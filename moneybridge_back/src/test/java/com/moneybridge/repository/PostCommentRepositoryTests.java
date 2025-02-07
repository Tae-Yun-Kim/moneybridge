package com.moneybridge.repository;

import com.moneybridge.MoneybridgeApplication;
import com.moneybridge.domain.account.Account;
import com.moneybridge.domain.member.Member;
import com.moneybridge.domain.member.MemberGrade;
import com.moneybridge.domain.post.LoanPost;
import com.moneybridge.domain.post.PostComment;
import com.moneybridge.repository.member.MemberRepository;
import com.moneybridge.repository.post.LoanPostRepository;
import com.moneybridge.repository.post.PostCommentRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest(classes = MoneybridgeApplication.class)
public class PostCommentRepositoryTests {

    @Autowired
    private LoanPostRepository loanPostRepository;

    @Autowired
    private PostCommentRepository postCommentRepository;

    @Autowired
    private MemberRepository memberRepository;

    private Member testMember;
    private Member lenderMember;

    @BeforeEach
    void setUp() {
        // 기존 데이터 삭제
        postCommentRepository.deleteAll();
        loanPostRepository.deleteAll();
        memberRepository.deleteAll();

        // ❗ 중복 방지를 위한 서로 다른 계좌번호 생성
        String borrowerAccountNumber = "ACCT-" + System.nanoTime();
        String lenderAccountNumber = "ACCT-" + (System.nanoTime() + 1);

        // 📌 Borrower의 계좌 생성
        Account borrowerAccount = Account.builder()
                .accountNumber(borrowerAccountNumber)
                .accountPassword("pass1234")
                .bankName("Test Bank")
                .accountHolderName("Borrower Member")
                .balance(10000L)
                .build();

        // 📌 Lender의 계좌 생성 (다른 계좌 사용)
        Account lenderAccount = Account.builder()
                .accountNumber(lenderAccountNumber)
                .accountPassword("pass5678")
                .bankName("Test Bank")
                .accountHolderName("Lender Member")
                .balance(50000L)
                .build();

        // ❗ Borrower와 Lender의 계좌를 다르게 설정
        testMember = Member.builder()
                .id("borrower123")
                .password("password")
                .name("Borrower Member")
                .residentNumber("123456-1234567")
                .phoneNumber("010-1234-5678")
                .email("borrower@example.com")
                .social(false)
                .isLender(false)
                .accountLocked(false)
                .account(borrowerAccount)  // ✅ Borrower 계좌 사용
                .build();

        lenderMember = Member.builder()
                .id("lender456")
                .password("password")
                .name("Lender Member")
                .residentNumber("234567-7654321")
                .phoneNumber("010-9876-5432")
                .email("lender@example.com")
                .social(false)
                .isLender(true)
                .accountLocked(false)
                .account(lenderAccount)  // ✅ Lender 계좌 사용 (다른 계좌)
                .build();

        // 데이터 저장
        memberRepository.save(testMember);
        memberRepository.save(lenderMember);

        LoanPost loanPost = LoanPost.builder()
                .writer(testMember)
                .loanAmount(10000L)
                .repaymentPeriod(12)
                .additionalConditions("조건 없음")
                .build();
        loanPost = loanPostRepository.save(loanPost);

        for (int j = 1; j <= 5; j++) {
            PostComment comment = PostComment.builder()
                    .post(loanPost)
                    .member(lenderMember)
                    .commentText("댓글 " + j)
                    .interestRate(3.0 + j)
                    .memberGrade(MemberGrade.BRONZE)
                    .isSelected(j == 3) // 3번째 댓글을 선택된 상태로 설정
                    .build();
            postCommentRepository.save(comment);
        }
    }

    @Test
    public void testFindCommentsByPostId() {
        LoanPost loanPost = loanPostRepository.findAll().get(0);
        List<PostComment> comments = postCommentRepository.findByPostId(loanPost.getId());
        assertThat(comments).hasSize(5);
    }

    @Test
    public void testFindSelectedComment() {
        LoanPost loanPost = loanPostRepository.findAll().get(0);
        Optional<PostComment> selectedComment = postCommentRepository.findByPostIdAndIsSelectedTrue(loanPost.getId());
        assertThat(selectedComment).isPresent();
        assertThat(selectedComment.get().isSelected()).isTrue();
    }

    @Test
    public void testDeleteCommentsByPostId() {
        LoanPost loanPost = loanPostRepository.findAll().get(0);
        postCommentRepository.deleteAll(postCommentRepository.findByPostId(loanPost.getId()));
        List<PostComment> comments = postCommentRepository.findByPostId(loanPost.getId());
        assertThat(comments).isEmpty();
    }

    @Test
    public void testSelectCommentByLender() {
        LoanPost loanPost = loanPostRepository.findAll().get(0);
        List<PostComment> comments = postCommentRepository.findByPostId(loanPost.getId());
        PostComment commentToSelect = comments.get(1);

        assertThat(commentToSelect.isSelected()).isFalse();
        assertThat(commentToSelect.getLender()).isNull();

        commentToSelect.setLender(lenderMember);
        commentToSelect.setIsSelected(true);
        postCommentRepository.save(commentToSelect);

        Optional<PostComment> selectedComment = postCommentRepository.findById(commentToSelect.getId());
        assertThat(selectedComment).isPresent();
        assertThat(selectedComment.get().isSelected()).isTrue();
        assertThat(selectedComment.get().getLender().getId()).isEqualTo(lenderMember.getId());
    }
}
