package com.moneybridge.dto.account;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class DonationStatsDTO {
    private String month;
    private Long totalDonation;
    private Long totalAdminProfit;
}
