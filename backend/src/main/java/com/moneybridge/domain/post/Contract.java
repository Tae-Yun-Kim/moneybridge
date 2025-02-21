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

    @Column(name = "deleted_by_users")
    private String deletedByUsers; // 삭제한 유저 ID 리스트 (콤마로 구분)

    @PrePersist
    public void onCreate() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    public void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }

    // ✅ 상환 기간 연장 요청 여부
    @Column(nullable = false)
    @Builder.Default
    private boolean extendRepaymentRequested = false;

    // ✅ 연장된 상환 기간 (단위: 개월)
    @Column(nullable = true)
    private Integer extendedPeriod;
    // ✅ 연장 요청 횟수 (최대 2회)
    @Column(nullable = false)
    @Builder.Default
    private int extensionRequestCount = 0;





    // ✅ 상환 기간 연장 및 금액 2배 증가 메서드
    public void extendRepaymentPeriod(int additionalMonths) {
        if (additionalMonths <= 0) {
            throw new IllegalArgumentException("상환 기간은 1개월 이상 늘려야 합니다.");
        }

        // 🔹 연장 요청 횟수 제한 (최대 2회)
        if (this.extensionRequestCount >= 2) {
            throw new IllegalStateException("상환 연장은 최대 2회까지만 가능합니다.");
        }

        // 🔹 상환 기간 증가
        this.repaymentPeriod += additionalMonths;

        // 🔹 총 상환 금액 2배로 증가
        this.totalRepaymentAmount *= 2;

        // 🔹 이자율 2배 증가 추가 (핵심 변경 부분)
        this.interestRate *= 2;

        // 🔹 연장 요청 상태 업데이트
        this.extendedPeriod = additionalMonths;
        this.extendRepaymentRequested = true;

        // 🔹 연장 요청 횟수 증가
        this.extensionRequestCount++;

        // 🔹 업데이트 타임스탬프 갱신
        this.updatedAt = LocalDateTime.now();

        // 🔹 로그 출력
        System.out.println("✅ 상환 기간 연장 완료: " + additionalMonths + "개월 / 총 상환 금액: " + this.totalRepaymentAmount + "원");
        System.out.println("🔹 이자율 변경: " + this.interestRate + "%");
        System.out.println("🛠️ 현재 연장 요청 횟수: " + this.extensionRequestCount);
    }

}
