//package com.moneybridge.service.post;
//
//import com.moneybridge.dto.post.LoanPostDTO;
//import org.springframework.data.domain.Page;
//import org.springframework.data.domain.Pageable;
//
//public interface LoanPostService {
//    // 현재 로그인된 사용자의 ID를 받아 게시글 생성
//    LoanPostDTO createLoanPost(LoanPostDTO loanPostDTO, String userId);
//    //상세페이지
//    LoanPostDTO getLoanPostById(Long id);
//
//    // 모든 대출 게시글 조회 로직
//    Page<LoanPostDTO> getLoanPosts(Pageable pageable);
//    //수정
//    LoanPostDTO updateLoanPost(Long id, LoanPostDTO loanPostDTO);
//    //삭제
//    void deleteLoanPost(Long id);
//}
//
package com.moneybridge.service.post;

import com.moneybridge.dto.post.LoanPostDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface LoanPostService {
    // 게시글 생성
    LoanPostDTO createLoanPost(LoanPostDTO loanPostDTO, String userId);

    // 상세 페이지 조회
    LoanPostDTO getLoanPostById(Long id);

    // 게시글 목록 조회 (페이징)
    Page<LoanPostDTO> getLoanPosts(Pageable pageable);

    // 게시글 수정
    LoanPostDTO updateLoanPost(Long id, LoanPostDTO loanPostDTO);

    // 게시글 삭제
    void deleteLoanPost(Long id);
}
