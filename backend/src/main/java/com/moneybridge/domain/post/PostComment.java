package com.moneybridge.domain.post;

import com.moneybridge.domain.BaseEntity;
import com.moneybridge.domain.member.Member;
import com.moneybridge.domain.member.MemberGrade;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "post_comments")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PostComment extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id; // 댓글 ID

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "post_id", nullable = false) // LoanPost와 연관 관계
    private LoanPost post; // LoanPost 엔터티와 매핑

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "member_id", nullable = false) // Member와 연관 관계
    private Member member; // 댓글 작성자 (Member 엔터티와 매핑)

    //임시 양방향 매핑
    @OneToOne(mappedBy = "selectedComment", fetch = FetchType.LAZY)
    private Contract contract;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "lender_id") // 출자자 (선택한 사람)
    private Member lender; // 출자자 정보 추가

    @Column(nullable = false)
    private Double interestRate; // 제시 이자율

    @Column(nullable = false, columnDefinition = "TEXT")
    private String commentText; // 댓글 내용

    @Enumerated(EnumType.STRING)
    @Column(length = 20) // 길이 제한 설정 (예: "BRONZE", "SILVER", "GOLD")
    private MemberGrade memberGrade; // 댓글 작성자의 회원 등급 (열거형 매핑)

    @Column(nullable = false)
    private Boolean isSelected = false;

    // 추가된 필드들(경우)
    @Column(nullable = true)
    private Long loanAmount; // 대출 금액 추가

    @Column(nullable = true)
    private Integer repaymentPeriod; // 상환 기간 추가

    @Column(nullable = true)
    private Long fee; // 수수료 추가

    public boolean isSelected() {
        return Boolean.TRUE.equals(this.isSelected);
    }
}
