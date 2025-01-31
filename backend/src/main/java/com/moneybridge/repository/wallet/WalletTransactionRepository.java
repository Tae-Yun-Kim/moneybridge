package com.moneybridge.repository.wallet;

import com.moneybridge.domain.wallet.Wallet;
import com.moneybridge.domain.wallet.WalletTransaction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface WalletTransactionRepository extends JpaRepository<WalletTransaction, String> {
    List<WalletTransaction> findByFromWallet(Wallet fromWallet);
    List<WalletTransaction> findByToWallet(Wallet toWallet);

    // 추가: 특정 지갑의 모든 거래 내역 (입/출금)
    List<WalletTransaction> findByFromWalletOrToWallet(Wallet fromWallet, Wallet toWallet);
}
