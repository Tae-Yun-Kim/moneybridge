package com.moneybridge.dto.account;

import lombok.*;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class AccountDTO {
    private String memberId;        // 회원 ID
    private String accountNumber;  // 계좌번호
    private String bankName;
    private double balance;
}
