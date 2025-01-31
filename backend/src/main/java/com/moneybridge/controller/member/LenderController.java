package com.moneybridge.controller.member;

import com.moneybridge.domain.member.Member;
import com.moneybridge.service.member.MemberService;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/lender")
@RequiredArgsConstructor
@Log4j2
public class LenderController {

    private final MemberService memberService;


    //사용자가 신청 또는 포기 요청
    @PostMapping("/request")
    public ResponseEntity<String> toggleLenderRequset(@RequestBody Map<String, String> request){
        String userId = request.get("id");
        String result = memberService.requestLenderToggle(userId);
        return ResponseEntity.ok(result);
    }

    //관리자가 승인 또는 거절
    @PostMapping("/approve")
    public ResponseEntity<String> approveLenderRequest(@RequestBody Map<String, String> request){
        String userId = request.get("id");
        boolean approve = Boolean.parseBoolean(request.get("approve"));

        log.info("받은 유저 id : " + userId);
        log.info("승인여부 : " + approve);

        String result = memberService.approveLenderRequest(userId, approve);
        return ResponseEntity.ok(result);
    }

    @PostMapping("/surrender")
    public ResponseEntity<String> surrenderLender(@RequestParam String memberId) {
        String result = memberService.surrenderLender(memberId);
        return ResponseEntity.ok(result);
    }

    // 3. 신청 목록 조회 API (관리자용)
    @GetMapping("/pending")
    public ResponseEntity<List<Member>> getPendingLenderRequests() {
        List<Member> pendingMembers = memberService.getPendingLenderRequests();
        return ResponseEntity.ok(pendingMembers);
    }

}
