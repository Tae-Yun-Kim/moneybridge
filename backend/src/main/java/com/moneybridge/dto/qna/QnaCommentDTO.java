//package com.moneybridge.dto.qna;
//
//import com.fasterxml.jackson.annotation.JsonFormat;
//import lombok.AllArgsConstructor;
//import lombok.Builder;
//import lombok.Getter;
//import lombok.Setter;
//
//import java.time.LocalDate;
//
//@Getter
//@Builder
//@Setter
//@AllArgsConstructor
//public class QnaCommentDTO {
//
//    private Long qcno; // 댓글 번호
//
//
//    private Long qno;
//
//    private String id; // 댓글 작성자
//
//    private String qnaCommentContent; // 댓글 내용
//
//    private boolean modified;
//
//    @JsonFormat(pattern = "yyyy-MM-dd")
//    private LocalDate regDate; // 댓글 작성일
//}