package com.moneybridge.domain.post;

import com.moneybridge.domain.BaseEntity;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "Comment")
@Getter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class Comment extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long commentId; // 댓글 ID

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "postId")
    private LoanPost loanPost; // 게시글 참조

    @Column(nullable = false)
    private Long debtorId; // 채무자 ID

    @Column(nullable = true)
    private String debtorMembershipLevel; // 채무자 회원 등급

    @Column(nullable = true)
    private Integer debtorCreditScore; // 채무자 신용 점수

    @Column(nullable = false)
    private String content; // 댓글 내용
}
