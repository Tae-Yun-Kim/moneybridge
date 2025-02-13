package com.moneybridge.repository;

import com.moneybridge.domain.account.Account;
import com.moneybridge.domain.member.Member;
import com.moneybridge.domain.post.LoanPost;
import com.moneybridge.repository.member.MemberRepository;
import com.moneybridge.repository.post.LoanPostRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.util.Optional;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest
class LoanPostRepositoryTests {

    @Autowired
    private LoanPostRepository loanPostRepository;

    @Autowired
    private MemberRepository memberRepository;

    private Member lender;



    @BeforeEach
    void setUp() {
        // 고유한 계좌 번호 생성
        String uniqueAccountNumber = "123-456-" + UUID.randomUUID().toString().substring(0, 6);

        // 테스트용 계좌 생성
        Account account = Account.builder()
                .accountNumber(uniqueAccountNumber) // 고유 계좌 번호
                .accountPassword("pass1234")
                .bankName("Test Bank")
                .accountHolderName("Lender Name")
                .balance(1000L)
                .build();

        // 테스트용 사용자 생성
        lender = Member.builder()
                .id("lender123")
                .password("password")
                .name("Lender Name")
                .residentNumber("123456-1234567")
                .phoneNumber("010-1234-5678")
                .email("lender@example.com")
                .social(false)
                .isLender(true)
                .accountLocked(false)
                .account(account) // 계좌 연결
                .build();

        memberRepository.save(lender);
    }





    @Test
    void testCreateLoanPost() {
        // Given
        LoanPost loanPost = LoanPost.builder()
                .writer(lender)
                .loanAmount((long) 40000)
                .repaymentPeriod(12)
                .additionalConditions("Test condition")
                .build();

        // When
        LoanPost savedPost = loanPostRepository.save(loanPost);

        // Then
        assertThat(savedPost).isNotNull();
        assertThat(savedPost.getId()).isNotNull();
        assertThat(savedPost.getLoanAmount()).isEqualTo(10000);
        assertThat(savedPost.getWriter().getId()).isEqualTo(lender.getId());
    }

    @Test
    void testFindLoanPostById() {
        // Given
        LoanPost loanPost = LoanPost.builder()
                .writer(lender)
                .loanAmount((long) 10000)
                .repaymentPeriod(12)
                .additionalConditions("Test condition")
                .build();
        LoanPost savedPost = loanPostRepository.save(loanPost);

        // When
        Optional<LoanPost> foundPost = loanPostRepository.findById(savedPost.getId());

        // Then
        assertThat(foundPost).isPresent();
        assertThat(foundPost.get().getLoanAmount()).isEqualTo(10000);
    }

    @Test
    void testUpdateLoanPost() {
        // Given
        LoanPost loanPost = LoanPost.builder()
                .writer(lender)
                .loanAmount((long) 10000)
                .repaymentPeriod(12)
                .additionalConditions("Test condition")
                .build();
        LoanPost savedPost = loanPostRepository.save(loanPost);

        // When
        savedPost.setLoanAmount((long) 20000);
        savedPost.setRepaymentPeriod(24);
        savedPost.setAdditionalConditions("Updated condition");
        LoanPost updatedPost = loanPostRepository.save(savedPost);

        // Then
        assertThat(updatedPost.getLoanAmount()).isEqualTo(20000);
        assertThat(updatedPost.getRepaymentPeriod()).isEqualTo(24);
        assertThat(updatedPost.getAdditionalConditions()).isEqualTo("Updated condition");
    }

    @Test
    void testDeleteLoanPost() {
        // Given
        LoanPost loanPost = LoanPost.builder()
                .writer(lender)
                .loanAmount((long) 10000)
                .repaymentPeriod(12)
                .additionalConditions("Test condition")
                .build();
        LoanPost savedPost = loanPostRepository.save(loanPost);

        // When
        loanPostRepository.delete(savedPost);
        Optional<LoanPost> deletedPost = loanPostRepository.findById(savedPost.getId());

        // Then
        assertThat(deletedPost).isEmpty();
    }
}
