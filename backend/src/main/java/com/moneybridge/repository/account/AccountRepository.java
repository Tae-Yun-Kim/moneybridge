package com.moneybridge.repository.account;

import com.moneybridge.domain.account.Account;
import com.moneybridge.domain.member.Member;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface AccountRepository extends JpaRepository<Account, Long> {
    Optional<Account> findByAccountNumber(String accountNumber);

//    @Query("SELECT m FROM Member m JOIN FETCH m.account WHERE m.id = :id")
//    Member findMemberWithAccount(@Param("id") String id);
}
