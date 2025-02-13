package com.moneybridge.service.wallet;

import com.moneybridge.dto.wallet.WalletTransactionDTO;
import java.util.List;

public interface WalletTransactionService {
    WalletTransactionDTO createWalletTransaction(WalletTransactionDTO walletTransactionDTO);
    WalletTransactionDTO getWalletTransactionById(String transactionId);
    List<WalletTransactionDTO> getWalletTransactionsByFromWalletId(String fromWalletId);
    List<WalletTransactionDTO> getWalletTransactionsByToWalletId(String toWalletId);
    List<WalletTransactionDTO> getAllTransactionsByWalletId(String walletId);
}
