//package com.moneybridge.repository;
//
//import com.moneybridge.MoneybridgeApplication;
//import com.moneybridge.domain.account.Account;
//import com.moneybridge.domain.member.Member;
//import com.moneybridge.domain.member.MemberGrade;
//import com.moneybridge.domain.post.LoanPost;
//import com.moneybridge.domain.post.PostComment;
//import com.moneybridge.repository.member.MemberRepository;
//import com.moneybridge.repository.post.LoanPostRepository;
//import com.moneybridge.repository.post.PostCommentRepository;
//import org.junit.jupiter.api.BeforeEach;
//import org.junit.jupiter.api.Test;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.boot.test.context.SpringBootTest;
//
//import java.util.List;
//import java.util.Optional;
//
//import static org.assertj.core.api.Assertions.assertThat;
//
//@SpringBootTest(classes = MoneybridgeApplication.class) // 애플리케이션 컨텍스트 로드
//public class PostCommentRepositoryTests {
//
//    @Autowired
//    private LoanPostRepository loanPostRepository;
//
//    @Autowired
//    private PostCommentRepository postCommentRepository;
//
//    @Autowired
//    private MemberRepository memberRepository;
//
//    private Member testMember; // 테스트용 멤버
//    private LoanPost testLoanPost; // 테스트용 게시글
//
//    @BeforeEach
//    void setUp() {
//        // 모든 기존 데이터를 삭제
//        postCommentRepository.deleteAll();
//        loanPostRepository.deleteAll();
//        memberRepository.deleteAll();
//
//        // 고유한 계좌 번호 생성
//        String uniqueAccountNumber = "123-456-789";
//
//        // 테스트용 계좌 생성
//        Account account = Account.builder()
//                .accountNumber(uniqueAccountNumber) // 고유 계좌 번호
//                .accountPassword("pass1234")
//                .bankName("Test Bank")
//                .accountHolderName("Test Member")
//                .balance(10000L)
//                .build();
//
//        // 테스트용 사용자 생성
//        testMember = Member.builder()
//                .id("test123")
//                .password("password")
//                .name("Test Member")
//                .residentNumber("123456-1234567")
//                .phoneNumber("010-1234-5678")
//                .email("test@example.com")
//                .social(false)
//                .isLender(true)
//                .accountLocked(false)
//                .account(account) // 계좌 연결
//                .build();
//
//        // 사용자 저장
//        memberRepository.save(testMember);
//
//        // 테스트용 게시글 생성
//        testLoanPost = LoanPost.builder()
//                .writer(testMember) // 작성자 설정
//                .loanAmount(5000L)
//                .repaymentPeriod(12)
//                .additionalConditions("No additional conditions")
//                .build();
//
//        loanPostRepository.save(testLoanPost);
//    }
//
//
//    @Test
//    public void testSaveAndRetrieveComments() {
//        // 댓글 저장
//        PostComment comment = PostComment.builder()
//                .post(testLoanPost)
//                .member(testMember)
//                .commentText("This is a test comment")
//                .interestRate(5.0)
//                .memberGrade(MemberGrade.BRONZE)
//                .isSelected(false)
//                .build();
//        postCommentRepository.save(comment);
//
//        // 댓글 조회
//        List<PostComment> comments = postCommentRepository.findByPostId(testLoanPost.getId());
//        assertThat(comments).isNotEmpty();
//        assertThat(comments.get(0).getCommentText()).isEqualTo("This is a test comment");
//    }
//
//    @Test
//    public void testFindSelectedComment() {
//        // 댓글 저장 및 선택 처리
//        PostComment comment1 = PostComment.builder()
//                .post(testLoanPost)
//                .member(testMember)
//                .commentText("Comment 1")
//                .interestRate(3.5)
//                .memberGrade(MemberGrade.SILVER)
//                .isSelected(false)
//                .build();
//
//        PostComment comment2 = PostComment.builder()
//                .post(testLoanPost)
//                .member(testMember)
//                .commentText("Comment 2 (Selected)")
//                .interestRate(4.0)
//                .memberGrade(MemberGrade.GOLD)
//                .isSelected(true)
//                .build();
//
//        postCommentRepository.save(comment1);
//        postCommentRepository.save(comment2);
//
//        // 선택된 댓글 조회
//        Optional<PostComment> selectedComment = postCommentRepository.findByPostIdAndIsSelectedTrue(testLoanPost.getId());
//        assertThat(selectedComment).isPresent();
//        assertThat(selectedComment.get().getCommentText()).isEqualTo("Comment 2 (Selected)");
//    }
//
//    @Test
//    public void testDeleteCommentsByPostId() {
//        // 댓글 저장
//        PostComment comment1 = PostComment.builder()
//                .post(testLoanPost)
//                .member(testMember)
//                .commentText("Comment 1")
//                .interestRate(3.5)
//                .memberGrade(MemberGrade.SILVER)
//                .isSelected(false)
//                .build();
//
//        PostComment comment2 = PostComment.builder()
//                .post(testLoanPost)
//                .member(testMember)
//                .commentText("Comment 2")
//                .interestRate(4.0)
//                .memberGrade(MemberGrade.GOLD)
//                .isSelected(false)
//                .build();
//
//        postCommentRepository.save(comment1);
//        postCommentRepository.save(comment2);
//
//        // 댓글 삭제
//        postCommentRepository.deleteAll(postCommentRepository.findByPostId(testLoanPost.getId()));
//
//        // 댓글 조회
//        List<PostComment> comments = postCommentRepository.findByPostId(testLoanPost.getId());
//        assertThat(comments).isEmpty();
//    }
//}
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

    @BeforeEach
    void setUp() {
        // 데이터 초기화
        postCommentRepository.deleteAll();
        loanPostRepository.deleteAll();
        memberRepository.deleteAll();

        // 계좌 생성
        Account account = Account.builder()
                .accountNumber("123-456-789")
                .accountPassword("pass1234")
                .bankName("Test Bank")
                .accountHolderName("Test Member")
                .balance(10000L)
                .build();

        // 사용자 생성
        testMember = Member.builder()
                .id("test123")
                .password("password")
                .name("Test Member")
                .residentNumber("123456-1234567")
                .phoneNumber("010-1234-5678")
                .email("test@example.com")
                .social(false)
                .isLender(true)
                .accountLocked(false)
                .account(account)
                .build();

        // 사용자 저장
        memberRepository.save(testMember);

        // 10개의 게시글과 각 게시글에 댓글 생성
        for (int i = 1; i <= 10; i++) {
            // 게시글 생성 및 저장
            LoanPost loanPost = LoanPost.builder()
                    .writer(testMember)
                    .loanAmount(1000L * i)
                    .repaymentPeriod(12 + i)
                    .additionalConditions("조건 " + i)
                    .build();
            loanPost = loanPostRepository.save(loanPost);

            // 각 게시글에 댓글 5개 추가
            for (int j = 1; j <= 5; j++) {
                PostComment comment = PostComment.builder()
                        .post(loanPost)
                        .member(testMember)
                        .commentText("게시글 " + i + "의 댓글 " + j)
                        .interestRate(3.0 + j)
                        .memberGrade(j % 2 == 0 ? MemberGrade.BRONZE : MemberGrade.SILVER)
                        .isSelected(j == 3) // 3번째 댓글을 선택된 댓글로 설정
                        .build();
                postCommentRepository.save(comment);
            }
        }
    }

    @Test
    public void testVerifyPostsAndComments() {
        // 10개의 게시글 조회 확인
        List<LoanPost> loanPosts = loanPostRepository.findAll();
        assertThat(loanPosts).hasSize(10);

        // 각 게시글에 댓글이 5개씩 있는지 확인
        for (LoanPost loanPost : loanPosts) {
            List<PostComment> comments = postCommentRepository.findByPostId(loanPost.getId());
            assertThat(comments).hasSize(5);
        }
    }

    @Test
    public void testSelectedCommentExists() {
        // 선택된 댓글이 각 게시글마다 하나씩 존재하는지 확인
        List<LoanPost> loanPosts = loanPostRepository.findAll();
        for (LoanPost loanPost : loanPosts) {
            List<PostComment> comments = postCommentRepository.findByPostId(loanPost.getId());
            boolean hasSelectedComment = comments.stream().anyMatch(PostComment::isSelected);
            assertThat(hasSelectedComment).isTrue();
        }
    }
}
