package com.moneybridge.service.post;

import com.moneybridge.domain.member.Member;
import com.moneybridge.domain.post.*;
import com.moneybridge.domain.wallet.Wallet;
import com.moneybridge.dto.post.CommentSelectionResponseDTO;
import com.moneybridge.dto.post.ContractDTO;
import com.moneybridge.dto.post.PostCommentDTO;
import com.moneybridge.repository.member.MemberRepository;
import com.moneybridge.repository.post.ContractRepository;
import com.moneybridge.repository.post.LoanPostRepository;
import com.moneybridge.repository.post.PostCommentRepository;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
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
    private final ContractRepository contractRepository;
    private final ContractServiceImpl contractServiceImpl;

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
                .memberGrade(member.getMemberGradeList().isEmpty() ? null : member.getMemberGradeList().get(0))
                .isSelected(false) // 명시적으로 초기화
                .build();

        PostComment savedComment = postCommentRepository.save(comment);

        log.info("Comment created successfully: {}", savedComment.getId());
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
//
//@Override
//@Transactional
//public ContractDTO createContract(Long postId, Long commentId) {
//    log.info("Creating contract for post ID: {} and comment ID: {}", postId, commentId);
//
//    LoanPost loanPost = loanPostRepository.findById(postId)
//            .orElseThrow(() -> new EntityNotFoundException("LoanPost not found with ID: " + postId));
//
//    PostComment comment = postCommentRepository.findById(commentId)
//            .orElseThrow(() -> new EntityNotFoundException("Comment not found with ID: " + commentId));
//
//    // 📌 이미 선택된 댓글인지 확인
//    if (comment.isSelected()) {
//        throw new IllegalStateException("This comment has already been selected for another contract.");
//    }
//
//    Member borrower = loanPost.getWriter();
//    Member lender = comment.getMember();
//
//    Contract contract = Contract.builder()
//            .selectedComment(comment)
//            .loanPost(loanPost)
//            .lender(lender)
//            .borrower(borrower)
//            .loanAmount(loanPost.getLoanAmount())
//            .repaymentPeriod(loanPost.getRepaymentPeriod())
//            .interestRate(comment.getInterestRate())
//            .totalRepaymentAmount(loanPost.getLoanAmount() + (long) (loanPost.getLoanAmount() * (comment.getInterestRate() / 100.0)))
//            .status(ContractStatus.PENDING) // 초기 상태 PENDING
//            .build();
//
//    // 📌 선택된 댓글로 상태 변경
//    comment.setIsSelected(true);
//
//    postCommentRepository.save(comment);
//
//    log.info("💾 계약 생성 중: Post ID={}, Comment ID={}, Lender={}, Borrower={}",
//            postId, commentId, lender.getId(), borrower.getId());
//
//    contractRepository.save(contract);
//
//    log.info("✅ 계약 생성 완료: 계약 ID={} 상태={}", contract.getId(), contract.getStatus());
//
//
//    log.info("Contract created successfully.");
//    return ContractDTO.toDTO(contract);
//}
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


    ContractDTO createdContract = contractServiceImpl.createContract(contractDTO); // ✅ 계약 생성

    log.info("✅ Contract created automatically: Contract ID={}, Status={}", createdContract.getId(), createdContract.getStatus());

    // ✅ 댓글 정보 + 계약 정보를 함께 반환
    return CommentSelectionResponseDTO.builder()
            .postComment(PostCommentDTO.toDTO(comment)) // 변경된 댓글 정보
            .contract(createdContract) // 생성된 계약 정보
            .build();
}

    private PostCommentDTO mapToDTO(PostComment comment) {
        return PostCommentDTO.builder()
                .id(comment.getId())
                .postId(comment.getPost().getId())
                .memberId(comment.getMember().getId())
                .lenderId(comment.getLender() != null ? comment.getLender().getId() : null) // ✅ 출자자 정보 추가
                .interestRate(comment.getInterestRate())
                .commentText(comment.getCommentText())
                .memberGrade(comment.getMemberGrade())
                .createdAt(comment.getCreatedAt())
                .updatedAt(comment.getUpdatedAt())
                .build();
    }
}
