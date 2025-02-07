//package com.moneybridge.controller.post;
//
//import com.moneybridge.dto.post.LoanPostDTO;
//import com.moneybridge.service.post.LoanPostService;
//import lombok.RequiredArgsConstructor;
//import org.slf4j.Logger;
//import org.slf4j.LoggerFactory;
//import org.springframework.data.domain.Page;
//import org.springframework.data.domain.PageRequest;
//import org.springframework.data.domain.Pageable;
//import org.springframework.http.HttpStatus;
//import org.springframework.http.ResponseEntity;
//import org.springframework.security.core.context.SecurityContextHolder;
//import org.springframework.web.bind.annotation.*;
//
//import java.util.Map;
//
//@RestController
//@RequestMapping("/api/post")
//@RequiredArgsConstructor
//public class LoanPostController {
//
//    private static final Logger log = LoggerFactory.getLogger(LoanPostController.class);
//
//    private final LoanPostService loanPostService;
//
//
//    @PostMapping("/add")
//    public ResponseEntity<?> createLoanPost(@RequestBody LoanPostDTO loanPostDTO) {
//        log.info("Received request to create LoanPost.");
//
//        try {
//            // 현재 사용자 ID 가져오기
//            String currentUserId = SecurityContextHolder.getContext().getAuthentication().getName();
//            log.info("Current user ID: {}", currentUserId);
//
//            // 게시글 생성
//            LoanPostDTO createdPost = loanPostService.createLoanPost(loanPostDTO, currentUserId); // userId 전달
//            log.info("Successfully created LoanPost: {}", createdPost);
//
//            return ResponseEntity.status(HttpStatus.CREATED).body(createdPost);
//        } catch (RuntimeException e) {
//            log.error("Failed to create LoanPost: {}", e.getMessage(), e);
//
//            // 출자자가 아닌 경우 명확한 메시지를 반환
//            if ("Only lenders can create loan posts.".equals(e.getMessage())) {
//                return ResponseEntity.status(HttpStatus.FORBIDDEN)
//                        .body(Map.of("error", "FORBIDDEN", "message", "Only lenders can create loan posts."));
//            }
//
//            // 다른 예외 처리
//            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
//                    .body(Map.of("error", "BAD_REQUEST", "message", e.getMessage()));
//        }
//    }
//
//
//@GetMapping("/view/{id}")
//public ResponseEntity<LoanPostDTO> getLoanPostById(@PathVariable Long id) {
//    log.info("Received request to fetch LoanPost by ID: {}", id);
//    try {
//        // 서비스에서 게시글과 댓글 데이터를 가져옴
//        LoanPostDTO loanPost = loanPostService.getLoanPostById(id);
//        log.info("Successfully fetched LoanPost: {}", loanPost);
//        return ResponseEntity.ok(loanPost);
//    } catch (RuntimeException e) {
//        log.error("Failed to fetch LoanPost by ID: {}", id, e);
//        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
//    }
//}
//
//    // 모든 대출 게시글을 조회하는 API
//    @GetMapping("/list")
//    public ResponseEntity<Page<LoanPostDTO>> getPaginatedLoanPosts(
//            @RequestParam(defaultValue = "0") int page,
//            @RequestParam(defaultValue = "10") int size) {
//
//        log.info("Received request to fetch paginated LoanPosts");
//
//        Pageable pageable = PageRequest.of(page, size);
//        Page<LoanPostDTO> loanPosts = loanPostService.getLoanPosts(pageable);
//
//        log.info("Successfully fetched paginated LoanPosts: {}", loanPosts.getTotalElements());
//        return ResponseEntity.ok(loanPosts);
//    }
//
//    // 대출 게시글을 수정하는 API
//    @PutMapping("/update/{id}")
//    public ResponseEntity<LoanPostDTO> updateLoanPost(@PathVariable Long id, @RequestBody LoanPostDTO loanPostDTO) {
//        log.info("Received request to update LoanPost with ID: {} using DTO: {}", id, loanPostDTO);
//        try {
//            LoanPostDTO updatedPost = loanPostService.updateLoanPost(id, loanPostDTO);
//            log.info("Successfully updated LoanPost: {}", updatedPost);
//            return ResponseEntity.ok(updatedPost);
//        } catch (RuntimeException e) {
//            log.error("Failed to update LoanPost with ID: {}", id, e);
//            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
//        }
//    }
//
//    // 대출 게시글을 삭제하는 API
//    @DeleteMapping("/delete/{id}")
//    public ResponseEntity<Void> deleteLoanPost(@PathVariable Long id) {
//        log.info("Received request to delete LoanPost with ID: {}", id);
//        try {
//            loanPostService.deleteLoanPost(id);
//            log.info("Successfully deleted LoanPost with ID: {}", id);
//            return ResponseEntity.noContent().build();
//        } catch (RuntimeException e) {
//            log.error("Failed to delete LoanPost with ID: {}", id, e);
//            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
//        }
//    }
//}
package com.moneybridge.controller.post;

import com.moneybridge.dto.post.LoanPostDTO;
import com.moneybridge.service.post.LoanPostService;
import lombok.RequiredArgsConstructor;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/post")
@RequiredArgsConstructor
public class LoanPostController {

    private static final Logger log = LoggerFactory.getLogger(LoanPostController.class);

    private final LoanPostService loanPostService;

    @PostMapping("/add")
    public ResponseEntity<?> createLoanPost(@RequestBody LoanPostDTO loanPostDTO) {
        log.info("Received request to create LoanPost with title: {}", loanPostDTO.getTitle());

        try {
            String currentUserId = SecurityContextHolder.getContext().getAuthentication().getName();
            log.info("Current user ID: {}", currentUserId);

            LoanPostDTO createdPost = loanPostService.createLoanPost(loanPostDTO, currentUserId);
            log.info("Successfully created LoanPost: {}", createdPost);

            return ResponseEntity.status(HttpStatus.CREATED).body(createdPost);
        } catch (RuntimeException e) {
            log.error("Failed to create LoanPost: {}", e.getMessage(), e);

            if ("Only lenders can create loan posts.".equals(e.getMessage())) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(Map.of("error", "FORBIDDEN", "message", "Only lenders can create loan posts."));
            }

            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("error", "BAD_REQUEST", "message", e.getMessage()));
        }
    }

    @GetMapping("/view/{id}")
    public ResponseEntity<LoanPostDTO> getLoanPostById(@PathVariable Long id) {
        log.info("Received request to fetch LoanPost by ID: {}", id);
        try {
            LoanPostDTO loanPost = loanPostService.getLoanPostById(id);
            log.info("Successfully fetched LoanPost: {}", loanPost);
            return ResponseEntity.ok(loanPost);
        } catch (RuntimeException e) {
            log.error("Failed to fetch LoanPost by ID: {}", id, e);
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }
    }

    @GetMapping("/list")
    public ResponseEntity<Page<LoanPostDTO>> getPaginatedLoanPosts(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        log.info("Received request to fetch paginated LoanPosts");

        Pageable pageable = PageRequest.of(page, size);
        Page<LoanPostDTO> loanPosts = loanPostService.getLoanPosts(pageable);

        log.info("Successfully fetched paginated LoanPosts: {}", loanPosts.getTotalElements());
        return ResponseEntity.ok(loanPosts);
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<LoanPostDTO> updateLoanPost(@PathVariable Long id, @RequestBody LoanPostDTO loanPostDTO) {
        log.info("Received request to update LoanPost with ID: {}, new title: {}", id, loanPostDTO.getTitle());
        try {
            LoanPostDTO updatedPost = loanPostService.updateLoanPost(id, loanPostDTO);
            log.info("Successfully updated LoanPost: {}", updatedPost);
            return ResponseEntity.ok(updatedPost);
        } catch (RuntimeException e) {
            log.error("Failed to update LoanPost with ID: {}", id, e);
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Void> deleteLoanPost(@PathVariable Long id) {
        log.info("Received request to delete LoanPost with ID: {}", id);
        try {
            loanPostService.deleteLoanPost(id);
            log.info("Successfully deleted LoanPost with ID: {}", id);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            log.error("Failed to delete LoanPost with ID: {}", id, e);
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }
}
