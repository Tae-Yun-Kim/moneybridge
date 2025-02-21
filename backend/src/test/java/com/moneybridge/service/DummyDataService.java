package com.moneybridge.service;

import com.moneybridge.domain.post.Contract;
import com.moneybridge.domain.account.Donation;
import com.moneybridge.repository.account.DonationRepository;
import com.moneybridge.repository.post.ContractRepository;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.stereotype.Service;

import java.time.YearMonth;
import java.util.Random;

@Service
@RequiredArgsConstructor
public class DummyDataService {

    private final ContractRepository contractRepository;
    private final DonationRepository donationRepository;
    private final Random random = new Random();

    @PostConstruct
    public void initDummyData() {

        // ✅ Contract 먼저 삽입 (ID를 직접 지정하지 않고 자동 생성)
        for (int i = 1; i < 3; i++) {
            contractRepository.save(Contract.builder().build()); // ID 자동 생성
        }

        // 최근 3개월 동안의 기부 데이터 생성
        for (int i = 0; i <= 3; i++) {
            YearMonth currentMonth = YearMonth.now().minusMonths(i);
            String monthLabel = currentMonth.getMonthValue() + "월";

            // 더미 데이터 생성
            long donationAmount = generateRandomAmount(3000000, 7000000);
            long adminProfitAmount = donationAmount / 2;

            // ✅ 저장된 Contract 객체를 가져오기 (첫 번째 Contract 사용)
            Contract contract = contractRepository.findAll().get(i); // 첫 번째 Contract 가져오기

            donationRepository.save(Donation.builder()
                    .donorId("lender00" + (i + 1))
                    .contract(contract)
                    .donationAmount(donationAmount)
                    .adminProfitAmount(adminProfitAmount)
                    .build());

            System.out.printf("📊 %s 기부 데이터: 기부 금액 %,d원 | 관리자 수익 %,d원%n", monthLabel, donationAmount, adminProfitAmount);
        }

        System.out.println("✅ 최근 3개월치 더미 데이터가 성공적으로 삽입되었습니다!");
    }

    // 랜덤 금액 생성 메서드
    private long generateRandomAmount(int min, int max) {
        return random.nextInt(max - min + 1) + min;
    }
}
