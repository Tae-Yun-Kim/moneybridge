//package com.moneybridge.domain.post;
//
//import com.moneybridge.domain.member.Member;
//import jakarta.persistence.*;
//import lombok.*;
//
//import java.time.LocalDateTime;
//
//@Entity
//@Table(name = "contracts")
//@Getter
//@Setter
//@NoArgsConstructor
//@AllArgsConstructor
//@Builder
//public class Contract {
//
//    @Id
//    @GeneratedValue(strategy = GenerationType.IDENTITY)
//    private Long id; // 계약 ID
//
//    @OneToOne(fetch = FetchType.LAZY, cascade = {CascadeType.PERSIST, CascadeType.MERGE})
//    @JoinColumn(name = "post_comment_id", nullable = false, unique = true)
//    private PostComment selectedComment;
//
//    @ManyToOne(fetch = FetchType.LAZY)
//    @JoinColumn(name = "loan_post_id", nullable = false)
//    private LoanPost loanPost; // 대출 신청 게시글
//
//    @ManyToOne(fetch = FetchType.LAZY)
//    @JoinColumn(name = "lender_id", nullable = false)
//    private Member lender; // 출자자 (돈을 빌려주는 사람)
//
//    @ManyToOne(fetch = FetchType.LAZY)
//    @JoinColumn(name = "borrower_id", nullable = false)
//    private Member borrower; // 대출자 (돈을 빌리는 사람)
//
//    @Column(nullable = false)
//    private Long loanAmount; // 대출 금액
//
//    @Column(nullable = false)
//    private Integer repaymentPeriod; // 상환 기간 (개월 단위)
//
//    @Column(nullable = false)
//    private Double interestRate; // 선택된 이자율
//
//    @Column(nullable = false)
//    private Long totalRepaymentAmount; // 총 상환 금액 (원금 + 이자)
//
//    @Enumerated(EnumType.STRING)
//    @Column(nullable = false)
//    private ContractStatus status; // 계약 상태
//
//    @Column(nullable = false)
//    @Builder.Default
//    private Boolean borrowerAgreed = false; // 📌 대출자의 계약 동의 여부
//
//    @Column(nullable = false)
//    @Builder.Default
//    private Boolean lenderAgreed = false; // 📌 출자자의 계약 동의 여부
//
//    // ✅ 대출자 및 출자자의 계약서 내용을 별도로 저장
//    @Column(nullable = true, columnDefinition = "TEXT")
//    private String borrowerContractContent; // 📌 대출자용 계약서 내용
//
//    @Column(nullable = true, columnDefinition = "TEXT")
//    private String lenderContractContent; // 📌 출자자용 계약서 내용
//
//    @Column(nullable = false)
//    private LocalDateTime createdAt; // 계약 생성일
//
//    @Column(nullable = false)
//    private LocalDateTime updatedAt; // 계약 수정일
//
//    @PrePersist
//    public void onCreate() {
//        this.createdAt = LocalDateTime.now();
//        this.updatedAt = LocalDateTime.now();
//    }
//
//    @PreUpdate
//    public void onUpdate() {
//        this.updatedAt = LocalDateTime.now();
//    }
//}
package com.moneybridge.domain.post;

import com.moneybridge.domain.member.Member;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "contracts")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Contract {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id; // 계약 ID

    @OneToOne(fetch = FetchType.LAZY, cascade = {CascadeType.PERSIST, CascadeType.MERGE})
    @JoinColumn(name = "post_comment_id", nullable = false, unique = true)
    private PostComment selectedComment;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "loan_post_id", nullable = false)
    private LoanPost loanPost; // 대출 신청 게시글

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "lender_id", nullable = false)
    private Member lender; // 출자자 (돈을 빌려주는 사람)

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "borrower_id", nullable = false)
    private Member borrower; // 대출자 (돈을 빌리는 사람)

    @Column(nullable = false)
    private Long loanAmount; // 대출 금액

    @Column(nullable = false)
    private Integer repaymentPeriod; // 상환 기간 (개월 단위)

    @Column(nullable = false)
    private Double interestRate; // 선택된 이자율

    @Column(nullable = false)
    private Long totalRepaymentAmount; // 총 상환 금액 (원금 + 이자)

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ContractStatus status; // 계약 상태

    // ✅ 대출자의 계약 동의 여부 (필수)
    @Column(nullable = false)
    @Builder.Default
    private Boolean borrowerAgreed = false;

    // ✅ 출자자의 계약 최종 승인 여부 (필수)
    @Column(nullable = false)
    @Builder.Default
    private Boolean lenderApproved = false;

    // ✅ 계약서 내용 저장 (출자자와 대출자 개별 저장)
    @Column(nullable = true, columnDefinition = "TEXT")
    @Builder.Default
    private String borrowerContractContent = ""; // 📌 기본값: ""

    @Column(nullable = true, columnDefinition = "TEXT")
    @Builder.Default
    private String lenderContractContent = ""; // 📌 기본값: ""

    @Column(nullable = false)
    private LocalDateTime createdAt; // 계약 생성일

    @Column(nullable = false)
    private LocalDateTime updatedAt; // 계약 수정일

    @PrePersist
    public void onCreate() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    public void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
}
