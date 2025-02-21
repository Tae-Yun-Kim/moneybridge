package com.moneybridge.controller.post;

import com.moneybridge.domain.post.ContractStatus;
import com.moneybridge.dto.post.ContractDTO;
import com.moneybridge.service.post.ContractService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.File;
import java.net.MalformedURLException;
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

    @PostMapping("/download")
    public ResponseEntity<Resource> downloadContractPDF(@RequestBody ContractDTO contractDTO) {
        log.info("📥 PDF 다운로드 요청: contractId={}, userId={}, isLender={}",
                contractDTO.getContractId(),
                contractDTO.getUserId(),
                contractDTO.getIsLender());

        // PDF 파일 경로 생성
        String filePath = contractService.generateContractPDF(
                contractDTO.getContractId(),
                contractDTO.getUserId(),
                contractDTO.getIsLender());

        File file = new File(filePath);

        if (!file.exists()) {
            log.error("❌ PDF 파일이 존재하지 않음: {}", filePath);
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }

        try {
            Resource resource = new UrlResource(file.toURI());

            // ✅ 필수 헤더 추가 (content-disposition)
            String fileName = file.getName();
            String contentDisposition = "attachment; filename=\"" + fileName + "\"";

            return ResponseEntity.ok()
                    .header(HttpHeaders.CONTENT_DISPOSITION, contentDisposition) // 필수 헤더 추가
                    .contentType(MediaType.APPLICATION_PDF)
                    .body(resource);
        } catch (MalformedURLException e) {
            log.error("❌ 파일 URL 변환 실패", e);
            throw new RuntimeException("파일 URL 변환 실패", e);
        }
    }

    // ✅ 계약서 내용 조회 (대출자 또는 출자자)
    @GetMapping("/{contractId}/content/{userId}")
    public ResponseEntity<String> getContractContent(
            @PathVariable Long contractId,
            @PathVariable String userId,
            @RequestParam boolean isLender) {

        String contractContent = contractService.getContractContent(contractId, userId, isLender);

        if (contractContent == null || contractContent.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NO_CONTENT).body("계약서 내용이 없습니다.");
        }

        return ResponseEntity.ok(contractContent);
    }

    @PutMapping("/{contractId}/soft-delete/{userId}")
    public ResponseEntity<Void> softDeleteContract(@PathVariable Long contractId, @PathVariable String userId) {
        log.info("사용자가 계약을 삭제 요청함: contractId={}, userId={}", contractId, userId);
        contractService.softDeleteContract(contractId, userId);
        return ResponseEntity.noContent().build();
    }


    // ✅ 자동 상환 엔드포인트
    @PostMapping("/{contractId}/repay")
    public ResponseEntity<ContractDTO> repayLoanAutomatically(
            @PathVariable Long contractId,
            @RequestParam String borrowerId) {

        ContractDTO updatedContract = contractService.repayLoanAutomatically(contractId, borrowerId);
        return ResponseEntity.ok(updatedContract);
    }

    // ✅ 대출자의 연장 요청 생성 (연장 요청은 최대 2회)
    @PostMapping("/{contractId}/extend")
    public ResponseEntity<String> requestRepaymentExtension(
            @PathVariable Long contractId,
            @RequestParam int additionalMonths,
            @RequestParam String borrowerId
    ) {
        log.info("🔔 연장 요청 생성: contractId={}, 추가 개월 수={}, borrowerId={}", contractId, additionalMonths, borrowerId);
        try {
            contractService.requestRepaymentExtension(contractId, additionalMonths, borrowerId);
            return ResponseEntity.ok("✅ 연장 요청이 성공적으로 접수되었습니다. (승인 대기 중)");
        } catch (IllegalArgumentException e) {
            log.warn("⚠️ [잘못된 요청] 연장 요청 실패: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("❌ 연장 요청 실패: " + e.getMessage());
        } catch (IllegalStateException e) {
            log.warn("⚠️ [비정상 상태] 연장 요청 실패: {}", e.getMessage());
            if (e.getMessage().contains("최대 2회까지만")) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("❌ 연장 요청 실패: 이미 최대 2회 연장을 완료했습니다.");
            } else if (e.getMessage().contains("진행 중")) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("❌ 연장 요청 실패: 이미 연장 요청이 진행 중입니다.");
            } else {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("⚠️ 연장 요청이 불가한 상태입니다.");
            }
        } catch (Exception e) {
            log.error("💥 [서버 오류] 연장 요청 중 알 수 없는 오류 발생", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("💥 서버 오류 발생: 잠시 후 다시 시도해주세요.");
        }
    }



    // ✅ 2️⃣ 출자자 - 상환 기간 연장 요청 승인
    @PostMapping("/{contractId}/extend/approve")
    public ResponseEntity<String> approveRepaymentExtension(
            @PathVariable Long contractId,
            @RequestParam String lenderId
    ) {
        log.info("✅ 상환 기간 연장 요청 승인 요청: contractId={}, lenderId={}", contractId, lenderId);

        try {
            // 🔹 상환 연장 요청 승인 로직 호출
            contractService.approveRepaymentExtension(contractId, lenderId);

            // 🔹 성공 응답 반환
            String successMessage = "✅ 상환 기간 연장 요청이 승인되었으며, 이자가 2배로 증가되었습니다.";
            log.info(successMessage);
            return ResponseEntity.ok(successMessage);

        } catch (IllegalArgumentException e) {
            log.error("❌ 요청 실패: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("❌ 요청 실패: " + e.getMessage());

        } catch (IllegalStateException e) {
            log.error("⚠️ 상태 오류: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("⚠️ 상태 오류: " + e.getMessage());

        } catch (Exception e) {
            log.error("💥 서버 오류 발생", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("💥 서버 오류 발생: " + e.getMessage());
        }
    }



    // ✅ 3️⃣ 출자자 - 상환 기간 연장 요청 거절
    @PostMapping("/{contractId}/extend/reject")
    public ResponseEntity<String> rejectRepaymentExtension(
            @PathVariable Long contractId,
            @RequestParam String lenderId
    ) {
        log.info("❌ 상환 기간 연장 요청 거절: contractId={}, lenderId={}", contractId, lenderId);
        try {
            contractService.rejectRepaymentExtension(contractId, lenderId);
            return ResponseEntity.ok("❌ 상환 기간 연장 요청이 거절되었습니다.");
        } catch (IllegalArgumentException e) {
            log.error("❌ 요청 실패: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        } catch (IllegalStateException e) {
            log.error("⚠️ 상태 오류: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        } catch (Exception e) {
            log.error("💥 서버 오류 발생", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("서버 오류 발생");
        }
    }
}
