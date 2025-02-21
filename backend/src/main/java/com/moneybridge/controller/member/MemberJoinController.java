package com.moneybridge.controller.member;

import com.moneybridge.domain.member.Member;
import com.moneybridge.dto.member.MemberDTO;
import com.moneybridge.dto.member.TopMemberDTO;
import com.moneybridge.repository.member.MemberRepository;
import com.moneybridge.service.member.MemberService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/member")
@RequiredArgsConstructor
public class MemberJoinController {

    private final MemberService memberService;
    private final PasswordEncoder passwordEncoder;
    private final MemberRepository memberRepository;

    // 회원가입
    @PostMapping("/register")
    public ResponseEntity<Member> register(@RequestBody MemberDTO memberDTO) {
        Member registeredMember = memberService.register(memberDTO);
        return ResponseEntity.ok(registeredMember);
    }

    // 회원정보 수정
    @PutMapping("/update")
    public ResponseEntity<Member> update(@RequestBody MemberDTO memberDTO) {
        Member updatedMember = memberService.update(memberDTO);
        return ResponseEntity.ok(updatedMember);
    }

    // 회원 조회
    @GetMapping("/{id}")
    public ResponseEntity<Member> findById(@PathVariable String id) {
        Member member = memberService.findById(id);
        return ResponseEntity.ok(member);
    }

    // 회원 삭제
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<String> delete(@PathVariable String id, @RequestBody Map<String, String> requestBody) {
        String password = requestBody.get("password");
        System.out.println("회원 삭제 요청 ID: " + id + ", 비밀번호: " + password); // 디버깅용 로그
        // 회원 정보를 가져옴
        Member member = memberService.findById(id);

        // 비밀번호 검증
        if (!passwordEncoder.matches(password, member.getPassword())) {
            // 비밀번호가 일치하지 않으면 예외 처리
            throw new IllegalArgumentException("비밀번호가 올바르지 않습니다.");
        }

        // 회원 삭제 로직
        memberService.delete(id, password);

        return ResponseEntity.ok("Member deleted successfully.");
    }

    // API: 상위 10명 반환

    @GetMapping("/top-members")
//    public List<Member> getTopMembers() {
//        return memberService.getTop10MembersByTransactionCount();
//    }
    public List<TopMemberDTO> getTopMembers() {
        List<Member> members = memberService.getTop10MembersByTransactionCount();

        return members.stream()
                .map(member -> new TopMemberDTO(
                        member.getId(),
                        member.getName(),
                        member.getTransactionCount()
                ))
                .collect(Collectors.toList());
    }

    @PostMapping("/check-duplicate")
//    public ResponseEntity<Boolean> checkDuplicate(
//            @RequestParam String field,
//            @RequestParam String value,
//            @RequestParam(required = false, defaultValue = "false") boolean social) {
//        boolean isDuplicate = memberService.checkFieldDuplicate(field, value, social);
//        return ResponseEntity.ok(isDuplicate);
//    }

//    public ResponseEntity<String> checkDuplicate(@RequestBody MemberDTO memberDTO) {
//        try {
//            System.out.println("🔍 중복 체크 API 호출: " + memberDTO.getEmail());
//            memberService.validateDuplicateMember(memberDTO, null);
//            return ResponseEntity.ok("사용 가능한 정보입니다.");
//        } catch (IllegalArgumentException e) {
//            return ResponseEntity.badRequest().body(e.getMessage());
//        }
//    }

    public ResponseEntity<Boolean> checkDuplicate(@RequestBody Map<String, String> requestData) {
        String field = requestData.get("field");
        String value = requestData.get("value");

        if (field == null || value == null) {
            return ResponseEntity.badRequest().body(null);
        }

        System.out.println("🔍 중복 체크 API 호출: " + field + " = " + value);

        boolean exists;
        switch (field) {
            case "id":
                exists = memberRepository.existsById(value);
                break;
            case "residentNumber":
                exists = memberRepository.existsByResidentNumber(value);
                break;
            case "phoneNumber":
                exists = memberRepository.existsByPhoneNumber(value);
                break;
            case "email":
                exists = memberRepository.existsByEmail(value);
                break;
            case "accountNumber":
                exists = memberRepository.existsByAccount_AccountNumber(value);
                break;
            default:
                return ResponseEntity.badRequest().body(null);
        }

        return ResponseEntity.ok(exists);
    }


}

