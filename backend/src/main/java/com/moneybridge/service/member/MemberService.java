package com.moneybridge.service.member;

import com.moneybridge.domain.member.Member;
<<<<<<< HEAD
import com.moneybridge.dto.MemberDTO;
=======
import com.moneybridge.dto.member.MemberDTO;
>>>>>>> 1ad78b99e14620fe3d0b28be2235ba78585b6f1e
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
