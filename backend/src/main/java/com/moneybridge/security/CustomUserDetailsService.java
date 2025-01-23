package com.moneybridge.security;

import java.util.stream.Collectors;

import com.moneybridge.domain.member.Member;
import com.moneybridge.dto.member.MemberDTO;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import com.moneybridge.repository.member.MemberRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;

@Service
@Log4j2
@RequiredArgsConstructor//스프링 시큐리티는 사용자의 인증 처리를 위해서 UserDetailsService라는 인터페이스의 구현체를 활용한다.
public class CustomUserDetailsService implements UserDetailsService{

    private final MemberRepository memberRepository;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {

        log.info("----------------loadUserByUsername-----------------------------");

        Member member = memberRepository.getWithRoles(username);

        if(member == null){
            throw new UsernameNotFoundException("Not Found");
        }

        MemberDTO memberDTO = new MemberDTO(
                member.getId(),
                member.getPassword(),
                member.getName(),
                member.getResidentNumber(),
                member.getPhoneNumber(),
                member.getEmail(),
                member.getAccount() != null ? member.getAccount().getAccountNumber() : null ,
                member.getNickname(),
                member.isSocial(),
                member.getAddress(),
                member.isLender(),
                member.isAccountLocked(),
                member.getMemberRoleList()
                        .stream()
                        .map(memberRole -> memberRole.name()).collect(Collectors.toList()));

        log.info(memberDTO);

        return memberDTO;

    }

}