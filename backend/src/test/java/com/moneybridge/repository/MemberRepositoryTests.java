package com.moneybridge.repository;

import com.moneybridge.domain.account.Account;
import com.moneybridge.domain.member.Member;
import com.moneybridge.domain.member.MemberGrade;
import com.moneybridge.domain.member.MemberRole;
import com.moneybridge.repository.member.MemberRepository;
import com.moneybridge.repository.account.AccountRepository;
import lombok.extern.log4j.Log4j2;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.crypto.password.PasswordEncoder;

@SpringBootTest
@Log4j2
public class MemberRepositoryTests {

    @Autowired
    private MemberRepository memberRepository;

    @Autowired
    private AccountRepository accountRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Test
    public void testInsertMemberWithAccount() {
        for (int i = 0; i < 10; i++) {
            boolean isLender = i % 2 == 1; // 홀수는 대출자

            // Account 생성
            Account account = Account.builder()
                    .accountNumber("123-456-78" + i)
                    .accountPassword("password" + i)
                    .bankName("Test Bank " + i)
                    .accountHolderName("Holder " + i)
                    .balance(1000.0 + i * 100)
                    .build();

            accountRepository.save(account);

            // Member 생성
            Member member = Member.builder()
                    .id("user" + i)
                    .password(passwordEncoder.encode("1111"))
                    .name("tester" + i)
                    .nickname("User" + i)
                    .residentNumber("000000-000000" + i)
                    .phoneNumber("010-0000-000" + i)
                    .email("test" + i + "@aaa.com")
                    .address("서울시 강남" + i + "동")
                    .isLender(isLender)
                    .accountLocked(false)
                    .build();

            // 양방향 관계 설정
            member.setAccount(account);
            account.setMember(member);

            // 역할 및 등급 설정
            member.addRole(MemberRole.USER);

            if (i >= 4) {
                member.addGrade(MemberGrade.SILVER);
            }
            if (i >= 7) {
                member.addGrade(MemberGrade.GOLD);
            }

            memberRepository.save(member);
        }
    }

    @Test
    public void testReadMemberWithAccount() {
        String id = "user9";

        Member member = memberRepository.getWithRoles(id);

        log.info("-----------------");
        log.info(member);
        log.info("Account: " + member.getAccount());
    }
}
