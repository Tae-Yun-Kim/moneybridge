package com.moneybridge.service.post;

import com.moneybridge.domain.member.Member;
import com.moneybridge.domain.post.*;
import com.moneybridge.dto.post.LoanPostDTO;
import com.moneybridge.dto.post.PostCommentDTO;
import com.moneybridge.repository.member.MemberRepository;
import com.moneybridge.repository.post.ContractRepository;
import com.moneybridge.repository.post.LoanPostRepository;
import com.moneybridge.repository.post.NotificationRepository;
import com.moneybridge.repository.post.PostCommentRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Log4j2
@Service
@RequiredArgsConstructor
public class LoanPostServiceImpl implements LoanPostService {

    private final LoanPostRepository loanPostRepository;
    private final MemberRepository memberRepository;
    private final PostCommentService postCommentService;
    private final PostCommentRepository postCommentRepository;
    private final ContractRepository contractRepository;
    private final NotificationRepository notificationRepository;
    private final NotificationService notificationService;

    @Override
    public LoanPostDTO createLoanPost(LoanPostDTO loanPostDTO, String userId) {
        log.info("Creating LoanPost for user ID: {}", userId);

        // 사용자 조회
        Member writer = memberRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Member not found with ID: " + userId));

        // 출자자인지 확인
        if (!writer.isLender()) {
            log.error("User with ID: {} is not a lender and cannot create a loan post.", userId);
            throw new RuntimeException("Only lenders can create loan posts.");
        }

        // 게시글 생성
        LoanPost loanPost = LoanPost.builder()
                .title(loanPostDTO.getTitle())
                .writer(writer)
                .loanAmount(loanPostDTO.getLoanAmount())
                .repaymentPeriod(loanPostDTO.getRepaymentPeriod())
                .additionalConditions(loanPostDTO.getAdditionalConditions())
                .build();

        LoanPost savedPost = loanPostRepository.save(loanPost);

        log.info("LoanPost created successfully: {}", savedPost);
        return mapToDTO(savedPost);
    }

//    @Override
//    public LoanPostDTO getLoanPostById(Long id) {
//        log.info("Fetching LoanPost with ID: {}", id);
//
//        LoanPost loanPost = loanPostRepository.findById(id)
//                .orElseThrow(() -> new RuntimeException("LoanPost not found"));
//
//        // 댓글 가져오기
//        List<PostCommentDTO> comments = postCommentService.getCommentsByPostId(id);
//
//        log.info("Fetched LoanPost: {}", loanPost);
//        return mapToDTO(loanPost, comments);
//    }
@Override
public LoanPostDTO getLoanPostById(Long id) {
    log.info("Fetching LoanPost with ID: {}", id);

    LoanPost loanPost = loanPostRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("LoanPost not found"));

    // 계약 상태 확인
    Contract contract = contractRepository.findByLoanPost_Id(id).orElse(null);
    if (contract == null) {
        log.error("LoanPost ID {}에 해당하는 계약이 존재하지 않습니다.", id);
    } else {
        log.info("LoanPost ID {}의 계약 상태: {}", id, contract.getStatus());
    }
    ContractStatus contractStatus = (contract != null) ? contract.getStatus() : null;

    log.info("LoanPost ID: {}, Contract Status: {}", id, contractStatus); // 로그 추가

    // 댓글 가져오기
    List<PostCommentDTO> comments = postCommentService.getCommentsByPostId(id);

    return mapToDTO(loanPost, comments, contractStatus);
}


//    private LoanPostDTO mapToDTO(LoanPost loanPost, List<PostCommentDTO> comments) {
//        return LoanPostDTO.builder()
//                .id(loanPost.getId())
//                .title(loanPost.getTitle())
//                .loanAmount(loanPost.getLoanAmount())
//                .repaymentPeriod(loanPost.getRepaymentPeriod())
//                .additionalConditions(loanPost.getAdditionalConditions())
//                .createdAt(loanPost.getCreatedAt())
//                .updatedAt(loanPost.getUpdatedAt())
//                .writerId(loanPost.getWriter().getId()) // 작성자 ID 매핑
//                .comments(comments) // 댓글 포함
//                .build();
//    }
private LoanPostDTO mapToDTO(LoanPost loanPost, List<PostCommentDTO> comments, ContractStatus status) {
    String contractStatusLabel = "모집 중"; // 기본값

    if (status == null) {
        log.warn("LoanPost ID {}의 contractStatus가 null입니다. DB를 확인하세요.", loanPost.getId());
        contractStatusLabel = "모집 중"; // 기본값
    } else if (status == ContractStatus.PENDING || status == ContractStatus.WAITING_FOR_APPROVAL || status == ContractStatus.ACTIVE) {
        contractStatusLabel = "진행 중";
    } else if (status == ContractStatus.COMPLETED) {
        contractStatusLabel = "계약 완료";
    } else if (status == ContractStatus.CANCELLED) {
        contractStatusLabel = "계약 취소";
    }

    return LoanPostDTO.builder()
            .id(loanPost.getId())
            .title(loanPost.getTitle())
            .loanAmount(loanPost.getLoanAmount())
            .repaymentPeriod(loanPost.getRepaymentPeriod())
            .additionalConditions(loanPost.getAdditionalConditions())
            .createdAt(loanPost.getCreatedAt())
            .updatedAt(loanPost.getUpdatedAt())
            .writerId(loanPost.getWriter().getId())
            .writerGrade(loanPost.getWriter().getMemberGradeList())
            .comments(comments)
            .contractStatus(contractStatusLabel) // 계약 상태 추가
            .build();
}


    // 모든 대출 게시글 조회 로직
//    @Override
//    public Page<LoanPostDTO> getLoanPosts(Pageable pageable) {
//        log.info("Fetching paginated LoanPosts...");
//
//        Page<LoanPost> loanPosts = loanPostRepository.findAllPosts(pageable);
//
//        log.info("Fetched LoanPosts count: {}", loanPosts.getTotalElements());
//
//        // Page<LoanPost> -> Page<LoanPostDTO> 변환
//        return loanPosts.map(this::mapToDTO);
//    }
    @Override
    public Page<LoanPostDTO> getLoanPosts(Pageable pageable) {
        log.info("Fetching paginated LoanPosts...");

        Page<LoanPost> loanPosts = loanPostRepository.findAllPosts(pageable);

        log.info("Fetched LoanPosts count: {}", loanPosts.getTotalElements());

        // ✅ 각 게시글에 대한 계약 상태를 조회하여 포함
        return loanPosts.map(loanPost -> {
            // 계약 상태 조회
            Contract contract = contractRepository.findByLoanPost_Id(loanPost.getId()).orElse(null);
            ContractStatus contractStatus = (contract != null) ? contract.getStatus() : null;

            return mapToDTO(loanPost, contractStatus);
        });
    }

    // 대출 게시글 수정 로직
    @Override
    public LoanPostDTO updateLoanPost(Long id, LoanPostDTO loanPostDTO) {
        log.info("Updating LoanPost with ID: {}", id);

        // 게시글이 존재하는지 확인
        LoanPost loanPost = loanPostRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("LoanPost not found with ID: " + id));

        // 게시글 필드 수정
        loanPost.setTitle(loanPostDTO.getTitle());
        loanPost.setLoanAmount(loanPostDTO.getLoanAmount());
        loanPost.setRepaymentPeriod(loanPostDTO.getRepaymentPeriod());
        loanPost.setAdditionalConditions(loanPostDTO.getAdditionalConditions());

        // 데이터베이스에 반영 (업데이트)
        LoanPost updatedPost = loanPostRepository.save(loanPost); // save() 호출로 DB에 반영

        log.info("Updated LoanPost: {}", updatedPost);
        return mapToDTO(updatedPost);  // DTO로 변환하여 반환
    }

    // 대출 게시글 삭제 로직
    @Override
    public void deleteLoanPost(Long id) {
        log.info("Deleting LoanPost with ID: {}", id);

        LoanPost loanPost = loanPostRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("LoanPost not found with ID: " + id));

        // 연결된 알림 삭제
        List<Notification> notifications = notificationRepository.findByPostId(loanPost);
        if (!notifications.isEmpty()) {
            notifications.forEach(notification ->
                    notificationService.deleteNotification(notification.getNotificationId())
            );
            log.info("Related notifications deleted for LoanPost ID: {}", id);
        }

        // 연결된 댓글 삭제
        List<PostComment> comments = postCommentRepository.findByPostId(id);
        postCommentRepository.deleteAll(comments);

        loanPostRepository.delete(loanPost);
        log.info("LoanPost and related comments deleted successfully with ID: {}", id);
    }


    // LoanPost 엔티티를 DTO로 변환하는 로직
    private LoanPostDTO mapToDTO(LoanPost loanPost) {
        return LoanPostDTO.builder()
                .id(loanPost.getId())
                .title(loanPost.getTitle())
                .loanAmount(loanPost.getLoanAmount())
                .repaymentPeriod(loanPost.getRepaymentPeriod())
                .additionalConditions(loanPost.getAdditionalConditions())
                .createdAt(loanPost.getCreatedAt())
                .updatedAt(loanPost.getUpdatedAt())
                .writerId(loanPost.getWriter().getId()) // 작성자 ID 매핑
                .writerGrade(loanPost.getWriter().getMemberGradeList())
                .build();
    }

    // ✅ 계약 상태를 포함하는 mapToDTO() 메서드 추가
    private LoanPostDTO mapToDTO(LoanPost loanPost, ContractStatus status) {
        String contractStatusLabel = "모집 중"; // 기본값

        if (status == ContractStatus.PENDING || status == ContractStatus.WAITING_FOR_APPROVAL || status == ContractStatus.ACTIVE) {
            contractStatusLabel = "진행 중";
        } else if (status == ContractStatus.COMPLETED) {
            contractStatusLabel = "계약 완료";
        } else if (status == ContractStatus.CANCELLED) {
            contractStatusLabel = "계약 취소";
        }

        return LoanPostDTO.builder()
                .id(loanPost.getId())
                .title(loanPost.getTitle())
                .loanAmount(loanPost.getLoanAmount())
                .repaymentPeriod(loanPost.getRepaymentPeriod())
                .additionalConditions(loanPost.getAdditionalConditions())
                .createdAt(loanPost.getCreatedAt())
                .updatedAt(loanPost.getUpdatedAt())
                .writerId(loanPost.getWriter().getId())
                .writerGrade(loanPost.getWriter().getMemberGradeList())
                .contractStatus(contractStatusLabel) // ✅ 계약 상태 추가
                .build();
    }
}


