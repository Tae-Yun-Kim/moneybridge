package com.moneybridge.service;

import com.moneybridge.domain.Member;
import com.moneybridge.dto.MemberDTO;
import org.springframework.transaction.annotation.Transactional;

@Transactional
public interface MemberService {

    Member register(MemberDTO memberDTO);

    Member update(MemberDTO memberDTO);

    Member findById(String id);

    void delete(String id, String password);

    MemberDTO updateSocialMember(MemberDTO memberDTO);

    boolean checkFieldDuplicate(String field, String value, boolean social);

    MemberDTO getKakaoMember(String accessToken);
}
