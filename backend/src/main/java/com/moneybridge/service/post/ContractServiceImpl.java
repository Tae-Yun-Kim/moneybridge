package com.moneybridge.service.post;

import com.moneybridge.domain.member.Member;
import com.moneybridge.domain.post.Contract;
import com.moneybridge.domain.post.ContractStatus;
import com.moneybridge.domain.post.LoanPost;
import com.moneybridge.domain.post.PostComment;
import com.moneybridge.dto.post.ContractDTO;
import com.moneybridge.repository.member.MemberRepository;
import com.moneybridge.repository.post.ContractRepository;
import com.moneybridge.repository.post.LoanPostRepository;
import com.moneybridge.repository.post.PostCommentRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Log4j2
@Service
@RequiredArgsConstructor
public class ContractServiceImpl implements ContractService {

    private final ContractRepository contractRepository;
    private final MemberRepository memberRepository;
    private final LoanPostRepository loanPostRepository;
    private final PostCommentRepository postCommentRepository;
    private final ContractDocumentService contractDocumentService; // ✅ 계약서 서비스 추가
    private final NotificationService notificationService; // 알림 서비스 주입

    // ✅ 출자자가 댓글을 선택하면 계약 생성 (PENDING 상태)
    @Transactional
    @Override
    public ContractDTO createContract(ContractDTO contractDTO) {
        log.info("🚀 createContract() 호출됨: lenderId={}, borrowerId={}, postId={}",
                contractDTO.getLenderId(), contractDTO.getBorrowerId(), contractDTO.getPostId());

        Member lender = memberRepository.findById(contractDTO.getLenderId())
                .orElseThrow(() -> new IllegalArgumentException("출자자를 찾을 수 없습니다."));
        Member borrower = memberRepository.findById(contractDTO.getBorrowerId())
                .orElseThrow(() -> new IllegalArgumentException("대출자를 찾을 수 없습니다."));
        LoanPost loanPost = loanPostRepository.findById(contractDTO.getPostId())
                .orElseThrow(() -> new IllegalArgumentException("대출 신청 게시글을 찾을 수 없습니다."));
        PostComment selectedComment = postCommentRepository.findById(contractDTO.getSelectedCommentId())
                .orElseThrow(() -> new IllegalArgumentException("선택된 댓글을 찾을 수 없습니다."));

        Long totalRepaymentAmount = contractDTO.getLoanAmount() +
                (long) (contractDTO.getLoanAmount() * (contractDTO.getInterestRate() / 100.0));

        Contract contract = Contract.builder()
                .lender(lender)
                .borrower(borrower)
                .loanPost(loanPost)
                .selectedComment(selectedComment)
                .loanAmount(contractDTO.getLoanAmount())
                .repaymentPeriod(contractDTO.getRepaymentPeriod())
                .interestRate(contractDTO.getInterestRate())
                .totalRepaymentAmount(totalRepaymentAmount)
                .status(ContractStatus.PENDING)
                .borrowerAgreed(false)
                .lenderApproved(false)
                .build();

        contractRepository.save(contract);
        contractRepository.flush();

        log.info("✅ 계약 저장 완료: contractId={}, 총 상환 금액={}", contract.getId(), contract.getTotalRepaymentAmount());
        return new ContractDTO(contract);
    }

    // ✅ 출자자가 체결한 모든 계약 조회
    @Override
    public List<ContractDTO> getContractsByLenderId(String lenderId) {
        return contractRepository.findByLender_Id(lenderId)
                .stream()
                .map(ContractDTO::new)
                .collect(Collectors.toList());
    }

    // ✅ 대출자가 체결한 모든 계약 조회
    @Override
    public List<ContractDTO> getContractsByBorrowerId(String borrowerId) {
        return contractRepository.findByBorrower_Id(borrowerId)
                .stream()
                .map(ContractDTO::new)
                .collect(Collectors.toList());
    }


    // ✅ 대출자가 계약을 승인하면 계약서를 생성하고 WAITING_FOR_APPROVAL 상태로 변경
    @Transactional
    @Override
    public ContractDTO approveContract(Long contractId, String borrowerId) {
        Contract contract = contractRepository.findById(contractId)
                .orElseThrow(() -> new IllegalArgumentException("계약을 찾을 수 없습니다."));

        if (!contract.getBorrower().getId().equals(borrowerId)) {
            throw new IllegalArgumentException("대출자만 계약을 승인할 수 있습니다.");
        }

        contract.setBorrowerAgreed(true);
        contract.setStatus(ContractStatus.WAITING_FOR_APPROVAL);

        // ✅ 계약서 자동 생성 및 저장
        String contractDocument = contractDocumentService.generateContractDocument(contract);
        contract.setBorrowerContractContent(contractDocument);
        log.info("✅ 계약서 생성 완료 (대출자) \n{}", contractDocument);

        contractRepository.save(contract);
        return new ContractDTO(contract);
    }

    // ✅ 출자자가 최종 계약 승인 (계약 상태: ACTIVE) 및 계약서 자동 생성
    @Transactional
    @Override
    public ContractDTO approveContractByLender(Long contractId, String lenderId) {
        Contract contract = contractRepository.findById(contractId)
                .orElseThrow(() -> new IllegalArgumentException("계약을 찾을 수 없습니다."));

        if (!contract.getLender().getId().equals(lenderId)) {
            throw new IllegalArgumentException("출자자만 계약을 승인할 수 있습니다.");
        }

        if (!contract.getBorrowerAgreed()) {
            throw new IllegalArgumentException("대출자가 계약을 먼저 승인해야 합니다.");
        }

        contract.setLenderApproved(true);
        contract.setStatus(ContractStatus.ACTIVE);

        // ✅ 계약서 자동 생성 및 저장
        String contractDocument = contractDocumentService.generateContractDocument(contract);
        contract.setLenderContractContent(contractDocument);
        log.info("✅ 계약서 생성 완료 (출자자) \n{}", contractDocument);

        contractRepository.save(contract);

        // ✅ 계약 최종 승인 시 채무자(Borrower)에게 알림 전송
        notificationService.createContractActiveNotification(contract.getBorrower(), contract);

        return new ContractDTO(contract);
    }

    // ✅ 계약 상태 업데이트
    @Transactional
    @Override
    public ContractDTO updateContractStatus(Long contractId, ContractStatus status) {
        Contract contract = contractRepository.findById(contractId)
                .orElseThrow(() -> new IllegalArgumentException("계약을 찾을 수 없습니다."));

        log.info("✅ 기존 계약 상태: {}", contract.getStatus());
        contract.setStatus(status);
        contractRepository.save(contract);
        log.info("✅ 변경된 계약 상태: {}", contract.getStatus());

        return new ContractDTO(contract);
    }

    // ✅ 계약 취소
    @Transactional
    @Override
    public void cancelContract(Long contractId) {
        Contract contract = contractRepository.findById(contractId)
                .orElseThrow(() -> new IllegalArgumentException("계약을 찾을 수 없습니다."));

        contract.setStatus(ContractStatus.CANCELLED);
        contractRepository.save(contract);

        // ✅ 계약 취소 시 채무자, 채권자에게 알림 전송
        notificationService.createContractCancelledNotification(contract.getBorrower(), contract.getLender(), contract);

    }

    // ✅ 계약서 내용 저장 (대출자 또는 출자자의 계약서 개별 저장)
    @Transactional
    @Override
    public ContractDTO saveContractContent(Long contractId, String userId, String content, boolean isLender) {
        Contract contract = contractRepository.findById(contractId)
                .orElseThrow(() -> new IllegalArgumentException("계약을 찾을 수 없습니다: " + contractId));

        if (isLender) {
            if (!contract.getLender().getId().equals(userId)) {
                throw new IllegalArgumentException("출자자만 출자자 계약서를 작성할 수 있습니다.");
            }
            contract.setLenderContractContent(content);
        } else {
            if (!contract.getBorrower().getId().equals(userId)) {
                throw new IllegalArgumentException("대출자만 대출자 계약서를 작성할 수 있습니다.");
            }
            contract.setBorrowerContractContent(content);
        }

        contractRepository.save(contract);
        return new ContractDTO(contract);
    }

    // ✅ 계약서 내용 조회
    @Override
    public String getContractContent(Long contractId, String userId, boolean isLender) {
        Contract contract = contractRepository.findById(contractId)
                .orElseThrow(() -> new IllegalArgumentException("계약을 찾을 수 없습니다: " + contractId));

        return isLender ? contract.getLenderContractContent() : contract.getBorrowerContractContent();
    }
}
