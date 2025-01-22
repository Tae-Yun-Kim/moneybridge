package com.moneybridge.repository;

import com.moneybridge.domain.member.Member;
import com.moneybridge.domain.wallet.Wallet;
import com.moneybridge.repository.member.MemberRepository;
import com.moneybridge.repository.wallet.WalletRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.annotation.Rollback;
import org.springframework.transaction.annotation.Transactional;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest
@Transactional
class WalletRepositoryTest {

    @Autowired
    private WalletRepository walletRepository;

    @Autowired
    private MemberRepository memberRepository;

    @Test
    @Rollback(false)
    void testCreateWalletWithRandomMoney() {
        // given
        Member member = memberRepository.getWithRoles("user1");
        assertThat(member).isNotNull();

        // 기존 지갑이 있다면 삭제
        walletRepository.findByMember(member)
                .ifPresent(w -> walletRepository.delete(w));

        // 지갑 생성
        String customWalletId = "w_" + member.getId();
        Wallet wallet = Wallet.builder()
                .walletId(customWalletId)
                .member(member)
                .accountNumber(member.getAccountNumber())
                .balance(0L)
                .pinNumber("1234")
                .transactionCount(0)
                .isLocked(false)
                .build();

        // when
        wallet = walletRepository.save(wallet);

        Long randomAmount = (long) (Math.random() * 990000 + 10000);

        wallet.updateBalance(randomAmount);
        walletRepository.save(wallet);

        // then
        Wallet foundWallet = walletRepository.findByMember(member)
                .orElseThrow(() -> new RuntimeException("Wallet not found"));

        assertThat(foundWallet).isNotNull();
        assertThat(foundWallet.getWalletId()).isEqualTo(customWalletId);
        assertThat(foundWallet.getBalance()).isEqualTo(randomAmount);
        assertThat(foundWallet.getMember().getId()).isEqualTo("user1");

        // 결과 출력
        System.out.println("===== 테스트 결과 =====");
        System.out.println("지갑 ID: " + foundWallet.getWalletId());
        System.out.println("회원 ID: " + foundWallet.getMember().getId());
        System.out.println("계좌번호: " + foundWallet.getAccountNumber());
        System.out.println("입금액: " + randomAmount + "원");
        System.out.println("최종잔액: " + foundWallet.getBalance() + "원");
    }
}
