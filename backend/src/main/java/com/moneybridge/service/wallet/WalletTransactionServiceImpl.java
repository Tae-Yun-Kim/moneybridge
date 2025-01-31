package com.moneybridge.service.wallet;

import com.moneybridge.domain.member.Member;
import com.moneybridge.domain.wallet.Wallet;
import com.moneybridge.domain.wallet.WalletTransaction;
import com.moneybridge.dto.wallet.WalletTransactionDTO;
import com.moneybridge.repository.member.MemberRepository;
import com.moneybridge.repository.wallet.WalletRepository;
import com.moneybridge.repository.wallet.WalletTransactionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class WalletTransactionServiceImpl implements WalletTransactionService {

    private final WalletTransactionRepository walletTransactionRepository;
    private final WalletRepository walletRepository;
    private final MemberRepository memberRepository;

    @Override
    @Transactional
    public WalletTransactionDTO createWalletTransaction(WalletTransactionDTO walletTransactionDTO) {
        // fromWallet과 toWallet을 데이터베이스에서 가져옵니다.
        Wallet fromWallet = walletRepository.findById(walletTransactionDTO.getFromWalletId())
                .orElseThrow(() -> new RuntimeException("From Wallet not found"));
        Wallet toWallet = walletRepository.findById(walletTransactionDTO.getToWalletId())
                .orElseThrow(() -> new RuntimeException("To Wallet not found"));

        System.out.println("✅ Initial fromWallet balance: " + fromWallet.getBalance());
        System.out.println("✅ Initial toWallet balance: " + toWallet.getBalance());

        // 잔액 확인
        if (fromWallet.getBalance() < walletTransactionDTO.getAmount()) {
            throw new IllegalArgumentException("Insufficient balance in the from wallet");
        }

        Member fromMember = fromWallet.getMember();
        Member toMember = toWallet.getMember();


        // DTO에서 Entity로 변환
        WalletTransaction walletTransaction = WalletTransaction.builder()
                .fromWallet(fromWallet)
                .toWallet(toWallet)
                .amount(walletTransactionDTO.getAmount())
                .transactionType(walletTransactionDTO.getTransactionType())
                .build();

        // 거래를 저장합니다.
        walletTransaction = walletTransactionRepository.save(walletTransaction);

        // 잔액 업데이트 로직
        if (fromWallet.getAccount() != null) {
            // 계좌 → 지갑
            System.out.println("🟢 계좌에서 지갑으로 송금");
            fromWallet.updateBalance(-walletTransactionDTO.getAmount());
            toWallet.updateBalance(walletTransactionDTO.getAmount());
        } else if (toWallet.getAccount() != null) {
            // 지갑 → 계좌
            System.out.println("🟢 지갑에서 계좌로 송금");
            fromWallet.updateBalance(-walletTransactionDTO.getAmount());
            toWallet.updateBalance(walletTransactionDTO.getAmount());
        } else {
            // 지갑 간 송금
            System.out.println("🟢 지갑 간 송금");
            fromWallet.updateBalance(-walletTransactionDTO.getAmount());
            fromWallet.incrementTransactionCount();
            toWallet.updateBalance(walletTransactionDTO.getAmount());
            toWallet.incrementTransactionCount();
        }

        // 지갑 저장
        walletRepository.save(fromWallet);
        walletRepository.save(toWallet);
        memberRepository.save(fromMember);
        memberRepository.save(toMember);

        return convertToDTO(walletTransaction);
    }

    @Override
    public WalletTransactionDTO getWalletTransactionById(String transactionId) {
        WalletTransaction walletTransaction = walletTransactionRepository.findById(transactionId)
                .orElseThrow(() -> new RuntimeException("Wallet Transaction not found"));
        return convertToDTO(walletTransaction);
    }

    @Override
    public List<WalletTransactionDTO> getWalletTransactionsByFromWalletId(String fromWalletId) {
        Wallet fromWallet = walletRepository.findById(fromWalletId)
                .orElseThrow(() -> new RuntimeException("From Wallet not found"));
        return walletTransactionRepository.findByFromWallet(fromWallet).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<WalletTransactionDTO> getWalletTransactionsByToWalletId(String toWalletId) {
        Wallet toWallet = walletRepository.findById(toWalletId)
                .orElseThrow(() -> new RuntimeException("To Wallet not found"));
        return walletTransactionRepository.findByToWallet(toWallet).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<WalletTransactionDTO> getAllTransactionsByWalletId(String walletId) {
        Wallet wallet = walletRepository.findById(walletId)
                .orElseThrow(() -> new RuntimeException("Wallet not found"));

        List<WalletTransaction> transactions = walletTransactionRepository.findByFromWalletOrToWallet(wallet, wallet);

        return transactions.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    private WalletTransactionDTO convertToDTO(WalletTransaction walletTransaction) {
        return WalletTransactionDTO.builder()
                .transactionId(walletTransaction.getTransactionId())
//                .fromWalletId(walletTransaction.getFromWallet().getWalletId())
//                .toWalletId(walletTransaction.getToWallet().getWalletId())
                .fromWalletId(walletTransaction.getFromWallet() != null ? walletTransaction.getFromWallet().getWalletId() : "N/A")
                .toWalletId(walletTransaction.getToWallet() != null ? walletTransaction.getToWallet().getWalletId() : "N/A")
                .amount(walletTransaction.getAmount())
                .transactionType(walletTransaction.getTransactionType())
                .createdAt(walletTransaction.getCreatedAt())
                .updatedAt(walletTransaction.getUpdatedAt())
                .build();
    }
}
