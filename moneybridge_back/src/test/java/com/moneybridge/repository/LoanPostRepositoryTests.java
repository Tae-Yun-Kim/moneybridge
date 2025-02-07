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

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.IntStream;

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
        String uniqueAccountNumber = "123-456-" + UUID.randomUUID().toString().substring(0, 6);
        Account account = Account.builder()
                .accountNumber(uniqueAccountNumber)
                .accountPassword("pass1234")
                .bankName("Test Bank")
                .accountHolderName("Lender Name")
                .balance(1000L)
                .build();

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
                .account(account)
                .build();

        memberRepository.save(lender);
    }
    //게시글 생성
    @Test
    void testCreateLoanPost() {
        LoanPost loanPost = LoanPost.builder()
                .title("Loan for Small Business")
                .writer(lender)
                .loanAmount(10000L)
                .repaymentPeriod(12)
                .additionalConditions("Test condition")
                .build();

        LoanPost savedPost = loanPostRepository.save(loanPost);

        assertThat(savedPost).isNotNull();
        assertThat(savedPost.getId()).isNotNull();
        assertThat(savedPost.getTitle()).isEqualTo("Loan for Small Business");
    }
    //30개의대출게시글 생성
    @Test
    void testCreateMultipleLoanPosts() {
        List<LoanPost> posts = IntStream.rangeClosed(1, 30).mapToObj(i ->
                LoanPost.builder()
                        .title("Loan Post " + i)
                        .writer(lender)
                        .loanAmount(5000L * i)
                        .repaymentPeriod(6 + (i % 12))
                        .additionalConditions("Condition " + i)
                        .build()
        ).toList();

        loanPostRepository.saveAll(posts);
        List<LoanPost> savedPosts = loanPostRepository.findAll();

        assertThat(savedPosts).hasSizeGreaterThanOrEqualTo(30);
    }
    //상세페이지 조회기능도 추가
    @Test
    void testFindLoanPostById() {
        LoanPost loanPost = LoanPost.builder()
                .title("Personal Loan Request")
                .writer(lender)
                .loanAmount(15000L)
                .repaymentPeriod(18)
                .additionalConditions("Flexible repayment")
                .build();
        LoanPost savedPost = loanPostRepository.save(loanPost);

        Optional<LoanPost> foundPost = loanPostRepository.findById(savedPost.getId());

        assertThat(foundPost).isPresent();
        assertThat(foundPost.get().getTitle()).isEqualTo("Personal Loan Request");
    }
    //수정코드
    @Test
    void testUpdateLoanPost() {
        LoanPost loanPost = LoanPost.builder()
                .title("Initial Loan Offer")
                .writer(lender)
                .loanAmount(12000L)
                .repaymentPeriod(24)
                .additionalConditions("Original conditions")
                .build();
        LoanPost savedPost = loanPostRepository.save(loanPost);

        savedPost.setTitle("Updated Loan Offer");
        savedPost.setLoanAmount(25000L);
        savedPost.setRepaymentPeriod(36);
        savedPost.setAdditionalConditions("Updated repayment terms");
        LoanPost updatedPost = loanPostRepository.save(savedPost);

        assertThat(updatedPost.getTitle()).isEqualTo("Updated Loan Offer");
        assertThat(updatedPost.getLoanAmount()).isEqualTo(25000L);
    }
    //삭제코드
    @Test
    void testDeleteLoanPost() {
        LoanPost loanPost = LoanPost.builder()
                .title("Temporary Loan Post")
                .writer(lender)
                .loanAmount(10000L)
                .repaymentPeriod(12)
                .additionalConditions("Temporary condition")
                .build();
        LoanPost savedPost = loanPostRepository.save(loanPost);

        loanPostRepository.delete(savedPost);
        Optional<LoanPost> deletedPost = loanPostRepository.findById(savedPost.getId());

        assertThat(deletedPost).isEmpty();
    }
}
