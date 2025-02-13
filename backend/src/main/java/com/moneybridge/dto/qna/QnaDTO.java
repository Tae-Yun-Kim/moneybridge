//package com.moneybridge.dto.qna;
//
//import com.fasterxml.jackson.annotation.JsonFormat;
//import lombok.AllArgsConstructor;
//import lombok.Builder;
//import lombok.Data;
//import lombok.NoArgsConstructor;
//import org.springframework.web.multipart.MultipartFile;
//
//import java.time.LocalDate;
//import java.util.List;
//
//@Data
//@Builder
//@AllArgsConstructor
//@NoArgsConstructor
//public class QnaDTO {
//
//    private Long qno;
//    private String qnaTitle;
//    private String qnaContent;
//    private String id;
//
//    private List<String> uploadFileNames; // 업로드된 파일 이름 목록
//    private List<String> imageFileNames;  // 이미지 파일 리스트
//    private List<MultipartFile> files;   // 클라이언트에서 전송한 파일
//    private Boolean isSecret = false;
//
//    public Boolean getIsSecret() {
//        return isSecret == null ? false : isSecret;
//    }
//
//    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd")
//    private LocalDate createdAt;
//
//    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd")
//    private LocalDate updatedAt;
//
//    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd")
//    private LocalDate regDate;
//
//    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd")
//    private LocalDate modDate;
//
//    private String category;
//
//    private Boolean complete;
//
//    public Boolean getComplete() {
//        return complete != null ? complete : false;
//    }
//
//    public void setComplete(Boolean complete) {
//        this.complete = complete;
//    }
//
//
//}
