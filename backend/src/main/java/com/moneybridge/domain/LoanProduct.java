package com.moneybridge.domain;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "loan_product")
@Data
public class LoanProduct {

    @Id
    private String finPrdtCd; // 금융상품 코드 (PK)

    private String dclsMonth;          // 공시 제출월
    private String finCoNo;            // 금융회사 코드
    private String korCoNm;            // 금융회사명
    private String finPrdtNm;          // 금융상품명

    private String dclsStrtDay;        // 공시 시작일
    private String dclsEndDay;         // 공시 종료일
    private String finCoSubmDay;       // 금융회사 제출일

    private String crdtPrdtType;       // 대출종류 코드
    private String crdtPrdtTypeNm;     // 대출종류명
    private String crdtLendRateTypeNm; // 금리구분
    private Double crdtGradAvg;        // 평균 금리
}
