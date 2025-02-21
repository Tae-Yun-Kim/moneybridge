package com.moneybridge.domain.account;

import com.moneybridge.domain.BaseEntity;
import com.moneybridge.domain.post.Contract;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "donations")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Donation extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String donorId; // 기부자(출자자) ID

    @Column(nullable = false)
    private Long donationAmount; // 기부 금액

    @Column(nullable = false)
    private Long adminProfitAmount; // 🔹 관리자 수익 금액

    // 🔗 Contract와의 관계 매핑
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "contract_id", nullable = false)
    private Contract contract;
}
