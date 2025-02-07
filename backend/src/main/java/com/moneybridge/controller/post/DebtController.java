package com.moneybridge.controller.post;

import com.moneybridge.domain.member.Member;
import com.moneybridge.domain.post.LoanPost;
import com.moneybridge.dto.DebtRequestDTO;
import com.moneybridge.dto.DebtResponseDTO;
import com.moneybridge.dto.post.LoanPostDTO;
import com.moneybridge.repository.member.MemberRepository;
import com.moneybridge.service.post.AuthenticationService;
import com.moneybridge.service.post.DebtService;
import com.moneybridge.service.post.LoanPostService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/debt")
@RequiredArgsConstructor
public class DebtController {

    private final DebtService debtService;
    private final MemberRepository memberRepository;
    private final AuthenticationService authenticationService;
    private final LoanPostService loanPostService;

    @PostMapping("/register")
    public ResponseEntity<DebtResponseDTO> createDebt(@RequestBody DebtRequestDTO requestDTO) {
        // 인증된 사용자의 memberId를 가져옵니다.
        String memberId = authenticationService.getAuthenticatedMemberId();
        System.out.println("Authenticated memberId: " + memberId);

        // 인증된 사용자의 정보를 가져옵니다.
        Member member = memberRepository.findById(memberId)
                .orElseThrow(() -> new RuntimeException("Member not found"));

        // Lender 여부 확인
        boolean isLender = member.isLender();
        System.out.println("Is Lender: " + isLender);

        // LoanPostService의 getLoanPostById(Long id) 메서드 호출
        LoanPostDTO loanPostDTO = loanPostService.getLoanPostById(requestDTO.getPostId().getId());
        if (loanPostDTO == null) {
            // 게시글을 찾을 수 없으면 404 에러 반환
            return ResponseEntity.status(404).body(null);
        }

        // LoanPostDTO를 LoanPost로 변환 (직접 매핑 또는 Mapper 클래스 사용)
        LoanPost loanPost = LoanPost.builder()
                .id(loanPostDTO.getId())
                .loanAmount(loanPostDTO.getLoanAmount())
                .repaymentPeriod(loanPostDTO.getRepaymentPeriod())
                .additionalConditions(loanPostDTO.getAdditionalConditions())
                .build();

        // 상환 상태 확인 (IN_PROGRESS 상태면 부채 등록을 막음)
        String repaymentStatus = debtService.getRepaymentStatusByMemberId(memberId);
        if ("IN_PROGRESS".equals(repaymentStatus)) {
            // 상환 상태가 'IN_PROGRESS'인 경우 부채 등록을 막음
            System.out.println("상환 중인 부채가 있어 등록을 막았습니다. memberId: " + memberId);
            return ResponseEntity.status(400).body(null);
        }
        // 인증된 memberId를 DebtRequestDTO에 설정
        requestDTO.setMember(member);

        // DebtRequestDTO에 LoanPost 설정
        requestDTO.setPostId(loanPost);

        // Debt 생성 로직
        DebtResponseDTO responseDTO = debtService.createDebt(requestDTO);
        return ResponseEntity.ok(responseDTO);
    }


    // 작성자(Member) 정보 조회 (isLender 정보 반환)
    @GetMapping("/member")
    public ResponseEntity<Member> getMemberInfo() {
        // 인증된 사용자의 memberId를 가져옵니다.
        String memberId = authenticationService.getAuthenticatedMemberId();

        // memberId로 멤버 정보 조회
        Member member = memberRepository.findById(memberId)
                .orElseThrow(() -> new RuntimeException("Member not found"));
        return ResponseEntity.ok(member);
    }

//    // ID로 대출 부채 조회
//    @GetMapping("/{debtId}")
//    public ResponseEntity<DebtResponseDTO> getDebtById(@PathVariable Long debtId) {
//        DebtResponseDTO responseDTO = debtService.getDebtById(debtId);
//        return ResponseEntity.ok(responseDTO);
//    }

    // memberId로 대출 부채 조회
    @GetMapping
    public ResponseEntity<List<DebtResponseDTO>> getAllDebts() {
        // 인증된 사용자의 memberId를 가져옵니다.
        String memberId = authenticationService.getAuthenticatedMemberId();

        // 인증된 사용자의 부채 목록을 가져옵니다.
        List<DebtResponseDTO> debts = debtService.getDebtsByMemberId(memberId);

        return ResponseEntity.ok(debts);
    }
    // 상환 상태 업데이트
    @PatchMapping("/{debtId}/status")
    public ResponseEntity<DebtResponseDTO> updateRepaymentStatus(
            @PathVariable Long debtId, @RequestParam String status) {
        DebtResponseDTO responseDTO = debtService.updateRepaymentStatus(debtId, status);
        return ResponseEntity.ok(responseDTO);
    }

    // 대출 연장 요청
    @PostMapping("/{debtId}/extension")
    public ResponseEntity<DebtResponseDTO> requestExtension(@PathVariable Long debtId) {
        DebtResponseDTO responseDTO = debtService.requestExtension(debtId);
        return ResponseEntity.ok(responseDTO);
    }

    // 부채 삭제
    @DeleteMapping("/{debtId}")
    public ResponseEntity<Void> deleteDebt(@PathVariable Long debtId) {
        // 인증된 사용자의 memberId를 가져옵니다.
        String memberId = authenticationService.getAuthenticatedMemberId();

        try {
            // 부채 삭제 서비스 호출
            debtService.deleteDebt(debtId, memberId);
            return ResponseEntity.noContent().build(); // 삭제 성공, 상태 204 반환
        } catch (RuntimeException e) {
            // 예외 처리 (예: 부채 삭제 권한 없음 등)
            return ResponseEntity.status(403).body(null); // 권한 없음, 상태 403 반환
        }
    }
}
