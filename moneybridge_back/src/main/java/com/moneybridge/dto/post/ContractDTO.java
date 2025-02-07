package com.moneybridge.dto.post;

import com.moneybridge.domain.post.Contract;
import com.moneybridge.domain.post.ContractStatus;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ContractDTO {

    private Long id;  // 계약 ID
    private String lenderId; // 출자자 ID
    private String borrowerId; // 대출자 ID
    private Long postId; // 대출 신청 게시글 ID
    private Long selectedCommentId; // ✅ 선택된 댓글 ID
    private Long loanAmount; // 대출 금액
    private Integer repaymentPeriod; // 상환 기간 (개월 단위)
    private Double interestRate; // 이자율
    private Long totalRepaymentAmount; // ✅ 총 상환 금액 (원금 + 이자)
    private ContractStatus status; // 계약 상태 (PENDING, ACTIVE, COMPLETED 등)

    private Boolean borrowerAgreed; // ✅ 대출자 계약 동의 여부
    private Boolean lenderApproved; // ✅ 출자자 계약 최종 승인 여부

    @Builder.Default
    private String borrowerContractContent = ""; // ✅ null 방지: 기본값 ""

    @Builder.Default
    private String lenderContractContent = ""; // ✅ null 방지: 기본값 ""

    // ✅ Contract 엔티티 → ContractDTO 변환
    public ContractDTO(Contract contract) {
        this.id = contract.getId();
        this.lenderId = contract.getLender().getId();
        this.borrowerId = contract.getBorrower().getId();
        this.postId = contract.getLoanPost().getId();
        this.selectedCommentId = contract.getSelectedComment().getId();
        this.loanAmount = contract.getLoanAmount();
        this.repaymentPeriod = contract.getRepaymentPeriod();
        this.interestRate = contract.getInterestRate();
        this.totalRepaymentAmount = contract.getTotalRepaymentAmount();
        this.status = contract.getStatus();

        this.borrowerAgreed = contract.getBorrowerAgreed();
        this.lenderApproved = contract.getLenderApproved();

        // ✅ null 체크하여 빈 문자열로 변환
        this.borrowerContractContent = contract.getBorrowerContractContent() != null ? contract.getBorrowerContractContent() : "";
        this.lenderContractContent = contract.getLenderContractContent() != null ? contract.getLenderContractContent() : "";
    }

    // ✅ 빌더 패턴에서 계약 동의 여부 및 계약서 내용 포함
    public static ContractDTO toDTO(Contract contract) {
        return ContractDTO.builder()
                .id(contract.getId())
                .lenderId(contract.getLender().getId())
                .borrowerId(contract.getBorrower().getId())
                .postId(contract.getLoanPost().getId())
                .selectedCommentId(contract.getSelectedComment().getId())
                .loanAmount(contract.getLoanAmount())
                .repaymentPeriod(contract.getRepaymentPeriod())
                .interestRate(contract.getInterestRate())
                .totalRepaymentAmount(contract.getTotalRepaymentAmount())
                .status(contract.getStatus())
                .borrowerAgreed(contract.getBorrowerAgreed())
                .lenderApproved(contract.getLenderApproved())
                // ✅ null 체크하여 빈 문자열로 변환
                .borrowerContractContent(contract.getBorrowerContractContent() != null ? contract.getBorrowerContractContent() : "")
                .lenderContractContent(contract.getLenderContractContent() != null ? contract.getLenderContractContent() : "")
                .build();
    }
}
