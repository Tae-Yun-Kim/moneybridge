package com.moneybridge.service.post;

import com.moneybridge.domain.member.Member;
import com.moneybridge.domain.post.LoanPost;
import com.moneybridge.domain.post.Notification;
import com.moneybridge.dto.post.NotificationDTO;
import com.moneybridge.repository.member.MemberRepository;
import com.moneybridge.repository.post.LoanPostRepository;
import com.moneybridge.repository.post.NotificationRepository;
import com.moneybridge.service.post.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class NotificationServiceImpl implements NotificationService {
    private final NotificationRepository notificationRepository;
    private final MemberRepository memberRepository;
    private final LoanPostRepository loanpostRepository;

    // 알림 생성
    @Override
    public NotificationDTO createNotification(NotificationDTO notificationDTO) {
        // SecurityContextHolder를 통해 현재 로그인한 회원의 ID를 조회
        String memberId = SecurityContextHolder.getContext().getAuthentication().getName();

        Member member = memberRepository.findById(memberId)
                .orElseThrow(() -> new RuntimeException("Member not found"));

        LoanPost post = loanpostRepository.findById(notificationDTO.getPostId())
                .orElseThrow(() -> new RuntimeException("Post not found"));

        Notification notification = Notification.builder()
                .member(member)
                .postId(post)
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
                .postId(notification.getPostId().getId())
                .type(notification.getType())
                .message(notification.getMessage())
                .createdAt(notification.getCreatedAt())
                .updatedAt(notification.getUpdatedAt()).build();
    }

    // 계약 대기 알림 생성
    public void createContractPendingNotification(Member member, LoanPost post) {
        NotificationDTO notificationDTO = NotificationDTO.builder()
                .memberId(member.getId())
                .postId(post.getId())
                .type(Notification.NotificationType.PENDING)  // 계약 대기 상태
                .message("게시글에 대출금액이 올려졌습니다.")  // 알림 메시지
                .build();

        createNotification(notificationDTO);
    }

    // 대출자의 승인 대기 알림 생성
    public void createApprovalPendingNotification(Member member, LoanPost post, String comment) {
        NotificationDTO notificationDTO = NotificationDTO.builder()
                .memberId(member.getId())
                .postId(post.getId())
                .type(Notification.NotificationType.WAITING_FOR_APPROVAL)  // 대출자의 승인 대기 상태
                .message("대출희망자가 댓글을 달았습니다: " + comment)  // 댓글 내용 포함
                .build();

        createNotification(notificationDTO);
    }

    // 계약 진행 알림 생성
    public void createContractActiveNotification(Member member, LoanPost post) {
        NotificationDTO notificationDTO = NotificationDTO.builder()
                .memberId(member.getId())
                .postId(post.getId())
                .type(Notification.NotificationType.ACTIVE)  // 계약 진행 상태
                .message("출자자가 댓글을 선택하여 계약이 진행되었습니다.")  // 알림 메시지
                .build();

        createNotification(notificationDTO);
    }

    // 계약 완료 알림 생성 (상환 완료)
    public void createContractCompletedNotification(Member member, LoanPost post) {
        NotificationDTO notificationDTO = NotificationDTO.builder()
                .memberId(member.getId())
                .postId(post.getId())
                .type(Notification.NotificationType.COMPLETED)  // 계약 완료 상태
                .message("계약이 완료되었습니다. 상환이 완료되었습니다.")  // 상환 완료 메시지
                .build();

        createNotification(notificationDTO);
    }

    // 계약 취소 알림 생성 (계약 삭제됨)
    public void createContractCancelledNotification(Member member, LoanPost post) {
        NotificationDTO notificationDTO = NotificationDTO.builder()
                .memberId(member.getId())
                .postId(post.getId())
                .type(Notification.NotificationType.CANCELLED)  // 계약 취소 상태
                .message("계약이 취소되었습니다.")  // 계약 취소 메시지
                .build();

        createNotification(notificationDTO);
    }

    // 채무자 -> 채권자 이체 알림 생성
    public void createDebtorToCreditorNotification(Member member, Double amount, LoanPost post) {
        NotificationDTO notificationDTO = NotificationDTO.builder()
                .memberId(member.getId())
                .postId(post.getId())
                .type(Notification.NotificationType.DEBTOR_TO_CREDITOR)  // 채무자 -> 채권자 이체 상태
                .message(String.format("%.2f원이 채무자에게서 채권자에게 이체되었습니다.", amount))  // 금액 포함
                .build();

        createNotification(notificationDTO);
    }

    // 채권자 -> 채무자 이체 알림 생성
    public void createCreditorToDebtorNotification(Member member, Double amount, LoanPost post) {
        NotificationDTO notificationDTO = NotificationDTO.builder()
                .memberId(member.getId())
                .postId(post.getId())
                .type(Notification.NotificationType.CREDITOR_TO_DEBTOR)  // 채권자 -> 채무자 이체 상태
                .message(String.format("%.2f원이 채권자에게서 채무자에게 이체되었습니다.", amount))  // 금액 포함
                .build();

        createNotification(notificationDTO);
    }

    // 연체 알림 생성
    public void createOverdueNotification(Member member, LoanPost post) {
        NotificationDTO notificationDTO = NotificationDTO.builder()
                .memberId(member.getId())
                .postId(post.getId())
                .type(Notification.NotificationType.OVERDUE)  // 연체 상태
                .message("계약이 연체되었습니다. 빨리 해결해 주세요.")  // 연체 메시지
                .build();

        createNotification(notificationDTO);
    }
}
