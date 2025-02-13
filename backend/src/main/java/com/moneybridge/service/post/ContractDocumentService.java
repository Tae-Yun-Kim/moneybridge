//package com.moneybridge.service.post;
//
//import com.moneybridge.domain.post.Contract;
//import org.springframework.stereotype.Service;
//import java.time.format.DateTimeFormatter;
//
//@Service
//public class ContractDocumentService {
//
//    public String generateContractDocument(Contract contract) {
//        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");
//
//        return """
//            대출 계약서
//
//            계약서 작성 날짜: %s
//            계약 ID: %d
//
//            [계약 당사자 정보]
//
//            대출자 (Borrower)
//            이름: %s
//            주민등록번호: %s
//            연락처: %s
//            이메일: %s
//            주소: %s
//
//            출자자 (Lender)
//            이름: %s
//            주민등록번호: %s
//            연락처: %s
//            이메일: %s
//            주소: %s
//
//            [대출 상세 정보]
//            대출 금액: %,d 원
//            대출 신청 게시글 ID: %d
//            상환 기간: %d 개월
//            적용 금리: %.2f%%
//            총 상환 금액: %,d 원
//            상환 방식: 원리금 균등상환
//            상환 기한: %s
//
//            [상환 조건]
//            월 상환금: %,d 원
//            연체 이자율: 기본 이자율 + 5%%
//            상환 연체 시 불이익:
//            - 30일 연체 시 계약 해지 가능
//            - 법적 대응 및 신용 등급 하락 가능
//
//            [대출자 동의 사항]
//            본인은 본 계약의 대출 조건을 충분히 이해하고 동의합니다.
//            □ 연체 발생 시 연체 이자가 부과되며, 30일 이상 연체 시 계약이 해지될 수 있음에 동의합니다.
//            □ 연체가 지속될 경우 법적 대응이 가능하며, 신용 등급이 하락할 수 있음에 동의합니다.
//            □ 연체가 지속될 경우 모든 금융 거래(대출 및 출금 포함)가 일시 정지될 수 있음에 동의합니다.
//            □ 출자자가 추심을 요청할 경우, 법적 절차가 진행될 수 있음에 동의합니다.
//            □ 본 계약과 관련된 개인정보 제공 및 이용에 동의합니다.
//            □ 본 계약을 전자 계약으로 체결함을 인정하고 동의합니다.
//
//            [출자자 확인 사항]
//            본인은 대출자의 동의 내용을 확인하였으며, 본 계약의 모든 조건을 검토한 후 계약을 진행함에 동의합니다.
//
//        """.formatted(
//                contract.getCreatedAt().format(formatter),
//                contract.getId(),
//                contract.getBorrower().getName(),
//                maskResidentNumber(contract.getBorrower().getResidentNumber()),
//                contract.getBorrower().getPhoneNumber(),
//                contract.getBorrower().getEmail(),
//                contract.getBorrower().getAddress(),
//                contract.getLender().getName(),
//                maskResidentNumber(contract.getLender().getResidentNumber()),
//                contract.getLender().getPhoneNumber(),
//                contract.getLender().getEmail(),
//                contract.getLender().getAddress(),
//                contract.getLoanAmount(),
//                contract.getLoanPost().getId(),
//                contract.getRepaymentPeriod(),
//                contract.getInterestRate(),
//                contract.getTotalRepaymentAmount(),
//                contract.getCreatedAt().plusMonths(contract.getRepaymentPeriod()).format(formatter),
//                (contract.getTotalRepaymentAmount() / contract.getRepaymentPeriod())
//        );
//    }
//
//    private String maskResidentNumber(String residentNumber) {
//        if (residentNumber == null || residentNumber.length() < 6) {
//            return "*************";
//        }
//        return residentNumber.substring(0, 6) + "-*******";
//    }
//}
package com.moneybridge.service.post;

import com.moneybridge.domain.post.Contract;
import org.springframework.stereotype.Service;

import java.time.format.DateTimeFormatter;

@Service
public class ContractDocumentService {

    public String generateContractDocument(Contract contract) {
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");

        return """
            대출 계약서
            
            계약서 작성 날짜: %s
            계약 ID: %d
            
            [계약 당사자 정보]
            
            대출자 (Borrower)
            이름: %s
            주민등록번호: %s
            연락처: %s
            이메일: %s
            주소: %s
            
            출자자 (Lender)
            이름: %s
            주민등록번호: %s
            연락처: %s
            이메일: %s
            주소: %s
            
            [대출 상세 정보]
            대출 금액: %,d 원
            대출 신청 게시글 ID: %d
            상환 기간: %d 개월
            적용 금리: %.2f%%
            총 상환 금액: %,d 원
            상환 방식: 원리금 균등상환
            상환 기한: %s
            
            [상환 조건]
            월 상환금: %,d 원
            연체 이자율: 기본 이자율 + 5%%
            상환 연체 시 불이익:
            - 30일 연체 시 계약 해지 가능
            - 법적 대응 및 신용 등급 하락 가능
        """.formatted(
                contract.getCreatedAt().format(formatter),
                contract.getId(),
                contract.getBorrower().getName(),
                maskResidentNumber(contract.getBorrower().getResidentNumber()),
                contract.getBorrower().getPhoneNumber(),
                contract.getBorrower().getEmail(),
                contract.getBorrower().getAddress(),
                contract.getLender().getName(),
                maskResidentNumber(contract.getLender().getResidentNumber()),
                contract.getLender().getPhoneNumber(),
                contract.getLender().getEmail(),
                contract.getLender().getAddress(),
                contract.getLoanAmount(),
                contract.getLoanPost().getId(),
                contract.getRepaymentPeriod(),
                contract.getInterestRate(),
                contract.getTotalRepaymentAmount(),
                contract.getCreatedAt().plusMonths(contract.getRepaymentPeriod()).format(formatter),
                (contract.getTotalRepaymentAmount() / contract.getRepaymentPeriod())
        );
    }

    private String maskResidentNumber(String residentNumber) {
        if (residentNumber == null || residentNumber.length() < 6) {
            return "*************";
        }
        return residentNumber.substring(0, 6) + "-*******";
    }
}
