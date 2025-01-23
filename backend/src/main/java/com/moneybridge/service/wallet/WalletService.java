package com.moneybridge.service.wallet;

import com.moneybridge.dto.wallet.WalletDTO;
import java.math.BigDecimal;

public interface WalletService {
    WalletDTO createWallet(WalletDTO walletDTO);
    WalletDTO getWalletById(String walletId);
    WalletDTO getWalletByAccountNumber(String accountNumber);
    WalletDTO getWalletByMemberId(String memberId);  // userId를 memberId로 변경
    WalletDTO updateWalletBalance(String walletId, Long amount);
    void incrementTransactionCount(String walletId);
    void lockWallet(String walletId);
    void unlockWallet(String walletId);
    void updatePinNumber(String walletId, String oldPin, String newPin);
    void transferFromWalletToAccount(String memberId, Long amount);
    void transferFromAccountToWallet(String memberId, Long amount);
    void transferBetweenWallets(String fromWalletId, String toWalletId, Long amount);
}