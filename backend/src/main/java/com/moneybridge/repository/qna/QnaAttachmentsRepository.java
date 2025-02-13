//package com.moneybridge.repository.qna;
//
//import com.moneybridge.domain.qna.Qna;
//import com.moneybridge.domain.qna.QnaAttachment;
//import org.springframework.data.jpa.repository.JpaRepository;
//import org.springframework.data.jpa.repository.Modifying;
//import org.springframework.data.jpa.repository.Query;
//import org.springframework.data.repository.query.Param;
//import org.springframework.stereotype.Repository;
//
//import java.util.List;
//
//@Repository
//public interface QnaAttachmentsRepository extends JpaRepository<QnaAttachment, Long> {
//
//    // QnA 번호(qno)로 첨부파일 조회
//    List<QnaAttachment> findByQna(Qna qna);
//
//    // QnA 번호와 파일 타입으로 첨부파일 조회
//    List<QnaAttachment> findByQnaAndFileType(Qna qna, String fileType);
//
//    @Modifying
//    @Query("DELETE FROM QnaAttachment qa WHERE qa.qna = :qna")
//    void deleteByQna(@Param("qna") Qna qna);
//
//
//    // Qna의 qno와 파일 타입으로 첨부파일 조회 (수정)
//    List<QnaAttachment> findByQna_QnoAndFileType(Long qno, String fileType);
//}