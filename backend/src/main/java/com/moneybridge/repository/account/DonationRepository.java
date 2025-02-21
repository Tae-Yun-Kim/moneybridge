package com.moneybridge.repository.account;

import com.moneybridge.domain.account.Donation;
import com.moneybridge.dto.account.DonationStatsDTO;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface DonationRepository extends JpaRepository<Donation, Long> {
//*기부금(donationAmount)**과 **관리자 수익(adminProfitAmount)**을 동시에 조회.
@Query("SELECT new com.moneybridge.dto.account.DonationStatsDTO(" +
        "CAST(FUNCTION('DATE_FORMAT', d.createdAt, '%Y-%m') AS string), " +
        "SUM(d.donationAmount), " +
        "SUM(d.adminProfitAmount)) " +
        "FROM Donation d " +
        "GROUP BY FUNCTION('DATE_FORMAT', d.createdAt, '%Y-%m') " +
        "ORDER BY FUNCTION('DATE_FORMAT', d.createdAt, '%Y-%m') DESC")
List<DonationStatsDTO> getMonthlyDonationStatsWithProfit();











}

