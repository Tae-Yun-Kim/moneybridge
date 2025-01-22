package com.moneybridge.service.wallet;

import com.moneybridge.dto.wallet.TransactionDTO;

import java.util.List;

public interface TransactionService {
    TransactionDTO createTransaction(TransactionDTO transactionDTO);
    TransactionDTO getTransactionById(String transactionId);
    List<TransactionDTO> getTransactionsByWalletId(String walletId);
    List<TransactionDTO> getTransactionsByAccountNumber(String accountNumber);
}
