package com.moneybridge.service.post;

import com.moneybridge.dto.post.CommentSelectionResponseDTO;
import com.moneybridge.dto.post.PostCommentDTO;

import java.util.List;

public interface PostCommentService {
   //댓글작성
    PostCommentDTO createComment(PostCommentDTO dto);

   //댓글조회
    PostCommentDTO getCommentById(Long id);

    //특정게시글의 모든 댓글 조회
    List<PostCommentDTO> getCommentsByPostId(Long postId);

   //댓글수정
    PostCommentDTO updateComment(Long id, PostCommentDTO dto);

   //댓글삭제
    void deleteComment(Long id);

   //출자자가특정 댓글 선택
//    PostCommentDTO selectComment(Long postId, Long commentId);
   CommentSelectionResponseDTO selectComment(Long postId, Long commentId, String lenderId);

    //거래 성립 후 거래 페이지로 이동
    PostCommentDTO confirmTransaction(Long commentId);
}
