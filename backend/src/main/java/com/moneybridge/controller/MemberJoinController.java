package com.moneybridge.controller;

import com.moneybridge.domain.Member;
import com.moneybridge.dto.MemberDTO;
import com.moneybridge.service.MemberService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/member")
@RequiredArgsConstructor
public class MemberJoinController {

    private final MemberService memberService;
    private final PasswordEncoder passwordEncoder;

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
    @DeleteMapping("/{id}")
    public ResponseEntity<String> delete(@PathVariable String id, @RequestParam String password) {
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

    @GetMapping("/check-duplicate")
    public ResponseEntity<Boolean> checkDuplicate(
            @RequestParam String field,
            @RequestParam String value,
            @RequestParam(required = false, defaultValue = "false") boolean social) {
        boolean isDuplicate = memberService.checkFieldDuplicate(field, value, social);
        return ResponseEntity.ok(isDuplicate);
    }

}

