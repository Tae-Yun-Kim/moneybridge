package com.moneybridge.dto;

import com.moneybridge.domain.member.Member;
import com.moneybridge.domain.post.LoanPost;
import lombok.*;

@Getter
@Setter
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class DebtRequestDTO {
    private LoanPost postId; // 게시글 ID
    private Member member;   // 사용자 (채권자/채무자 구분은 isLender로 판단)
    private Long loanAmount; // 대출 금액
    private Double interestRate; // 이자율
    private Integer repaymentPeriod; // 상환 기간
    private Long fee; // 수수료
}
