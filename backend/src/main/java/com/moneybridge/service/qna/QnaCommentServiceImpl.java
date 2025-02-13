//package com.moneybridge.service.qna;
//
//import com.moneybridge.domain.qna.QnaComment;
//import com.moneybridge.dto.qna.QnaCommentDTO;
//import com.moneybridge.repository.member.MemberRepository;
//import com.moneybridge.repository.qna.QnaCommentRepository;
//import com.moneybridge.repository.qna.QnaRepository;
//import lombok.RequiredArgsConstructor;
//import org.springframework.security.access.prepost.PreAuthorize;
//import org.springframework.stereotype.Service;
//import org.springframework.transaction.annotation.Transactional;
//
//import java.time.LocalDate;
//import java.util.List;
//import java.util.stream.Collectors;
//
//@Service
//@RequiredArgsConstructor
//@Transactional
//public class QnaCommentServiceImpl implements QnaCommentService {
//
//    private final QnaCommentRepository qnaCommentRepository;
//    private final QnaRepository qnaRepository;
//    private final MemberRepository memberRepository;
//
//    @Override
//    @PreAuthorize("hasRole('ADMIN')")
//    public QnaCommentDTO addComment(QnaCommentDTO dto) {
//        QnaComment comment = QnaComment.builder()
//                .qna(qnaRepository.findById(dto.getQno()).orElseThrow(() -> new IllegalArgumentException("존재하지 않는 QnA 게시글입니다.")))
//                .qnaCommentContent(dto.getQnaCommentContent())
//                .regDate(LocalDate.now())
//                .build();
//
//        QnaComment savedComment = qnaCommentRepository.save(comment);
//
//        return convertToDTO(savedComment);
//    }
//
//    @Override
//    public List<QnaCommentDTO> getCommentsByQna(Long qno) {
//        return qnaCommentRepository.findAll().stream()
//                .filter(comment -> comment.getQna().getQno().equals(qno))
//                .map(this::convertToDTO)
//                .collect(Collectors.toList());
//    }
//
//    @Override
//    @PreAuthorize("hasRole('ADMIN')")
//    public QnaCommentDTO updateComment(Long qcno, QnaCommentDTO dto) {
//        QnaComment comment = qnaCommentRepository.findById(qcno)
//                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 댓글입니다."));
//
//        comment.setQnaCommentContent(dto.getQnaCommentContent());
//        comment.setModifiedDate(LocalDate.now());
//        QnaComment updatedComment = qnaCommentRepository.save(comment);
//
//        return convertToDTO(updatedComment);
//    }
//
//    @Override
//    @PreAuthorize("hasRole('ADMIN')")
//    public void deleteComment(Long qcno) {
//        QnaComment comment = qnaCommentRepository.findById(qcno)
//                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 댓글입니다."));
//        qnaCommentRepository.delete(comment);
//    }
//
//    // DTO 변환 메서드
//    private QnaCommentDTO convertToDTO(QnaComment comment) {
//        return QnaCommentDTO.builder()
//                .qcno(comment.getQcno())
//                .qno(comment.getQna().getQno())
//                .id(comment.getId())
//                .qnaCommentContent(comment.getQnaCommentContent())
//                .regDate(comment.getRegDate())
//                .modified(comment.isModified())
//                .build();
//    }
//}
