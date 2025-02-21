//package com.moneybridge.repository;
//
//import com.moneybridge.domain.member.Member;
//import com.moneybridge.domain.wallet.Wallet;
//import com.moneybridge.domain.wallet.WalletTransaction;
//import com.moneybridge.repository.member.MemberRepository;
//import com.moneybridge.repository.wallet.WalletRepository;
//import com.moneybridge.repository.wallet.WalletTransactionRepository;
//import jakarta.persistence.EntityManager;
//import org.junit.jupiter.api.BeforeEach;
//import org.junit.jupiter.api.Test;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.boot.test.context.SpringBootTest;
//import org.springframework.test.annotation.Rollback;
//import org.springframework.transaction.annotation.Transactional;
//
//import java.util.List;
//
//import static org.assertj.core.api.Assertions.assertThat;
//
//@SpringBootTest
//@Transactional
//class WalletTransactionTest {
//
//    @Autowired
//    private WalletRepository walletRepository;
//
//    @Autowired
//    private MemberRepository memberRepository;
//
//    @Autowired
//    private WalletTransactionRepository walletTransactionRepository;
//
//    @Autowired
//    private EntityManager entityManager;
//
//    private Member member1;
//    private Member member2;
//    private Wallet wallet1;
//    private Wallet wallet2;
//
//    @BeforeEach
//    void setup() {
//        // 테스트 데이터 초기화
//        member1 = memberRepository.getWithRoles("user1");
//        member2 = memberRepository.getWithRoles("user2");
//        wallet1 = walletRepository.findByMember(member1).orElseThrow();
//        wallet2 = walletRepository.findByMember(member2).orElseThrow();
//
//        // 초기 잔액 설정
//        wallet1.setBalance(10_000L);
//        wallet2.setBalance(5_000L);
//        walletRepository.saveAll(List.of(wallet1, wallet2));
//    }
//
//    @Test
//    @Rollback(false) // 실제 DB에 저장되는지 확인
//    void testTransactionCountSyncBetweenWalletAndMember() {
//        // given
//        Long transferAmount = 2_000L;
//        int initialWalletCount1 = wallet1.getTransactionCount();
//        int initialWalletCount2 = wallet2.getTransactionCount();
//        int initialMemberCount1 = member1.getTransactionCount();
//        int initialMemberCount2 = member2.getTransactionCount();
//
//        // when: 거래 수행
//        performTransfer(wallet1, wallet2, transferAmount);
//
//        // then: 영속성 컨텍스트 초기화 후 실제 DB 값 검증
//        entityManager.flush();
//        entityManager.clear();
//
//        Member refreshedMember1 = memberRepository.findById(member1.getId()).orElseThrow();
//        Member refreshedMember2 = memberRepository.findById(member2.getId()).orElseThrow();
//        Wallet refreshedWallet1 = walletRepository.findById(wallet1.getWalletId()).orElseThrow();
//        Wallet refreshedWallet2 = walletRepository.findById(wallet2.getWalletId()).orElseThrow();
//
//        assertThat(refreshedWallet1.getTransactionCount()).isEqualTo(initialWalletCount1 + 1);
//        assertThat(refreshedWallet2.getTransactionCount()).isEqualTo(initialWalletCount2 + 1);
//        assertThat(refreshedMember1.getTransactionCount()).isEqualTo(initialMemberCount1 + 1);
//        assertThat(refreshedMember2.getTransactionCount()).isEqualTo(initialMemberCount2 + 1);
//    }
//
//    private void performTransfer(Wallet fromWallet, Wallet toWallet, Long amount) {
//        // 거래 기록 생성
//        WalletTransaction transaction = WalletTransaction.builder()
//                .fromWallet(fromWallet)
//                .toWallet(toWallet)
//                .amount(amount)
//                .transactionType("TRANSFER")
//                .build();
//
//        // 거래 횟수 증가
//        fromWallet.incrementTransactionCount();
//        toWallet.incrementTransactionCount();
//        fromWallet.getMember().incrementTransactionCount();
//        toWallet.getMember().incrementTransactionCount();
//
//        // 잔액 업데이트
//        fromWallet.updateBalanceWithWallet(-amount);
//        toWallet.updateBalanceWithWallet(amount);
//
//        // 저장 (트랜잭션 커밋 시 자동 반영)
//        walletTransactionRepository.save(transaction);
//    }
//}
