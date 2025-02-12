//package com.moneybridge.repository;
//
//import com.moneybridge.domain.account.Account;
//import com.moneybridge.domain.member.Member;
//import com.moneybridge.domain.post.LoanPost;
//import com.moneybridge.domain.post.Notification;
//import com.moneybridge.dto.post.NotificationDTO;
//import com.moneybridge.repository.member.MemberRepository;
//import com.moneybridge.repository.post.NotificationRepository;
//import com.moneybridge.repository.post.LoanPostRepository;
//import com.moneybridge.service.post.NotificationServiceImpl;
//import org.junit.jupiter.api.BeforeEach;
//import org.junit.jupiter.api.Test;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.boot.test.context.SpringBootTest;
//import org.springframework.security.crypto.password.PasswordEncoder;
//import org.springframework.test.annotation.Rollback;
//import org.springframework.transaction.annotation.Transactional;
//
//import java.util.List;
//import java.util.Optional;
//import java.util.UUID;
//
//import static org.junit.jupiter.api.Assertions.*;
//
//@SpringBootTest
//@Transactional
//@Rollback(false) // 롤백 방지
//public class NotificationRepositoryTests {
//
//    @Autowired
//    private NotificationRepository notificationRepository;
//    @Autowired
//    private MemberRepository memberRepository;
//    @Autowired
//    private LoanPostRepository loanpostRepository;
//    @Autowired
//    private NotificationServiceImpl notificationService;
//
//    private Member testMember;
//    private Member lender;
//    private LoanPost testPost;
//    private Notification testNotification;
//    private NotificationDTO testNotificationDTO;
//
//    @Autowired
//    private PasswordEncoder passwordEncoder;
//
//    @BeforeEach
//    void setUp() {
//        testMember = Member.builder()
//                .id("1111")
//                .password("1111")
//                .name("tester1111")
//                .nickname("User1111")
//                .residentNumber("111111-1111111")
//                .phoneNumber("010-1111-1111")
//                .email("test1111@aaa.com")
//                .address("서울시 강남11동")
//                .isLender(true)
//                .accountLocked(false)
//                .build();
//        memberRepository.save(testMember);
//
//        // 고유한 계좌 번호 생성
//        String uniqueAccountNumber = "111-111-" + UUID.randomUUID().toString().substring(0, 6);
//
//        // 테스트용 사용자 (이름: lender123)
//        Account account = Account.builder()
//                .accountNumber(uniqueAccountNumber)
//                .accountPassword("1111")
//                .bankName("Test Bank")
//                .accountHolderName("lender123")
//                .balance(1000L)
//                .build();
//
//        lender = Member.builder()
//                .id("lender111")
//                .password(passwordEncoder.encode("1111"))
//                .name("lender111")
//                .residentNumber("11111-11111")
//                .phoneNumber("010-9999-1111")
//                .email("lender111@example.com")
//                .social(false)
//                .isLender(true)
//                .accountLocked(false)
//                .account(account)
//                .build();
//        memberRepository.save(lender);
//
//        // 게시물 ID DB에 있는걸로 설정
//        testPost = LoanPost.builder()
//                .id(7L)
//                .writer(lender)
//                .loanAmount(40000L)
//                .repaymentPeriod(99)
//                .additionalConditions("Test condition")
//                .build();
//        loanpostRepository.save(testPost);
//
//        testNotification = Notification.builder()
//                .notificationId(99L)
//                .member(testMember)
//                .postId(testPost)
//                .type(Notification.NotificationType.TRANSFER_TO_WALLET)
//                .message("테스트 알림")
//                .build();
//        notificationRepository.save(testNotification);
//
//        testNotificationDTO = NotificationDTO.builder()
//                .notificationId(99L)
//                .memberId("1111")
//                .postId(testPost.getId())
//                .type(Notification.NotificationType.TRANSFER_TO_WALLET)
//                .message("테스트 알림")
//                .build();
//    }
//    // 알림 생성
//    @Test
//    void createNotification_Success() {
//        NotificationDTO result = notificationService.createNotification(testNotificationDTO);
//
//        assertNotNull(result);
//        assertEquals(testNotificationDTO.getMessage(), result.getMessage());
//        assertEquals(testNotificationDTO.getType(), result.getType());
//
//        Optional<Notification> savedNotification = notificationRepository.findById(result.getNotificationId());
//        assertTrue(savedNotification.isPresent());
//    }
//    // 특정 회원의 알림 목록 조회
//    @Test
//    void getMemberNotifications_Success() {
//        // 이미 setUp()에서 testNotification이 저장되었으므로, 여기서는 저장할 필요 없음
//        List<NotificationDTO> results = notificationService.getMemberNotifications("9999");
//
//        // 알림이 1개인 경우에 대해서 확인
//        assertFalse(results.isEmpty());
//        assertEquals(1, results.size()); // 저장된 알림이 1개여야 하므로 1로 설정
//        assertEquals(testNotificationDTO.getMessage(), results.get(0).getMessage());
//    }
//    // 알림 삭제 테스트
////    @Test
////    void deleteNotification_Success() {
////        // 알림 삭제 실행
////        notificationService.deleteNotification(testNotification.getNotificationId());
////
////        // 삭제된 알림이 존재하지 않는지 확인
////        Optional<Notification> deletedNotification = notificationRepository.findById(testNotification.getNotificationId());
////        assertFalse(deletedNotification.isPresent(), "알림이 삭제되지 않았습니다.");
////    }
//
////    @Test
////    void verifyNotificationSaved() {
////        // testNotification이 setUp()에서 저장되었으므로, 이 데이터를 통해 확인
////        Optional<Notification> savedNotification = notificationRepository.findById(testNotification.getNotificationId());
////
////        // 알림이 존재하는지 확인
////        assertTrue(savedNotification.isPresent(), "Notification should be present in the repository.");
////
////        // 알림 메시지가 예상한 값과 동일한지 확인
////        assertEquals("테스트 알림", savedNotification.get().getMessage());
////    }
//}

package com.moneybridge.repository;

import com.moneybridge.domain.account.Account;
import com.moneybridge.domain.member.Member;
import com.moneybridge.domain.post.LoanPost;
import com.moneybridge.domain.post.Notification;
import com.moneybridge.dto.post.NotificationDTO;
import com.moneybridge.repository.member.MemberRepository;
import com.moneybridge.repository.post.LoanPostRepository;
import com.moneybridge.repository.post.NotificationRepository;
import com.moneybridge.service.post.NotificationServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.annotation.Rollback;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@Transactional
@Rollback(false) // 롤백 방지
public class NotificationRepositoryTests {

    @Autowired
    private NotificationServiceImpl notificationService;
    @Autowired
    private MemberRepository memberRepository;
    @Autowired
    private LoanPostRepository loanPostRepository;
    @Autowired
    private NotificationRepository notificationRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    private Member testMember;
    private LoanPost testPost;
    private Member lender;
    private Notification testNotification;
    private NotificationDTO testNotificationDTO;



    @BeforeEach
    void setUp() {
        // 테스트용 회원 생성
        testMember = Member.builder()
                .id("lender666")
                .password(passwordEncoder.encode("1111"))
                .name("Test Member66")
                .nickname("TestNick66")
                .residentNumber("666666-666666")
                .phoneNumber("010-6666-6666")
                .email("test666@aaa.com")
                .address("서울시 강남구")
                .isLender(true)
                .accountLocked(false)
                .build();
        memberRepository.save(testMember);

        // 고유한 계좌 번호 생성
        String uniqueAccountNumber = "666-666-" + UUID.randomUUID().toString().substring(0, 6);

        // 테스트용 사용자 (이름: lender777)
        Account account = Account.builder()
                .accountNumber(uniqueAccountNumber)
                .accountPassword("6666")
                .bankName("Test Bank")
                .accountHolderName("lender666")
                .balance(1000L)
                .build();

        lender = Member.builder()
                .id("lender666")
                .password(passwordEncoder.encode("1111"))
                .name("lender666")
                .residentNumber("666666-6666")
                .phoneNumber("666-666-666")
                .email("lender666@example.com")
                .social(false)
                .isLender(true)
                .accountLocked(false)
                .account(account)
                .build();
        memberRepository.save(lender);

        // 게시물 ID DB에 있는 걸로 설정
        testPost = LoanPost.builder()
                .id(7L)
                .writer(lender)
                .loanAmount(50000L)
                .repaymentPeriod(12)
                .additionalConditions("Test loan conditions")
                .build();
        loanPostRepository.save(testPost);

        // 테스트용 알림 생성
        testNotification = Notification.builder()
                .notificationId(99L)
                .member(testMember)
                .postId(testPost)
                .type(Notification.NotificationType.TRANSFER_TO_WALLET)
                .message("테스트 알림")
                .build();
        notificationRepository.save(testNotification);

        // 테스트용 NotificationDTO 생성
        testNotificationDTO = NotificationDTO.builder()
                .notificationId(99L)
                .memberId("lender666")
                .postId(testPost.getId())
                .type(Notification.NotificationType.TRANSFER_TO_WALLET)
                .message("테스트 알림")
                .build();

        // SecurityContext 설정하여 현재 로그인된 사용자가 testMember가 되도록 설정
        SecurityContextHolder.getContext().setAuthentication(
                new org.springframework.security.authentication.UsernamePasswordAuthenticationToken(
                        testMember.getId(), testMember.getPassword())
        );
    }


    // 알림 생성 테스트
    @Test
    void createNotification_Success() {
        NotificationDTO notificationDTO = NotificationDTO.builder()
                .memberId(testMember.getId())
                .postId(testPost.getId())
                .type(Notification.NotificationType.TRANSFER_TO_WALLET)
                .message("Test notification message")
                .build();

        NotificationDTO result = notificationService.createNotification(notificationDTO, notificationDTO.getMemberId());

        assertNotNull(result);
        assertEquals(notificationDTO.getMessage(), result.getMessage());
        assertEquals(notificationDTO.getType(), result.getType());
    }

    // 계약 대기 알림 생성 테스트
    @Test
    void createContractPendingNotification_Success() {
        notificationService.createContractPendingNotification(testMember, testPost);

        Notification savedNotification = notificationRepository.findAll().get(0);
        assertEquals(Notification.NotificationType.PENDING, savedNotification.getType());
        assertEquals("게시글에 대출금액이 올려졌습니다.", savedNotification.getMessage());
    }

    // 대출자의 승인 대기 알림 생성 테스트
    @Test
    void createApprovalPendingNotification_Success() {
        String comment = "Test comment";

        notificationService.createApprovalPendingNotification(testMember, testPost, comment);

        Notification savedNotification = notificationRepository.findAll().get(0);
        assertEquals(Notification.NotificationType.WAITING_FOR_APPROVAL, savedNotification.getType());
        assertEquals("대출희망자가 댓글을 달았습니다: " + comment, savedNotification.getMessage());
    }

    // 계약 진행 알림 생성 테스트
    @Test
    void createContractActiveNotification_Success() {
        notificationService.createContractActiveNotification(testMember, testPost);

        Notification savedNotification = notificationRepository.findAll().get(0);
        assertEquals(Notification.NotificationType.ACTIVE, savedNotification.getType());
        assertEquals("출자자가 댓글을 선택하여 계약이 진행되었습니다.", savedNotification.getMessage());
    }

    // 계약 완료 알림 생성 테스트
    @Test
    void createContractCompletedNotification_Success() {
        notificationService.createContractCompletedNotification(testMember, testPost);

        Notification savedNotification = notificationRepository.findAll().get(0);
        assertEquals(Notification.NotificationType.COMPLETED, savedNotification.getType());
        assertEquals("계약이 완료되었습니다. 상환이 완료되었습니다.", savedNotification.getMessage());
    }

    // 계약 취소 알림 생성 테스트
    @Test
    void createContractCancelledNotification_Success() {
        notificationService.createContractCancelledNotification(testMember, testPost);

        Notification savedNotification = notificationRepository.findAll().get(0);
        assertEquals(Notification.NotificationType.CANCELLED, savedNotification.getType());
        assertEquals("계약이 취소되었습니다.", savedNotification.getMessage());
    }

    // 채무자 -> 채권자 이체 알림 생성 테스트
//    @Test
//    void createDebtorToCreditorNotification_Success() {
//        Double amount = 1000.00;
//
//        notificationService.createDebtorToCreditorNotification(testMember, amount, testPost);
//
//        Notification savedNotification = notificationRepository.findAll().get(0);
//        assertEquals(Notification.NotificationType.DEBTOR_TO_CREDITOR, savedNotification.getType());
//        assertEquals(String.format("%.2f원이 채무자에게서 채권자에게 이체되었습니다.", amount), savedNotification.getMessage());
//    }
//
//    // 채권자 -> 채무자 이체 알림 생성 테스트
//    @Test
//    void createCreditorToDebtorNotification_Success() {
//        Double amount = 500.00;
//
//        notificationService.createCreditorToDebtorNotification(testMember, amount, testPost);
//
//        Notification savedNotification = notificationRepository.findAll().get(0);
//        assertEquals(Notification.NotificationType.CREDITOR_TO_DEBTOR, savedNotification.getType());
//        assertEquals(String.format("%.2f원이 채권자에게서 채무자에게 이체되었습니다.", amount), savedNotification.getMessage());
//    }

    // 연체 알림 생성 테스트
    @Test
    void createOverdueNotification_Success() {
        notificationService.createOverdueNotification(testMember, testPost);

        Notification savedNotification = notificationRepository.findAll().get(0);
        assertEquals(Notification.NotificationType.OVERDUE, savedNotification.getType());
        assertEquals("계약이 연체되었습니다. 빨리 해결해 주세요.", savedNotification.getMessage());
    }
}

