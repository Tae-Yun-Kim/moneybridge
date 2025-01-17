package com.moneybridge.domain.post;

import com.moneybridge.domain.BaseEntity;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "DonationStatus")
@Getter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class DonationStatus extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long donationId; // 기부 ID

    @Column(nullable = false)
    private Long donationAmount; // 기부 금액

    @Column(nullable = false)
    private String donationSource; // 기부 출처

    @Column(nullable = false)
    private String donationTarget; // 기부 대상

    @ManyToOne(fetch = FetchType.LAZY) // LoanDebt와 다대일 관계
    @JoinColumn(name = "debt_id", referencedColumnName = "debtId", nullable = false) // 외래 키 설정
    private LoanDebt loanDebt; // LoanDebt 참조
}
