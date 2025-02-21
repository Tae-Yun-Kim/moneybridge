package com.moneybridge.controller.qna;

import com.moneybridge.dto.PageRequestDTO;
import com.moneybridge.dto.qna.QnaDTO;
import com.moneybridge.service.qna.QnaService;

import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.beans.propertyeditors.CustomBooleanEditor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.WebDataBinder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequiredArgsConstructor
@Log4j2
@RequestMapping("/api/qna")
public class QnaController {


    private final QnaService qnaService;

    @InitBinder
    public void initBinder(WebDataBinder binder) {
        binder.registerCustomEditor(Boolean.class, new CustomBooleanEditor("true", "false", true));
    }

    // QnA 등록
    @PostMapping("/register")
    public ResponseEntity<?> register(@Validated @ModelAttribute QnaDTO qnaDTO) {
        try {


            Long qnaId = qnaService.register(qnaDTO);
            return ResponseEntity.ok(Map.of("id", qnaId));
        } catch (Exception e) {
            log.error("[ERROR] QnA 등록 실패", e);
            return ResponseEntity.internalServerError().body("등록 중 오류가 발생했습니다.");
        }
    }

    // ✅ QnA 조회 - 비밀글은 작성자 본인 또는 ROLE_ADMIN만 조회 가능하도록 수정
    @GetMapping("/read/{qno}")
    public ResponseEntity<?> getQna(
            @PathVariable(name = "qno") Long qno,
            @RequestParam(name = "id") String requesterId // ✅ 요청한 사용자 ID (프론트에서 ?id=... 로 전송)
    ) {
        log.info("--------------- [START] QnA 조회 요청: QNO = {}, 요청자 ID = {} ---------------", qno, requesterId);
        try {
            // **(1) QnA 정보 조회**
            QnaDTO qnaDTO = qnaService.getQna(qno);
            log.info("QnA 작성자 (qnaDTO.getId()): {}", qnaDTO.getId());

            // **(2) SecurityContextHolder 에서 현재 사용자 권한 확인**
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            String role = auth.getAuthorities().toString();
            log.info("현재 사용자 ROLE = {}", role); // 예: [ROLE_ADMIN]

            // **(3) 비밀글 접근 권한 확인**
            // - 작성자가 아닌 경우
            // - 그리고 관리자 권한(ROLE_ADMIN)도 없는 경우
            if (qnaDTO.getIsSecret()) {
                boolean isWriter = requesterId.equals(qnaDTO.getId());
                boolean isAdmin = role.contains("ROLE_ADMIN");

                if (!isWriter && !isAdmin) {
                    log.warn("[WARN] QnA 조회 실패: 비밀글 접근 권한 없음 (작성자도, 관리자도 아님)");
                    return ResponseEntity.status(403).body("해당 게시글을 볼 수 있는 권한이 없습니다.");
                }
            }

            log.info("[SUCCESS] QnA 조회 성공: {}", qnaDTO);
            return ResponseEntity.ok(qnaDTO);
        } catch (Exception e) {
            log.error("[ERROR] QnA 조회 중 오류 발생", e);
            return ResponseEntity.internalServerError().body("QnA 조회 중 오류가 발생했습니다.");
        } finally {
            log.info("--------------- [END] QnA 조회 처리 완료 ---------------");
        }
    }

    // QnA 수정
    @PutMapping(value = "/modify/{qno}")
    public ResponseEntity<?> modify(
            @PathVariable Long qno,
            @RequestBody QnaDTO qnaDTO
    ) {
        try {
            log.info("Received QnA DTO: {}", qnaDTO);
            qnaDTO.setQno(qno);
            qnaService.modify(qnaDTO);
            return ResponseEntity.ok("수정이 완료되었습니다.");
        } catch (Exception e) {
            log.error("QnA 수정 중 오류 발생: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("QnA 수정 중 오류가 발생했습니다.");
        }
    }

    @DeleteMapping("/{qno}")
    public ResponseEntity<?> remove(
            @PathVariable(name = "qno") Long qno
    ) {
        log.info("--------------- [START] QnA 삭제 요청: QNO = {} ---------------", qno);
        try {
            // 1) QnA 정보를 조회
            QnaDTO qnaDTO = qnaService.getQna(qno);
            // ↑ DTO를 가져오든, Entity를 직접 가져오든 괜찮습니다.
            // 여기서는 서비스단에서 엔티티 -> DTO 변환 가정

            if (qnaDTO == null) {
                log.warn("[WARN] 해당 QnA가 존재하지 않습니다. QNO = {}", qno);
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("해당 QnA가 존재하지 않습니다.");
            }

            // 2) 권한 체크: 작성자 or 관리자
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();

            String currentUserId = auth.getName();             // 로그인된 사용자 ID
            log.info(" currentUserId={}",  currentUserId);


            // 3) 서비스에서 실제 삭제
            //    QnA 엔티티를 가져와 repository.delete() → cascade로 첨부/댓글도 같이 삭제
            qnaService.remove(qno);

            log.info("[SUCCESS] QnA 삭제 성공: QNO = {}", qno);
            return ResponseEntity.ok(Map.of("RESULT", "SUCCESS"));
        } catch (Exception e) {
            log.error("[ERROR] QnA 삭제 중 오류 발생: QNO = {}", qno, e);
            return ResponseEntity.internalServerError().body("QnA 삭제 중 오류가 발생했습니다.");
        } finally {
            log.info("--------------- [END] QnA 삭제 처리 완료 ---------------");
        }
    }

    // QnA 목록 조회
    @GetMapping("/list")
    public ResponseEntity<?> list(PageRequestDTO pageRequestDTO,
                                  @RequestParam(required = false) Boolean getAllPosts) {
        log.info("--------------- [START] QnA 목록 조회 요청: {}, 모든 게시물 조회 여부: {} ---------------", pageRequestDTO, getAllPosts);
        try {
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            String id = auth.getName();
            String role = auth.getAuthorities().toString();

            Object result;
            if (Boolean.TRUE.equals(getAllPosts)) {
                log.info("[PROCESS] 모든 게시물 조회");
                result = qnaService.getAllPosts();
            } else {
                log.info("[PROCESS] 사용자별 비밀 게시물 필터링");
                result = qnaService.getQnaListBySecretStatus(pageRequestDTO, id, role);
            }

            log.info("[SUCCESS] QnA 목록 조회 성공: {}", result);
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            log.error("[ERROR] QnA 목록 조회 중 오류 발생", e);
            return ResponseEntity.internalServerError().body("QnA 목록 조회 중 오류가 발생했습니다.");
        } finally {
            log.info("--------------- [END] QnA 목록 조회 처리 완료 ---------------");
        }

    }
    /**
     * QnA의 complete 상태 업데이트 API
     */
    @PutMapping("/{qno}/complete")
    public ResponseEntity<String> updateCompleteStatus(@PathVariable Long qno) {
        try {
            qnaService.updateCompleteStatus(qno);
            return ResponseEntity.ok("QnA 상태가 '답변완료'로 변경되었습니다.");
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }
}
