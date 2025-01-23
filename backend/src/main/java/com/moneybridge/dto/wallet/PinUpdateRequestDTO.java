package com.moneybridge.dto.wallet;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class PinUpdateRequestDTO {
    private String walletId;
    private String oldPin;
    private String newPin;
}
