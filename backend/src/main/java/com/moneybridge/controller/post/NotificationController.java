package com.moneybridge.controller.post;

import com.moneybridge.dto.post.NotificationDTO;
import com.moneybridge.service.post.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/notifications")
@RequiredArgsConstructor
public class NotificationController {
    private final NotificationService notificationService;

    @PostMapping
    public ResponseEntity<NotificationDTO> createNotification(@RequestBody NotificationDTO notificationDTO) {
        return ResponseEntity.ok(notificationService.createNotification(notificationDTO));
    }

    @GetMapping("/member/{memberId}")
    public ResponseEntity<List<NotificationDTO>> getMemberNotifications(@PathVariable String memberId) {
        return ResponseEntity.ok(notificationService.getMemberNotifications(memberId));
    }

//    @PutMapping("/{notificationId}/read")
//    public ResponseEntity<NotificationDTO> markAsRead(@PathVariable Long notificationId) {
//        return ResponseEntity.ok(notificationService.markAsRead(notificationId));
//    }

    @DeleteMapping("/{notificationId}")
    public ResponseEntity<Void> deleteNotification(@PathVariable Long notificationId) {
        notificationService.deleteNotification(notificationId);
        return ResponseEntity.ok().build();
    }
}
