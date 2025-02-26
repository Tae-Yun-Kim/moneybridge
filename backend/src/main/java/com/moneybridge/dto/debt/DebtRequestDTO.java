package com.moneybridge.dto.debt;

import com.moneybridge.domain.debt.DebtRequest;
import com.moneybridge.domain.debt.DebtRequestStatus;
import lombok.*;

import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DebtRequestDTO {
    private Long id;
    private Long contractId;
    private String lenderId;
    private String borrowerId;
    private LocalDate approvedAt; // ✅ 승인 시간 추가
    private Long debtAmount; // ✅ 추심 금액 추가
    private Double extraInterestRate; // ✅ 추가 이자율 저장\
    private Long overdueDebt; // ✅ 연체 추심 금액 저장
    private DebtRequestStatus debtstatus;


    // ✅ DebtRequest 엔티티 → DebtRequestDTO 변환하는 생성자 추가
    public DebtRequestDTO(DebtRequest debtRequest) {
        this.id = debtRequest.getId();
        this.contractId = debtRequest.getContract().getId();
        this.lenderId = String.valueOf(debtRequest.getLender().getId());
        this.borrowerId = String.valueOf(debtRequest.getBorrower().getId());
        this.debtstatus = debtRequest.getDebtstatus();
        this.approvedAt = debtRequest.getApprovedAt();
        this.extraInterestRate = debtRequest.getExtraInterestRate(); // ✅ 추가 이자율 저장
        this.debtAmount = debtRequest.getDebtAmount(); // ✅ 추심 금액 추가
        this.overdueDebt = debtRequest.getOverdueDebt(); // ✅ 연체 추심 금액 추가
    }
}
