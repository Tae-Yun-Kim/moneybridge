package com.moneybridge.repository;

import com.moneybridge.domain.member.MemberGrade;
import lombok.extern.log4j.Log4j2;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.crypto.password.PasswordEncoder;

import com.moneybridge.domain.member.Member;
import com.moneybridge.domain.member.MemberRole;

@SpringBootTest
@Log4j2
public class MemberRepositoryTests {

    @Autowired
    private MemberRepository memberRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Test
    public void testInsertMember(){

        for (int i = 0; i < 10 ; i++) {
            boolean isLender = i % 2 == 1; // 나머지가 1이면 true, 아니면 false


            Member member = Member.builder()
                    .id("user"+i)
                    .password(passwordEncoder.encode("1111"))
                    .name("tester"+i)
                    .nickname("User"+i)
                    .residentNumber("000000-000000"+i)
                    .phoneNumber("010-0000-000"+i)
                    .email("test"+i+"@aaa.com")
                    .accountNumber("000000"+i)
                    .address("서울시 강남"+i+"동")
                    .isLender(isLender)
                    .accountLocked(false)
                    .build();

            member.addRole(MemberRole.USER);

            if(i >= 4){
                member.addGrade(MemberGrade.SILVER);
            }
            if (i >= 7){
                member.addGrade(MemberGrade.GOLD);
            }

            memberRepository.save(member);
        }
    }

    @Test
    public void testRead() {

        String id = "user9";

        Member member = memberRepository.getWithRoles(id);

        log.info("-----------------");
        log.info(member);
    }

}