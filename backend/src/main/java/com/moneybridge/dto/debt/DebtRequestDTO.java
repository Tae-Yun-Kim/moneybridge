package com.moneybridge.dto.debt;

import com.moneybridge.domain.debt.DebtRequest;
import com.moneybridge.domain.debt.DebtRequestStatus;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DebtRequestDTO {
    private Long id;
    private Long contractId;
    private String lenderId;

    private DebtRequestStatus debtstatus;


    // ✅ DebtRequest 엔티티 → DebtRequestDTO 변환하는 생성자 추가
    public DebtRequestDTO(DebtRequest debtRequest) {
        this.id = debtRequest.getId();
        this.contractId = debtRequest.getContract().getId();
        this.lenderId = String.valueOf(debtRequest.getLender().getId());
        this.debtstatus = debtRequest.getDebtstatus();
    }
}
