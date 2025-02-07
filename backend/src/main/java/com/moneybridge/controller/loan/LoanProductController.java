package com.moneybridge.controller.loan;

import com.moneybridge.domain.loan.LoanProduct;
import com.moneybridge.service.loan.LoanProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/loan-products")
@RequiredArgsConstructor
public class LoanProductController {

    private final LoanProductService loanProductService;

    // 1️⃣ 전체 대출 상품 조회 (DB에서 불러오기)
    @GetMapping
    public ResponseEntity<List<LoanProduct>> getAllLoanProducts() {
        List<LoanProduct> loanProducts = loanProductService.getAllLoanProducts();
        System.out.println("✅ DB에서 가져온 데이터: " + loanProducts);
        return ResponseEntity.ok(loanProducts);
    }

    // 2️⃣ 특정 상품 코드로 대출 상품 조회
    @GetMapping("/{finPrdtCd}")
    public ResponseEntity<LoanProduct> getLoanProductByCode(@PathVariable String finPrdtCd) {
        return loanProductService.getLoanProductByCode(finPrdtCd)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}
