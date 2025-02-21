package com.moneybridge.dto.post;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CommentSelectionResponseDTO {
    private PostCommentDTO postComment; // 댓글 정보
    private ContractDTO contract; // 생성된 계약 정보
}
