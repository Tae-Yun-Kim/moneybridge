package com.moneybridge.domain.debt;

import com.moneybridge.domain.member.Member;
import com.moneybridge.domain.post.Contract;
import jakarta.persistence.*;
import lombok.*;

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

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private DebtRequestStatus debtstatus;


}
