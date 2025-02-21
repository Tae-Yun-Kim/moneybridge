

package com.moneybridge.service.debt;

import com.moneybridge.domain.debt.DebtRequestStatus;
import com.moneybridge.dto.debt.DebtRequestDTO;
import org.springframework.security.core.Authentication;

import java.util.List;

public interface DebtService {
    DebtRequestDTO createDebtRequest(DebtRequestDTO dto);
    DebtRequestDTO updateDebtRequestStatus(Long requestId, DebtRequestStatus status);
    List<DebtRequestDTO> getDebtRequestsByContract(Long contractId);
    List<DebtRequestDTO> getAllDebtRequests(Authentication authentication);
    DebtRequestDTO approveOrRejectDebtRequest(Long requestId, DebtRequestStatus status, Authentication authentication);

    // ✅ 추심 완료 처리 (debtstatus를 COLLECTED로 변경 후 계약 상태 변경)
    void completeDebtCollection(Long requestId);
}
