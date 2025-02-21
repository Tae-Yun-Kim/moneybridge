package com.moneybridge.service.post;

import com.moneybridge.domain.member.Member;
import com.moneybridge.domain.member.MemberGrade;
import com.moneybridge.domain.post.ContractStatus;
import com.moneybridge.domain.post.LoanPost;
import com.moneybridge.domain.post.PostComment;
import com.moneybridge.dto.post.CommentSelectionResponseDTO;
import com.moneybridge.dto.post.ContractDTO;
import com.moneybridge.dto.post.PostCommentDTO;
import com.moneybridge.repository.member.MemberRepository;
import com.moneybridge.repository.post.LoanPostRepository;
import com.moneybridge.repository.post.PostCommentRepository;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class PostCommentServiceImpl implements PostCommentService {

    private final PostCommentRepository postCommentRepository;
    private final LoanPostRepository loanPostRepository;
    private final MemberRepository memberRepository;
    private final NotificationService notificationService; // 알림 서비스 주입
    private final ContractService contractService;
//    private final DebtService debtService;  // DebtService 사용
//    private final AuthenticationService authenticationService;

    @Override
    public PostCommentDTO createComment(PostCommentDTO dto) {
        log.info("Creating comment for post ID: {}", dto.getPostId());

        // 게시글 확인
        LoanPost post = loanPostRepository.findById(dto.getPostId())
                .orElseThrow(() -> new EntityNotFoundException("LoanPost not found with ID: " + dto.getPostId()));

        // 작성자 확인
        if (dto.getMemberId() == null) {
            throw new IllegalArgumentException("Member ID must not be null");
        }

        Member member = memberRepository.findById(dto.getMemberId())
                .orElseThrow(() -> new EntityNotFoundException("Member not found with ID: " + dto.getMemberId()));

        // 댓글 생성
        PostComment comment = PostComment.builder()
                .post(post)
                .member(member)
                .interestRate(dto.getInterestRate())
                .commentText(dto.getCommentText())
                .memberGrade(member.getMemberGradeList().isEmpty()
                        || member.getMemberGradeList().get(0) == null
                        ?MemberGrade.BRONZE
                        : member.getMemberGradeList().get(0))
                .isSelected(false) // 명시적으로 초기화
                .build();

        PostComment savedComment = postCommentRepository.save(comment);

        log.info("Comment created successfully: {}", savedComment.getId());

        // 알림 추가: 새로운 댓글에 대해 알림 전송
        notificationService.createApprovalPendingNotification(post.getWriter(), post, dto.getCommentText());
        return mapToDTO(savedComment);
    }


    @Override
    public PostCommentDTO getCommentById(Long id) {
        log.info("Fetching comment by ID: {}", id);

        PostComment comment = postCommentRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Comment not found with ID: " + id));

        return mapToDTO(comment);
    }

    @Override
    public List<PostCommentDTO> getCommentsByPostId(Long postId) {
        log.info("Fetching comments for post ID: {}", postId);

        List<PostComment> comments = postCommentRepository.findByPostId(postId);

        return comments.stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public PostCommentDTO updateComment(Long id, PostCommentDTO dto) {
        log.info("Updating comment ID: {}", id);

        PostComment comment = postCommentRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Comment not found with ID: " + id));

        // 업데이트할 필드 설정
        comment.setInterestRate(dto.getInterestRate());
        comment.setCommentText(dto.getCommentText());

        PostComment updatedComment = postCommentRepository.save(comment);
        log.info("Comment updated successfully: {}", updatedComment.getId());

        return mapToDTO(updatedComment);
    }

    @Override
    public void deleteComment(Long id) {
        log.info("Deleting comment ID: {}", id);

        PostComment comment = postCommentRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Comment not found with ID: " + id));

        postCommentRepository.delete(comment);
        log.info("Comment deleted successfully.");
    }

//    @Override
//    public PostCommentDTO selectComment(Long postId, Long commentId) {
//        log.info("Selecting comment ID: {} for post ID: {}", commentId, postId);
//
//        // 게시글 확인
//        loanPostRepository.findById(postId)
//                .orElseThrow(() -> new EntityNotFoundException("LoanPost not found with ID: " + postId));
//
//        // 기존 선택된 댓글 초기화
//        postCommentRepository.findByPostIdAndIsSelectedTrue(postId)
//                .ifPresent(selectedComment -> {
//                    selectedComment.setIsSelected(false);
//                    postCommentRepository.save(selectedComment);
//                    log.info("Previously selected comment reset.");
//                });
//
//        // 새로운 댓글 선택
//        PostComment comment = postCommentRepository.findById(commentId)
//                .orElseThrow(() -> new EntityNotFoundException("Comment not found with ID: " + commentId));
//
//        comment.setIsSelected(true);
//        PostComment selectedComment = postCommentRepository.save(comment);
//
//        log.info("Comment selected successfully: {}", selectedComment.getId());
//
//        return mapToDTO(selectedComment);
//    }
@Override
@Transactional
public CommentSelectionResponseDTO selectComment(Long postId, Long commentId, String lenderId) { // ✅ 새로운 DTO 반환
    log.info("Selecting comment ID: {} for post ID: {} by lender ID: {}", commentId, postId, lenderId);

    LoanPost loanPost = loanPostRepository.findById(postId)
            .orElseThrow(() -> new EntityNotFoundException("LoanPost not found with ID: " + postId));

    PostComment comment = postCommentRepository.findById(commentId)
            .orElseThrow(() -> new EntityNotFoundException("Comment not found with ID: " + commentId));

    Member lender = memberRepository.findById(lenderId)
            .orElseThrow(() -> new EntityNotFoundException("Lender not found with ID: " + lenderId));

    // 이미 선택된 댓글인지 확인
    if (comment.getLender() != null) {
        throw new IllegalStateException("This comment has already been selected by another lender.");
    }

    // ✅ 출자자를 댓글에 저장하고 선택 상태 변경
    comment.setLender(lender);
    comment.setIsSelected(true);
    postCommentRepository.save(comment); // 🔥 댓글 테이블에 반영됨!

    log.info("✅ Comment ID: {} selected by lender ID: {}", commentId, lenderId);

    // ✅ 선택된 댓글을 기반으로 계약 자동 생성
    ContractDTO contractDTO = ContractDTO.builder()
            .lenderId(lender.getId())  // ✅ 출자자 ID (정상)
            .borrowerId(comment.getMember().getId()) // ✅ 대출자는 댓글 작성자!
            .postId(postId)
            .selectedCommentId(commentId)
            .loanAmount(comment.getPost().getLoanAmount())
            .repaymentPeriod(comment.getPost().getRepaymentPeriod())
            .interestRate(comment.getInterestRate())
            .totalRepaymentAmount(comment.getPost().getLoanAmount() +
                    (long) (comment.getPost().getLoanAmount() * (comment.getInterestRate() / 100.0)))
            .status(ContractStatus.PENDING)
            .build();


    ContractDTO createdContract = contractService.createContract(contractDTO); // ✅ 계약 생성

    // 알림 추가: 새로운 댓글에 대해 알림 전송
    notificationService.createContractPendingNotification(comment.getMember(), loanPost);


    log.info("✅ Contract created automatically: Contract ID={}, Status={}", createdContract.getId(), createdContract.getStatus());

    // ✅ 댓글 정보 + 계약 정보를 함께 반환
    return CommentSelectionResponseDTO.builder()
            .postComment(PostCommentDTO.toDTO(comment)) // 변경된 댓글 정보
            .contract(createdContract) // 생성된 계약 정보
            .build();
}


    @Override
    public PostCommentDTO confirmTransaction(Long commentId) {
        log.info("Confirming transaction for comment ID: {}", commentId);

        // 댓글 확인
        PostComment comment = postCommentRepository.findById(commentId)
                .orElseThrow(() -> new EntityNotFoundException("Comment not found with ID: " + commentId));

        if (!comment.getIsSelected()) {
            throw new IllegalStateException("Only selected comments can be confirmed for a transaction.");
        }

        // 거래 성립 로직 추가 (예: 거래 상태 업데이트, 기록 저장 등)
        log.info("Transaction confirmed for comment ID: {}", commentId);

        return mapToDTO(comment);
    }

    private PostCommentDTO mapToDTO(PostComment comment) {
        return PostCommentDTO.builder()
                .id(comment.getId())
                .postId(comment.getPost().getId())
                .memberId(comment.getMember().getId()) // String 타입의 Member ID 반환
                .interestRate(comment.getInterestRate())
                .commentText(comment.getCommentText())
                .memberGrade(comment.getMemberGrade())
                .isSelected(comment.getIsSelected())
                .createdAt(comment.getCreatedAt())
                .updatedAt(comment.getUpdatedAt())
                .build();
    }
}
