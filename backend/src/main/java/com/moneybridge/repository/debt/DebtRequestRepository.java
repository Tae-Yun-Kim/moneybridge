//package com.moneybridge.repository.debt;
//
//import com.moneybridge.domain.debt.DebtRequest;
//import org.springframework.data.jpa.repository.JpaRepository;
//import java.util.List;
//
//public interface DebtRequestRepository extends JpaRepository<DebtRequest, Long> {
//    List<DebtRequest> findByContractId(Long contractId);
//}
package com.moneybridge.repository.debt;

import com.moneybridge.domain.debt.DebtRequest;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface DebtRequestRepository extends JpaRepository<DebtRequest, Long> {
    List<DebtRequest> findByContractId(Long contractId);
}
