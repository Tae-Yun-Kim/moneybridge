package com.moneybridge.service.account;

import com.moneybridge.domain.post.Contract;
import com.moneybridge.domain.account.Donation;
import com.moneybridge.repository.account.DonationRepository;
import jakarta.persistence.EntityManager;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class DonationService {

    private final DonationRepository donationRepository;

    @Autowired
    private EntityManager entityManager;

    @Transactional
    public void saveDonation(String donorId, Long contractId, Long donationAmount, Long adminProfitAmount) {
        // 🔹 Contract 프록시 객체 생성 (성능 최적화 및 오류 방지)
        Contract contractProxy = entityManager.getReference(Contract.class, contractId);

        Donation donation = Donation.builder()
                .donorId(donorId)
                .contract(contractProxy)
                .donationAmount(donationAmount)
                .adminProfitAmount(adminProfitAmount)
                .build();

        donationRepository.save(donation);
    }



    }


