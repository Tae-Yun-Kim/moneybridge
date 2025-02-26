package com.moneybridge.controller.debt;

import com.moneybridge.dto.debt.DebtRequestDTO;
import com.moneybridge.repository.wallet.WalletRepository;
import com.moneybridge.service.debt.DebtService;
import com.moneybridge.service.wallet.WalletService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Slf4j
@RestController
@RequestMapping("/api/debt")
@RequiredArgsConstructor
public class DebtRequestController {

    private final DebtService debtService;
    private final WalletRepository walletRepository;
    private final WalletService walletService;


    @PostMapping("/request")
    public ResponseEntity<DebtRequestDTO> requestDebt(@RequestBody DebtRequestDTO dto) {
        log.info("📌 추심 요청: contractId={}, lenderId={}, borrowerId={}, 추가 이자율={}, 추심금액={}, 연체 추심금={}",
                dto.getContractId(), dto.getLenderId(), dto.getBorrowerId(), dto.getExtraInterestRate(), dto.getDebtAmount(),dto.getOverdueDebt());

        return ResponseEntity.ok(debtService.createDebtRequest(dto));
    }


    // ✅ 관리자 또는 승인자가 추심 요청 상태 변경 (APPROVED / REJECTED)
    @PutMapping("/request/{id}/status")
    public ResponseEntity<DebtRequestDTO> updateDebtStatus(@PathVariable Long id, @RequestBody DebtRequestDTO dto) {
        log.info("🚀 추심 요청 상태 변경: requestId={}, newStatus={}", id, dto.getDebtstatus());
        return ResponseEntity.ok(debtService.updateDebtRequestStatus(id, dto.getDebtstatus()));
    }

    // ✅ 특정 계약의 모든 추심 요청 조회
    @GetMapping("/request/{contractId}")
    public ResponseEntity<List<DebtRequestDTO>> getDebtRequestsByContract(@PathVariable Long contractId) {
        log.info("📌 특정 계약의 추심 요청 조회: contractId={}", contractId);
        return ResponseEntity.ok(debtService.getDebtRequestsByContract(contractId));
    }

    // ✅ 모든 추심 요청 조회 (관리자용)
    @GetMapping("/requests")
    public ResponseEntity<List<DebtRequestDTO>> getAllDebtRequests(Authentication authentication) {
        log.info("📌 모든 추심 요청 조회 (관리자): user={}", authentication.getName());
        return ResponseEntity.ok(debtService.getAllDebtRequests(authentication));
    }

    // ✅ 관리자가 특정 추심 요청 승인 또는 거절
    @PutMapping("/requests/{id}/approve")
    public ResponseEntity<DebtRequestDTO> approveDebtRequest(
            @PathVariable Long id,
            @RequestBody DebtRequestDTO dto,
            Authentication authentication) {

        log.info("✅ 관리자가 추심 요청 승인/거절: requestId={}, status={}, user={}",
                id, dto.getDebtstatus(), authentication.getName());

        return ResponseEntity.ok(debtService.approveOrRejectDebtRequest(id, dto.getDebtstatus(), authentication));
    }

    @PutMapping("/requests/{id}/complete")
    public ResponseEntity<Void> completeDebtCollection(@PathVariable Long id) {
        log.info("✅ 관리자가 추심 완료 처리: requestId={}", id);

        debtService.completeDebtCollection(id);

        return ResponseEntity.ok().build();
    }




}
