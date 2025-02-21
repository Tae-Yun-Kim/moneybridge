package com.moneybridge.service.post;

import com.moneybridge.dto.member.MemberDTO;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

@Service
public class AuthenticationService {

    // memberId 추출하는 메서드
    public String getAuthenticatedMemberId() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        MemberDTO memberDTO = (MemberDTO) authentication.getPrincipal();
        return memberDTO.getId();
    }
}
