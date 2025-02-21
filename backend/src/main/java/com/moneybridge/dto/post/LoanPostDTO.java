package com.moneybridge.dto.post;

import com.moneybridge.domain.member.MemberGrade;
import lombok.*;

import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LoanPostDTO {
    private Long id; // 게시글 ID
    private String title;
    private Long loanAmount; // 대출 금액
    private Integer repaymentPeriod; // 상환 기간 (개월 단위)
    private String additionalConditions; // 추가 조건
    private LocalDateTime createdAt; // 생성일
    private LocalDateTime updatedAt; // 수정일
    private List<PostCommentDTO> comments; // 댓글 리스트 추가
    private String writerId; // 작성자 ID 추가
    private List<MemberGrade> writerGrade; //작성자 등급 추가

    private String contractStatus; // 계약 상태 필드
}
