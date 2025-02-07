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

//    @Test
//    public void testInsertMemberWithAccount() {
//        for (int i = 0; i < 10; i++) {
//            boolean isLender = i % 2 == 1; // 홀수는 대출자
//
//            // Account 생성
//            Account account = Account.builder()
//                    .accountNumber("123-456-78" + i)
//                    .accountPassword("password" + i)
//                    .bankName("Test Bank " + i)
//                    .accountHolderName("Holder " + i)
//                    .balance(1000L + i * 100)
//                    .build();
//
//            accountRepository.save(account);
//
//            // Member 생성
//            Member member = Member.builder()
//                    .id("user" + i)
//                    .password(passwordEncoder.encode("1111"))
//                    .name("tester" + i)
//                    .nickname("User" + i)
//                    .residentNumber("000000-000000" + i)
//                    .phoneNumber("010-0000-000" + i)
//                    .email("test" + i + "@aaa.com")
//                    .address("서울시 강남" + i + "동")
//                    .isLender(isLender)
//                    .accountLocked(false)
//                    .build();
//
//            // 양방향 관계 설정
//            member.setAccount(account);
//            account.setMember(member);
//
//            // 역할 및 등급 설정
//            member.addRole(MemberRole.USER);
//
//            if (i >= 4) {
//                member.addGrade(MemberGrade.SILVER);
//            }
//            if (i >= 7) {
//                member.addGrade(MemberGrade.GOLD);
//            }
//
//            memberRepository.save(member);
//        }
//    }

    @Test
    public void testInsertMemberWithAccount() {
        char[] lenders = {'a', 'b', 'c', 'd', 'e'}; // 출자자
        char[] borrowers = {'f', 'g', 'h', 'i', 'j'}; // 대출자

        // 출자자 생성
        for (char ch : lenders) {
            createMemberWithAccount(String.valueOf(ch), true);
        }

        // 대출자 생성 (모든 대출자는 등급이 있어야 함)
        for (char ch : borrowers) {
            createMemberWithAccount(String.valueOf(ch), false);
        }
    }

    private void createMemberWithAccount(String userId, boolean isLender) {
        // Account 생성
        Account account = Account.builder()
                .accountNumber("987-654-32" + userId)
                .accountPassword("pass" + userId)
                .bankName("Bank " + userId)
                .accountHolderName("Holder " + userId)
                .balance(5000L)
                .build();

        accountRepository.save(account);

        // Member 생성
        Member member = Member.builder()
                .id(userId)
                .password(passwordEncoder.encode("1111"))
                .name("User " + userId)
                .nickname("Nick_" + userId)
                .residentNumber("000000-000000" + userId)
                .phoneNumber("010-1234-567" + userId)
                .email(userId + "@test.com")
                .address("서울시 강남구 " + userId + "동")
                .isLender(isLender)
                .accountLocked(false)
                .account(account) // 계좌 설정
                .build();

        // 기본 역할 추가
        member.addRole(MemberRole.USER);

        // ✅ 모든 회원이 최소 BRONZE 등급을 가지도록 설정
        member.addGrade(MemberGrade.BRONZE);

        // ✅ 대출자는 추가적인 등급을 가져야 하므로 설정
        if (!isLender) { // 대출자인 경우
            if (userId.compareTo("h") >= 0 && userId.compareTo("j") <= 0) {
                member.addGrade(MemberGrade.SILVER);
            }
            if (userId.equals("j")) {
                member.addGrade(MemberGrade.GOLD);
            }
        }

        // ✅ 출자자는 추가적으로 등급을 가질 수 있음
        if (isLender) {
            if (userId.compareTo("c") >= 0 && userId.compareTo("e") <= 0) {
                member.addGrade(MemberGrade.SILVER);
            }
            if (userId.equals("e")) {
                member.addGrade(MemberGrade.GOLD);
            }
        }

        memberRepository.save(member);
        log.info("✅ 회원 생성 완료: " + userId + " (출자자: " + isLender + ", 등급: " + member.getMemberGradeList() + ")");
    }

    @Test
    public void testInsertSimpleIds() {
        // 1~5: 출자자 (lender), 6~10: 대출자 (borrower)
        for (int i = 1; i <= 10; i++) {
            boolean isLender = i <= 5; // 1~5는 출자자, 6~10은 대출자
            createSimpleMember(String.valueOf(i), isLender);
        }
    }

    private void createSimpleMember(String userId, boolean isLender) {
        // ✅ Account 생성
        Account account = Account.builder()
                .accountNumber("111-222-33" + userId) // 예제 계좌번호
                .accountPassword("pass" + userId)
                .bankName("Bank_" + userId)
                .accountHolderName("Holder_" + userId)
                .balance(10000L)
                .build();

        accountRepository.save(account);

        // ✅ Member 생성
        Member member = Member.builder()
                .id(userId) // 아이디는 1~10
                .password(passwordEncoder.encode("1111")) // 비밀번호 암호화
                .name("User_" + userId)
                .nickname("Nick_" + userId)
                .residentNumber("900101-12345" + userId) // 주민번호 예제
                .phoneNumber("010-1111-222" + userId) // 예제 전화번호
                .email("user" + userId + "@test.com")
                .address("서울시 강남구 " + userId + "동")
                .isLender(isLender)
                .accountLocked(false)
                .account(account) // 계좌 연결
                .build();

        // ✅ 모든 사용자 기본 USER 역할 추가
        member.addRole(MemberRole.USER);

        // ✅ 출자자는 BRONZE부터, 대출자는 최소 SILVER 등급 보장
        if (isLender) {
            member.addGrade(MemberGrade.BRONZE);
            if (Integer.parseInt(userId) >= 4) {
                member.addGrade(MemberGrade.SILVER);
            }
            if (Integer.parseInt(userId) == 5) {
                member.addGrade(MemberGrade.GOLD);
            }
        } else { // 대출자
            member.addGrade(MemberGrade.SILVER); // 대출자는 최소 SILVER
            if (Integer.parseInt(userId) >= 8) {
                member.addGrade(MemberGrade.GOLD);
            }
        }

        // ✅ 회원 저장
        memberRepository.save(member);
        log.info("✅ 회원 생성 완료: " + userId + " (출자자: " + isLender + ", 등급: " + member.getMemberGradeList() + ")");
    }


//    @Test
//    public void testReadMemberWithAccount() {
//        String id = "user9";
//
//        Member member = memberRepository.getWithRoles(id);
//
//        log.info("-----------------");
//        log.info(member);
//        log.info("Account: " + member.getAccount());
//    }
}
