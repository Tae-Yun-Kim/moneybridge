//package com.moneybridge.controller.qna;
//
//import com.moneybridge.dto.PageRequestDTO;
//import com.moneybridge.dto.qna.QnaDTO;
//import com.moneybridge.service.qna.QnaService;
//import com.moneybridge.util.CustomFileUtil;
//import lombok.RequiredArgsConstructor;
//import lombok.extern.log4j.Log4j2;
//import org.springframework.beans.propertyeditors.CustomBooleanEditor;
//import org.springframework.http.HttpStatus;
//import org.springframework.http.ResponseEntity;
//import org.springframework.security.core.Authentication;
//import org.springframework.security.core.context.SecurityContextHolder;
//import org.springframework.validation.annotation.Validated;
//import org.springframework.web.bind.WebDataBinder;
//import org.springframework.web.bind.annotation.*;
//
//import java.util.List;
//import java.util.Map;
//
//@RestController
//@RequiredArgsConstructor
//@Log4j2
//@RequestMapping("/api/qna")
//public class QnaController {
//
//    private final CustomFileUtil fileUtil;
//    private final QnaService qnaService;
//
//    @InitBinder
//    public void initBinder(WebDataBinder binder) {
//        binder.registerCustomEditor(Boolean.class, new CustomBooleanEditor("true", "false", true));
//    }
//
//    // QnA 등록
//    @PostMapping("/register")
//    public ResponseEntity<?> register(@Validated @ModelAttribute QnaDTO qnaDTO) {
//        try {
//            // 파일 처리 (파일 저장 및 이름 설정)
//            if (qnaDTO.getFiles() != null && !qnaDTO.getFiles().isEmpty()) {
//                List<String> uploadedFiles = fileUtil.saveFiles(qnaDTO.getFiles());
//                qnaDTO.setUploadFileNames(uploadedFiles);
//            }
//
//            Long qnaId = qnaService.register(qnaDTO);
//            return ResponseEntity.ok(Map.of("id", qnaId));
//        } catch (Exception e) {
//            log.error("[ERROR] QnA 등록 실패", e);
//            return ResponseEntity.internalServerError().body("등록 중 오류가 발생했습니다.");
//        }
//    }
//
//    // QnA 조회
//    @GetMapping("/read/{qno}")
//    public ResponseEntity<?> getQna(@PathVariable(name = "qno") Long qno) {
//        log.info("--------------- [START] QnA 조회 요청: QNO = {} ---------------", qno);
//        try {
//            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
//            String currentUser = authentication.getPrincipal().toString();
//            log.info("현재 인증된 사용자 정보: {}", authentication.getPrincipal());
//            String role = authentication.getAuthorities().toString();
//            log.info("현재 사용자 (currentUser): {}", currentUser);
//
//
//            QnaDTO qnaDTO = qnaService.getQna(qno);
//            log.info("QnA 작성자 (qnaDTO.getId()): {}", qnaDTO.getId());
//
//
//            // 비밀글 권한 체크
//            if (qnaDTO.getIsSecret() && !currentUser.equals(qnaDTO.getId()) && !role.contains("ROLE_ADMIN")) {
//                log.warn("[WARN] QnA 조회 실패: 권한 없음");
//                return ResponseEntity.status(403).body("권한이 없습니다.");
//            }
//
//            log.info("[SUCCESS] QnA 조회 성공: {}", qnaDTO);
//            return ResponseEntity.ok(qnaDTO);
//        } catch (Exception e) {
//            log.error("[ERROR] QnA 조회 중 오류 발생", e);
//            return ResponseEntity.internalServerError().body("QnA 조회 중 오류가 발생했습니다.");
//        } finally {
//            log.info("--------------- [END] QnA 조회 처리 완료 ---------------");
//        }
//    }
//
////    @PutMapping("/{qno}")
////    public ResponseEntity<?> modify(@PathVariable Long qno, @ModelAttribute QnaDTO qnaDTO) {
////        log.info("QnA 수정 요청: {}", qnaDTO);
////
////        try {
////            // QnA 번호 설정
////            qnaDTO.setQno(qno);
////
////            // 제목과 내용 확인 (디버깅용)
////            log.info("Qna Title: {}", qnaDTO.getQnaTitle());
////            log.info("Qna Content: {}", qnaDTO.getQnaContent());
////
////            // 기본값 설정 로직 제거 (실제 값이 제대로 들어왔는지 확인 필요)
////            if (qnaDTO.getQnaTitle() == null || qnaDTO.getQnaTitle().trim().isEmpty()) {
////                return ResponseEntity.badRequest().body("제목은 필수 항목입니다.");
////            }
////            if (qnaDTO.getQnaContent() == null || qnaDTO.getQnaContent().trim().isEmpty()) {
////                return ResponseEntity.badRequest().body("내용은 필수 항목입니다.");
////            }
////
////            // 파일 처리
////            if (qnaDTO.getFiles() != null && !qnaDTO.getFiles().isEmpty()) {
////                List<String> uploadedFiles = fileUtil.saveFiles(qnaDTO.getFiles());
////                qnaDTO.setUploadFileNames(uploadedFiles);
////            }
////
////            qnaService.modify(qnaDTO);
////            return ResponseEntity.ok("수정이 완료되었습니다.");
////        } catch (Exception e) {
////            log.error("QnA 수정 중 오류 발생", e);
////            return ResponseEntity.internalServerError().body("수정 중 오류가 발생했습니다.");
////        }
////    }
//
////    @PutMapping(value = "/modify/{qno}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
////    public ResponseEntity<?> modify(
////            @PathVariable Long qno,
////            @RequestPart("qnaData") String qnaDataJson,
////            @RequestPart(value = "files", required = false) List<MultipartFile> files
////    ) {
////        try {
////            // JSON 데이터를 DTO로 변환
////            log.info("Received qnaDataJson: {}", qnaDataJson);
////            ObjectMapper objectMapper = new ObjectMapper();
////            QnaDTO qnaDTO = objectMapper.readValue(qnaDataJson, QnaDTO.class);
////
////            // QnA 번호 설정
////            log.info("Parsed QnaDTO: {}", qnaDTO);
////            qnaDTO.setQno(qno);
////
////            // 파일 처리
////            if (files != null && !files.isEmpty()) {
////                List<String> uploadedFiles = fileUtil.saveFiles(files);
////                qnaDTO.setUploadFileNames(uploadedFiles);
////            }
////
////            // QnA 수정
////            qnaService.modify(qnaDTO);
////
////            return ResponseEntity.ok("수정이 완료되었습니다.");
////        } catch (JsonProcessingException e) {
////            // JSON 변환 오류 처리
////            log.error("JSON 변환 중 오류 발생: {}", e.getMessage(), e);
////            return ResponseEntity.badRequest().body("JSON 처리 중 오류가 발생했습니다.");
////        } catch (Exception e) {
////            // 일반적인 오류 처리
////            log.error("QnA 수정 중 오류 발생: {}", e.getMessage(), e);
////            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("QnA 수정 중 오류가 발생했습니다.");
////        }
////    }
//
//    @PutMapping(value = "/modify/{qno}")
//public ResponseEntity<?> modify(
//        @PathVariable Long qno,
//        @RequestBody QnaDTO qnaDTO
//) {
//    try {
//        log.info("Received QnA DTO: {}", qnaDTO);
//        qnaDTO.setQno(qno);
//        qnaService.modify(qnaDTO);
//        return ResponseEntity.ok("수정이 완료되었습니다.");
//    } catch (Exception e) {
//        log.error("QnA 수정 중 오류 발생: {}", e.getMessage(), e);
//        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("QnA 수정 중 오류가 발생했습니다.");
//    }
//}
//
//
//
//
//
//
//
//    // QnA 삭제
//    @DeleteMapping("/{qno}")
//    public ResponseEntity<?> remove(@PathVariable(name = "qno") Long qno) {
//        log.info("--------------- [START] QnA 삭제 요청: QNO = {} ---------------", qno);
//        try {
//            log.debug("서비스에 QnA 삭제 요청 전달: QNO = {}", qno);
//            qnaService.remove(qno);
//            log.info("[SUCCESS] QnA 삭제 성공: QNO = {}", qno);
//            return ResponseEntity.ok(Map.of("RESULT", "SUCCESS"));
//        } catch (Exception e) {
//            log.error("[ERROR] QnA 삭제 중 오류 발생: QNO = {}", qno, e);
//            return ResponseEntity.internalServerError().body("QnA 삭제 중 오류가 발생했습니다.");
//        } finally {
//            log.info("--------------- [END] QnA 삭제 처리 완료 ---------------");
//        }
//    }
//
//
//
//
//    // QnA 목록 조회
//    @GetMapping("/list")
//    public ResponseEntity<?> list(PageRequestDTO pageRequestDTO, @RequestParam(required = false) Boolean getAllPosts) {
//        log.info("--------------- [START] QnA 목록 조회 요청: {}, 모든 게시물 조회 여부: {} ---------------", pageRequestDTO, getAllPosts);
//        try {
//            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
//            String id = auth.getName();
//            String role = auth.getAuthorities().toString();
//
//            Object result;
//            if (Boolean.TRUE.equals(getAllPosts)) {
//                log.info("[PROCESS] 모든 게시물 조회");
//                result = qnaService.getAllPosts();
//            } else {
//                log.info("[PROCESS] 사용자별 비밀 게시물 필터링");
//                result = qnaService.getQnaListBySecretStatus(pageRequestDTO, id, role);
//            }
//
//            log.info("[SUCCESS] QnA 목록 조회 성공: {}", result);
//            return ResponseEntity.ok(result);
//        } catch (Exception e) {
//            log.error("[ERROR] QnA 목록 조회 중 오류 발생", e);
//            return ResponseEntity.internalServerError().body("QnA 목록 조회 중 오류가 발생했습니다.");
//        } finally {
//            log.info("--------------- [END] QnA 목록 조회 처리 완료 ---------------");
//        }
//    }
//
//}
