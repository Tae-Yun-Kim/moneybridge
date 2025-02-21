//package com.moneybridge.controller.post;
//
//import com.moneybridge.domain.member.Member;
//import com.moneybridge.domain.post.Contract;
//import com.moneybridge.domain.post.LoanPost;
//import com.moneybridge.dto.post.ContractDTO;
//import com.moneybridge.dto.post.LoanPostDTO;
//import com.moneybridge.dto.post.NotificationDTO;
//import com.moneybridge.repository.post.ContractRepository;
//import com.moneybridge.service.member.MemberService;
//import com.moneybridge.service.post.ContractService;
//import com.moneybridge.service.post.LoanPostService;
//import com.moneybridge.service.post.NotificationService;
//import lombok.RequiredArgsConstructor;
//import org.springframework.http.ResponseEntity;
//import org.springframework.security.core.context.SecurityContextHolder;
//import org.springframework.web.bind.annotation.*;
//
//import java.util.List;
//
//@RestController
//@RequestMapping("/api/notifications")
//@RequiredArgsConstructor
//public class NotificationController {
//    private final NotificationService notificationService;
//    private final LoanPostService loanPostService;
//    private final MemberService memberService;
//    private final ContractRepository contractRepository;
//
//    // ✅ 알림 생성 (redirectUrl 포함)
//    @PostMapping
//    public ResponseEntity<NotificationDTO> createNotification(@RequestBody NotificationDTO notificationDTO) {
//        NotificationDTO createdNotification = notificationService.createNotification(notificationDTO, notificationDTO.getMemberId());
//        return ResponseEntity.ok(createdNotification);
//    }
//
//    // ✅ 특정 회원의 알림 목록 조회 (redirectUrl 포함)
//    @GetMapping("/member/{memberId}")
//    public ResponseEntity<List<NotificationDTO>> getMemberNotifications(@PathVariable String memberId) {
//        List<NotificationDTO> notifications = notificationService.getMemberNotifications(memberId);
//        return ResponseEntity.ok(notifications);
//    }
//
//    // 알림 삭제
//    @DeleteMapping("/{notificationId}")
//    public ResponseEntity<Void> deleteNotification(@PathVariable Long notificationId) {
//        notificationService.deleteNotification(notificationId);
//        return ResponseEntity.ok().build();
//    }
//
//    // 출자자의 승인 대기 알림 생성(대출희망자가 댓글 달 때)
//    @PostMapping("/approval-pending/{postId}")
//    public ResponseEntity<Void> createApprovalPendingNotification(@PathVariable Long postId, @RequestBody String comment) {
//        String currentUserId = SecurityContextHolder.getContext().getAuthentication().getName();
//        Member member = memberService.findById(currentUserId);  // MemberService로 현재 사용자 조회
//        LoanPostDTO postDTO = loanPostService.getLoanPostById(postId);  // LoanPostDTO로 게시글 조회
//        LoanPost post = convertToLoanPost(postDTO);  // LoanPostDTO를 LoanPost로 변환
//        notificationService.createApprovalPendingNotification(member, post, comment);
//        return ResponseEntity.ok().build();
//    }
//
//    // 대출희망자의 승인 대기 알림 생성(출자자가 댓글 선택할 때)
//    @PostMapping("/contract-pending/{postId}")
//    public ResponseEntity<Void> createContractPendingNotification(@PathVariable Long postId) {
//        String currentUserId = SecurityContextHolder.getContext().getAuthentication().getName();
//        Member member = memberService.findById(currentUserId);  // MemberService로 현재 사용자 조회
//        LoanPostDTO postDTO = loanPostService.getLoanPostById(postId);  // LoanPostDTO로 게시글 조회
//        LoanPost post = convertToLoanPost(postDTO);  // LoanPostDTO를 LoanPost로 변환
//        notificationService.createContractPendingNotification(member, post);
//        return ResponseEntity.ok().build();
//    }
//
//
//    @PostMapping("/contract-active/{contractId}")
//    public ResponseEntity<Void> createContractActiveNotification(@PathVariable Long contractId) {
//        String currentUserId = SecurityContextHolder.getContext().getAuthentication().getName();
//
//        Member lender = memberService.findById(currentUserId);  // 현재 로그인한 출자자
//
//        // 계약 ID를 사용해 계약 정보 가져오기
//        Contract contract = contractRepository.findById(contractId)
//                .orElseThrow(() -> new IllegalArgumentException("계약을 찾을 수 없습니다."));
//
//        if (!contract.getLender().getId().equals(lender.getId())) {
//            throw new IllegalArgumentException("출자자만 계약 진행 알림을 보낼 수 있습니다.");
//        }
//
//        // ✅ 계약 최종 승인 시 채무자(Borrower)에게 알림 전송
//        notificationService.createContractActiveNotification(contract.getBorrower(), contract);
//
//        return ResponseEntity.ok().build();
//    }
//
//
//    // 계약 완료 알림 생성 (상환 완료)
//    @PostMapping("/contract-completed/{postId}")
//    public ResponseEntity<Void> createContractCompletedNotification(@PathVariable Long postId) {
//        String currentUserId = SecurityContextHolder.getContext().getAuthentication().getName();
//        Member member = memberService.findById(currentUserId);  // MemberService로 현재 사용자 조회
//        LoanPostDTO postDTO = loanPostService.getLoanPostById(postId);  // LoanPostDTO로 게시글 조회
//        LoanPost post = convertToLoanPost(postDTO);  // LoanPostDTO를 LoanPost로 변환
//        notificationService.createContractCompletedNotification(member, post);
//        return ResponseEntity.ok().build();
//    }
//
//    // 계약 취소 알림 생성 (계약 삭제됨)
//    @PostMapping("/contract-cancelled/{contractId}")
//    public ResponseEntity<Void> createContractCancelledNotification(@PathVariable Long contractId) {
//        String currentUserId = SecurityContextHolder.getContext().getAuthentication().getName();
//
//        // 계약 ID를 사용해 계약 정보 가져오기
//        Contract contract = contractRepository.findById(contractId)
//                .orElseThrow(() -> new IllegalArgumentException("계약을 찾을 수 없습니다."));
//
//        // ✅ 계약 취소 시 채무자(Borrower)와 출자자(Lender) 모두에게 알림 전송
//        notificationService.createContractCancelledNotification(contract.getBorrower(), contract.getLender(), contract);
//
//        return ResponseEntity.ok().build();
//    }
//
//
///*    // 채무자 -> 채권자 이체 알림 생성
//    @PostMapping("/debtor-to-creditor/{postId}")
//    public ResponseEntity<Void> createDebtorToCreditorNotification(@PathVariable Long postId, @RequestBody Double amount) {
//        String currentUserId = SecurityContextHolder.getContext().getAuthentication().getName();
//        Member member = memberService.findById(currentUserId);  // MemberService로 현재 사용자 조회
//        LoanPostDTO postDTO = loanPostService.getLoanPostById(postId);  // LoanPostDTO로 게시글 조회
//        notificationService.createDebtorToCreditorNotification(member, amount);
//        return ResponseEntity.ok().build();
//    }
//
//    // 채권자 -> 채무자 이체 알림 생성
//    @PostMapping("/creditor-to-debtor/{postId}")
//    public ResponseEntity<Void> createCreditorToDebtorNotification(@PathVariable Long postId, @RequestBody Double amount) {
//        String currentUserId = SecurityContextHolder.getContext().getAuthentication().getName();
//        Member member = memberService.findById(currentUserId);  // MemberService로 현재 사용자 조회
//        LoanPostDTO postDTO = loanPostService.getLoanPostById(postId);  // LoanPostDTO로 게시글 조회
//        notificationService.createCreditorToDebtorNotification(member, amount);
//        return ResponseEntity.ok().build();
//    }*/
//
//    // 연체 알림 생성
//    @PostMapping("/overdue/{postId}")
//    public ResponseEntity<Void> createOverdueNotification(@PathVariable Long postId) {
//        String currentUserId = SecurityContextHolder.getContext().getAuthentication().getName();
//        Member member = memberService.findById(currentUserId);  // MemberService로 현재 사용자 조회
//        LoanPostDTO postDTO = loanPostService.getLoanPostById(postId);  // LoanPostDTO로 게시글 조회
//        LoanPost post = convertToLoanPost(postDTO);  // LoanPostDTO를 LoanPost로 변환
//        notificationService.createOverdueNotification(member, post);
//        return ResponseEntity.ok().build();
//    }
//
//    // LoanPostDTO를 LoanPost로 변환하는 메서드
//    private LoanPost convertToLoanPost(LoanPostDTO postDTO) {
//        // LoanPostDTO에서 필요한 정보를 가져와 LoanPost 객체를 생성
//        return new LoanPost(
//                postDTO.getId(),  // 게시글 ID
//                null,  // Member 엔터티는 작성자 정보를 가지고 오지 않아서 null로 설정 (나중에 Member 엔터티를 설정하는 방식으로 처리)
//                postDTO.getLoanAmount(),  // 대출 금액
//                postDTO.getRepaymentPeriod(),  // 상환 기간 (개월 단위)
//                postDTO.getAdditionalConditions()  // 추가 조건
//        );
//    }
//}
//package com.moneybridge.controller.post;
//
//import com.moneybridge.domain.member.Member;
//import com.moneybridge.domain.post.Contract;
//import com.moneybridge.domain.post.LoanPost;
//import com.moneybridge.dto.post.ContractDTO;
//import com.moneybridge.dto.post.LoanPostDTO;
//import com.moneybridge.dto.post.NotificationDTO;
//import com.moneybridge.repository.post.ContractRepository;
//import com.moneybridge.service.member.MemberService;
//import com.moneybridge.service.post.ContractService;
//import com.moneybridge.service.post.LoanPostService;
//import com.moneybridge.service.post.NotificationService;
//import lombok.RequiredArgsConstructor;
//import org.springframework.http.ResponseEntity;
//import org.springframework.security.core.context.SecurityContextHolder;
//import org.springframework.web.bind.annotation.*;
//
//import java.util.List;
//
//@RestController
//@RequestMapping("/api/notifications")
//@RequiredArgsConstructor
//public class NotificationController {
//    private final NotificationService notificationService;
//    private final LoanPostService loanPostService;
//    private final MemberService memberService;
//    private final ContractService contractService;
//    private final ContractRepository contractRepository;
//
////    // 알림 생성
////    @PostMapping
////    public ResponseEntity<NotificationDTO> createNotification(@RequestBody NotificationDTO notificationDTO) {
////        return ResponseEntity.ok(notificationService.createNotification(notificationDTO, notificationDTO.getMemberId()));
////    }
////
////    // 특정 회원의 알림 목록 조회
////    @GetMapping("/member/{memberId}")
////    public ResponseEntity<List<NotificationDTO>> getMemberNotifications(@PathVariable String memberId) {
////        return ResponseEntity.ok(notificationService.getMemberNotifications(memberId));
////    }
//@PostMapping
//public ResponseEntity<NotificationDTO> createNotification(@RequestBody NotificationDTO notificationDTO) {
//    NotificationDTO createdNotification = notificationService.createNotification(notificationDTO, notificationDTO.getMemberId());
//    return ResponseEntity.ok(createdNotification);
//}
//
//    // ✅ 특정 회원의 알림 목록 조회 API 수정
//    @GetMapping("/member/{memberId}")
//    public ResponseEntity<List<NotificationDTO>> getMemberNotifications(@PathVariable String memberId) {
//        return ResponseEntity.ok(notificationService.getMemberNotifications(memberId));
//    }
//
//    // 알림 삭제
//    @DeleteMapping("/{notificationId}")
//    public ResponseEntity<Void> deleteNotification(@PathVariable Long notificationId) {
//        notificationService.deleteNotification(notificationId);
//        return ResponseEntity.ok().build();
//    }
//
//    // 출자자의 승인 대기 알림 생성(대출희망자가 댓글 달 때)
//    @PostMapping("/approval-pending/{postId}")
//    public ResponseEntity<Void> createApprovalPendingNotification(@PathVariable Long postId, @RequestBody String comment) {
//        String currentUserId = SecurityContextHolder.getContext().getAuthentication().getName();
//        Member member = memberService.findById(currentUserId);  // MemberService로 현재 사용자 조회
//        LoanPostDTO postDTO = loanPostService.getLoanPostById(postId);  // LoanPostDTO로 게시글 조회
//        LoanPost post = convertToLoanPost(postDTO);  // LoanPostDTO를 LoanPost로 변환
//        notificationService.createApprovalPendingNotification(member, post, comment);
//        return ResponseEntity.ok().build();
//    }
//
//    // 대출희망자의 승인 대기 알림 생성(출자자가 댓글 선택할 때)
//    @PostMapping("/contract-pending/{postId}")
//    public ResponseEntity<Void> createContractPendingNotification(@PathVariable Long postId) {
//        String currentUserId = SecurityContextHolder.getContext().getAuthentication().getName();
//        Member member = memberService.findById(currentUserId);  // MemberService로 현재 사용자 조회
//        LoanPostDTO postDTO = loanPostService.getLoanPostById(postId);  // LoanPostDTO로 게시글 조회
//        LoanPost post = convertToLoanPost(postDTO);  // LoanPostDTO를 LoanPost로 변환
//        notificationService.createContractPendingNotification(member, post);
//        return ResponseEntity.ok().build();
//    }
//
//
//    @PostMapping("/contract-active/{contractId}")
//    public ResponseEntity<Void> createContractActiveNotification(@PathVariable Long contractId) {
//        String currentUserId = SecurityContextHolder.getContext().getAuthentication().getName();
//
//        Member lender = memberService.findById(currentUserId);  // 현재 로그인한 출자자
//
//        // 계약 ID를 사용해 계약 정보 가져오기
//        Contract contract = contractRepository.findById(contractId)
//                .orElseThrow(() -> new IllegalArgumentException("계약을 찾을 수 없습니다."));
//
//        if (!contract.getLender().getId().equals(lender.getId())) {
//            throw new IllegalArgumentException("출자자만 계약 진행 알림을 보낼 수 있습니다.");
//        }
//
//        // ✅ 계약 최종 승인 시 채무자(Borrower)에게 알림 전송
//        notificationService.createContractActiveNotification(contract.getBorrower(), contract);
//
//        return ResponseEntity.ok().build();
//    }
//
//
//    // 계약 완료 알림 생성 (상환 완료)
//    @PostMapping("/contract-completed/{postId}")
//    public ResponseEntity<Void> createContractCompletedNotification(@PathVariable Long postId) {
//        String currentUserId = SecurityContextHolder.getContext().getAuthentication().getName();
//        Member member = memberService.findById(currentUserId);  // MemberService로 현재 사용자 조회
//        LoanPostDTO postDTO = loanPostService.getLoanPostById(postId);  // LoanPostDTO로 게시글 조회
//        LoanPost post = convertToLoanPost(postDTO);  // LoanPostDTO를 LoanPost로 변환
//        notificationService.createContractCompletedNotification(member, post);
//        return ResponseEntity.ok().build();
//    }
//
//    // 계약 취소 알림 생성 (계약 삭제됨)
//    @PostMapping("/contract-cancelled/{contractId}")
//    public ResponseEntity<Void> createContractCancelledNotification(@PathVariable Long contractId) {
//        String currentUserId = SecurityContextHolder.getContext().getAuthentication().getName();
//
//        // 계약 ID를 사용해 계약 정보 가져오기
//        Contract contract = contractRepository.findById(contractId)
//                .orElseThrow(() -> new IllegalArgumentException("계약을 찾을 수 없습니다."));
//
//        // ✅ 계약 취소 시 채무자(Borrower)와 출자자(Lender) 모두에게 알림 전송
//        notificationService.createContractCancelledNotification(contract.getBorrower(), contract.getLender(), contract);
//
//        return ResponseEntity.ok().build();
//    }
//
//
///*    // 채무자 -> 채권자 이체 알림 생성
//    @PostMapping("/debtor-to-creditor/{postId}")
//    public ResponseEntity<Void> createDebtorToCreditorNotification(@PathVariable Long postId, @RequestBody Double amount) {
//        String currentUserId = SecurityContextHolder.getContext().getAuthentication().getName();
//        Member member = memberService.findById(currentUserId);  // MemberService로 현재 사용자 조회
//        LoanPostDTO postDTO = loanPostService.getLoanPostById(postId);  // LoanPostDTO로 게시글 조회
//        notificationService.createDebtorToCreditorNotification(member, amount);
//        return ResponseEntity.ok().build();
//    }
//
//    // 채권자 -> 채무자 이체 알림 생성
//    @PostMapping("/creditor-to-debtor/{postId}")
//    public ResponseEntity<Void> createCreditorToDebtorNotification(@PathVariable Long postId, @RequestBody Double amount) {
//        String currentUserId = SecurityContextHolder.getContext().getAuthentication().getName();
//        Member member = memberService.findById(currentUserId);  // MemberService로 현재 사용자 조회
//        LoanPostDTO postDTO = loanPostService.getLoanPostById(postId);  // LoanPostDTO로 게시글 조회
//        notificationService.createCreditorToDebtorNotification(member, amount);
//        return ResponseEntity.ok().build();
//    }*/
//
//    // 연체 알림 생성
//    @PostMapping("/overdue/{postId}")
//    public ResponseEntity<Void> createOverdueNotification(@PathVariable Long postId) {
//        String currentUserId = SecurityContextHolder.getContext().getAuthentication().getName();
//        Member member = memberService.findById(currentUserId);  // MemberService로 현재 사용자 조회
//        LoanPostDTO postDTO = loanPostService.getLoanPostById(postId);  // LoanPostDTO로 게시글 조회
//        LoanPost post = convertToLoanPost(postDTO);  // LoanPostDTO를 LoanPost로 변환
//        notificationService.createOverdueNotification(member, post);
//        return ResponseEntity.ok().build();
//    }
//
//    // LoanPostDTO를 LoanPost로 변환하는 메서드
//    private LoanPost convertToLoanPost(LoanPostDTO postDTO) {
//        // LoanPostDTO에서 필요한 정보를 가져와 LoanPost 객체를 생성
//        return new LoanPost(
//                postDTO.getId(),  // 게시글 ID
//                null,  // Member 엔터티는 작성자 정보를 가지고 오지 않아서 null로 설정 (나중에 Member 엔터티를 설정하는 방식으로 처리)
//                postDTO.getLoanAmount(),  // 대출 금액
//                postDTO.getRepaymentPeriod(),  // 상환 기간 (개월 단위)
//                postDTO.getAdditionalConditions()  // 추가 조건
//        );
//    }
//}
package com.moneybridge.controller.post;

import com.moneybridge.domain.member.Member;
import com.moneybridge.domain.post.Contract;
import com.moneybridge.domain.post.LoanPost;
import com.moneybridge.dto.post.LoanPostDTO;
import com.moneybridge.dto.post.NotificationDTO;
import com.moneybridge.repository.post.ContractRepository;
import com.moneybridge.service.member.MemberService;
import com.moneybridge.service.post.LoanPostService;
import com.moneybridge.service.post.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/notifications")
@RequiredArgsConstructor
public class NotificationController {
    private final NotificationService notificationService;
    private final LoanPostService loanPostService;
    private final MemberService memberService;
    private final ContractRepository contractRepository;

    // ✅ 알림 생성 (redirectUrl 포함)
    @PostMapping
    public ResponseEntity<NotificationDTO> createNotification(@RequestBody NotificationDTO notificationDTO) {
        NotificationDTO createdNotification = notificationService.createNotification(notificationDTO, notificationDTO.getMemberId());
        return ResponseEntity.ok(createdNotification);
    }

    // ✅ 특정 회원의 알림 목록 조회 (redirectUrl 포함)
    @GetMapping("/member/{memberId}")
    public ResponseEntity<List<NotificationDTO>> getMemberNotifications(@PathVariable String memberId) {
        List<NotificationDTO> notifications = notificationService.getMemberNotifications(memberId);
        return ResponseEntity.ok(notifications);
    }

    // ✅ 알림 삭제
    @DeleteMapping("/{notificationId}")
    public ResponseEntity<Void> deleteNotification(@PathVariable Long notificationId) {
        notificationService.deleteNotification(notificationId);
        return ResponseEntity.ok().build();
    }

    // ✅ 출자자의 승인 대기 알림 생성 (대출희망자가 댓글 달 때)
    @PostMapping("/approval-pending/{postId}")
    public ResponseEntity<Void> createApprovalPendingNotification(@PathVariable Long postId, @RequestBody String comment) {
        String currentUserId = SecurityContextHolder.getContext().getAuthentication().getName();
        Member member = memberService.findById(currentUserId);
        LoanPostDTO postDTO = loanPostService.getLoanPostById(postId);
        LoanPost post = convertToLoanPost(postDTO);
        notificationService.createApprovalPendingNotification(member, post, comment);
        return ResponseEntity.ok().build();
    }

    // ✅ 계약 대기 알림 생성 (출자자가 댓글 선택)
    @PostMapping("/contract-pending/{postId}")
    public ResponseEntity<Void> createContractPendingNotification(@PathVariable Long postId) {
        String currentUserId = SecurityContextHolder.getContext().getAuthentication().getName();
        Member member = memberService.findById(currentUserId);
        LoanPostDTO postDTO = loanPostService.getLoanPostById(postId);
        LoanPost post = convertToLoanPost(postDTO);
        notificationService.createContractPendingNotification(member, post);
        return ResponseEntity.ok().build();
    }

    // ✅ 계약 활성화 알림 (출자자가 계약 승인)
    @PostMapping("/contract-active/{contractId}")
    public ResponseEntity<Void> createContractActiveNotification(@PathVariable Long contractId) {
        String currentUserId = SecurityContextHolder.getContext().getAuthentication().getName();
        Member lender = memberService.findById(currentUserId);
        Contract contract = contractRepository.findById(contractId)
                .orElseThrow(() -> new IllegalArgumentException("계약을 찾을 수 없습니다."));

        if (!contract.getLender().getId().equals(lender.getId())) {
            throw new IllegalArgumentException("출자자만 계약 진행 알림을 보낼 수 있습니다.");
        }

        notificationService.createContractActiveNotification(contract.getBorrower(), contract);
        return ResponseEntity.ok().build();
    }

    // ✅ 계약 완료 알림 (상환 완료)
    @PostMapping("/contract-completed/{postId}")
    public ResponseEntity<Void> createContractCompletedNotification(@PathVariable Long postId) {
        String currentUserId = SecurityContextHolder.getContext().getAuthentication().getName();
        Member member = memberService.findById(currentUserId);
        LoanPostDTO postDTO = loanPostService.getLoanPostById(postId);
        LoanPost post = convertToLoanPost(postDTO);
        notificationService.createContractCompletedNotification(member, post);
        return ResponseEntity.ok().build();
    }

    // ✅ 계약 취소 알림 (계약 삭제됨)
    @PostMapping("/contract-cancelled/{contractId}")
    public ResponseEntity<Void> createContractCancelledNotification(@PathVariable Long contractId) {
        String currentUserId = SecurityContextHolder.getContext().getAuthentication().getName();
        Contract contract = contractRepository.findById(contractId)
                .orElseThrow(() -> new IllegalArgumentException("계약을 찾을 수 없습니다."));

        notificationService.createContractCancelledNotification(contract.getBorrower(), contract.getLender(), contract);
        return ResponseEntity.ok().build();
    }

    // ✅ 연체 알림 생성
    @PostMapping("/overdue/{postId}")
    public ResponseEntity<Void> createOverdueNotification(@PathVariable Long postId) {
        String currentUserId = SecurityContextHolder.getContext().getAuthentication().getName();
        Member member = memberService.findById(currentUserId);
        LoanPostDTO postDTO = loanPostService.getLoanPostById(postId);
        LoanPost post = convertToLoanPost(postDTO);
        notificationService.createOverdueNotification(member, post);
        return ResponseEntity.ok().build();
    }

    // ✅ LoanPostDTO -> LoanPost 변환 메서드
    private LoanPost convertToLoanPost(LoanPostDTO postDTO) {
        return new LoanPost(
                postDTO.getId(),
                null,
                postDTO.getLoanAmount(),
                postDTO.getRepaymentPeriod(),
                postDTO.getAdditionalConditions()
        );
    }
    // ✅ QnA 알림 생성 API (QnA 목록 페이지로 이동)
    @PostMapping("/qna")
    public ResponseEntity<String> createQnaNotification(
            @RequestParam String receiverId,
            @RequestParam Long qno) {

        // 수신자 (receiver) 조회
        Member receiver = memberService.findById(receiverId);

        // QnA 알림 생성
        notificationService.createQnaNotification(receiver, qno);

        return ResponseEntity.ok("QnA 알림이 성공적으로 생성되었습니다.");
    }

}
