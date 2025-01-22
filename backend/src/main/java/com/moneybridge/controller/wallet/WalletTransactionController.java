package com.moneybridge.controller.wallet;

import com.moneybridge.dto.wallet.WalletTransactionDTO;
import com.moneybridge.service.wallet.WalletTransactionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/wallet-transactions")
@RequiredArgsConstructor
public class WalletTransactionController {

    private final WalletTransactionService walletTransactionService;

    @PostMapping
    public ResponseEntity<WalletTransactionDTO> createWalletTransaction(@RequestBody WalletTransactionDTO walletTransactionDTO) {
        return ResponseEntity.ok(walletTransactionService.createWalletTransaction(walletTransactionDTO));
    }

    @GetMapping("/{transactionId}")
    public ResponseEntity<WalletTransactionDTO> getWalletTransaction(@PathVariable String transactionId) {
        return ResponseEntity.ok(walletTransactionService.getWalletTransactionById(transactionId));
    }

    @GetMapping("/from/{fromWalletId}")
    public ResponseEntity<List<WalletTransactionDTO>> getWalletTransactionsByFromWalletId(@PathVariable String fromWalletId) {
        return ResponseEntity.ok(walletTransactionService.getWalletTransactionsByFromWalletId(fromWalletId));
    }

    @GetMapping("/to/{toWalletId}")
    public ResponseEntity<List<WalletTransactionDTO>> getWalletTransactionsByToWalletId(@PathVariable String toWalletId) {
        return ResponseEntity.ok(walletTransactionService.getWalletTransactionsByToWalletId(toWalletId));
    }
}
