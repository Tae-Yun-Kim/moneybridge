package com.moneybridge.service.loan;

import com.moneybridge.domain.loan.LoanProduct;
import com.moneybridge.repository.loan.LoanProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestTemplate;

import java.util.*;

@Service
@RequiredArgsConstructor
public class LoanProductService {
    private final LoanProductRepository loanProductRepository;
//    private final RestTemplate restTemplate;

//    public LoanProductService(LoanProductRepository loanProductRepository, RestTemplate restTemplate) {
//        this.loanProductRepository = loanProductRepository;
////        this.restTemplate = restTemplate;
//    }

//    @Transactional
//    public List<LoanProduct> fetchAndSaveProducts(String apiUrl) {
//        Map<String, Object> response = restTemplate.getForObject(apiUrl, Map.class);
//        Map<String, Object> result = (Map<String, Object>) response.get("result");
//
//        List<Map<String, Object>> baseList = (List<Map<String, Object>>) result.get("baseList");
//        List<Map<String, Object>> optionList = (List<Map<String, Object>>) result.get("optionList");
//
//        // optionList에서 금리 정보를 찾아서 매핑
//        Map<String, Map<String, Object>> rateInfoMap = new HashMap<>();
//        for (Map<String, Object> option : optionList) {
//            String finPrdtCd = (String) option.get("fin_prdt_cd");
//            String lendRateType = (String) option.get("crdt_lend_rate_type");
//            if ("A".equals(lendRateType)) {
//                rateInfoMap.put(finPrdtCd, option);
//            }
//        }
//
//        List<LoanProduct> loanProducts = new ArrayList<>();
//        for (Map<String, Object> data : baseList) {
//            LoanProduct loanProduct = new LoanProduct();
//            String finPrdtCd = (String) data.get("fin_prdt_cd");
//
//            // 기본 정보 설정
//            loanProduct.setFinPrdtCd(finPrdtCd);
//            loanProduct.setDclsMonth((String) data.get("dcls_month"));
//            loanProduct.setFinCoNo((String) data.get("fin_co_no"));
//            loanProduct.setKorCoNm((String) data.get("kor_co_nm"));
//            loanProduct.setFinPrdtNm((String) data.get("fin_prdt_nm"));
//            loanProduct.setDclsStrtDay((String) data.get("dcls_strt_day"));
//            loanProduct.setDclsEndDay((String) data.get("dcls_end_day"));
//            loanProduct.setFinCoSubmDay((String) data.get("fin_co_subm_day"));
//            loanProduct.setCrdtPrdtType((String) data.get("crdt_prdt_type"));
//            loanProduct.setCrdtPrdtTypeNm((String) data.get("crdt_prdt_type_nm"));
//
//            // 금리 정보 설정
//            Map<String, Object> rateInfo = rateInfoMap.get(finPrdtCd);
//            if (rateInfo != null) {
//                loanProduct.setCrdtLendRateTypeNm((String) rateInfo.get("crdt_lend_rate_type_nm"));
//
//                Object avgRate = rateInfo.get("crdt_grad_avg");
//                if (avgRate != null) {
//                    if (avgRate instanceof Number) {
//                        loanProduct.setCrdtGradAvg(((Number) avgRate).doubleValue());
//                    }
//                }
//            }
//            loanProducts.add(loanProduct);
//        }
//
//        return loanProductRepository.saveAll(loanProducts);
//    }

    // 🔹 (1) 모든 대출 상품 조회
    @Transactional(readOnly = true)
    public List<LoanProduct> getAllLoanProducts() {
        return loanProductRepository.findAll();
    }

    // 🔹 (2) 특정 상품 코드로 대출 상품 조회
    @Transactional(readOnly = true)
    public Optional<LoanProduct> getLoanProductByCode(String finPrdtCd) {
        return loanProductRepository.findById(finPrdtCd);
    }
}