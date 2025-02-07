package com.moneybridge.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.moneybridge.domain.member.Member;
import lombok.*;

import java.time.LocalDate;

@Getter
@Setter
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class DebtResponseDTO {
    private Long debtId; // 채무 ID

    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    private Member member; // 사용자 (채권자/채무자 정보 포함)
    private Long loanAmount; // 대출 금액
    private Long remainingAmount; // 남은 변제 금액
    private Double interestRate; // 이자율
    private Long fee; // 수수료
    private Integer repaymentPeriod; // 상환 기간
    private LocalDate repaymentDate; // 상환 날짜
    private String repaymentStatus; // 상환 상태
    private Boolean extensionRequested; // 연장 신청 여부
    private Boolean collectionInProgress; // 추심 진행 여부
}
