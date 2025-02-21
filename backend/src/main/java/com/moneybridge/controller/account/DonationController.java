package com.moneybridge.controller.account;

import com.moneybridge.domain.account.Donation;
import com.moneybridge.dto.account.DonationStatsDTO;
import com.moneybridge.repository.account.DonationRepository;
import com.moneybridge.service.account.DonationService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/donations")
@RequiredArgsConstructor
public class DonationController {

    private final DonationRepository donationRepository;
    private final DonationService donationService;

    // 📊 관리자 - 월별 기부금 & 관리자 수익 내역 조회
    @GetMapping("/monthly")
    public List<DonationStatsDTO> getMonthlyDonationStatsWithProfit() {
        return donationRepository.getMonthlyDonationStatsWithProfit();
    }

    // 🗂️ 관리자 - 기부금 상세 내역 조회
    @GetMapping("/details")
    public List<Donation> getDonationDetails() {
        return donationRepository.findAll();
    }


    }


