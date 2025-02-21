package com.moneybridge.service.qna;

import com.moneybridge.domain.post.Notification;
import com.moneybridge.domain.qna.QnaComment;
import com.moneybridge.dto.post.NotificationDTO;
import com.moneybridge.dto.qna.QnaCommentDTO;
import com.moneybridge.repository.member.MemberRepository;
import com.moneybridge.repository.post.NotificationRepository;
import com.moneybridge.repository.qna.QnaCommentRepository;
import com.moneybridge.repository.qna.QnaRepository;
import com.moneybridge.domain.member.Member;
import com.moneybridge.service.post.NotificationServiceImpl;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class QnaCommentServiceImpl implements QnaCommentService {

    private final QnaCommentRepository qnaCommentRepository;
    private final QnaRepository qnaRepository;
    private final MemberRepository memberRepository;
    private final NotificationRepository notificationRepository; // 알림 서비스 주입
    private final NotificationServiceImpl notificationServiceImpl;

    @Override
    @PreAuthorize("hasRole('ADMIN')")
    public QnaCommentDTO addComment(QnaCommentDTO dto) {
        // QnA 게시글 찾기
        var qna = qnaRepository.findById(dto.getQno())
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 QnA 게시글입니다."));

        QnaComment comment = QnaComment.builder()
                .qna(qna)
                .qnaCommentContent(dto.getQnaCommentContent())
                .regDate(LocalDate.now())
                .build();

        QnaComment savedComment = qnaCommentRepository.save(comment);

        // QnA 작성자에게 알림 생성
        createQnaNotification(qna.getMember(), dto.getQno());

        return convertToDTO(savedComment);
    }

    // QnA 알림 생성 메서드
    private void createQnaNotification(Member receiver, Long qno) {
        NotificationDTO notificationDTO = NotificationDTO.builder()
                .memberId(receiver.getId())
                .postId(null)  // QnA는 게시글 ID 없음
                .type(Notification.NotificationType.QNA_RESPONSE)
                .message("📩 QnA #" + qno + "에 새로운 답변이 등록되었습니다.")
                .redirectUrl("/qna/one-to-one")
                .build();

        notificationServiceImpl.createNotification(notificationDTO, receiver.getId());
    }

    @Override
    public List<QnaCommentDTO> getCommentsByQna(Long qno) {
        return qnaCommentRepository.findAll().stream()
                .filter(comment -> comment.getQna().getQno().equals(qno))
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Override
    @PreAuthorize("hasRole('ADMIN')")
    public QnaCommentDTO updateComment(Long qcno, QnaCommentDTO dto) {
        QnaComment comment = qnaCommentRepository.findById(qcno)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 댓글입니다."));

        comment.setQnaCommentContent(dto.getQnaCommentContent());
        comment.setModifiedDate(LocalDate.now());
        QnaComment updatedComment = qnaCommentRepository.save(comment);

        return convertToDTO(updatedComment);
    }

    @Override
    @PreAuthorize("hasRole('ADMIN')")
    public void deleteComment(Long qcno) {
        QnaComment comment = qnaCommentRepository.findById(qcno)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 댓글입니다."));
        qnaCommentRepository.delete(comment);
    }

    // DTO 변환 메서드
    private QnaCommentDTO convertToDTO(QnaComment comment) {
        return QnaCommentDTO.builder()
                .qcno(comment.getQcno())
                .qno(comment.getQna().getQno())
                .id(comment.getId())
                .qnaCommentContent(comment.getQnaCommentContent())
                .regDate(comment.getRegDate())
                .modified(comment.isModified())
                .build();
    }
}