package com.moneybridge.service.post;

import com.moneybridge.domain.post.Debt;
import com.moneybridge.dto.DebtRequestDTO;
import com.moneybridge.dto.DebtResponseDTO;
import com.moneybridge.repository.post.DebtRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class DebtServiceImpl implements DebtService {

    private final DebtRepository debtRepository;

    // 새로운 대출 채무 생성
    @Override
    public DebtResponseDTO createDebt(DebtRequestDTO requestDTO) {
        // 회원의 부채 상태가 'IN_PROGRESS'인 경우 부채 등록을 막는 로직 추가
        String memberId = requestDTO.getMember().getId();
        Debt existingDebt = debtRepository.findFirstByMemberIdAndRepaymentStatus(memberId, Debt.RepaymentStatus.IN_PROGRESS);

        if (existingDebt != null) {
            throw new IllegalArgumentException("채무를 갚기 전에는 부채 등록이 불가합니다.");
        }
        // loanAmount가 null일 경우 예외 처리
        Long loanAmount = requestDTO.getLoanAmount();
        if (loanAmount == null) {
            loanAmount = 0L; // 기본값 0 설정
        }

        // repaymentPeriod가 null일 경우 기본값 0 설정
        Integer repaymentPeriod = requestDTO.getRepaymentPeriod();
        if (repaymentPeriod == null) {
            repaymentPeriod = 0; // 기본값 0 설정
        }

        // Debt 객체 생성 시 이자율을 double로 설정
        Debt debt = Debt.builder()
                .postId(requestDTO.getPostId())
                .member(requestDTO.getMember()) // Member로 설정
                .fee(requestDTO.getFee()) // 수수료
                .loanAmount(requestDTO.getLoanAmount()) // 대출 금액
                .remainingAmount(requestDTO.getLoanAmount()) // 남은 금액
                .interestRate(requestDTO.getInterestRate()) // 이자율 (double로 설정)
                .repaymentPeriod(repaymentPeriod) // 상환 기간 (null 처리 후 설정)
                .repaymentDate(LocalDate.now().plusDays(repaymentPeriod)) // 상환일 설정
                .repaymentStatus(Debt.RepaymentStatus.IN_PROGRESS) // 상환 상태
                .build();

        debtRepository.save(debt); // 부채 저장

        return mapToResponseDTO(debt); // DebtResponseDTO 반환
    }


    // 상환 상태가 'IN_PROGRESS'인 부채가 있는지 확인
    @Override
    public String getRepaymentStatusByMemberId(String memberId) {
        Debt debt = debtRepository.findFirstByMemberIdAndRepaymentStatus(memberId, Debt.RepaymentStatus.IN_PROGRESS);

        // 만약 부채가 있다면 'IN_PROGRESS' 상태로 반환
        if (debt != null) {
            return "IN_PROGRESS";
        }

        // 부채가 없으면 'COMPLETED' 상태 반환
        return "COMPLETED";
    }

    // memberId로 부채 목록 조회
    @Override
    public List<DebtResponseDTO> getDebtsByMemberId(String memberId) {
        List<Debt> debts = debtRepository.findByMemberId(memberId);
        return debts.stream()
                .map(this::mapToResponseDTO)
                .collect(Collectors.toList());
    }

    // 모든 대출 채무 조회
    @Override
    public List<DebtResponseDTO> getAllDebts() {
        return debtRepository.findAll()
                .stream()
                .map(this::mapToResponseDTO)
                .collect(Collectors.toList());
    }

    // 상환 상태 업데이트
    @Override
    public DebtResponseDTO updateRepaymentStatus(Long debtId, String status) {
        Debt debt = debtRepository.findById(debtId)
                .orElseThrow(() -> new IllegalArgumentException("Debt not found with id: " + debtId));

        debt.setRepaymentStatus(Debt.RepaymentStatus.valueOf(status)); // 상태 업데이트
        return mapToResponseDTO(debt); // 업데이트된 부채 정보 반환
    }

    // 상환 기한 연장 요청
    @Override
    public DebtResponseDTO requestExtension(Long debtId) {
        Debt debt = debtRepository.findById(debtId)
                .orElseThrow(() -> new IllegalArgumentException("Debt not found with id: " + debtId));

        debt.requestExtension(); // 연장 요청
        return mapToResponseDTO(debt); // 연장된 부채 반환
    }

    // Debt를 ResponseDTO로 변환
    private DebtResponseDTO mapToResponseDTO(Debt debt) {
        return DebtResponseDTO.builder()
                .debtId(debt.getDebtId()) // 부채 ID
                .member(debt.getMember()) // 회원 정보
                .loanAmount(debt.getLoanAmount()) // 대출 금액
                .remainingAmount(debt.getRemainingAmount()) // 남은 금액
                .interestRate(debt.getInterestRate()) // 이자율 (double)
                .fee(debt.getFee()) // 수수료
                .repaymentPeriod(debt.getRepaymentPeriod()) // 상환 기간
                .repaymentDate(debt.getRepaymentDate()) // 상환 날짜
                .repaymentStatus(debt.getRepaymentStatus().name()) // 상환 상태
                .extensionRequested(debt.getExtensionRequested()) // 연장 요청 여부
                .collectionInProgress(debt.getCollectionInProgress()) // 회수 진행 여부
                .build();
    }

    // 부채 삭제 요청
    @Override
    public void deleteDebt(Long debtId, String memberId) {
        Debt debt = debtRepository.findById(debtId)
                .orElseThrow(() -> new RuntimeException("Debt not found"));

        // 부채 작성자와 인증된 사용자 비교
        if (!debt.getMember().getId().equals(memberId)) {
            throw new RuntimeException("부채를 삭제할 권한이 없습니다.");
        }

        // 부채 삭제
        debtRepository.delete(debt);
    }
}
