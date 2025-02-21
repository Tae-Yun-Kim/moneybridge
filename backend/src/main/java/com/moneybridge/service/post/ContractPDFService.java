//package com.moneybridge.service.post;
//
//import com.itextpdf.html2pdf.HtmlConverter;
//import org.springframework.stereotype.Service;
//import java.io.File;
//import java.io.FileOutputStream;
//import java.io.IOException;
//
//@Service
//public class ContractPDFService {
//
//    // ✅ 고정된 PDF 저장 경로 (Windows 절대 경로)
//    private static final String UPLOAD_DIR = "C:\\Users\\EZEN\\Desktop\\moneybridge_back\\upload";
//
//    public void generateContractPDF(String contractHtml, String fileName) {
//        try {
//            // ✅ 저장할 파일 경로 설정
//            File uploadDir = new File(UPLOAD_DIR);
//            if (!uploadDir.exists()) {
//                boolean created = uploadDir.mkdirs();
//                if (!created) {
//                    throw new RuntimeException("PDF 저장 폴더 생성 실패: " + uploadDir.getAbsolutePath());
//                }
//            }
//
//            File pdfFile = new File(uploadDir, fileName);
//
//            // ✅ PDF 변환 실행
//            try (FileOutputStream fos = new FileOutputStream(pdfFile)) {
//                HtmlConverter.convertToPdf(contractHtml, fos);
//            }
//
//        } catch (IOException e) {
//            throw new RuntimeException("PDF 변환 중 오류 발생", e);
//        }
//    }
//
//    // ✅ PDF 파일 경로 반환 메서드 추가
//    public String getPDFFilePath(String fileName) {
//        return UPLOAD_DIR + File.separator + fileName;
//    }
//}
//package com.moneybridge.service.post;
//
//import com.itextpdf.html2pdf.ConverterProperties;
//import com.itextpdf.html2pdf.HtmlConverter;
//import com.itextpdf.layout.font.FontProvider;
//import org.springframework.stereotype.Service;
//
//import java.io.File;
//import java.io.FileOutputStream;
//import java.io.IOException;
//
//@Service
//public class ContractPDFService {
//
//    private static final String UPLOAD_DIR = "C:\\Users\\EZEN\\Desktop\\moneybridge_back\\upload";
//
//    public void generateContractPDF(String contractHtml, String fileName) {
//        try {
//            File uploadDir = new File(UPLOAD_DIR);
//            if (!uploadDir.exists() && !uploadDir.mkdirs()) {
//                throw new RuntimeException("PDF 저장 폴더 생성 실패: " + uploadDir.getAbsolutePath());
//            }
//
//            File pdfFile = new File(uploadDir, fileName);
//
//            try (FileOutputStream fos = new FileOutputStream(pdfFile)) {
//                ConverterProperties properties = new ConverterProperties();
//
//                // ✅ iText Asian 폰트 대신 직접 폰트 파일 사용
//                String fontPath = "src/main/resources/fonts/NotoSansCJKkr-Regular.otf";
//                File fontFile = new File(fontPath);
//                if (!fontFile.exists()) {
//                    throw new RuntimeException("한글 폰트 파일이 없습니다. 경로를 확인하세요: " + fontPath);
//                }
//
//                FontProvider fontProvider = new FontProvider();
//                fontProvider.addFont(fontPath);
//                properties.setFontProvider(fontProvider);
//
//                HtmlConverter.convertToPdf(contractHtml, fos, properties);
//            }
//        } catch (IOException e) {
//            throw new RuntimeException("PDF 변환 중 오류 발생", e);
//        }
//    }
//
//    public String getPDFFilePath(String fileName) {
//        return UPLOAD_DIR + File.separator + fileName;
//    }
//}
package com.moneybridge.service.post;

import com.itextpdf.html2pdf.ConverterProperties;
import com.itextpdf.html2pdf.HtmlConverter;
import com.itextpdf.layout.font.FontProvider;
import org.springframework.stereotype.Service;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;

@Service
public class ContractPDFService {

    private static final String UPLOAD_DIR = "C:\\Users\\EZEN\\Desktop\\moneybridge_back\\upload";

    public void generateContractPDF(String contractHtml, String fileName) {
        try {
            File uploadDir = new File(UPLOAD_DIR);
            if (!uploadDir.exists() && !uploadDir.mkdirs()) {
                throw new RuntimeException("PDF 저장 폴더 생성 실패: " + uploadDir.getAbsolutePath());
            }

            File pdfFile = new File(uploadDir, fileName);

            try (FileOutputStream fos = new FileOutputStream(pdfFile)) {
                ConverterProperties properties = new ConverterProperties();

                // 🚨 폰트 경로 및 파일명 조정 (다운로드된 파일 반영)
                String fontPath = "src/main/resources/fonts/NotoSansKR-VariableFont_wght.ttf";
                File fontFile = new File(fontPath);
                if (!fontFile.exists()) {
                    System.err.println("⚠️ 폰트 파일을 찾을 수 없습니다. 현재 경로 확인: " + fontFile.getAbsolutePath());
                    throw new RuntimeException("한글 폰트 파일이 없습니다. 경로를 확인하세요: " + fontFile.getAbsolutePath());
                }

                FontProvider fontProvider = new FontProvider();
                fontProvider.addFont(fontPath);
                properties.setFontProvider(fontProvider);

                HtmlConverter.convertToPdf(contractHtml, fos, properties);
                System.out.println("✅ PDF 생성 완료: " + pdfFile.getAbsolutePath());
            }
        } catch (IOException e) {
            throw new RuntimeException("PDF 변환 중 오류 발생", e);
        }
    }

    public String getPDFFilePath(String fileName) {
        return UPLOAD_DIR + File.separator + fileName;
    }
}
