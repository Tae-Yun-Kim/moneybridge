package com.moneybridge.service.post;

import com.moneybridge.domain.member.Member;
import com.moneybridge.domain.post.LoanPost;
import com.moneybridge.domain.post.Notification;
import com.moneybridge.dto.post.NotificationDTO;
import com.moneybridge.repository.member.MemberRepository;
import com.moneybridge.repository.post.LoanPostRepository;
import com.moneybridge.repository.post.NotificationRepository;
import com.moneybridge.service.post.NotificationService;
import lombok.extern.log4j.Log4j2;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Log4j2
@Service
@RequiredArgsConstructor
@Transactional
public class NotificationServiceImpl implements NotificationService {
    private final NotificationRepository notificationRepository;
    private final MemberRepository memberRepository;
    private final LoanPostRepository loanpostRepository;

    // 알림 생성
    @Override
    public NotificationDTO createNotification(NotificationDTO notificationDTO, String memberId) {
        // 원래 내거
        String finalMemberId = memberId != null ? memberId :
                SecurityContextHolder.getContext().getAuthentication().getName();
        Member member = memberRepository.findById(finalMemberId)
                .orElseThrow(() -> new RuntimeException("Member not found"));

        LoanPost post = null;
        if (notificationDTO.getPostId() != null) {
            post = loanpostRepository.findById(notificationDTO.getPostId())
                    .orElseThrow(() -> new RuntimeException("Post not found"));
        }

        Notification notification = Notification.builder()
                .member(member)
                .postId(post)  // null 허용
                .type(notificationDTO.getType())
                .message(notificationDTO.getMessage())
                .build();


        notification = notificationRepository.save(notification);
        return convertToDTO(notification);
    }

    // 특정 회원의 알림 목록 조회
    @Override
    public List<NotificationDTO> getMemberNotifications(String memberId) {
        Member member = memberRepository.findById(memberId)
                .orElseThrow(() -> new RuntimeException("Member not found"));

        return notificationRepository.findByMemberOrderByCreatedAtDesc(member)
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    // 알림 삭제
    @Override
    public void deleteNotification(Long notificationId) {
        notificationRepository.deleteById(notificationId);
    }

    // Notification 엔티티를 DTO로 변환
    private NotificationDTO convertToDTO(Notification notification) {
        return NotificationDTO.builder()
                .notificationId(notification.getNotificationId())
                .memberId(notification.getMember().getId())
                .type(notification.getType())
                .createdAt(notification.getCreatedAt())
                .updatedAt(notification.getUpdatedAt())
                .message(notification.getMessage())
                .postId(notification.getPostId() != null ? notification.getPostId().getId() : null) // postId가 null일 경우 처리
                .build();
    }

    // 계약 대기 알림 생성 -> 이건 굳이 안 넣어도 될 듯
    public void createContractPendingNotification(Member member, LoanPost post) {
        NotificationDTO notificationDTO = NotificationDTO.builder()
                .memberId(member.getId())
                .postId(post.getId())
                .type(Notification.NotificationType.PENDING)  // 계약 대기 상태
                .message("게시글에 대출금액이 올려졌습니다.")  // 알림 메시지
                .build();

        createNotification(notificationDTO, member.getId());
    }

    // 대출자의 승인 대기 알림 생성 -> 완료
    public void createApprovalPendingNotification(Member member, LoanPost post, String comment) {
        log.info("Creating approval pending notification for member ID: {}, post ID: {}",
                member != null ? member.getId() : "NULL",
                post != null ? post.getId() : "NULL");

        NotificationDTO notificationDTO = NotificationDTO.builder()
                .memberId(member.getId())
                .postId(post.getId())
                .type(Notification.NotificationType.WAITING_FOR_APPROVAL)
                .message("대출희망자가 댓글을 달았습니다: " + comment)
                .build();

        createNotification(notificationDTO, member.getId());
    }

    // 계약 진행 알림 생성 -> 이건 계약 끝나면
    public void createContractActiveNotification(Member member, LoanPost post) {
        NotificationDTO notificationDTO = NotificationDTO.builder()
                .memberId(member.getId())
                .postId(post.getId())
                .type(Notification.NotificationType.ACTIVE)  // 계약 진행 상태
                .message("출자자가 댓글을 선택하여 계약이 진행되었습니다.")  // 알림 메시지
                .build();

        createNotification(notificationDTO, member.getId());
    }

    // 계약 완료 알림 생성 (상환 완료) -> 이것도 계약 끝나면
    public void createContractCompletedNotification(Member member, LoanPost post) {
        NotificationDTO notificationDTO = NotificationDTO.builder()
                .memberId(member.getId())
                .postId(post.getId())
                .type(Notification.NotificationType.COMPLETED)  // 계약 완료 상태
                .message("계약이 완료되었습니다. 상환이 완료되었습니다.")  // 상환 완료 메시지
                .build();

        createNotification(notificationDTO, member.getId());
    }

    // 계약 취소 알림 생성 (계약 삭제됨) -> 이것도 계약 끝나면
    public void createContractCancelledNotification(Member member, LoanPost post) {
        NotificationDTO notificationDTO = NotificationDTO.builder()
                .memberId(member.getId())
                .postId(post.getId())
                .type(Notification.NotificationType.CANCELLED)  // 계약 취소 상태
                .message("계약이 취소되었습니다.")  // 계약 취소 메시지
                .build();

        createNotification(notificationDTO, member.getId());
    }

//    // 채무자 -> 채권자 이체 알림 생성
//    public void createDebtorToCreditorNotification(Member member, Double amount) {
//        log.info("Creating debtor-to-creditor notification for member ID: {}, amount: {}",
//                member.getId(), amount);  // 로그에 amount 추가
//
//        NotificationDTO notificationDTO = NotificationDTO.builder()
//                .memberId(member.getId())
//                .postId(null)  // post를 제거하고 null로 설정
//                .type(Notification.NotificationType.DEBTOR_TO_CREDITOR)  // 채무자 -> 채권자 이체 상태
//                .message(String.format("%.2f원이 채무자에게서 채권자에게 이체되었습니다.", amount))  // 금액 포함
//                .build();
//
//        createNotification(notificationDTO, member.getId());
//    }
//
//    // 채권자 -> 채무자 이체 알림 생성
//    public void createCreditorToDebtorNotification(Member member, Double amount) {
//        log.info("Creating creditor-to-debtor notification for member ID: {}, amount: {}",
//                member.getId(), amount);  // 로그에 amount 추가
//
//        NotificationDTO notificationDTO = NotificationDTO.builder()
//                .memberId(member.getId())
//                .postId(null)  // post를 제거하고 null로 설정
//                .type(Notification.NotificationType.CREDITOR_TO_DEBTOR)  // 채권자 -> 채무자 이체 상태
//                .message(String.format("%.2f원이 채권자에게서 채무자에게 이체되었습니다.", amount))  // 금액 포함
//                .build();
//
//        createNotification(notificationDTO, member.getId());
//    }


    // 연체 알림 생성
    public void createOverdueNotification(Member member, LoanPost post) {
        NotificationDTO notificationDTO = NotificationDTO.builder()
                .memberId(member.getId())
                .postId(post.getId())
                .type(Notification.NotificationType.OVERDUE)  // 연체 상태
                .message("계약이 연체되었습니다. 빨리 해결해 주세요.")  // 연체 메시지
                .build();

        createNotification(notificationDTO, member.getId());
    }
}
