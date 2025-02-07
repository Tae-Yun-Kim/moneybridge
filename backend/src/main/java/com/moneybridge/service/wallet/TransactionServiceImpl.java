package com.moneybridge.service.wallet;

import com.moneybridge.domain.wallet.Transaction;
import com.moneybridge.dto.wallet.TransactionDTO;
import com.moneybridge.repository.wallet.TransactionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TransactionServiceImpl implements TransactionService {

    private final TransactionRepository transactionRepository;

    @Override
    @Transactional
    public TransactionDTO createTransaction(TransactionDTO transactionDTO) {
        Transaction transaction = new Transaction();
        // DTO to Entity 변환 로직
        transaction = transactionRepository.save(transaction);
        return convertToDTO(transaction);
    }

    @Override
    public TransactionDTO getTransactionById(String transactionId) {
        Transaction transaction = transactionRepository.findById(transactionId)
                .orElseThrow(() -> new RuntimeException("Transaction not found"));
        return convertToDTO(transaction);
    }

    @Override
    public List<TransactionDTO> getTransactionsByWalletId(String walletId) {
        return transactionRepository.findByWalletId(walletId).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<TransactionDTO> getTransactionsByAccountNumber(String accountNumber) {
        return transactionRepository.findByAccountNumber(accountNumber).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    private TransactionDTO convertToDTO(Transaction transaction) {
        // Entity to DTO 변환 로직
        return new TransactionDTO();
    }
}
