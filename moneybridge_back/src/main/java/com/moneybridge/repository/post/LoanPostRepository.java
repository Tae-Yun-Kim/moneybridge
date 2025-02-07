package com.moneybridge.repository.post;

import com.moneybridge.domain.post.LoanPost;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface LoanPostRepository extends JpaRepository<LoanPost, Long> {

    // 작성자 ID 기반 대출 게시글 조회 (페이지네이션 지원)
    @Query("SELECT lp FROM LoanPost lp")
    Page<LoanPost> findAllPosts(Pageable pageable);
}