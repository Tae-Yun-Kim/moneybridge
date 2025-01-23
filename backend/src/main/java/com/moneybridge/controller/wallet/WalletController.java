package com.moneybridge.controller.wallet;

import com.moneybridge.domain.wallet.Wallet;
import com.moneybridge.dto.wallet.WalletDTO;
import com.moneybridge.repository.wallet.WalletRepository;
import com.moneybridge.service.wallet.WalletService;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;


@RestController
@RequestMapping("/api/wallets")
@RequiredArgsConstructor
public class WalletController {

    private final WalletService walletService;
    private final WalletRepository walletRepository;

    @PostMapping
    public ResponseEntity<WalletDTO> createWallet(@RequestBody WalletDTO walletDTO) {
        return ResponseEntity.ok(walletService.createWallet(walletDTO));
    }

    @GetMapping("/{walletId}")
    public ResponseEntity<WalletDTO> getWallet(@PathVariable String walletId) {
        return ResponseEntity.ok(walletService.getWalletById(walletId));
    }

    @GetMapping("/member/{memberId}")
    public ResponseEntity<WalletDTO> getWalletByMemberId(Authentication authentication) {
        // 인증된 사용자 ID 가져오기
        String loggedInUserId = authentication.getName(); // 보통 username (ID)

        // 로그인한 사용자의 지갑 정보만 반환
        WalletDTO walletDTO = walletService.getWalletByMemberId(loggedInUserId);
        if (walletDTO == null) {
            throw new RuntimeException("Wallet not found for the logged-in user");
        }

        return ResponseEntity.ok(walletDTO);
    }

    @PutMapping("/{walletId}/balance")
    public ResponseEntity<WalletDTO> updateBalance(
            @PathVariable String walletId,
            @RequestParam Long amount) {
        return ResponseEntity.ok(walletService.updateWalletBalance(walletId, amount));
    }

    @PostMapping("/{memberId}/transfer")
    public ResponseEntity<String> transferToAccount(
            @PathVariable String memberId,
            @RequestParam Long amount,
            Authentication authentication) {
        // 로그인된 사용자 ID 가져오기
        String loggedInUserId = authentication.getName();

        // 요청된 memberId와 로그인된 사용자 ID가 일치하는지 확인
        if (!loggedInUserId.equals(memberId)) {
            throw new RuntimeException("Unauthorized: You can only transfer your own funds.");
        }

        // 송금 로직 실행
        walletService.transferFromWalletToAccount(memberId, amount);
        return ResponseEntity.ok("지갑에서 계좌로 송금 완료");
    }

    @PostMapping("/{memberId}/deposit")
    public ResponseEntity<String> transferToWallet(
            @PathVariable String memberId,
            @RequestParam Long amount,
            Authentication authentication) {
        // 로그인된 사용자 ID 가져오기
        String loggedInUserId = authentication.getName();

        // 요청된 memberId와 로그인된 사용자 ID가 일치하는지 확인
        if (!loggedInUserId.equals(memberId)) {
            throw new RuntimeException("Unauthorized: You can only deposit to your own wallet.");
        }

        // 입금 로직 실행
        walletService.transferFromAccountToWallet(memberId, amount);
        return ResponseEntity.ok("계좌에서 지갑으로 송금 완료");
    }

    @PutMapping("/{walletId}/lock")
    public ResponseEntity<String> lockWallet(@PathVariable String walletId) {
        walletService.lockWallet(walletId);
        return ResponseEntity.ok("지갑이 잠겼습니다.");
    }

    @PutMapping("/{walletId}/unlock")
    public ResponseEntity<String> unlockWallet(@PathVariable String walletId) {
        walletService.unlockWallet(walletId);
        return ResponseEntity.ok("지갑이 잠금 해제되었습니다.");
    }

    @PutMapping("/{walletId}/increment-transaction")
    public ResponseEntity<String> incrementTransactionCount(@PathVariable String walletId) {
        walletService.incrementTransactionCount(walletId);
        return ResponseEntity.ok("거래 횟수가 증가했습니다.");
    }

    // New: PIN 변경 엔드포인트 추가
    @PutMapping("/{walletId}/pin")
    public ResponseEntity<Void> updatePinNumber(
            @PathVariable String walletId,
            @RequestParam String oldPin,
            @RequestParam String newPin) {
        walletService.updatePinNumber(walletId, oldPin, newPin);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/{fromWalletId}/transfer/{toWalletId}")
    public ResponseEntity<String> transferBetweenWallets(
            @PathVariable String fromWalletId,
            @PathVariable String toWalletId,
            @RequestParam Long amount,
            Authentication authentication) {

        // 로그인된 사용자 확인
        String loggedInUserId = authentication.getName();

        // 출발 지갑의 소유자가 로그인된 사용자인지 확인
        Wallet fromWallet = walletRepository.findById(fromWalletId)
                .orElseThrow(() -> new RuntimeException("From Wallet not found"));
        if (!fromWallet.getMember().getId().equals(loggedInUserId)) {
            throw new RuntimeException("Unauthorized: You can only transfer money from your own wallet.");
        }

        // 지갑 간 거래 수행
        walletService.transferBetweenWallets(fromWalletId, toWalletId, amount);
        return ResponseEntity.ok("지갑 간 거래가 완료되었습니다.");
    }

}
