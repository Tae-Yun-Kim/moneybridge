package com.moneybridge.service;

import com.moneybridge.domain.account.Donation;
import com.moneybridge.domain.post.Contract;
import com.moneybridge.repository.account.DonationRepository;
import com.moneybridge.repository.post.ContractRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import java.util.List;
import java.util.Random;
import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest // JPA 관련 테스트를 위한 어노테이션 (실제 서비스 로직 실행 없이 DB 테스트 가능)
public class DonationTests {

    @Autowired
    private DonationRepository donationRepository;

    @Autowired
    private ContractRepository contractRepository;

    private final Random random = new Random();

    @BeforeEach // 각 테스트 실행 전에 실행되는 메서드
    void setup() {
        // 먼저 Contract를 3개 더미 데이터로 저장
        for (int i = 22; i <= 25; i++) {
            contractRepository.save(Contract.builder().id((long) i).build());
        }
    }

    @Test
    void testInsertDummyData() {
        // 최근 3개월 동안의 기부 데이터 생성
        for (int i = 22; i < 25; i++) {
            // Contract ID가 실제 존재하는지 확인 후 가져오기
            Contract contract = contractRepository.findById((long) (i + 1))
                    .orElseThrow(() -> new RuntimeException("해당 Contract ID가 존재하지 않습니다: "));

            // 랜덤 기부 금액 생성
            long donationAmount = generateRandomAmount(3000000, 7000000);
            long adminProfitAmount = donationAmount / 2;

            // 기부 데이터 저장
            donationRepository.save(Donation.builder()
                    .donorId("lender00" + (i + 1))
                    .contract(contract)
                    .donationAmount(donationAmount)
                    .adminProfitAmount(adminProfitAmount)
                    .build());
        }

        // 저장된 데이터 확인
        List<Donation> donations = donationRepository.findAll();
        assertThat(donations).hasSize(3); // 3개의 데이터가 저장되었는지 검증
    }

    // 랜덤 금액 생성 메서드
    private long generateRandomAmount(int min, int max) {
        return random.nextInt(max - min + 1) + min;
    }
}
