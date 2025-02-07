package com.moneybridge.repository.wallet;

import com.moneybridge.domain.account.Account;
import com.moneybridge.domain.member.Member;
import com.moneybridge.domain.wallet.Wallet;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface WalletRepository extends JpaRepository<Wallet, String> {
    Optional<Wallet> findByAccount_AccountNumber(String accountNumber);
    Optional<Wallet> findByMember(Member member);
    Optional<Wallet> findByMember_Id(String memberId); // Long에서 String으로 변경
}
