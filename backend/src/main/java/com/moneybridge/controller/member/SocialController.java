package com.moneybridge.controller.member;

import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.moneybridge.dto.member.MemberDTO;
import com.moneybridge.service.member.MemberService;
import com.moneybridge.util.JWTUtil;

import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;

import java.util.Map;

import org.springframework.web.bind.annotation.GetMapping;


@RestController
@Log4j2
@RequiredArgsConstructor
public class SocialController {

    private final MemberService memberService;

    @GetMapping("/api/member/kakao")
    public Map<String, Object> getMemberFromKakao(String accessToken) {

        log.info("accessToken ");
        log.info(accessToken);

        MemberDTO memberDTO = memberService.getKakaoMember(accessToken);

        // Claims 토큰 기반 인증 시스템에서 사용하는데 토큰에 담긴 정보를 나타낸다.
        // 주로 사용자에 대한 정보나 권한, 토큰의 유효기간등이 포함된다.
        Map<String, Object> claims = memberDTO.getClaims();

        String jwtAccessToken = JWTUtil.generateToken(claims, 10);
        String jwtRefreshToken = JWTUtil.generateToken(claims, 60*1);

        claims.put("AccessToken", jwtAccessToken);
        claims.put("refreshToken", jwtRefreshToken);

        return claims;
    }

    @PutMapping("/api/member/social/update")
    public ResponseEntity<MemberDTO> updateSocialMember(@RequestBody @Validated MemberDTO memberDTO) {
        log.info("소셜 회원 정보 수정 요청: {}", memberDTO);

        MemberDTO updatedMemberDTO = memberService.updateSocialMember(memberDTO);

        return ResponseEntity.ok(updatedMemberDTO);
    }
}