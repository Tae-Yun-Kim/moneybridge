package com.moneybridge.repository.wallet;

import com.moneybridge.domain.wallet.Transaction;;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TransactionRepository extends JpaRepository<Transaction, String> {
    List<Transaction> findByWalletId(String walletId);
    List<Transaction> findByAccountNumber(String accountNumber);
}
