package com.moneybridge.service.post;

import com.moneybridge.domain.post.Contract;
import org.springframework.stereotype.Service;

import java.time.format.DateTimeFormatter;

@Service
public class ContractDocumentService {

//    public String generateContractDocument(Contract contract) {
//        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");
//
//        return """
//            <!DOCTYPE html>
//            <html lang="ko">
//            <head>
//                <meta charset="UTF-8">
//                <meta name="viewport" content="width=device-width, initial-scale=1.0">
//                <title>대출 계약서</title>
//                <style>
//                    body { font-family: Arial, sans-serif; font-size: 16px; line-height: 1.6; padding: 20px; }
//                    h1 { text-align: center; font-size: 24px; font-weight: bold; }
//                    .contract-section { margin-bottom: 20px; }
//                    .contract-section h2 { font-size: 20px; color: #333; border-bottom: 2px solid #ddd; padding-bottom: 5px; }
//                    .contract-section p { margin: 5px 0; }
//                    .highlight { font-weight: bold; color: #d9534f; }
//                </style>
//            </head>
//            <body>
//                <h1>📜 대출 계약서</h1>
//
//                <div class="contract-section">
//                    <h2>계약 정보</h2>
//                    <p><strong>계약서 작성 날짜:</strong> %s</p>
//                    <p><strong>계약 ID:</strong> %d</p>
//                </div>
//
//                <div class="contract-section">
//                    <h2>계약 당사자 정보</h2>
//                    <p class="highlight">[대출자]</p>
//                    <p>이름: %s</p>
//                    <p>주민등록번호: %s</p>
//                    <p>연락처: %s</p>
//                    <p>이메일: %s</p>
//                    <p>주소: %s</p>
//
//                    <p class="highlight">[출자자]</p>
//                    <p>이름: %s</p>
//                    <p>주민등록번호: %s</p>
//                    <p>연락처: %s</p>
//                    <p>이메일: %s</p>
//                    <p>주소: %s</p>
//                </div>
//
//                <div class="contract-section">
//                    <h2>대출 상세 정보</h2>
//                    <p><strong>대출 금액:</strong> %,d 원</p>
//                    <p><strong>대출 신청 게시글 ID:</strong> %d</p>
//                    <p><strong>상환 기간:</strong> %d 개월</p>
//                    <p><strong>적용 금리:</strong> %.2f%%</p>
//                    <p><strong>총 상환 금액:</strong> %,d 원</p>
//                    <p><strong>상환 방식:</strong> 원리금 균등상환</p>
//                    <p><strong>상환 기한:</strong> %s</p>
//                </div>
//
//                <div class="contract-section">
//                    <h2>상환 조건</h2>
//                    <p><strong>월 상환금:</strong> %,d 원</p>
//                    <p><strong>연체 이자율:</strong> 기본 이자율 + 5%%</p>
//                    <p><strong>상환 연체 시 불이익:</strong></p>
//                    <ul>
//                        <li>30일 연체 시 계약 해지 가능</li>
//                        <li>법적 대응 및 신용 등급 하락 가능</li>
//                    </ul>
//                </div>
//
//            </body>
//            </html>
//        """.formatted(
//                contract.getCreatedAt().format(formatter),
//                contract.getId(),
//                contract.getBorrower().getName(),
//                contract.getBorrower().getResidentNumber(),
//                contract.getBorrower().getPhoneNumber(),
//                contract.getBorrower().getEmail(),
//                contract.getBorrower().getAddress(),
//                contract.getLender().getName(),
//                contract.getLender().getResidentNumber(),
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
public String generateContractDocument(Contract contract) {
    DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");

    // 🔍 1️⃣ 연장 여부 판별
    String repaymentLabel = contract.getExtensionRequestCount() > 0
            ? "상환 기간 (연장 반영)"
            : "상환 기간";

    return """
        <!DOCTYPE html>
        <html lang="ko">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>대출 계약서</title>
            <style>
                body { font-family: Arial, sans-serif; font-size: 16px; line-height: 1.6; padding: 20px; }
                h1 { text-align: center; font-size: 24px; font-weight: bold; }
                .contract-section { margin-bottom: 20px; }
                .contract-section h2 { font-size: 20px; color: #333; border-bottom: 2px solid #ddd; padding-bottom: 5px; }
                .contract-section p { margin: 5px 0; }
                .highlight { font-weight: bold; color: #d9534f; }
            </style>
        </head>
        <body>
            <h1>📜 대출 계약서</h1>

            <div class="contract-section">
                <h2>계약 정보</h2>
                <p><strong>계약서 작성 날짜:</strong> %s</p>
                <p><strong>계약 ID:</strong> %d</p>
            </div>

            <div class="contract-section">
                <h2>계약 당사자 정보</h2>
                <p class="highlight">[대출자]</p>
                <p>이름: %s</p>
                <p>주민등록번호: %s</p>
                <p>연락처: %s</p>
                <p>이메일: %s</p>
                <p>주소: %s</p>

                <p class="highlight">[출자자]</p>
                <p>이름: %s</p>
                <p>주민등록번호: %s</p>
                <p>연락처: %s</p>
                <p>이메일: %s</p>
                <p>주소: %s</p>
            </div>

            <div class="contract-section">
                <h2>대출 상세 정보</h2>
                <p><strong>대출 금액:</strong> %,d 원</p>
                <p><strong>대출 신청 게시글 ID:</strong> %d</p>
                <p><strong>%s:</strong> %d 개월</p>
                <p><strong>적용 금리:</strong> %.2f%%</p>
                <p><strong>총 상환 금액:</strong> %,d 원</p>
                <p><strong>상환 방식:</strong> 원리금 균등상환</p>
                <p><strong>상환 기한:</strong> %s</p>
            </div>

            <div class="contract-section">
                <h2>상환 조건</h2>
                <p><strong>월 상환금:</strong> %,d 원</p>
                <p><strong>연체 이자율:</strong> 기본 이자율 + 5%%</p>
                <p><strong>상환 연체 시 불이익:</strong></p>
                <ul>
                    <li>30일 연체 시 계약 해지 가능</li>
                    <li>법적 대응 및 신용 등급 하락 가능</li>
                </ul>
            </div>

        </body>
        </html>
    """.formatted(
            contract.getCreatedAt().format(formatter),
            contract.getId(),
            contract.getBorrower().getName(),
            contract.getBorrower().getResidentNumber(),
            contract.getBorrower().getPhoneNumber(),
            contract.getBorrower().getEmail(),
            contract.getBorrower().getAddress(),
            contract.getLender().getName(),
            contract.getLender().getResidentNumber(),
            contract.getLender().getPhoneNumber(),
            contract.getLender().getEmail(),
            contract.getLender().getAddress(),
            contract.getLoanAmount(),
            contract.getLoanPost().getId(),
            repaymentLabel, // 🔑 변경된 라벨 적용
            contract.getRepaymentPeriod(),
            contract.getInterestRate(),
            contract.getTotalRepaymentAmount(),
            contract.getCreatedAt().plusMonths(contract.getRepaymentPeriod()).format(formatter),
            (contract.getTotalRepaymentAmount() / contract.getRepaymentPeriod())
    );
}

}
