package com.moneybridge.controller.account;

import com.moneybridge.dto.account.AccountDTO;
import com.moneybridge.service.account.AccountService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/account")
public class AccountController {

    private final AccountService accountService;

    @GetMapping("/{accountNumber}")
    public ResponseEntity<AccountDTO> getAccount(@PathVariable String accountNumber) {
        AccountDTO accountDTO = accountService.getAccountByNumber(accountNumber);
        return ResponseEntity.ok(accountDTO);
    }
}
