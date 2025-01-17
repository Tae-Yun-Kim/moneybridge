package com.moneybridge.service.account;

import com.moneybridge.domain.account.Account;
import com.moneybridge.dto.account.AccountDTO;
import com.moneybridge.repository.account.AccountRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AccountService {

    private final AccountRepository accountRepository;

    public AccountDTO getAccountByNumber(String accountNumber) {
        Account account = accountRepository.findByAccountNumber(accountNumber)
                .orElseThrow(() -> new IllegalArgumentException("Account not found for number: " + accountNumber));
        return new AccountDTO(account.getMember().getId(), account.getAccountNumber(), account.getBankName(), account.getBalance());
    }
}

