//package com.moneybridge.service.qna;
//
//import com.moneybridge.domain.member.Member;
//import com.moneybridge.domain.qna.Qna;
//import com.moneybridge.domain.qna.QnaAttachment;
//import com.moneybridge.dto.PageRequestDTO;
//import com.moneybridge.dto.PageResponseDTO;
//import com.moneybridge.dto.qna.QnaDTO;
//import com.moneybridge.repository.member.MemberRepository;
//import com.moneybridge.repository.qna.QnaAttachmentsRepository;
//import com.moneybridge.repository.qna.QnaRepository;
//import jakarta.persistence.EntityNotFoundException;
//import lombok.RequiredArgsConstructor;
//import lombok.extern.log4j.Log4j2;
//import org.springframework.data.domain.Page;
//import org.springframework.data.domain.PageRequest;
//import org.springframework.data.domain.Sort;
//import org.springframework.stereotype.Service;
//import org.springframework.transaction.annotation.Transactional;
//
//import java.util.List;
//import java.util.stream.Collectors;
//
//@Service
//@RequiredArgsConstructor
//@Log4j2
//@Transactional
//public class QnaServiceImpl implements QnaService {
//
//    private final QnaRepository qnaRepository;
//    private final MemberRepository memberRepository;
//    private final QnaAttachmentsRepository qnaAttachmentsRepository;
//
//    @Override
//    public PageResponseDTO<QnaDTO> getQnaListBySecretStatus(PageRequestDTO pageRequestDTO, String id, String role) {
//        try {
//            PageRequest pageable = PageRequest.of(pageRequestDTO.getPage() - 1, pageRequestDTO.getSize(), Sort.by("qno").descending());
//
//            Page<Qna> result = qnaRepository.findAll(pageable);
//            List<QnaDTO> dtoList = result.getContent().stream()
//                    .map(qna -> {
//                        QnaDTO dto = entityToDTO(qna);
//                        if (qna.isSecret() && !qna.getMember().getId().equals(id) && !role.contains("ROLE_ADMIN")) {
//                            dto.setQnaTitle("비밀글입니다");
//                            dto.setQnaContent(null);
//                        }
//                        return dto;
//                    })
//                    .collect(Collectors.toList());
//
//            log.info("[DEBUG] 조회된 QnA DTO 리스트: {}", dtoList);
//
//            return PageResponseDTO.<QnaDTO>withAll()
//                    .dtoList(dtoList)
//                    .totalCount(result.getTotalElements())
//                    .pageRequestDTO(pageRequestDTO)
//                    .build();
//        } catch (Exception e) {
//            log.error("QnA 목록 조회 중 오류 발생", e);
//            throw new RuntimeException("QnA 목록 조회 중 오류가 발생했습니다.", e);
//        }
//    }
//
//
//    @Override
//    public Long register(QnaDTO qnaDTO) {
//        log.info("QnA 등록 요청 데이터: {}", qnaDTO);
//
//        if (qnaDTO.getQnaTitle() == null || qnaDTO.getQnaTitle().isBlank()) {
//            throw new IllegalArgumentException("제목은 필수 입력 항목입니다.");
//        }
//        if (qnaDTO.getCategory() == null || qnaDTO.getCategory().isBlank()) {
//            throw new IllegalArgumentException("카테고리는 필수 항목입니다.");
//        }
//
//        Member member = memberRepository.findById(qnaDTO.getId())
//                .orElseThrow(() -> new IllegalStateException("회원 정보를 찾을 수 없습니다."));
//
//        Qna qna = dtoToEntity(qnaDTO);
//        qna.setMember(member);
//
//        Qna savedQna = qnaRepository.save(qna);
//
//        // 첨부파일 저장
//        if (qnaDTO.getFiles() != null && !qnaDTO.getFiles().isEmpty()) {
//            qnaDTO.getFiles().forEach(file -> {
//                String fileType = file.getContentType() != null && file.getContentType().startsWith("image") ? "image" : "file";
//                QnaAttachment attachment = QnaAttachment.builder()
//                        .fileName(file.getOriginalFilename())
//                        .fileType(fileType)
//                        .build();
//                attachment.setQna(savedQna); // Qna와의 관계 설정
//                qnaAttachmentsRepository.save(attachment);
//            });
//        }
//
//        log.info("QnA 등록 성공: {}", savedQna);
//        return savedQna.getQno();
//    }
//
//
//    @Override
//    public QnaDTO getQna(Long qno) {
//        try {
//            log.info("QnA 조회 요청: QNO = {}", qno);
//
//            // QnA 엔티티 조회
//            Qna qna = qnaRepository.findById(qno)
//                    .orElseThrow(() -> new RuntimeException("QnA not found: " + qno));
//
//            // 엔티티를 DTO로 변환
//            QnaDTO dto = entityToDTO(qna);
//
//            // 첨부파일 조회
//            List<String> fileNames = qnaAttachmentsRepository.findByQna(qna).stream()
//                    .map(QnaAttachment::getFileName)
//                    .collect(Collectors.toList());
//            dto.setUploadFileNames(fileNames);
//
//            return dto;
//        } catch (Exception e) {
//            log.error("QnA 조회 중 오류 발생", e);
//            throw new RuntimeException("QnA 조회 중 오류가 발생했습니다.", e);
//        }
//    }
//
//
//
//    @Override
//    @Transactional
//    public void modify(QnaDTO qnaDTO) {
//        Qna qna = qnaRepository.findById(qnaDTO.getQno())
//                .orElseThrow(() -> new RuntimeException("QnA not found: " + qnaDTO.getQno()));
//
//        // QnA 정보 수정
//        if (qnaDTO.getQnaTitle() != null) {
//            qna.changeTitle(qnaDTO.getQnaTitle());
//        }
//        if (qnaDTO.getQnaContent() != null) {
//            qna.changeContent(qnaDTO.getQnaContent());
//        }
//        qna.setSecret(qnaDTO.getIsSecret());
//
//        // 기존 첨부파일 삭제
//        qnaAttachmentsRepository.deleteByQna(qna);
//
//        // 새 파일 추가
//        if (qnaDTO.getFiles() != null && !qnaDTO.getFiles().isEmpty()) {
//            qnaDTO.getFiles().forEach(file -> {
//                QnaAttachment attachment = QnaAttachment.builder()
//                        .fileName(file.getOriginalFilename())
//                        .fileType(file.getContentType())
//                        .qna(qna)
//                        .build();
//                qnaAttachmentsRepository.save(attachment);
//            });
//        }
//
//        qnaRepository.save(qna);
//        log.info("QnA 수정 완료: {}", qna);
//    }
//
//
//    @Override
//    @Transactional
//    public void remove(Long qno) {
//        try {
//            log.info("QnA 삭제 요청: QNO = {}", qno);
//
//            // QnA 존재 여부 확인
//            log.debug("QnA 존재 여부 확인 중...");
//            Qna qna = qnaRepository.findById(qno)
//                    .orElseThrow(() -> new EntityNotFoundException("QnA not found with QNO = " + qno));
//            log.debug("QnA 존재 확인 완료: QNO = {}", qno);
//
//            // 첨부파일 삭제
//            log.debug("첨부파일 삭제 시작: QNO = {}", qno);
//            qnaAttachmentsRepository.deleteByQna(qna);
//            log.debug("첨부파일 삭제 완료: QNO = {}", qno);
//
//            // QnA 삭제
//            log.debug("QnA 삭제 시작: QNO = {}", qno);
//            qnaRepository.delete(qna);
//            log.info("QnA 삭제 완료: QNO = {}", qno);
//        } catch (Exception e) {
//            log.error("QnA 삭제 중 오류 발생: QNO = {}", qno, e);
//            throw new RuntimeException("QnA 삭제 중 오류가 발생했습니다.", e);
//        }
//    }
//
//
//
//    @Override
//    public List<QnaDTO> getAllPosts() {
//        try {
//            log.info("모든 QnA 게시글 조회 요청");
//            List<Qna> qnaList = qnaRepository.findAll();
//            return qnaList.stream()
//                    .map(this::entityToDTO)
//                    .collect(Collectors.toList());
//        } catch (Exception e) {
//            log.error("모든 QnA 게시글 조회 중 오류 발생", e);
//            throw new RuntimeException("모든 QnA 게시글 조회 중 오류가 발생했습니다.", e);
//        }
//    }
//
//    @Override
//    public void increaseViewCount(Long qno) {
//        try {
//            log.info("QnA 조회수 증가 요청: QNO = {}", qno);
//            Qna qna = qnaRepository.findById(qno)
//                    .orElseThrow(() -> new RuntimeException("QnA not found: " + qno));
//            qna.increaseViewCount();
//            qnaRepository.save(qna);
//            log.info("QnA 조회수 증가 완료: QNO = {}", qno);
//        } catch (Exception e) {
//            log.error("QnA 조회수 증가 중 오류 발생", e);
//            throw new RuntimeException("QnA 조회수 증가 중 오류가 발생했습니다.", e);
//        }
//    }
//
//    @Override
//    public List<QnaDTO> getQnaByCategory(String category) {
//        try {
//            log.info("카테고리별 QnA 조회 요청: 카테고리 = {}", category);
//            return qnaRepository.findByCategory(category)
//                    .stream()
//                    .map(this::entityToDTO)
//                    .collect(Collectors.toList());
//        } catch (Exception e) {
//            log.error("카테고리별 QnA 조회 중 오류 발생", e);
//            throw new RuntimeException("카테고리별 QnA 조회 중 오류가 발생했습니다.", e);
//        }
//    }
//
//    private Qna dtoToEntity(QnaDTO dto) {
//        Member member = memberRepository.findById(dto.getId())
//                .orElseThrow(() -> new RuntimeException("Member not found: " + dto.getId()));
//
//        return Qna.builder()
//                .qno(dto.getQno())
//                .qnaTitle(dto.getQnaTitle())
//                .qnaContent(dto.getQnaContent())
//                .member(member)
//                .isSecret(dto.getIsSecret())
//                .category(dto.getCategory())
//                .build();
//    }
//
//    private QnaDTO entityToDTO(Qna entity) {
//        // Member 정보가 없을 경우 기본값 설정
//        String id = entity.getMember() != null ? entity.getMember().getId() : "Unknown";
////        String id = entity.getMember() != null ? entity.getMember().getId() : "Anonymous";
//
//        return QnaDTO.builder()
//                .qno(entity.getQno())
//                .qnaTitle(entity.getQnaTitle())
//                .qnaContent(entity.getQnaContent())
//                .id(id) // Member가 없으면 기본값으로 설정
//
//                .isSecret(entity.isSecret())
//                .category(entity.getCategory())
//                .build();
//    }
//
//}
