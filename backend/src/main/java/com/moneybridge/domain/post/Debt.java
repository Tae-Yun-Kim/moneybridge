package com.moneybridge.domain.post;

import com.moneybridge.domain.BaseEntity;
import com.moneybridge.domain.member.Member;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

@Entity
@Table(name = "Debt")
@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class Debt extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long debtId; // 채무 ID

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "postId", nullable = false)
    private LoanPost postId; // 게시글 참조

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "memberId", nullable = true)
    private Member member; // 사용자 참조 (채권자/채무자 구분은 isLender로 판단)

    @Column(nullable = true)
    private Long loanAmount; // 대출 금액

    @Column(nullable = true)
    private Long remainingAmount; // 남은 변제 금액

    @Column(nullable = false)
    private Double interestRate; // 이자율

    @Column(nullable = true)
    private Long fee; // 수수료

    @Column(nullable = true)
    private Integer repaymentPeriod; // 상환 기간

    @Column(nullable = true)
    private LocalDate repaymentDate; // 상환 날짜

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private RepaymentStatus repaymentStatus = RepaymentStatus.IN_PROGRESS; // 상환 상태 ("IN_PROGRESS", "COMPLETED")

    @Column(nullable = true)
    private Boolean extensionRequested; // 연장 신청 여부

    @Column(nullable = true)
    private Boolean collectionInProgress; // 추심 진행 여부

    // 필드에 null이 들어갔을 때 기본값을 설정하는 메서드
    public Long getFeeOrDefault() {
        return fee != null ? fee : 0L; // 수수료가 null일 경우 0으로 설정
    }

    public Integer getRepaymentPeriodOrDefault() {
        return repaymentPeriod != null ? repaymentPeriod : 0; // 상환기간이 null일 경우 0으로 설정
    }

    public LocalDate getRepaymentDateOrDefault() {
        return repaymentDate != null ? repaymentDate : LocalDate.now(); // 상환일자가 null일 경우 오늘 날짜로 설정
    }

    public void requestExtension() {
        this.extensionRequested = true;
    }

    public void markAsCompleted() {
        this.repaymentStatus = RepaymentStatus.COMPLETED;
    }

    /**
     * 채권자 여부 확인 메서드
     */
    public boolean isCreditor() {
        return this.member.isLender();
    }

    /**
     * 채무자 여부 확인 메서드
     */
    public boolean isDebtor() {
        return !this.member.isLender();
    }

    // 상환 상태를 정의하는 Enum 타입
    public enum RepaymentStatus {
        IN_PROGRESS,   // 진행 중
        COMPLETED      // 완료
    }
}
