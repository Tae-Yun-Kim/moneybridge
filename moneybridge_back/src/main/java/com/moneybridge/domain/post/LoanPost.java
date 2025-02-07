package com.moneybridge.domain.post;

import com.moneybridge.domain.member.Member;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "loan_posts")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LoanPost {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id; // 게시글 ID

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "member_id", nullable = false) // Member 엔터티와 매핑
    private Member writer; // 작성자 (Member 엔터티)

    @Column(nullable = false)
    private Long loanAmount; // 대출 금액

    @Column(nullable = false)
    private Integer repaymentPeriod; // 상환 기간 (개월 단위)

    @Column(nullable = true, length = 500)
    private String additionalConditions; // 추가 조건

    @Column(nullable = true, length = 255)
    private String title; // ✅ 게시글 제목 (nullable 허용)


    @Column(nullable = false)
    private LocalDateTime createdAt; // 생성일

    @Column(nullable = false)
    private LocalDateTime updatedAt; // 수정일

    @PrePersist
    public void onCreate() {
        this.createdAt = LocalDateTime.now(); // 생성 시 현재 시간 설정
        this.updatedAt = LocalDateTime.now(); // 생성 시 수정 시간도 현재 시간 설정
    }

    @PreUpdate
    public void onUpdate() {
        this.updatedAt = LocalDateTime.now(); // 수정 시 현재 시간 업데이트
    }
}
