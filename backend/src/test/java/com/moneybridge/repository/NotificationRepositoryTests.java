package com.moneybridge.repository;

import com.moneybridge.domain.account.Account;
import com.moneybridge.domain.member.Member;
import com.moneybridge.domain.post.LoanPost;
import com.moneybridge.domain.post.Notification;
import com.moneybridge.dto.post.NotificationDTO;
import com.moneybridge.repository.member.MemberRepository;
import com.moneybridge.repository.post.NotificationRepository;
import com.moneybridge.repository.post.LoanPostRepository;
import com.moneybridge.service.post.NotificationServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@Transactional
public class NotificationRepositoryTests {

    @Autowired
    private NotificationRepository notificationRepository;
    @Autowired
    private MemberRepository memberRepository;
    @Autowired
    private LoanPostRepository loanpostRepository;
    @Autowired
    private NotificationServiceImpl notificationService;

    private Member testMember;
    private Member lender;
    private LoanPost testPost;
    private Notification testNotification;
    private NotificationDTO testNotificationDTO;

    @BeforeEach
    void setUp() {
        testMember = Member.builder()
                .id("9999")
                .password("9999")
                .name("tester9999")
                .nickname("User9999")
                .residentNumber("999999-9999999")
                .phoneNumber("010-9999-9999")
                .email("test9999@aaa.com")
                .address("서울시 강남99동")
                .isLender(true)
                .accountLocked(false)
                .build();
        memberRepository.save(testMember);

        // 고유한 계좌 번호 생성
        String uniqueAccountNumber = "999-999-" + UUID.randomUUID().toString().substring(0, 6);

        // 테스트용 사용자 (이름: lender123)
        Account account = Account.builder()
                .accountNumber(uniqueAccountNumber)
                .accountPassword("9999")
                .bankName("Test Bank")
                .accountHolderName("lender123")
                .balance(1000L)
                .build();

        lender = Member.builder()
                .id("lender999")
                .password("9999")
                .name("lender123")
                .residentNumber("99999-99999")
                .phoneNumber("010-9999-5678")
                .email("lender999@example.com")
                .social(false)
                .isLender(true)
                .accountLocked(false)
                .account(account)
                .build();
        memberRepository.save(lender);

        // 게시물 ID 2번 설정
        testPost = LoanPost.builder()
                .id(2L)
                .writer(lender)
                .loanAmount(40000L)
                .repaymentPeriod(99)
                .additionalConditions("Test condition")
                .build();
        loanpostRepository.save(testPost);

        testNotification = Notification.builder()
                .notificationId(99L)
                .member(testMember)
                .postId(testPost)
                .type(Notification.NotificationType.TRANSFER_TO_WALLET)
                .message("테스트 알림")
                .build();
        notificationRepository.save(testNotification);

        testNotificationDTO = NotificationDTO.builder()
                .notificationId(99L)
                .memberId("9999")
                .postId(2L)
                .type(Notification.NotificationType.TRANSFER_TO_WALLET)
                .message("테스트 알림")
                .build();
    }

    @Test
    void createNotification_Success() {
        NotificationDTO result = notificationService.createNotification(testNotificationDTO);

        assertNotNull(result);
        assertEquals(testNotificationDTO.getMessage(), result.getMessage());
        assertEquals(testNotificationDTO.getType(), result.getType());

        Optional<Notification> savedNotification = notificationRepository.findById(result.getNotificationId());
        assertTrue(savedNotification.isPresent());
    }

    @Test
    void getMemberNotifications_Success() {
        // 이미 setUp()에서 testNotification이 저장되었으므로, 여기서는 저장할 필요 없음
        List<NotificationDTO> results = notificationService.getMemberNotifications("9999");

        // 알림이 1개인 경우에 대해서 확인
        assertFalse(results.isEmpty());
        assertEquals(1, results.size()); // 저장된 알림이 1개여야 하므로 1로 설정
        assertEquals(testNotificationDTO.getMessage(), results.get(0).getMessage());
    }

    @Test
    void verifyNotificationSaved() {
        // testNotification이 setUp()에서 저장되었으므로, 이 데이터를 통해 확인
        Optional<Notification> savedNotification = notificationRepository.findById(testNotification.getNotificationId());

        // 알림이 존재하는지 확인
        assertTrue(savedNotification.isPresent(), "Notification should be present in the repository.");

        // 알림 메시지가 예상한 값과 동일한지 확인
        assertEquals("테스트 알림", savedNotification.get().getMessage());
    }
}
