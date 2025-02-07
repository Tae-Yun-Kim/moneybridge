package com.moneybridge.domain.post;

import com.moneybridge.domain.BaseEntity;
import com.moneybridge.domain.member.Member;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "Notification")
@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class Notification extends BaseEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long notificationId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "memberId", nullable = true)
    private Member member; // 사용자 참조 (채권자/채무자 구분은 isLender로 판단)

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "postId")
    private LoanPost postId; // 게시글 참조

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
