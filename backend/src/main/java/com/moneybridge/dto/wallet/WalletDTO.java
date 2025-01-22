package com.moneybridge.dto.wallet;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Getter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class WalletDTO {
    private String walletId;
    private String memberId;  // userId를 memberId로 변경
    private String accountNumber;
    private Long balance;
    private String pinNumber;
    private int transactionCount;
    private boolean isLocked;
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime createdAt;
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss") // JSON 응답 시 날짜 포맷 지정
    private LocalDateTime updatedAt;
}
