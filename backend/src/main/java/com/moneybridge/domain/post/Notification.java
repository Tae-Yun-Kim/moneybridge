package com.moneybridge.domain.post;

import com.moneybridge.domain.BaseEntity;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "Notification")
@Getter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class Notification extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long notificationId; // 알림 ID

    @Column(nullable = false)
    private Long creditorId; // 채권자 ID

    @Column(nullable = false)
    private Long debtorId; // 채무자 ID

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "postId")
    private LoanPost loanPost; // 게시글 참조

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private NotificationType type; // 알림 유형 (DEPOSIT, APPLICATION, APPROVAL, REJECTION, EXTENSION_REQUEST)

    @Column(nullable = true)
    private String message; // 알림 메시지

    // 알림 유형을 정의하는 Enum 타입
    public enum NotificationType {
        DEPOSIT,          // 입금
        APPLICATION,      // 신청
        APPROVAL,         // 승인
        REJECTION,        // 거절
        EXTENSION_REQUEST // 연장 요청
    }
}
