package com.moneybridge.repository;

import com.back.domain.LoanProduct;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest
public class LoanProductServiceTests {

    @Autowired
    private LoanProductService loanProductService;

    @Test
    public void testFetchAndSaveLoanProduct() {
        String apiUrl = "https://finlife.fss.or.kr/finlifeapi/creditLoanProductsSearch.json?auth=5f455051e1f1a62029a6e23556c16c59&topFinGrpNo=020000&pageNo=1";

        List<LoanProduct> savedProducts = loanProductService.fetchAndSaveProducts(apiUrl);

        assertThat(savedProducts).isNotEmpty();

        // 첫 번째 상품에 대한 상세 검증
        LoanProduct firstProduct = savedProducts.get(0);
        assertThat(firstProduct.getFinPrdtCd()).isNotNull();
        assertThat(firstProduct.getCrdtPrdtType()).isNotNull();
        assertThat(firstProduct.getCrdtGradAvg()).isNotNull();
        assertThat(firstProduct.getKorCoNm()).isNotNull();
        assertThat(firstProduct.getFinPrdtNm()).isNotNull();
    }
}
