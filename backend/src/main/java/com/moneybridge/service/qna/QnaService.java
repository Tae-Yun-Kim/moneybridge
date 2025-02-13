//package com.moneybridge.service.qna;
//
//import com.moneybridge.dto.PageRequestDTO;
//import com.moneybridge.dto.PageResponseDTO;
//import com.moneybridge.dto.qna.QnaDTO;
//
//import java.util.List;
//
//public interface QnaService {
//
//    // QnA 게시글 등록
//    Long register(QnaDTO qnaDTO);
//
//    // 특정 QnA 게시글 조회
//    QnaDTO getQna(Long qno);
//
//    // QnA 게시글 수정
//    void modify(QnaDTO qnaDTO);
//
//    // QnA 게시글 삭제
//    void remove(Long qno);
//
//    // 비밀글 여부와 권한에 따른 QnA 게시글 목록 조회
//    PageResponseDTO<QnaDTO> getQnaListBySecretStatus(PageRequestDTO pageRequestDTO, String id, String role);
//
//    List<QnaDTO> getAllPosts();
//
//    // QnA 게시글 조회수 증가
//    void increaseViewCount(Long qno);
//
//    // 카테고리별 QnA 조회
//    List<QnaDTO> getQnaByCategory(String category);
//
//}