package com.moneybridge.dto.post;

import com.moneybridge.domain.member.Member;
import com.moneybridge.domain.post.PostComment;
import com.moneybridge.domain.member.MemberGrade;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PostCommentDTO {

    private Long id; // 댓글 ID
    private Long postId; // 게시글 ID
    private String memberId; // 댓글 작성자 ID
    private String lenderId; // ✅ 출자자 ID 추가
    private MemberGrade memberGrade; // 댓글 작성자의 기본 회원 등급
    private Double interestRate; // 제시 이자율
    private String commentText; // 댓글 내용
    private Boolean isSelected; // 출자자가 댓글을 선택했는지 여부
    private LocalDateTime createdAt; // 댓글 생성일
    private LocalDateTime updatedAt; // 댓글 수정일

    // 정적 변환 메서드
    public static PostCommentDTO toDTO(PostComment postComment) {
        Member member = postComment.getMember(); // 댓글 작성자
        Member lender = postComment.getLender(); // 출자자 추가

        return PostCommentDTO.builder()
                .id(postComment.getId())
                .postId(postComment.getPost().getId())
                .memberId(member != null ? member.getId() : null) // 작성자 ID 매핑
                .lenderId(lender != null ? lender.getId() : null) // ✅ 출자자 ID 매핑 (중복 제거)
                .memberGrade(member != null && !member.getMemberGradeList().isEmpty()
                        ? member.getMemberGradeList().get(0)
                        : null)
                .interestRate(postComment.getInterestRate())
                .commentText(postComment.getCommentText())
                .isSelected(postComment.getIsSelected() != null ? postComment.getIsSelected() : false) // null 방지
                .createdAt(postComment.getCreatedAt())
                .updatedAt(postComment.getUpdatedAt())
                .build();
    }


}
