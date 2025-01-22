package com.moneybridge.controller.wallet;

import com.moneybridge.dto.wallet.WalletDTO;
import com.moneybridge.service.wallet.WalletService;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


@RestController
@RequestMapping("/api/wallets")
@RequiredArgsConstructor
public class WalletController {

    private final WalletService walletService;

    @PostMapping
    public ResponseEntity<WalletDTO> createWallet(@RequestBody WalletDTO walletDTO) {
        return ResponseEntity.ok(walletService.createWallet(walletDTO));
    }

    @GetMapping("/{walletId}")
    public ResponseEntity<WalletDTO> getWallet(@PathVariable String walletId) {
        return ResponseEntity.ok(walletService.getWalletById(walletId));
    }

    @GetMapping("/member/{memberId}")
    public ResponseEntity<WalletDTO> getWalletByMemberId(@PathVariable String memberId) {
        return ResponseEntity.ok(walletService.getWalletByMemberId(memberId));
    }

    @PutMapping("/{walletId}/balance")
    public ResponseEntity<WalletDTO> updateBalance(
            @PathVariable String walletId,
            @RequestParam Long amount) {
        return ResponseEntity.ok(walletService.updateWalletBalance(walletId, amount));
    }

    @PutMapping("/{walletId}/lock")
    public ResponseEntity<Void> lockWallet(@PathVariable String walletId) {
        walletService.lockWallet(walletId);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/{walletId}/unlock")
    public ResponseEntity<Void> unlockWallet(@PathVariable String walletId) {
        walletService.unlockWallet(walletId);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/{walletId}/increment-transaction")
    public ResponseEntity<Void> incrementTransactionCount(@PathVariable String walletId) {
        walletService.incrementTransactionCount(walletId);
        return ResponseEntity.ok().build();
    }
}
