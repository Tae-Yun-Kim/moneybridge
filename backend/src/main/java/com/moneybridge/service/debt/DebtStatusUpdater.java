package com.moneybridge.service.debt;

import com.moneybridge.domain.post.Contract;
import com.moneybridge.domain.post.ContractStatus;
import com.moneybridge.repository.post.ContractRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Slf4j
@Component
@RequiredArgsConstructor
public class DebtStatusUpdater {

    private final ContractRepository contractRepository;

    @Scheduled(cron = "0 18 9 * * ?") // 매일 자정에 실행
    @Transactional
    public void updateOverdueContracts() {
        log.info("📌 연체 계약 업데이트 시작...");

        // ACTIVE 상태의 계약 조회
        List<Contract> activeContracts = contractRepository.findByStatus(ContractStatus.ACTIVE);
        LocalDateTime now = LocalDateTime.now();

        for (Contract contract : activeContracts) {
            LocalDateTime dueDate = contract.getUpdatedAt().plusDays(contract.getRepaymentPeriod() * 30L);

            if (now.isAfter(dueDate)) { // 기한이 초과된 경우
                contract.setStatus(ContractStatus.OVERDUE);
                contract.setUpdatedAt(LocalDateTime.now());
                log.info("🚨 계약 {} 연체 처리됨", contract.getId());
            }
        }

        contractRepository.saveAll(activeContracts);
        log.info("✅ 연체 계약 업데이트 완료");
    }
}
