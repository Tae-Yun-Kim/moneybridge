package com.moneybridge.domain.post;

import com.moneybridge.domain.BaseEntity;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Entity
@Table(name = "LoanApplication")
@Getter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class LoanApplication extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long applicationId; // 신청 ID

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "postId")
    private LoanPost loanPost; // 게시글 참조

    @Column(nullable = false)
    private Long applicantId; // 신청자 ID

    @Column(nullable = false)
    private Long requestedAmount; // 신청 금액

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal interestRate; // 이자율

    @Column
    private Long expectedInterest; // 예상 이자

    @Column
    private Long totalAmount; // 총액

    @Column(nullable = false)
    private Integer repaymentPeriod; // 상환 기간

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ApplicationStatus status = ApplicationStatus.APPLIED; // 상태 ("APPLIED", "CANCELLED", "APPROVED", "REJECTED")

    @Column(nullable = false)
    private Boolean contractAgreed = false; // 계약서 동의 여부

    @Column(nullable = false)
    private Boolean eSignature = false; // 전자서명 여부

    public void approveApplication() {
        this.status = ApplicationStatus.APPROVED;
    }

    public void rejectApplication() {
        this.status = ApplicationStatus.REJECTED;
    }

    // 상태를 정의하는 Enum 타입
    public enum ApplicationStatus {
        APPLIED,       // 신청됨
        CANCELLED,     // 취소됨
        APPROVED,      // 승인됨
        REJECTED       // 거절됨
    }
}
