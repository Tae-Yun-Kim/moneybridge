package com.moneybridge.controller.post;

import com.moneybridge.dto.post.NotificationDTO;
import com.moneybridge.dto.post.LoanPostDTO;
import com.moneybridge.service.member.MemberService;
import com.moneybridge.service.post.NotificationService;
import com.moneybridge.service.post.LoanPostService;
import com.moneybridge.domain.member.Member;
import com.moneybridge.domain.post.LoanPost;  // LoanPost import
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.core.context.SecurityContextHolder;

import java.util.List;

@RestController
@RequestMapping("/api/notifications")
@RequiredArgsConstructor
public class NotificationController {
    private final NotificationService notificationService;
    private final LoanPostService loanPostService;
    private final MemberService memberService;

    // 알림 생성
    @PostMapping
    public ResponseEntity<NotificationDTO> createNotification(@RequestBody NotificationDTO notificationDTO) {
        return ResponseEntity.ok(notificationService.createNotification(notificationDTO));
    }

    // 특정 회원의 알림 목록 조회
    @GetMapping("/member/{memberId}")
    public ResponseEntity<List<NotificationDTO>> getMemberNotifications(@PathVariable String memberId) {
        return ResponseEntity.ok(notificationService.getMemberNotifications(memberId));
    }

    // 알림 삭제
    @DeleteMapping("/{notificationId}")
    public ResponseEntity<Void> deleteNotification(@PathVariable Long notificationId) {
        notificationService.deleteNotification(notificationId);
        return ResponseEntity.ok().build();
    }

    // 계약 대기 알림 생성
    @PostMapping("/contract-pending/{postId}")
    public ResponseEntity<Void> createContractPendingNotification(@PathVariable Long postId) {
        String currentUserId = SecurityContextHolder.getContext().getAuthentication().getName();
        Member member = memberService.findById(currentUserId);  // MemberService로 현재 사용자 조회
        LoanPostDTO postDTO = loanPostService.getLoanPostById(postId);  // LoanPostDTO로 게시글 조회
        LoanPost post = convertToLoanPost(postDTO);  // LoanPostDTO를 LoanPost로 변환
        notificationService.createContractPendingNotification(member, post);
        return ResponseEntity.ok().build();
    }

    // 대출자의 승인 대기 알림 생성
    @PostMapping("/approval-pending/{postId}")
    public ResponseEntity<Void> createApprovalPendingNotification(@PathVariable Long postId, @RequestBody String comment) {
        String currentUserId = SecurityContextHolder.getContext().getAuthentication().getName();
        Member member = memberService.findById(currentUserId);  // MemberService로 현재 사용자 조회
        LoanPostDTO postDTO = loanPostService.getLoanPostById(postId);  // LoanPostDTO로 게시글 조회
        LoanPost post = convertToLoanPost(postDTO);  // LoanPostDTO를 LoanPost로 변환
        notificationService.createApprovalPendingNotification(member, post, comment);
        return ResponseEntity.ok().build();
    }

    // 계약 진행 알림 생성
    @PostMapping("/contract-active/{postId}")
    public ResponseEntity<Void> createContractActiveNotification(@PathVariable Long postId) {
        String currentUserId = SecurityContextHolder.getContext().getAuthentication().getName();
        Member member = memberService.findById(currentUserId);  // MemberService로 현재 사용자 조회
        LoanPostDTO postDTO = loanPostService.getLoanPostById(postId);  // LoanPostDTO로 게시글 조회
        LoanPost post = convertToLoanPost(postDTO);  // LoanPostDTO를 LoanPost로 변환
        notificationService.createContractActiveNotification(member, post);
        return ResponseEntity.ok().build();
    }

    // 계약 완료 알림 생성 (상환 완료)
    @PostMapping("/contract-completed/{postId}")
    public ResponseEntity<Void> createContractCompletedNotification(@PathVariable Long postId) {
        String currentUserId = SecurityContextHolder.getContext().getAuthentication().getName();
        Member member = memberService.findById(currentUserId);  // MemberService로 현재 사용자 조회
        LoanPostDTO postDTO = loanPostService.getLoanPostById(postId);  // LoanPostDTO로 게시글 조회
        LoanPost post = convertToLoanPost(postDTO);  // LoanPostDTO를 LoanPost로 변환
        notificationService.createContractCompletedNotification(member, post);
        return ResponseEntity.ok().build();
    }

    // 계약 취소 알림 생성 (계약 삭제됨)
    @PostMapping("/contract-cancelled/{postId}")
    public ResponseEntity<Void> createContractCancelledNotification(@PathVariable Long postId) {
        String currentUserId = SecurityContextHolder.getContext().getAuthentication().getName();
        Member member = memberService.findById(currentUserId);  // MemberService로 현재 사용자 조회
        LoanPostDTO postDTO = loanPostService.getLoanPostById(postId);  // LoanPostDTO로 게시글 조회
        LoanPost post = convertToLoanPost(postDTO);  // LoanPostDTO를 LoanPost로 변환
        notificationService.createContractCancelledNotification(member, post);
        return ResponseEntity.ok().build();
    }

    // 채무자 -> 채권자 이체 알림 생성
    @PostMapping("/debtor-to-creditor/{postId}")
    public ResponseEntity<Void> createDebtorToCreditorNotification(@PathVariable Long postId, @RequestBody Double amount) {
        String currentUserId = SecurityContextHolder.getContext().getAuthentication().getName();
        Member member = memberService.findById(currentUserId);  // MemberService로 현재 사용자 조회
        LoanPostDTO postDTO = loanPostService.getLoanPostById(postId);  // LoanPostDTO로 게시글 조회
        LoanPost post = convertToLoanPost(postDTO);  // LoanPostDTO를 LoanPost로 변환
        notificationService.createDebtorToCreditorNotification(member, amount, post);
        return ResponseEntity.ok().build();
    }

    // 채권자 -> 채무자 이체 알림 생성
    @PostMapping("/creditor-to-debtor/{postId}")
    public ResponseEntity<Void> createCreditorToDebtorNotification(@PathVariable Long postId, @RequestBody Double amount) {
        String currentUserId = SecurityContextHolder.getContext().getAuthentication().getName();
        Member member = memberService.findById(currentUserId);  // MemberService로 현재 사용자 조회
        LoanPostDTO postDTO = loanPostService.getLoanPostById(postId);  // LoanPostDTO로 게시글 조회
        LoanPost post = convertToLoanPost(postDTO);  // LoanPostDTO를 LoanPost로 변환
        notificationService.createCreditorToDebtorNotification(member, amount, post);
        return ResponseEntity.ok().build();
    }

    // 연체 알림 생성
    @PostMapping("/overdue/{postId}")
    public ResponseEntity<Void> createOverdueNotification(@PathVariable Long postId) {
        String currentUserId = SecurityContextHolder.getContext().getAuthentication().getName();
        Member member = memberService.findById(currentUserId);  // MemberService로 현재 사용자 조회
        LoanPostDTO postDTO = loanPostService.getLoanPostById(postId);  // LoanPostDTO로 게시글 조회
        LoanPost post = convertToLoanPost(postDTO);  // LoanPostDTO를 LoanPost로 변환
        notificationService.createOverdueNotification(member, post);
        return ResponseEntity.ok().build();
    }

    // LoanPostDTO를 LoanPost로 변환하는 메서드
    private LoanPost convertToLoanPost(LoanPostDTO postDTO) {
        // LoanPostDTO에서 필요한 정보를 가져와 LoanPost 객체를 생성
        return new LoanPost(
                postDTO.getId(),  // 게시글 ID
                null,  // Member 엔터티는 작성자 정보를 가지고 오지 않아서 null로 설정 (나중에 Member 엔터티를 설정하는 방식으로 처리)
                postDTO.getLoanAmount(),  // 대출 금액
                postDTO.getRepaymentPeriod(),  // 상환 기간 (개월 단위)
                postDTO.getAdditionalConditions()  // 추가 조건
        );
    }
}
