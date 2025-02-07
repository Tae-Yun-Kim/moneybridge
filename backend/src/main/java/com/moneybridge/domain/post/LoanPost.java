package com.moneybridge.domain.post;

import com.moneybridge.domain.BaseEntity;
import com.moneybridge.domain.member.Member;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "loan_posts")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LoanPost extends BaseEntity {

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
}