package com.moneybridge.repository;

import com.moneybridge.domain.account.Account;
import com.moneybridge.domain.member.Member;
import com.moneybridge.domain.member.MemberGrade;
import com.moneybridge.domain.member.MemberRole;
import com.moneybridge.repository.account.AccountRepository;
import lombok.extern.log4j.Log4j2;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest
@Log4j2
public class AccountRepositoryTests {

    @Autowired
    private AccountRepository accountRepository;

    @Test
    public void testInsertAccount(){

        for (int i = 0; i < 10 ; i++) {

            Account account = Account.builder()
                            .accountNumber("000000"+i)
                                    .accountPassword("1111")
                                            .bankName("bank"+i)
                                                    .accountHolderName("tester"+i)
                                                            .balance(10000000000L)
                                                                    .build();

            accountRepository.save(account);
        }
    }
}
