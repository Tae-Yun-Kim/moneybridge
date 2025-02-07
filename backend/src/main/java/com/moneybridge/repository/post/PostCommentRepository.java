package com.moneybridge.repository.post;

import com.moneybridge.domain.post.PostComment;
import com.moneybridge.dto.post.PostCommentDTO;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface PostCommentRepository extends JpaRepository<PostComment, Long> {
    // LoanPost ID로 모든 댓글 조회
    List<PostComment> findByPostId(Long postId);

    // 특정 LoanPost의 댓글 중 선택된 댓글 조회
    Optional<PostComment> findByPostIdAndIsSelectedTrue(Long postId);

    // LoanPost ID로 모든 댓글과 작성자의 ID, 등급, 이름, 댓글 세부 정보를 조회
    @Query("SELECT new com.moneybridge.dto.post.PostCommentDTO(" +
            "c.id, c.post.id, m.id, c.memberGrade, c.interestRate, c.commentText, c.isSelected, c.createdAt, c.updatedAt) " +
            "FROM PostComment c JOIN c.member m WHERE c.post.id = :postId")
    List<PostCommentDTO> findCommentsWithMemberDetailsByPostId(@Param("postId") Long postId);
}
