package com.moneybridge.domain.post;

import com.moneybridge.domain.BaseEntity;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "Contract")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Contract extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "postId", nullable = false)
    private LoanPost loanPost; // 대출 게시글과 연관

    @Column(name = "creditorId", nullable = false)
    private Long creditorId; // 채권자 ID

    @Column(name = "debtorId", nullable = false)
    private Long debtorId; // 채무자 ID

    @Column(name = "contractDetails", nullable = false, columnDefinition = "TEXT")
    private String contractDetails; // 계약 내용

    @Column(name = "eSignature", nullable = false)
    private Boolean eSignature = false; // 전자서명 여부 (기본값: false)
}
