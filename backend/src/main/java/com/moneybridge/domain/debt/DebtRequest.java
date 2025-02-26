package com.moneybridge.domain.debt;

import com.moneybridge.domain.member.Member;
import com.moneybridge.domain.post.Contract;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

@Entity
@Table(name = "debt_requests")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DebtRequest {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "contract_id", nullable = false)
    private Contract contract;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "lender_id", nullable = false)
    private Member lender;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "borrower_id", nullable = false)
    private Member borrower; // 대출자 (돈을 빌리는 사람)

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private DebtRequestStatus debtstatus;

    @Column(nullable = true)
    private LocalDate approvedAt; // ✅ 승인된 시간

    @Column(nullable = false)
    private Double extraInterestRate; // ✅ 추가 이자율 저장

    @Column(nullable = false)
    private Long debtAmount; // ✅ 추심 금액

    @Column(nullable = false)
    private Long overdueDebt; // ✅ 연체 추심 금액 (추심 금액 + 추가 이자)


    // ✅ debtstatus가 변경될 때 approvedAt 업데이트
    public void updateDebtStatus(DebtRequestStatus newStatus) {
        if (this.debtstatus == DebtRequestStatus.PENDING && newStatus == DebtRequestStatus.APPROVED) {
            this.approvedAt = LocalDate.now();
        }
        this.debtstatus = newStatus;
    }

}
