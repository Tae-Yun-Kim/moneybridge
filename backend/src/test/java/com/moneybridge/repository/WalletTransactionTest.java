package com.moneybridge.repository;

import com.moneybridge.domain.member.Member;
import com.moneybridge.domain.wallet.Wallet;
import com.moneybridge.domain.wallet.WalletTransaction;
import com.moneybridge.repository.member.MemberRepository;
import com.moneybridge.repository.wallet.WalletRepository;
import com.moneybridge.repository.wallet.WalletTransactionRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.annotation.Rollback;
import org.springframework.transaction.annotation.Transactional;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest
@Transactional
class WalletTransactionTest {

    @Autowired
    private WalletRepository walletRepository;

    @Autowired
    private MemberRepository memberRepository;

    @Autowired
    private WalletTransactionRepository walletTransactionRepository;

    @Test
    @Rollback(false)
    void testTransferMoneyFromUser1ToUser2() {
        // given
        Member member1 = memberRepository.getWithRoles("user1");
        Member member2 = memberRepository.getWithRoles("user2");
        assertThat(member1).isNotNull();
        assertThat(member2).isNotNull();

        // 지갑 가져오기
        Wallet wallet1 = walletRepository.findByMember(member1)
                .orElseThrow(() -> new RuntimeException("Wallet for user1 not found"));
        Wallet wallet2 = walletRepository.findByMember(member2)
                .orElseThrow(() -> new RuntimeException("Wallet for user2 not found"));

        // 송금할 금액
        Long transferAmount = 1000L;

        // when: 거래 생성 및 저장
        WalletTransaction transaction = new WalletTransaction();
        transaction.setFromWallet(wallet1);
        transaction.setToWallet(wallet2);
        transaction.setAmount(transferAmount);
        transaction.setTransactionType("TRANSFER");

        walletTransactionRepository.save(transaction);

        // 지갑 잔액 업데이트
        wallet1.updateBalance(-transferAmount);
        wallet2.updateBalance(transferAmount);

        walletRepository.save(wallet1);
        walletRepository.save(wallet2);

        // 결과 출력
        System.out.println("===== 송금 테스트 결과 =====");
        System.out.println("송금 후 user1의 잔액: " + wallet1.getBalance() + "원");
        System.out.println("송금 후 user2의 잔액: " + wallet2.getBalance() + "원");
    }
}
