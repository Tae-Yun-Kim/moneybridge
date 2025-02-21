package com.moneybridge.repository.qna;

import com.moneybridge.domain.qna.QnaComment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface QnaCommentRepository extends JpaRepository<QnaComment, Long> {
}

