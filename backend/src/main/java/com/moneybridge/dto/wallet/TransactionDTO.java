package com.moneybridge.dto.wallet;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class TransactionDTO {

    private String transactionId;
    private String walletId;
    private String accountNumber;
    private BigDecimal amount;
    private String transactionType;
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime createdAt;
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss") // JSON 응답 시 날짜 포맷 지정
    private LocalDateTime updatedAt;
}
