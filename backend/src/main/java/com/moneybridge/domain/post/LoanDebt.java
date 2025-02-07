package com.moneybridge.domain.post;

import com.moneybridge.domain.BaseEntity;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "LoanDebt")
@Getter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class LoanDebt extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long debtId; // 채무 ID

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "postId")
    private LoanPost loanPost; // 게시글 참조

    @Column(nullable = false)
    private Long creditorId; // 채권자 ID

    @Column(nullable = false)
    private Long debtorId; // 채무자 ID

    @Column(nullable = false)
    private Long loanAmount; // 대출 금액

    @Column(nullable = true)
    private Long remainingAmount; // 남은 금액

    @Column(nullable = false)
    private BigDecimal interestRate; // 이자율

    @Column(nullable = true)
    private Long fee; // 수수료

    @Column(nullable = false)
    private Integer repaymentPeriod; // 상환 기간

    @Column(nullable = true)
    private LocalDate repaymentDate; // 상환 날짜

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private RepaymentStatus repaymentStatus = RepaymentStatus.IN_PROGRESS; // 상환 상태 ("IN_PROGRESS", "COMPLETED")

    @Column(nullable = false)
    private Boolean extensionRequested = false; // 연장 신청 여부

    @Column(nullable = false)
    private Boolean collectionInProgress = false; // 추심 진행 여부

    public void requestExtension() {
        this.extensionRequested = true;
    }

    public void markAsCompleted() {
        this.repaymentStatus = RepaymentStatus.COMPLETED;
    }

    // 상환 상태를 정의하는 Enum 타입
    public enum RepaymentStatus {
        IN_PROGRESS,   // 진행 중
        COMPLETED      // 완료
    }
}
