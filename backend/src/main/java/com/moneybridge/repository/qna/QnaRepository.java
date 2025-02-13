//package com.moneybridge.repository.qna;
//
//import com.moneybridge.domain.qna.Qna;
//import org.springframework.data.domain.Page;
//import org.springframework.data.domain.Pageable;
//import org.springframework.data.jpa.repository.EntityGraph;
//import org.springframework.data.jpa.repository.JpaRepository;
//import org.springframework.data.jpa.repository.Query;
//import org.springframework.data.repository.query.Param;
//
//import java.util.List;
//import java.util.Optional;
//
//public interface QnaRepository extends JpaRepository<Qna, Long> {
//
//    List<Qna> findByCategory(String category);
//
//    // 특정 QnA 게시글을 조회하면서 해당 게시글에 관련된 첨부파일 목록도 함께 조회
//    @EntityGraph(attributePaths = "attachments") // 수정: imageList -> attachments
//    @Query("select q from Qna q where q.qno = :qno")
//    Optional<Qna> selectOne(@Param("qno") Long qno);
//
//    // 비밀글 여부에 따라, 작성자와 관리자만 조회할 수 있도록 처리
//    @Query("select q from Qna q " +
//            "where q.isSecret = false " +
//            "or q.member.id = :id " +
//            "or :role = 'ROLE_ADMIN'")
//    Page<Qna> findBySecretStatusAndRole(
//            @Param("id") String id,
//            @Param("role") String role,
//            Pageable pageable);
//
//    // 카테고리별 QnA 조회
//    @Query("select q from Qna q where q.category = :category")
//    Page<Qna> findByCategory(@Param("category") String category, Pageable pageable);
//
//    // 카테고리 + 비밀글 조건 + 작성자/관리자 조건 QnA 조회
//    @Query("select q from Qna q " +
//            "where q.category = :category " +
//            "and (q.isSecret = false " +
//            "or q.member.id = :id " +
//            "or :role = 'ROLE_ADMIN')")
//    Page<Qna> findByCategoryAndSecretStatusAndRole(
//            @Param("category") String category,
//            @Param("id") String id,
//            @Param("role") String role,
//            Pageable pageable);
//
//    @EntityGraph(attributePaths = "attachments") // 수정: imageList -> attachments
//    Optional<Qna> findById(Long qno);
//}