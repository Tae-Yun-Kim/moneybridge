//package com.moneybridge.domain.post;
//
//import com.moneybridge.domain.BaseEntity;
//import com.moneybridge.domain.member.Member;
//import jakarta.persistence.*;
//import lombok.*;
//
//@Entity
//@Table(name = "notification")
//@Getter
//@Setter
//@Builder
//@AllArgsConstructor
//@NoArgsConstructor
//public class Notification extends BaseEntity {
//    @Id
//    @GeneratedValue(strategy = GenerationType.IDENTITY)
//    private Long notificationId;
//
//    @ManyToOne(fetch = FetchType.LAZY)
//    @JoinColumn(name = "member_id", nullable = true)
//    private Member member; // 사용자 참조 (채권자/채무자 구분은 isLender로 판단)
//
//    @ManyToOne(fetch = FetchType.LAZY)
//    @JoinColumn(name = "post_id", nullable = true)
//    private LoanPost postId; // 게시글 참조
//
//    @Enumerated(EnumType.STRING)
//    @Column(nullable = true)
//    private NotificationType type; // 알림 유형
//
//    @Column(nullable = true)
//    private String message; // 알림 메시지
//
//    // 알림 유형을 정의하는 Enum 타입
//    public enum NotificationType {
//        PENDING,  // 계약 대기 (출자자가 선택한 후)
//        WAITING_FOR_APPROVAL, // 대출자의 승인 대기 상태
//        ACTIVE,   // 계약 진행 중 (대출 실행됨)
//        COMPLETED, // 계약 완료 (상환 완료)
//        OVERDUE,  // 연체 상태
//        CANCELLED, // 계약 취소됨
//        EXTENSION_REQUEST, // 연장 요청
//        TRANSFER_TO_WALLET,    // 계좌 -> 지갑 이체
//        TRANSFER_TO_ACCOUNT,   // 지갑 -> 계좌 이체
//        DEBTOR_TO_CREDITOR,    // 채무자 -> 채권자 이체
//        CREDITOR_TO_DEBTOR     // 채권자 -> 채무자 이체
//    }
//
//    @Column(nullable = true)
//    private String redirectUrl; // ✅ 알림 클릭 시 이동할 URL 추가
//
//
//}


package com.moneybridge.domain.post;

import com.moneybridge.domain.BaseEntity;
import com.moneybridge.domain.member.Member;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "notification")
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
    @JoinColumn(name = "member_id", nullable = true)
    private Member member; // 사용자 참조 (채권자/채무자 구분은 isLender로 판단)

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "post_id", nullable = true)
    private LoanPost postId; // 게시글 참조

    @Enumerated(EnumType.STRING)
    @Column(nullable = true)
    private NotificationType type; // 알림 유형

    @Column(nullable = true)
    private String message; // 알림 메시지

    // 알림 유형을 정의하는 Enum 타입
    public enum NotificationType {
        PENDING,  // 계약 대기 (출자자가 선택한 후)
        WAITING_FOR_APPROVAL, // 대출자의 승인 대기 상태
        ACTIVE,   // 계약 진행 중 (대출 실행됨)
        COMPLETED, // 계약 완료 (상환 완료)
        OVERDUE,  // 연체 상태
        CANCELLED, // 계약 취소됨
        EXTENSION_REQUEST, // 연장 요청
        TRANSFER_TO_WALLET,    // 계좌 -> 지갑 이체
        TRANSFER_TO_ACCOUNT,   // 지갑 -> 계좌 이체
        DEBTOR_TO_CREDITOR,    // 채무자 -> 채권자 이체
        CREDITOR_TO_DEBTOR,     // 채권자 -> 채무자 이체
        QNA_RESPONSE;  // ✅ QnA 알림 추가
    }
    @Column(nullable = true)
    private String redirectUrl; // ✅ 알림 클릭 시 이동할 URL 추가

}
