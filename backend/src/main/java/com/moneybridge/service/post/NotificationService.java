package com.moneybridge.service.post;

import com.moneybridge.dto.post.NotificationDTO;
import java.util.List;

public interface NotificationService {
    NotificationDTO createNotification(NotificationDTO notificationDTO);
    List<NotificationDTO> getMemberNotifications(String memberId);
    // NotificationDTO markAsRead(Long notificationId);
    void deleteNotification(Long notificationId);
}
