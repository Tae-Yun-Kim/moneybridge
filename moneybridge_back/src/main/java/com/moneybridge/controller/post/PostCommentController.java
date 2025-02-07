package com.moneybridge.controller.post;

import com.moneybridge.dto.post.CommentSelectionResponseDTO;
import com.moneybridge.dto.post.ContractDTO;
import com.moneybridge.dto.post.PostCommentDTO;
import com.moneybridge.service.post.PostCommentService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Slf4j
@RestController
@RequestMapping("/api/post")
@RequiredArgsConstructor
public class PostCommentController {

    private final PostCommentService postCommentService;

    // 댓글 작성
    @PostMapping("/{postId}/comments")
    public ResponseEntity<PostCommentDTO> createComment(@PathVariable Long postId,
                                                        @RequestBody PostCommentDTO dto) {
        // 요청으로 받은 postId를 로그로 출력
        log.info("Received request to create comment for post ID: {}", postId);

        // DTO에 postId를 설정
        dto.setPostId(postId);

        // PostCommentService를 호출하여 댓글 생성
        PostCommentDTO createdComment = postCommentService.createComment(dto);

        // 생성된 댓글 정보를 반환
        return ResponseEntity.ok(createdComment);
    }

    // 특정 댓글 조회
    @GetMapping("/comments/{commentId}")
    public ResponseEntity<PostCommentDTO> getCommentById(@PathVariable Long commentId) {
        // 요청으로 받은 commentId를 로그로 출력
        log.info("Received request to fetch comment by ID: {}", commentId);

        // PostCommentService를 호출하여 댓글 조회
        PostCommentDTO comment = postCommentService.getCommentById(commentId);

        // 조회된 댓글 정보를 반환
        return ResponseEntity.ok(comment);
    }

    // 특정 게시글의 모든 댓글 조회
    @GetMapping("/{postId}/comments")
    public ResponseEntity<List<PostCommentDTO>> getCommentsByPostId(@PathVariable Long postId) {
        // 요청으로 받은 postId를 로그로 출력
        log.info("Received request to fetch comments for post ID: {}", postId);

        // PostCommentService를 호출하여 댓글 목록 조회
        List<PostCommentDTO> comments = postCommentService.getCommentsByPostId(postId);

        // 조회된 댓글 목록을 반환
        return ResponseEntity.ok(comments);
    }

    // 댓글 수정
    @PutMapping("/comments/{commentId}")
    public ResponseEntity<PostCommentDTO> updateComment(@PathVariable Long commentId,
                                                        @RequestBody PostCommentDTO dto) {
        // 요청으로 받은 commentId를 로그로 출력
        log.info("Received request to update comment ID: {}", commentId);

        // PostCommentService를 호출하여 댓글 수정
        PostCommentDTO updatedComment = postCommentService.updateComment(commentId, dto);

        // 수정된 댓글 정보를 반환
        return ResponseEntity.ok(updatedComment);
    }

    // 댓글 삭제
    @DeleteMapping("/comments/{commentId}")
    public ResponseEntity<Void> deleteComment(@PathVariable Long commentId) {
        // 요청으로 받은 commentId를 로그로 출력
        log.info("Received request to delete comment ID: {}", commentId);

        // PostCommentService를 호출하여 댓글 삭제
        postCommentService.deleteComment(commentId);

        // 삭제 완료 응답 반환 (204 No Content)
        return ResponseEntity.noContent().build();
    }

    // ✅ 출자자가 댓글을 선택하면 계약까지 자동 생성됨
    @PostMapping("/{postId}/comments/{commentId}/select-comment/{lenderId}")
    public ResponseEntity<CommentSelectionResponseDTO> selectComment(@PathVariable Long postId,
                                                                     @PathVariable Long commentId,
                                                                     @PathVariable String lenderId) {
        log.info("Received request to select comment ID: {} for post ID: {} by lender ID: {}", commentId, postId, lenderId);

        // ✅ 댓글 선택과 동시에 계약이 생성되므로, 이를 하나의 DTO로 반환
        CommentSelectionResponseDTO response = postCommentService.selectComment(postId, commentId, lenderId);

        return ResponseEntity.ok(response);
    }

}
