package com.moneybridge.service.wallet;

import com.moneybridge.domain.account.Account;
import com.moneybridge.domain.member.Member;
import com.moneybridge.domain.wallet.Wallet;
import com.moneybridge.dto.wallet.WalletDTO;
import com.moneybridge.repository.account.AccountRepository;
import com.moneybridge.repository.member.MemberRepository;
import com.moneybridge.repository.wallet.WalletRepository;


import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;


@Service
@RequiredArgsConstructor
public class WalletServiceImpl implements WalletService {

    private final WalletRepository walletRepository;
    private final MemberRepository memberRepository;
    private final AccountRepository accountRepository;

    @Override
    @Transactional
    public WalletDTO createWallet(WalletDTO walletDTO) {
        Member member = memberRepository.findById(walletDTO.getMemberId())
                .orElseThrow(() -> new RuntimeException("Member not found"));

        // 2. Account 조회
        System.out.println("Received accountNumber: " + walletDTO.getAccountNumber());
        Account account = accountRepository.findByAccountNumber(walletDTO.getAccountNumber())
                .orElseThrow(() -> new RuntimeException("Account not found"));


        String customWalletId = "w_" + member.getId();

        Wallet wallet = Wallet.builder()
                .walletId(customWalletId)
                .member(member)
                .account(account)
                .balance(0L)
                .pinNumber(walletDTO.getPinNumber()!= null ? walletDTO.getPinNumber() : "1234") // 기본값 설정
                .transactionCount(0)
                .isLocked(false)
                .build();

        wallet = walletRepository.save(wallet);
        return convertToDTO(wallet);
    }

    @Override
    public WalletDTO getWalletById(String walletId) {
        Wallet wallet = walletRepository.findById(walletId)
                .orElseThrow(() -> new RuntimeException("Wallet not found"));
        return convertToDTO(wallet);
    }

    @Override
    public WalletDTO getWalletByAccountNumber(String accountNumber) {
        Wallet wallet = walletRepository.findByAccount_AccountNumber(accountNumber)
                .orElseThrow(() -> new RuntimeException("Wallet not found"));
        return convertToDTO(wallet);
    }

    @Override
    public WalletDTO getWalletByMemberId(String memberId) {
        Wallet wallet = walletRepository.findByMember_Id(memberId)
                .orElseThrow(() -> new RuntimeException("Wallet not found"));
        return convertToDTO(wallet);
    }

    @Override
    @Transactional
    public WalletDTO updateWalletBalance(String walletId, Long amount) {
        Wallet wallet = walletRepository.findById(walletId)
                .orElseThrow(() -> new RuntimeException("Wallet not found"));
        long newBalance = wallet.getBalance() + amount;
        if (newBalance > 1000000000L) {
            throw new IllegalArgumentException("Balance cannot exceed 1 billion won");
        }
        wallet.updateBalance(amount);
        return convertToDTO(wallet);
    }

    @Override
    @Transactional
    public void incrementTransactionCount(String walletId) {
        Wallet wallet = walletRepository.findById(walletId)
                .orElseThrow(() -> new RuntimeException("Wallet not found"));
        wallet.incrementTransactionCount();
    }

    @Override
    @Transactional
    public void lockWallet(String walletId) {
        Wallet wallet = walletRepository.findById(walletId)
                .orElseThrow(() -> new RuntimeException("Wallet not found"));
        wallet.changeLockStatus(true);
    }

    @Override
    @Transactional
    public void unlockWallet(String walletId) {
        Wallet wallet = walletRepository.findById(walletId)
                .orElseThrow(() -> new RuntimeException("Wallet not found"));
        wallet.changeLockStatus(false);
    }

    @Override
    @Transactional
    public void updatePinNumber(String walletId, String oldPin, String newPin) {
        Wallet wallet = walletRepository.findById(walletId)
                .orElseThrow(() -> new RuntimeException("Wallet not found"));

        // 기존 PIN 확인
        if (!wallet.getPinNumber().equals(oldPin)) {
            throw new IllegalArgumentException("현재 PIN 번호가 올바르지 않습니다.");
        }

        // 새로운 PIN 유효성 검사 (4자리 숫자만 허용)
        if (newPin == null || !newPin.matches("\\d{4}")) {
            throw new IllegalArgumentException("새 PIN 번호는 4자리 숫자여야 합니다.");
        }

        // PIN 변경
        wallet.setPinNumber(newPin);
        walletRepository.save(wallet);
    }

    @Override
    @Transactional
    public void transferFromAccountToWallet(String memberId, Long amount) {
        // 1. 회원 및 지갑 찾기
        Member member = memberRepository.findById(memberId)
                .orElseThrow(() -> new RuntimeException("Member not found"));
        Wallet wallet = walletRepository.findByMember(member)
                .orElseThrow(() -> new RuntimeException("Wallet not found"));

        // 2. 계좌 검증
        if (wallet.getAccount() == null) {
            throw new IllegalArgumentException("No linked account found for this wallet");
        }
        if (wallet.getAccount().getBalance() < amount) {
            throw new IllegalArgumentException("Insufficient account balance");
        }

        // 3. 계좌 잔액 차감 및 지갑 잔액 증가
        wallet.getAccount().updateBalance(-amount);
        wallet.updateBalance(amount);

        // 4. 저장
        walletRepository.save(wallet); // 지갑 업데이트
        memberRepository.save(member); // 계좌 업데이트
    }

    @Override
    @Transactional
    public void transferFromWalletToAccount(String memberId, Long amount) {
        // 1. 회원 및 지갑 찾기
        Member member = memberRepository.findById(memberId)
                .orElseThrow(() -> new RuntimeException("Member not found"));
        Wallet wallet = walletRepository.findByMember(member)
                .orElseThrow(() -> new RuntimeException("Wallet not found"));

        // 2. 잔액 검증
        if (wallet.getBalance() < amount) {
            throw new IllegalArgumentException("Insufficient wallet balance");
        }

        // 3. 계좌 검증
        if (wallet.getAccount() == null) {
            throw new IllegalArgumentException("No linked account found for this wallet");
        }

        // 4. 지갑 잔액 차감 및 계좌 잔액 증가
        wallet.updateBalance(-amount);
        wallet.getAccount().updateBalance(amount);

        // 5. 저장
        walletRepository.save(wallet); // 지갑 업데이트
        memberRepository.save(member); // 계좌 업데이트
    }

    @Override
    @Transactional
    public void transferBetweenWallets(String fromWalletId, String toWalletId, Long amount) {
        // 출발 지갑 및 도착 지갑 조회
        Wallet fromWallet = walletRepository.findById(fromWalletId)
                .orElseThrow(() -> new RuntimeException("From Wallet not found"));
        Wallet toWallet = walletRepository.findById(toWalletId)
                .orElseThrow(() -> new RuntimeException("To Wallet not found"));

        // 출발 지갑 잔액 확인
        if (fromWallet.getBalance() < amount) {
            throw new RuntimeException("Insufficient balance in the sender's wallet.");
        }

        // 잔액 업데이트
        fromWallet.updateBalanceWithWallet(-amount); // 출발 지갑에서 금액 차감
        toWallet.updateBalanceWithWallet(amount);   // 도착 지갑에 금액 추가

        // 저장
        walletRepository.save(fromWallet);
        walletRepository.save(toWallet);
    }



    private WalletDTO convertToDTO(Wallet wallet) {
        return WalletDTO.builder()
                .walletId(wallet.getWalletId())
                .memberId(wallet.getMember().getId())
                .accountNumber(wallet.getAccount().getAccountNumber())
                .balance(wallet.getBalance())
                .pinNumber(wallet.getPinNumber())
                .transactionCount(wallet.getTransactionCount())
                .isLocked(wallet.isLocked())
                .build();
    }
}
