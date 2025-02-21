package com.moneybridge.controller.qna;

import com.moneybridge.dto.qna.QnaCommentDTO;
import com.moneybridge.service.qna.QnaCommentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/qna/comment")
public class QnaCommentController {

    private final QnaCommentService qnaCommentService;

    // 댓글 추가
    @PostMapping("/register")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<QnaCommentDTO> addComment(@RequestBody QnaCommentDTO dto) {
        QnaCommentDTO savedComment = qnaCommentService.addComment(dto);
        return ResponseEntity.ok(savedComment);
    }

    // QnA 댓글 조회
    @GetMapping("/{qno}")
    public ResponseEntity<List<QnaCommentDTO>> getCommentsByQna(@PathVariable Long qno) {
        List<QnaCommentDTO> comments = qnaCommentService.getCommentsByQna(qno);
        return ResponseEntity.ok(comments);
    }

    // 댓글 수정
    @PutMapping("/{qcno}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<QnaCommentDTO> updateComment(
            @PathVariable Long qcno, @RequestBody QnaCommentDTO dto) {
        QnaCommentDTO updatedComment = qnaCommentService.updateComment(qcno, dto);
        return ResponseEntity.ok(updatedComment);
    }

    // 댓글 삭제
    @DeleteMapping("/{qcno}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteComment(@PathVariable Long qcno) {
        qnaCommentService.deleteComment(qcno);
        return ResponseEntity.noContent().build();
    }
}