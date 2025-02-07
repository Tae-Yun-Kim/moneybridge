package com.moneybridge.domain.post;

import com.moneybridge.domain.BaseEntity;
import com.moneybridge.domain.Member;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@ToString
@Table(name = "LoanPost")
public class LoanPost extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "member_id", nullable = false)
    private Member member; // 작성자 (Member 테이블과 연관)

    @Column(nullable = false, length = 255)
    private String title; // 게시글 제목

    @Column(nullable = false)
    private Long loanAmount; // 총 대출 금액

    @Column(nullable = false)
    private Long loanAvailableAmount; // 현재 대출 가능 금액

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private Status status = Status.AVAILABLE; // 상태 (기본값: AVAILABLE)

    @Column
    private LocalDateTime deletionRequestedAt; // 삭제 요청 시간

    // 상태 Enum 정의
    public enum Status {
        AVAILABLE,          // 대출 가능
        IN_PROGRESS,        // 진행 중
        COMPLETED,          // 완료
        LOCKED,             // 잠김
        DELETION_REQUESTED  // 삭제 요청됨
    }
}
