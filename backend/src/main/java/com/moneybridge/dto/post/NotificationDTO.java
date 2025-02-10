package com.moneybridge.dto.post;

import com.moneybridge.domain.post.Notification.NotificationType;
import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class NotificationDTO {
    private Long notificationId;
    private String memberId;
    private Long postId;
    private NotificationType type;
    private String message;
    private Long amount;  // 거래 금액 (지갑 거래 시 사용)
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}