//package com.moneybridge.repository;
//
//import com.moneybridge.domain.member.Member;
//import com.moneybridge.domain.wallet.Wallet;
//import com.moneybridge.repository.member.MemberRepository;
//import com.moneybridge.repository.wallet.WalletRepository;
//import org.junit.jupiter.api.Test;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.boot.test.context.SpringBootTest;
//import org.springframework.test.annotation.Rollback;
//import org.springframework.transaction.annotation.Transactional;
//
//import static org.assertj.core.api.Assertions.assertThat;
//
//@SpringBootTest
//@Transactional
//class WalletRepositoryTest {
//
//    @Autowired
//    private WalletRepository walletRepository;
//
//    @Autowired
//    private MemberRepository memberRepository;
//
//    @Test
//    @Rollback(false)
//    void testCreateWalletWithRandomMoney() {
//        // given
//        Member member = memberRepository.findById("user1")
//                .orElseThrow(() -> new RuntimeException("Member not found: user1"));
//
//        assertThat(member.getAccount()).isNotNull();
//
//        // 기존 지갑 삭제 (테스트 재현성 확보)
//        walletRepository.findByMember(member)
//                .ifPresent(walletRepository::delete);
//
//        // 지갑 생성
//        String customWalletId = "w_" + member.getId();
//        Wallet wallet = Wallet.builder()
//                .walletId(customWalletId)
//                .member(member)
//                .account(member.getAccount())
//                .balance(0L)
//                .pinNumber("1234")
//                .transactionCount(0)
//                .isLocked(false)
//                .build();
//
//        // when
//        wallet = walletRepository.save(wallet);
//
//        Long depositAmount = 50000L; // 고정된 금액
//
//        Long initialBalance = wallet.getAccount().getBalance();
//
//        wallet.updateBalance(depositAmount);
//        walletRepository.save(wallet);
//
//        // then
//        Wallet foundWallet = walletRepository.findByMember(member)
//                .orElseThrow(() -> new RuntimeException("Wallet not found"));
//
//        assertThat(foundWallet).isNotNull();
//        assertThat(foundWallet.getWalletId()).isEqualTo(customWalletId);
//        assertThat(foundWallet.getBalance()).isEqualTo(depositAmount);
//        assertThat(foundWallet.getMember().getId()).isEqualTo("user1");
//
//        Long updatedAccountBalance = member.getAccount().getBalance();
//        assertThat(updatedAccountBalance).isEqualTo(initialBalance - depositAmount);
//
//        // 결과 출력
//        System.out.println("===== 테스트 결과 =====");
//        System.out.println("지갑 ID: " + foundWallet.getWalletId());
//        System.out.println("회원 ID: " + foundWallet.getMember().getId());
//        System.out.println("계좌번호: " + foundWallet.getAccount());
//        System.out.println("입금액: " + depositAmount + "원");
//        System.out.println("최종잔액: " + foundWallet.getBalance() + "원");
//    }
//
//    @Test
//    @Rollback(false)
//    void testTransferFromAccountToWallet() {
//        // given
//        String memberId = "user1";
//        Long transferAmount = 100000000L;
//
//        Member member = memberRepository.findById(memberId)
//                .orElseThrow(() -> new RuntimeException("Member not found"));
//        Wallet wallet = walletRepository.findByMember(member)
//                .orElseThrow(() -> new RuntimeException("Wallet not found"));
//
//        Long initialAccountBalance = wallet.getAccount().getBalance();
//        Long initialWalletBalance = wallet.getBalance();
//
//        assertThat(initialAccountBalance).isGreaterThanOrEqualTo(transferAmount);
//
//        // when
//        wallet.transferFromAccount(transferAmount);
//
//        // then
//        Wallet updatedWallet = walletRepository.findByMember(member)
//                .orElseThrow(() -> new RuntimeException("Wallet not found"));
//        Long updatedAccountBalance = updatedWallet.getAccount().getBalance();
//
//        assertThat(updatedWallet.getBalance()).isEqualTo(initialWalletBalance + transferAmount);
//        assertThat(updatedAccountBalance).isEqualTo(initialAccountBalance - transferAmount);
//
//        // 결과 출력
//        System.out.println("===== 테스트 결과 =====");
//        System.out.println("송금 후 지갑 잔액: " + updatedWallet.getBalance() + "원");
//        System.out.println("송금 후 계좌 잔액: " + updatedAccountBalance + "원");
//    }
//
//    @Test
//    @Rollback(false)
//    void testTransferFromWalletToAccount() {
//        // given
//        Member member = memberRepository.findById("user1")
//                .orElseThrow(() -> new RuntimeException("Member not found: user1"));
//
//        Wallet wallet = walletRepository.findByMember(member)
//                .orElseThrow(() -> new RuntimeException("Wallet not found"));
//
//        Long transferAmount = 50000L;
//
//        // 지갑 잔액 확인
//        assertThat(wallet.getBalance()).isGreaterThanOrEqualTo(transferAmount);
//
//        // 계좌 잔액 초기값 저장
//        Long initialAccountBalance = wallet.getAccount().getBalance();
//        Long initialWalletBalance = wallet.getBalance();
//
//        // when
//        wallet.transferToAccount(transferAmount);
//        walletRepository.save(wallet); // 지갑 저장
//        memberRepository.save(member); // 회원(계좌 포함) 저장
//
//        // then
//        Wallet updatedWallet = walletRepository.findById(wallet.getWalletId())
//                .orElseThrow(() -> new RuntimeException("Wallet not found after update"));
//
//        Member updatedMember = memberRepository.findById(member.getId())
//                .orElseThrow(() -> new RuntimeException("Member not found after update"));
//
//        assertThat(updatedWallet.getBalance()).isEqualTo(initialWalletBalance - transferAmount);
//        assertThat(updatedMember.getAccount().getBalance()).isEqualTo(initialAccountBalance + transferAmount);
//
//        // 결과 출력
//        System.out.println("===== 테스트 결과 =====");
//        System.out.println("지갑 ID: " + updatedWallet.getWalletId());
//        System.out.println("잔액 송금 후 지갑 잔액: " + updatedWallet.getBalance() + "원");
//        System.out.println("계좌 잔액: " + updatedMember.getAccount().getBalance() + "원");
//    }
//}
