package com.moneybridge.service.post;

import com.moneybridge.domain.member.Member;
import com.moneybridge.domain.post.Contract;
import com.moneybridge.domain.post.ContractStatus;
import com.moneybridge.domain.post.LoanPost;
import com.moneybridge.domain.post.PostComment;
import com.moneybridge.domain.wallet.Wallet;
import com.moneybridge.domain.wallet.WalletTransaction;
import com.moneybridge.dto.post.ContractDTO;
import com.moneybridge.repository.account.AccountRepository;
import com.moneybridge.repository.member.MemberRepository;
import com.moneybridge.repository.post.ContractRepository;
import com.moneybridge.repository.post.LoanPostRepository;
import com.moneybridge.repository.post.PostCommentRepository;
import com.moneybridge.repository.wallet.WalletRepository;
import com.moneybridge.repository.wallet.WalletTransactionRepository;
import com.moneybridge.service.account.DonationService;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Arrays;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
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
    private final WalletTransactionRepository walletTransactionRepository;
    private final WalletRepository walletRepository;
    private final ContractPDFService contractPDFService;
    private final AccountRepository accountRepository;
    private final NotificationService notificationService;
    private final DonationService donationService;


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

//    // ✅ 출자자가 체결한 모든 계약 조회
//    @Override
//    public List<ContractDTO> getContractsByLenderId(String lenderId) {
//        return contractRepository.findByLender_Id(lenderId)
//                .stream()
//                .map(ContractDTO::new)
//                .collect(Collectors.toList());
//    }
//
//    // ✅ 대출자가 체결한 모든 계약 조회
//    @Override
//    public List<ContractDTO> getContractsByBorrowerId(String borrowerId) {
//        return contractRepository.findByBorrower_Id(borrowerId)
//                .stream()
//                .map(ContractDTO::new)
//                .collect(Collectors.toList());
//    }


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

        // 출자자 본인 확인
        if (!contract.getLender().getId().equals(lenderId)) {
            throw new IllegalArgumentException("출자자만 계약을 승인할 수 있습니다.");
        }

        // 대출자 승인 확인
        if (!contract.getBorrowerAgreed()) {
            throw new IllegalArgumentException("대출자가 계약을 먼저 승인해야 합니다.");
        }

        // ✅ 출자자 및 대출자의 지갑 조회
        Wallet lenderWallet = walletRepository.findByMember(contract.getLender())
                .orElseThrow(() -> new IllegalArgumentException("출자자의 지갑을 찾을 수 없습니다."));
        Wallet borrowerWallet = walletRepository.findByMember(contract.getBorrower())
                .orElseThrow(() -> new IllegalArgumentException("대출자의 지갑을 찾을 수 없습니다."));

        // ✅ 출자자의 지갑 잔액 확인
        if (lenderWallet.getBalance() < contract.getLoanAmount()) {
            throw new IllegalArgumentException("출자자의 지갑에 잔액이 부족합니다.");
        }

        // ✅ 출자자의 지갑에서 출금
        lenderWallet.updateBalanceWithWallet(-contract.getLoanAmount());
        lenderWallet.incrementTransactionCount();  // 🔑 거래 횟수 증가
        // ✅ 대출자의 지갑에 입금
        borrowerWallet.updateBalanceWithWallet(contract.getLoanAmount());
        borrowerWallet.incrementTransactionCount();  // 🔑 거래 횟수 증가
        // ✅ 거래 내역 저장
        WalletTransaction transaction = WalletTransaction.builder()
                .fromWallet(lenderWallet)
                .toWallet(borrowerWallet)
                .amount(contract.getLoanAmount())
                .transactionType("LOAN_DISBURSEMENT") // 대출 지급
                .build();

        walletTransactionRepository.save(transaction);

        // ✅ 계약 상태 변경
        contract.setLenderApproved(true);
        contract.setStatus(ContractStatus.ACTIVE);

        // ✅ 계약서 자동 생성
        String contractDocument = contractDocumentService.generateContractDocument(contract);
        contract.setLenderContractContent(contractDocument);

        // ✅ 계약 저장
        contractRepository.save(contract);
        log.info("✅ 출자자가 최종 승인 및 송금 완료: contractId={}, 금액={}",
                contract.getId(), contract.getLoanAmount());

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

    // ✅ 출자자가 체결한 모든 계약 조회 (조회 시 자동 상태 업데이트 포함)
    @Override
    public List<ContractDTO> getContractsByLenderId(String lenderId) {
        return contractRepository.findByLender_Id(lenderId)
                .stream()
                .map(contract -> {
                    // 조회 시 상태 자동 업데이트
                    updateContractStatus(contract.getId(), contract.getStatus());
                    return new ContractDTO(contract);
                })
                .collect(Collectors.toList());
    }

    // ✅ 대출자가 체결한 모든 계약 조회 (조회 시 자동 상태 업데이트 포함)
    @Override
    public List<ContractDTO> getContractsByBorrowerId(String borrowerId) {
        return contractRepository.findByBorrower_Id(borrowerId)
                .stream()
                .map(contract -> {
                    // 조회 시 상태 자동 업데이트
                    updateContractStatus(contract.getId(), contract.getStatus());
                    return new ContractDTO(contract);
                })
                .collect(Collectors.toList());
    }

    // ✅ 계약 취소
    @Transactional
    @Override
    public void cancelContract(Long contractId) {
        Contract contract = contractRepository.findById(contractId)
                .orElseThrow(() -> new IllegalArgumentException("계약을 찾을 수 없습니다."));

        contract.setStatus(ContractStatus.CANCELLED);
        contractRepository.save(contract);
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

    // ✅ 계약서 내용 조회 (대출자 또는 출자자)
    @Override
    public String getContractContent(Long contractId, String userId, boolean isLender) {
        Contract contract = contractRepository.findById(contractId)
                .orElseThrow(() -> new IllegalArgumentException("계약을 찾을 수 없습니다: " + contractId));

        String lenderContent = contract.getLenderContractContent();
        String borrowerContent = contract.getBorrowerContractContent();

        // ✅ 출자자는 본인 계약서가 없으면 대출자 계약서 반환
        if (isLender) {
            return (lenderContent != null && !lenderContent.isEmpty())
                    ? lenderContent
                    : (borrowerContent != null && !borrowerContent.isEmpty())
                    ? borrowerContent
                    : "<p>출자자 및 대출자 계약서가 모두 없습니다.</p>";
        }
        // ✅ 대출자는 본인 계약서가 없으면 출자자 계약서 반환
        else {
            return (borrowerContent != null && !borrowerContent.isEmpty())
                    ? borrowerContent
                    : (lenderContent != null && !lenderContent.isEmpty())
                    ? lenderContent
                    : "<p>대출자 및 출자자 계약서가 모두 없습니다.</p>";
        }
    }


    // ✅ 계약 조회 시 본인이 삭제한 계약을 필터링해서 반환
    @Override
    public List<ContractDTO> getContractsByUser(String userId, boolean isLender) {
        List<Contract> contracts = isLender
                ? contractRepository.findByLender_Id(userId)
                : contractRepository.findByBorrower_Id(userId);

        return contracts.stream()
                .filter(contract -> {
                    // ✅ deletedByUsers 필드가 null이거나 비어있으면 모든 유저에게 보임
                    if (contract.getDeletedByUsers() == null || contract.getDeletedByUsers().isEmpty()) {
                        return true;
                    }
                    // ✅ deletedByUsers 필드에 현재 userId가 포함되어 있으면 해당 유저에게 숨김 처리
                    List<String> deletedUsers = Arrays.asList(contract.getDeletedByUsers().split(","));
                    return !deletedUsers.contains(userId);
                })
                .map(ContractDTO::new)
                .collect(Collectors.toList());
    }

    //소프트 삭제 기능 추가
    @Transactional
    @Override
    public void softDeleteContract(Long contractId, String userId) {
        Contract contract = contractRepository.findById(contractId)
                .orElseThrow(() -> new IllegalArgumentException("계약을 찾을 수 없습니다."));

        // 기존에 삭제한 유저가 있으면 추가, 없으면 새로 설정
        if (contract.getDeletedByUsers() == null || contract.getDeletedByUsers().isEmpty()) {
            contract.setDeletedByUsers(userId);
        } else {
            // 기존 삭제 목록에 추가 (중복 방지)
            Set<String> deletedUsers = new HashSet<>(Arrays.asList(contract.getDeletedByUsers().split(",")));
            deletedUsers.add(userId);
            contract.setDeletedByUsers(String.join(",", deletedUsers));
        }

        contractRepository.save(contract);
    }
    //계약서Pdf변환및 다운로드
    public String generateContractPDF(Long contractId, String userId, boolean isLender) {
        log.info("🚀 generateContractPDF() 호출됨: contractId={}, userId={}, isLender={}", contractId, userId, isLender);

        // 1️⃣ 계약 조회
        Contract contract = contractRepository.findById(contractId)
                .orElseThrow(() -> new RuntimeException("계약을 찾을 수 없습니다."));

        // 2️⃣ 계약서 HTML 가져오기
        String contractHtml = isLender ? contract.getLenderContractContent() : contract.getBorrowerContractContent();
        if (contractHtml == null || contractHtml.isEmpty()) {
            throw new RuntimeException("계약서가 존재하지 않습니다.");
        }

        // 3️⃣ PDF 파일명 설정
        String fileName = "contract_" + contractId + (isLender ? "_lender.pdf" : "_borrower.pdf");

        // 4️⃣ PDF 변환 실행
        try {
            contractPDFService.generateContractPDF(contractHtml, fileName);  // 실제 PDF 생성 메서드 호출
        } catch (Exception e) {
            log.error("❌ 계약서 PDF 생성 중 오류 발생", e);
            throw new RuntimeException("PDF 생성 중 오류 발생", e);
        }
        log.info("✅ 계약서 PDF 생성 완료: {}", fileName);

        // 5️⃣ PDF 파일 경로 반환
        // 여기서 반환하는 값은 실제 PDF 파일의 절대 경로
        return contractPDFService.getPDFFilePath(fileName);  // 절대 경로 반환
    }

    @Transactional
    @Override
    public ContractDTO repayLoanAutomatically(Long contractId, String borrowerId) {
        // ✅ 계약 조회
        Contract contract = contractRepository.findById(contractId)
                .orElseThrow(() -> new IllegalArgumentException("계약을 찾을 수 없습니다."));

        // ✅ 대출자 확인
        if (!contract.getBorrower().getId().equals(borrowerId)) {
            throw new IllegalArgumentException("대출자만 상환할 수 있습니다.");
        }

        // ✅ 지갑 조회
        Wallet borrowerWallet = walletRepository.findByMember(contract.getBorrower())
                .orElseThrow(() -> new IllegalArgumentException("대출자의 지갑을 찾을 수 없습니다."));
        Wallet lenderWallet = walletRepository.findByMember(contract.getLender())
                .orElseThrow(() -> new IllegalArgumentException("출자자의 지갑을 찾을 수 없습니다."));

        // ✅ 4️⃣ 잔액 확인
        long repaymentAmount = contract.getTotalRepaymentAmount();
        if (borrowerWallet.getBalance() < repaymentAmount) {
            throw new IllegalArgumentException("잔액 부족");
        }

        // ✅ 5️⃣ 수수료 계산 (총 상환 금액의 0.1%)
        long fee = (long) (repaymentAmount * 0.001);
        long donationAmount = fee / 2; // 🔹 50% → 기부금
        long adminAmount = fee / 2;    // 🔹 50% → 관리자 수익

// 🔹 대출자 지갑 출금
        borrowerWallet.updateBalanceWithWallet(-repaymentAmount);

// 🔹 출자자 지갑 입금
        lenderWallet.updateBalanceWithWallet(repaymentAmount);

        // ✅ 8️⃣ 수수료 출금 (출자자 지갑 → 기부 및 관리자 수익)
        lenderWallet.updateBalanceWithWallet(-fee);

// 🔹 거래 내역 저장
        WalletTransaction transaction = WalletTransaction.builder()
                .fromWallet(borrowerWallet)
                .toWallet(lenderWallet)
                .amount(repaymentAmount)
                .transactionType("LOAN_REPAYMENT")
                .build();
        walletTransactionRepository.save(transaction);

        // ✅ 🔟 기부 및 관리자 수익 저장
        donationService.saveDonation(
                contract.getLender().getId(),
                contract.getId(),
                donationAmount,
                adminAmount
        );

        // ✅ 계약 상태 변경
        contract.setStatus(ContractStatus.COMPLETED);
        contractRepository.save(contract);

        // ✅ 1️⃣2️⃣ 로그 출력
        log.info("✅ 대출 상환 완료 - 총 상환 금액: {}원 (수수료: {}원, 기부: {}원, 관리자: {}원)",
                repaymentAmount, fee, donationAmount, adminAmount);

        return new ContractDTO(contract);
    }

    // ✅ 1. 대출자가 상환 기간 연장 요청 (최대 2회)
    @Override
    @Transactional
    public void requestRepaymentExtension(Long contractId, int additionalMonths, String borrowerId) {
        Contract contract = contractRepository.findById(contractId)
                .orElseThrow(() -> new IllegalArgumentException("계약을 찾을 수 없습니다: " + contractId));

        if (contract.getStatus() != ContractStatus.ACTIVE) {
            throw new IllegalStateException("연장 요청은 ACTIVE 상태에서만 가능합니다.");
        }

        if (!contract.getBorrower().getId().equals(borrowerId)) {
            throw new IllegalArgumentException("대출자만 연장 요청을 할 수 있습니다.");
        }

        if (additionalMonths <= 0) {
            throw new IllegalArgumentException("연장 기간은 1개월 이상이어야 합니다.");
        }

        // ✅ 연장 요청이 이미 진행 중인 경우 방지
        if (contract.isExtendRepaymentRequested()) {
            throw new IllegalStateException("이미 연장 요청이 진행 중입니다.");
        }

        // ✅ 요청 생성 (카운트 증가 없음, 승인 시 증가)
        contract.setExtendRepaymentRequested(true);
        contract.setExtendedPeriod(additionalMonths);

        contractRepository.save(contract);
        log.info("📨 상환 연장 요청 생성: {}개월 (승인 대기 중)", additionalMonths);
    }




    //    // ✅ 2. 출자자가 상환 기간 연장 요청 승인
//    @Override
//    @Transactional
//    public void approveRepaymentExtension(Long contractId, String lenderId) {
//        Contract contract = contractRepository.findById(contractId)
//                .orElseThrow(() -> new IllegalArgumentException("계약을 찾을 수 없습니다: " + contractId));
//
//        if (!contract.isExtendRepaymentRequested()) {
//            throw new IllegalStateException("해당 계약에는 연장 요청이 없습니다.");
//        }
//
//        if (!contract.getLender().getId().equals(lenderId)) {
//            throw new IllegalArgumentException("출자자만 연장 요청을 승인할 수 있습니다.");
//        }
//
//        if (contract.getExtensionRequestCount() >= 2) {
//            throw new IllegalStateException("⚠️ 상환 연장 요청은 최대 2회까지만 가능합니다.");
//        }
//
//        // ✅ 연장된 기간 및 총 상환 금액 계산
//        int extensionMonths = contract.getExtendedPeriod();
//        int newRepaymentPeriod = contract.getRepaymentPeriod() + extensionMonths;
//        double newInterestRate = contract.getInterestRate() * 2; // 이자율 2배 증가
//
//        long newTotalRepaymentAmount = Math.round(
//                contract.getLoanAmount() + (contract.getLoanAmount() * (newInterestRate / 100.0))
//        );
//
//        // ✅ DB에 직접 업데이트
//        contract.setRepaymentPeriod(newRepaymentPeriod);
//        contract.setInterestRate(newInterestRate);
//        contract.setTotalRepaymentAmount(newTotalRepaymentAmount);
//
//        // ✅ 승인 시 카운트 증가
//        contract.setExtensionRequestCount(contract.getExtensionRequestCount() + 1);
//
//        // ✅ 플래그 초기화
//        contract.setExtendRepaymentRequested(false);
//        contract.setExtendedPeriod(null);
//
//        contractRepository.save(contract);
//
//        log.info("✅ 상환 연장 요청 승인 완료: contractId={}, 총 상환 금액: {}원, 이자율: {}%, 상환 기간: {}개월",
//                contract.getId(), contract.getTotalRepaymentAmount(), contract.getInterestRate(), contract.getRepaymentPeriod());
//    }
// ✅ 2. 출자자가 상환 기간 연장 요청 승인
    @Override
    @Transactional
    public void approveRepaymentExtension(Long contractId, String lenderId) {
        Contract contract = contractRepository.findById(contractId)
                .orElseThrow(() -> new IllegalArgumentException("계약을 찾을 수 없습니다: " + contractId));

        if (!contract.isExtendRepaymentRequested()) {
            throw new IllegalStateException("해당 계약에는 연장 요청이 없습니다.");
        }

        if (!contract.getLender().getId().equals(lenderId)) {
            throw new IllegalArgumentException("출자자만 연장 요청을 승인할 수 있습니다.");
        }

        if (contract.getExtensionRequestCount() >= 2) {
            throw new IllegalStateException("⚠️ 상환 연장 요청은 최대 2회까지만 가능합니다.");
        }

        // 🔹 1️⃣ 연장된 상환 기간 및 총 상환 금액 계산
        int extensionMonths = contract.getExtendedPeriod();
        int updatedRepaymentPeriod = contract.getRepaymentPeriod() + extensionMonths;
        double updatedInterestRate = contract.getInterestRate() * 2;

        long updatedTotalRepaymentAmount = Math.round(
                contract.getLoanAmount() + (contract.getLoanAmount() * (updatedInterestRate / 100.0))
        );

        // ✅ 2️⃣ 변경된 값 즉시 DB에 저장
        contract.setRepaymentPeriod(updatedRepaymentPeriod);
        contract.setInterestRate(updatedInterestRate);
        contract.setTotalRepaymentAmount(updatedTotalRepaymentAmount);

        // 📑 3️⃣ 연장 승인 즉시 계약서 내용 업데이트
        String updatedContractDocument = contractDocumentService.generateContractDocument(contract);
        contract.setBorrowerContractContent(updatedContractDocument);
        contract.setLenderContractContent(updatedContractDocument);

        // 📈 4️⃣ 연장 요청 카운트 증가
        contract.setExtensionRequestCount(contract.getExtensionRequestCount() + 1);

        // 🚫 5️⃣ 연장 요청 플래그 초기화
        contract.setExtendRepaymentRequested(false);
        contract.setExtendedPeriod(null);

        // 💾 6️⃣ 변경된 필드 & 계약서 저장
        contractRepository.save(contract);

        log.info("✅ 연장 승인 완료: 기간={}개월, 이자율={}%, 총 상환금액={}",
                contract.getRepaymentPeriod(), contract.getInterestRate(), contract.getTotalRepaymentAmount());
    }






    // ✅ 3. 출자자가 상환 기간 연장 요청 거절
    @Override
    @Transactional
    public void rejectRepaymentExtension(Long contractId, String lenderId) {
        // 1️⃣ 계약 조회
        Contract contract = contractRepository.findById(contractId)
                .orElseThrow(() -> new IllegalArgumentException("계약을 찾을 수 없습니다: " + contractId));

        // 2️⃣ 요청 확인
        if (!contract.isExtendRepaymentRequested()) {
            throw new IllegalStateException("해당 계약에는 연장 요청이 없습니다.");
        }

        // 3️⃣ 요청자 검증
        if (!contract.getLender().getId().equals(lenderId)) {
            throw new IllegalArgumentException("출자자만 연장 요청을 거절할 수 있습니다.");
        }

        // 4️⃣ 금액 및 기간 복원
        int rollbackMonths = contract.getExtendedPeriod();
        long rollbackAmount = contract.getLoanAmount() * (long) Math.pow(2, rollbackMonths);
        contract.setRepaymentPeriod(contract.getRepaymentPeriod() - rollbackMonths);
        contract.setTotalRepaymentAmount(contract.getTotalRepaymentAmount() - rollbackAmount);
        // ✅ 요청 거절 시 카운트 증가
        contract.setExtensionRequestCount(contract.getExtensionRequestCount() + 1);
        // 5️⃣ 플래그 및 필드 초기화
        contract.setExtendRepaymentRequested(false);
        contract.setExtendedPeriod(null);

        contractRepository.save(contract);
        log.info("❌ 상환 연장 요청 거절 완료: {}개월 복원, 총 금액: {}원", rollbackMonths, contract.getTotalRepaymentAmount());
    }


}
