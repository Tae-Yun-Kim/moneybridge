package com.moneybridge.service.post;

import com.moneybridge.dto.post.CommentSelectionResponseDTO;
import com.moneybridge.dto.post.ContractDTO;
import com.moneybridge.dto.post.PostCommentDTO;

import java.util.List;

public interface PostCommentService {
    // 댓글 작성
    PostCommentDTO createComment(PostCommentDTO dto);

    // 특정 댓글 조회
    PostCommentDTO getCommentById(Long id);

    // 특정 게시글의 모든 댓글 조회
    List<PostCommentDTO> getCommentsByPostId(Long postId);

    // 댓글 수정
    PostCommentDTO updateComment(Long id, PostCommentDTO dto);

    // 댓글 삭제
    void deleteComment(Long id);

    //댓글 선택
    CommentSelectionResponseDTO selectComment(Long postId, Long commentId, String lenderId);


}
