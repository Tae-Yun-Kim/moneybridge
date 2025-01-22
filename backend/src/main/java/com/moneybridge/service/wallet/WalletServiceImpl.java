package com.moneybridge.service.wallet;

import com.moneybridge.domain.member.Member;
import com.moneybridge.domain.wallet.Wallet;
import com.moneybridge.dto.wallet.WalletDTO;
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

    @Override
    @Transactional
    public WalletDTO createWallet(WalletDTO walletDTO) {
        Member member = memberRepository.findById(walletDTO.getMemberId())
                .orElseThrow(() -> new RuntimeException("Member not found"));

        String customWalletId = "w_" + member.getId();

        Wallet wallet = Wallet.builder()
                .walletId(customWalletId)
                .member(member)
                .accountNumber(walletDTO.getAccountNumber())
                .balance(0L)
                .pinNumber(walletDTO.getPinNumber())
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
        Wallet wallet = walletRepository.findByAccountNumber(accountNumber)
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

    private WalletDTO convertToDTO(Wallet wallet) {
        return WalletDTO.builder()
                .walletId(wallet.getWalletId())
                .memberId(wallet.getMember().getId())
                .accountNumber(wallet.getAccountNumber())
                .balance(wallet.getBalance())
                .pinNumber(wallet.getPinNumber())
                .transactionCount(wallet.getTransactionCount())
                .isLocked(wallet.isLocked())
                .build();
    }
}
