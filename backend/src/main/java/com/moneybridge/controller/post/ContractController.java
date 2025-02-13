package com.moneybridge.controller.post;

import com.moneybridge.domain.post.ContractStatus;
import com.moneybridge.dto.post.ContractDTO;
import com.moneybridge.service.post.ContractService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@Slf4j
@RestController
@RequestMapping("/api/contracts")
@RequiredArgsConstructor
public class ContractController {

    private final ContractService contractService;

    // ✅ 출자자가 댓글을 선택하여 계약 생성 (PENDING 상태)
    @PostMapping("/create")
    public ResponseEntity<ContractDTO> createContract(@RequestBody ContractDTO contractDTO) {
        log.info("출자자가 댓글을 선택하여 계약 생성 요청: lenderId={}, borrowerId={}, postId={}",
                contractDTO.getLenderId(), contractDTO.getBorrowerId(), contractDTO.getPostId());

        ContractDTO createdContract = contractService.createContract(contractDTO);
        return ResponseEntity.ok(createdContract);
    }

    // ✅ 출자자가 체결한 모든 계약 조회
    @GetMapping("/lender/{lenderId}")
    public ResponseEntity<List<ContractDTO>> getContractsByLender(@PathVariable String lenderId) {
        log.info("출자자의 계약 목록 조회 요청: lenderId={}", lenderId);
        return ResponseEntity.ok(contractService.getContractsByLenderId(lenderId));
    }

    // ✅ 대출자가 체결한 모든 계약 조회
    @GetMapping("/borrower/{borrowerId}")
    public ResponseEntity<List<ContractDTO>> getContractsByBorrower(@PathVariable String borrowerId) {
        log.info("대출자의 계약 목록 조회 요청: borrowerId={}", borrowerId);
        return ResponseEntity.ok(contractService.getContractsByBorrowerId(borrowerId));
    }

    // ✅ 대출자가 계약을 승인하면 계약서가 자동 생성되고 WAITING_FOR_APPROVAL 상태로 변경됨
    @PostMapping("/{contractId}/approve/{borrowerId}")
    public ResponseEntity<ContractDTO> approveContract(@PathVariable Long contractId, @PathVariable String borrowerId) {
        log.info("대출자가 계약을 승인함: contractId={}, borrowerId={}", contractId, borrowerId);
        return ResponseEntity.ok(contractService.approveContract(contractId, borrowerId));
    }

    // ✅ 출자자가 최종 계약 승인 (계약 상태: ACTIVE) 및 계약서 자동 생성
    @PostMapping("/{contractId}/approve-lender/{lenderId}")
    public ResponseEntity<ContractDTO> approveContractByLender(@PathVariable Long contractId,
                                                               @PathVariable String lenderId) {
        log.info("출자자가 계약을 최종 승인: contractId={}, lenderId={}", contractId, lenderId);
        return ResponseEntity.ok(contractService.approveContractByLender(contractId, lenderId));
    }

    // ✅ 계약 상태 업데이트 (COMPLETED, OVERDUE 등)
    @PutMapping("/{contractId}/status")
    public ResponseEntity<ContractDTO> updateContractStatus(@PathVariable Long contractId,
                                                            @RequestParam ContractStatus status) {
        log.info("계약 상태 업데이트 요청: contractId={}, status={}", contractId, status);
        return ResponseEntity.ok(contractService.updateContractStatus(contractId, status));
    }

    // ✅ 계약 취소 (CANCELLED 상태로 변경)
    @DeleteMapping("/{contractId}/cancel")
    public ResponseEntity<Void> cancelContract(@PathVariable Long contractId) {
        log.info("계약 취소 요청: contractId={}", contractId);
        contractService.cancelContract(contractId);
        return ResponseEntity.noContent().build();
    }

    // ✅ 계약서 내용 저장 (대출자 또는 출자자) - 🔴 `@RequestBody` 사용
    @PostMapping("/{contractId}/content")
    public ResponseEntity<ContractDTO> saveContractContent(@PathVariable Long contractId,
                                                           @RequestBody Map<String, String> requestBody) {
        String userId = requestBody.get("userId");
        String content = requestBody.get("content");
        boolean isLender = Boolean.parseBoolean(requestBody.get("isLender"));

        log.info("계약서 저장 요청: contractId={}, userId={}, isLender={}", contractId, userId, isLender);

        ContractDTO updatedContract = contractService.saveContractContent(contractId, userId, content, isLender);
        return ResponseEntity.ok(updatedContract);
    }

    // ✅ 계약서 내용 조회 (대출자 또는 출자자)
    @GetMapping("/{contractId}/content/{userId}")
    public ResponseEntity<String> getContractContent(@PathVariable Long contractId,
                                                     @PathVariable String userId,
                                                     @RequestParam boolean isLender) {
        String contractContent = contractService.getContractContent(contractId, userId, isLender);
        return ResponseEntity.ok(contractContent);
    }
}
