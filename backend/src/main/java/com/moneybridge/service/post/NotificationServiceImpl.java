package com.moneybridge.service.post;

import com.moneybridge.domain.member.Member;
import com.moneybridge.domain.post.LoanPost;
import com.moneybridge.domain.post.Notification;
import com.moneybridge.dto.post.NotificationDTO;
import com.moneybridge.repository.member.MemberRepository;
import com.moneybridge.repository.post.NotificationRepository;
import com.moneybridge.repository.post.LoanPostRepository;
import lombok.RequiredArgsConstructor;
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

    @Override
    public NotificationDTO createNotification(NotificationDTO notificationDTO) {
        Member member = memberRepository.findById(notificationDTO.getMemberId())
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

    @Override
    public List<NotificationDTO> getMemberNotifications(String memberId) {
        Member member = memberRepository.findById(memberId)
                .orElseThrow(() -> new RuntimeException("Member not found"));

        return notificationRepository.findByMemberOrderByCreatedAtDesc(member)
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    // 읽음 처리는 안넣어도 될 듯

//    @Override
//    public NotificationDTO markAsRead(Long notificationId) {
//        Notification notification = notificationRepository.findById(notificationId)
//                .orElseThrow(() -> new RuntimeException("Notification not found"));
//
//        // 읽음 처리 로직 추가 (isRead 필드가 있다고 가정)
//        notification.setRead(true);
//        notification = notificationRepository.save(notification);
//        return convertToDTO(notification);
//    }

    @Override
    public void deleteNotification(Long notificationId) {
        notificationRepository.deleteById(notificationId);
    }

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
}