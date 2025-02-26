package com.moneybridge.repository.debt;

import com.moneybridge.domain.debt.DebtRequest;
import com.moneybridge.domain.debt.DebtRequestStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;

public interface DebtRequestRepository extends JpaRepository<DebtRequest, Long> {
    List<DebtRequest> findByContractId(Long contractId);

    // ✅ 30일이 지난 APPROVED 상태의 요청 찾기
    List<DebtRequest> findByDebtstatusAndApprovedAtBefore(DebtRequestStatus status, LocalDate date);
}
