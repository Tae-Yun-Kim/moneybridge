package com.moneybridge.service.member;

import com.moneybridge.domain.member.Member;
import com.moneybridge.dto.member.MemberDTO;
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
