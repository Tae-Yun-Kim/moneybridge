//package com.moneybridge.service.debt;
//
//import com.moneybridge.domain.debt.DebtRequest;
//import com.moneybridge.domain.debt.DebtRequestStatus;
//import com.moneybridge.domain.post.Contract;
//import com.moneybridge.domain.post.ContractStatus;
//import com.moneybridge.repository.debt.DebtRequestRepository;
//import com.moneybridge.repository.post.ContractRepository;
//import lombok.RequiredArgsConstructor;
//import lombok.extern.slf4j.Slf4j;
//import org.springframework.scheduling.annotation.Scheduled;
//import org.springframework.stereotype.Component;
//import org.springframework.transaction.annotation.Isolation;
//import org.springframework.transaction.annotation.Transactional;
//
//import java.time.LocalDate;
//import java.util.List;
//
//@Slf4j
//@Component
//@RequiredArgsConstructor
//public class DebtStatusUpdater {
//
//    private final ContractRepository contractRepository;
//    private final DebtRequestRepository debtRequestRepository;
//
//    /**
//     * ✅ 매일 오전 9시 18분에 실행: ACTIVE 상태의 계약을 OVERDUE로 업데이트
//     */
//    @Scheduled(cron = "0 45 19 * * ?") // 매일 9시 18분 실행
//    @Transactional
//    public void updateOverdueContracts() {
//        log.info("📌 연체 계약 업데이트 시작...");
//
//        // ACTIVE 상태의 계약 조회
//        List<Contract> activeContracts = contractRepository.findByStatus(ContractStatus.ACTIVE);
//        LocalDate now = LocalDate.now();
//
//        for (Contract contract : activeContracts) {
//            LocalDate dueDate = contract.getContractAt().plusDays(contract.getRepaymentPeriod() * 30L);
//
//            if (now.isAfter(dueDate)) { // 기한이 초과된 경우
//                contract.setStatus(ContractStatus.OVERDUE);
//                contract.setContractAt(now);
//                log.info("🚨 계약 {} 연체 처리됨", contract.getId());
//            }
//        }
//
//        contractRepository.saveAll(activeContracts);
//        log.info("✅ 연체 계약 업데이트 완료");
//    }
//
//
//
//    /**
//     * ✅ 매일 19:04에 실행: 30일 지난 APPROVED 상태의 debt_requests overdueDebt 업데이트
//     */
//
//    @Scheduled(cron = "0 43 19 * * ?") // 매일 19:04 실행
//    @Transactional
//    public void updateOverdueDebtRequests() {
//        log.info("📌 연체 추심 금액 업데이트 시작...");
//
//        // 오늘 날짜 기준 30일 이상 지난 approvedAt을 가진 APPROVED 상태의 요청 찾기
//        LocalDate overdueDate = LocalDate.now().minusDays(30);
//        List<DebtRequest> overdueRequests = debtRequestRepository.findByDebtstatusAndApprovedAtBefore(DebtRequestStatus.APPROVED, overdueDate);
//
//        if (overdueRequests.isEmpty()) {
//            log.info("✅ 연체된 추심 요청 없음");
//            return;
//        }
//
//        for (DebtRequest request : overdueRequests) {
//            log.info("🔍 추심 요청 {} 처리 중...", request.getId());
//
//            // Step 1️⃣: overdueDebt 값을 debtAmount로 덮어쓰기
//            request.setDebtAmount(request.getOverdueDebt()); // 기존 연체 금액을 새로운 원금으로 설정
//            log.info("🔹 추심 요청 {}: debtAmount 값을 {}원으로 변경", request.getId(), request.getOverdueDebt());
//
//            // Step 2️⃣: 이자율 적용 후 새로운 overdueDebt 계산
//            Long newOverdueDebt = Math.round(request.getDebtAmount() * (1 + request.getExtraInterestRate()));
//            request.setOverdueDebt(newOverdueDebt);
//            log.info("🚨 추심 요청 {}: 연체 원리금 {}원으로 업데이트됨", request.getId(), newOverdueDebt);
//
//            // Step 3️⃣: approvedAt을 오늘 날짜로 업데이트
//            request.setApprovedAt(LocalDate.now());
//            log.info("📅 추심 요청 {}: approvedAt을 {}로 업데이트", request.getId(), request.getApprovedAt());
//        }
//
//        // 변경된 overdueDebt와 approvedAt을 데이터베이스에 저장
//        debtRequestRepository.saveAll(overdueRequests);
//        debtRequestRepository.flush(); // 즉시 DB 반영
//        log.info("✅ 연체 추심 금액 업데이트 완료");
//    }
//}


package com.moneybridge.service.debt;

import com.moneybridge.domain.debt.DebtRequest;
import com.moneybridge.domain.debt.DebtRequestStatus;
import com.moneybridge.domain.post.Contract;
import com.moneybridge.domain.post.ContractStatus;
import com.moneybridge.repository.debt.DebtRequestRepository;
import com.moneybridge.repository.post.ContractRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Slf4j
@Component
@RequiredArgsConstructor
public class DebtStatusUpdater {

    private final ContractRepository contractRepository;
    private final DebtRequestRepository debtRequestRepository;

    /**
     * ✅ 매일 19:45에 실행: ACTIVE 상태의 계약을 OVERDUE로 업데이트하고, 30일 지난 APPROVED 상태의 debt_requests overdueDebt 업데이트
     */
    @Scheduled(cron = "0 56 19 * * ?") // 매일 19:45 실행
    @Transactional
    public void updateDebtStatus() {
        log.info("📌 연체 계약 및 연체 추심 금액 업데이트 시작...");

        // 1️⃣ 연체 계약 상태 업데이트
        updateOverdueContracts();

        // 2️⃣ 연체 추심 금액 업데이트
        updateOverdueDebtRequests();

        log.info("✅ 모든 연체 업데이트 완료!");
    }

    /**
     * ✅ ACTIVE 상태의 계약을 OVERDUE로 업데이트
     */
    @Transactional
    public void updateOverdueContracts() {
        log.info("📌 연체 계약 업데이트 시작...");

        // ACTIVE 상태의 계약 조회
        List<Contract> activeContracts = contractRepository.findByStatus(ContractStatus.ACTIVE);
        LocalDate now = LocalDate.now();

        for (Contract contract : activeContracts) {
            LocalDate dueDate = contract.getContractAt().plusDays(contract.getRepaymentPeriod() * 30L);

            if (now.isAfter(dueDate)) { // 기한이 초과된 경우
                contract.setStatus(ContractStatus.OVERDUE);

                log.info("🚨 계약 {} 연체 처리됨", contract.getId());
            }
        }

        contractRepository.saveAll(activeContracts);
        log.info("✅ 연체 계약 업데이트 완료");
    }

    /**
     * ✅ 30일 지난 APPROVED 상태의 debt_requests overdueDebt 업데이트
     */
    @Transactional
    public void updateOverdueDebtRequests() {
        log.info("📌 연체 추심 금액 업데이트 시작...");

        // 오늘 날짜 기준 30일 이상 지난 approvedAt을 가진 APPROVED 상태의 요청 찾기
        LocalDate overdueDate = LocalDate.now().minusDays(30);
        List<DebtRequest> overdueRequests = debtRequestRepository.findByDebtstatusAndApprovedAtBefore(DebtRequestStatus.APPROVED, overdueDate);

        if (overdueRequests.isEmpty()) {
            log.info("✅ 연체된 추심 요청 없음");
            return;
        }

        for (DebtRequest request : overdueRequests) {
            log.info("🔍 추심 요청 {} 처리 중...", request.getId());

            // Step 1️⃣: overdueDebt 값을 debtAmount로 덮어쓰기
            request.setDebtAmount(request.getOverdueDebt()); // 기존 연체 금액을 새로운 원금으로 설정
            log.info("🔹 추심 요청 {}: debtAmount 값을 {}원으로 변경", request.getId(), request.getOverdueDebt());

            // Step 2️⃣: 이자율 적용 후 새로운 overdueDebt 계산
            Long newOverdueDebt = Math.round(request.getDebtAmount() * (1 + request.getExtraInterestRate()));
            request.setOverdueDebt(newOverdueDebt);
            log.info("🚨 추심 요청 {}: 연체 원리금 {}원으로 업데이트됨", request.getId(), newOverdueDebt);

            // Step 3️⃣: approvedAt을 오늘 날짜로 업데이트
            request.setApprovedAt(LocalDate.now());
            log.info("📅 추심 요청 {}: approvedAt을 {}로 업데이트", request.getId(), request.getApprovedAt());
        }

        // 변경된 overdueDebt와 approvedAt을 데이터베이스에 저장
        debtRequestRepository.saveAll(overdueRequests);
        debtRequestRepository.flush(); // 즉시 DB 반영
        log.info("✅ 연체 추심 금액 업데이트 완료");
    }
}
