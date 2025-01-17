package com.moneybridge.service;

import com.moneybridge.domain.member.Member;
import com.moneybridge.domain.member.MemberGrade;
import com.moneybridge.domain.member.MemberRole;
import com.moneybridge.dto.MemberDTO;
import com.moneybridge.repository.MemberRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponents;
import org.springframework.web.util.UriComponentsBuilder;

import java.util.LinkedHashMap;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
@Log4j2
public class MemberServiceImpl implements MemberService {

    private final MemberRepository memberRepository;
    private final PasswordEncoder passwordEncoder; // PasswordEncoder 주입


    @Override
    public Member register(MemberDTO memberDTO) {
        validateDuplicateMember(memberDTO, null);
        // 비밀번호 암호화
        String encodedPassword = passwordEncoder.encode(memberDTO.getPassword());

        Member member = Member.builder()
                .id(memberDTO.getId())
                .password(encodedPassword)
                .name(memberDTO.getName())
                .residentNumber(memberDTO.getResidentNumber())
                .phoneNumber(memberDTO.getPhoneNumber())
                .email(memberDTO.getEmail())
                .accountNumber(memberDTO.getAccountNumber())
                .nickname(memberDTO.getNickname())
                .social(memberDTO.isSocial())
                .address(memberDTO.getAddress())
                .isLender(memberDTO.isLender())
                .accountLocked(false)
                .build();

        member.addRole(MemberRole.USER); // 기본 권한 추가
        member.addGrade(MemberGrade.BRONZE); // 기본 등급 추가

        return memberRepository.save(member);
    }

    @Override
    public Member update(MemberDTO memberDTO) {
        Member member = memberRepository.findById(memberDTO.getId())
                .orElseThrow(() -> new IllegalArgumentException("Member not found: " + memberDTO.getId()));

        // 소셜 로그인 사용자의 이메일 수정 금지
        if (member.isSocial() && !member.getEmail().equals(memberDTO.getEmail())) {
            throw new IllegalArgumentException("소셜 로그인 사용자는 이메일을 수정할 수 없습니다.");
        }
        //주민번호 중복검사
        if (!member.getResidentNumber().equals(memberDTO.getResidentNumber()) &&
                memberRepository.existsByResidentNumber(memberDTO.getResidentNumber())) {
            throw new IllegalArgumentException("Duplicate resident number: " + memberDTO.getResidentNumber());
        }
        //전화번호
        if (!member.getPhoneNumber().equals(memberDTO.getPhoneNumber()) &&
                memberRepository.existsByPhoneNumber(memberDTO.getPhoneNumber())) {
            throw new IllegalArgumentException("Duplicate phone number: " + memberDTO.getPhoneNumber());
        }
        //이메일
        if (!member.getEmail().equals(memberDTO.getEmail()) &&
                memberRepository.existsByEmail(memberDTO.getEmail())) {
            throw new IllegalArgumentException("Duplicate email: " + memberDTO.getEmail());
        }
        //계좌번호
        if (!member.getAccountNumber().equals(memberDTO.getAccountNumber()) &&
                memberRepository.existsByAccountNumber(memberDTO.getAccountNumber())) {
            throw new IllegalArgumentException("Duplicate account number: " + memberDTO.getAccountNumber());
        }
        member.changeMemberinfo(memberDTO, passwordEncoder);
        return memberRepository.save(member);
    }

    @Override
    public MemberDTO updateSocialMember(MemberDTO memberDTO) {
        Member member = memberRepository.findById(memberDTO.getId())
                .orElseThrow(() -> new IllegalArgumentException("Member not found: " + memberDTO.getId()));

        if (!member.isSocial()) {
            throw new IllegalArgumentException("일반 회원은 소셜 수정 API를 사용할 수 없습니다.");
        }

        if (memberDTO.getResidentNumber() != null && (member.getResidentNumber() == null || member.getResidentNumber().isEmpty())) {
            member.setResidentNumber(memberDTO.getResidentNumber());
        }
        if (memberDTO.getPhoneNumber() != null && (member.getPhoneNumber() == null || member.getPhoneNumber().isEmpty())) {
            member.setPhoneNumber(memberDTO.getPhoneNumber());
        }
        if (memberDTO.getAccountNumber() != null && (member.getAccountNumber() == null || member.getAccountNumber().isEmpty())) {
            member.setAccountNumber(memberDTO.getAccountNumber());
        }
        if (memberDTO.getAddress() != null && (member.getAddress() == null || member.getAddress().isEmpty())) {
            member.setAddress(memberDTO.getAddress());
        }

        memberRepository.save(member);
        return entityToDTO(member);
    }

    @Override
    public Member findById(String id) {
        return memberRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Member not found: " + id));
    }

    @Override
    public void delete(String id, String password) {
        Member member = memberRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Member not found: " + id));

        memberRepository.delete(member);
    }

    public void validateDuplicateMember(MemberDTO memberDTO, String memberId) {
        if (memberId == null) {
            // 회원가입: 모든 데이터가 중복되지 않아야 함
            if (memberRepository.existsById(memberDTO.getId())) {
                throw new IllegalArgumentException("Duplicate ID: " + memberDTO.getId());
            }
            if (memberRepository.existsByResidentNumber(memberDTO.getResidentNumber())) {
                throw new IllegalArgumentException("Duplicate resident number: " + memberDTO.getResidentNumber());
            }
            if (memberRepository.existsByPhoneNumber(memberDTO.getPhoneNumber())) {
                throw new IllegalArgumentException("Duplicate phone number: " + memberDTO.getPhoneNumber());
            }
            if (memberRepository.existsByEmail(memberDTO.getEmail())) {
                throw new IllegalArgumentException("Duplicate email: " + memberDTO.getEmail());
            }
            if (memberRepository.existsByAccountNumber(memberDTO.getAccountNumber())) {
                throw new IllegalArgumentException("Duplicate account number: " + memberDTO.getAccountNumber());
            }
        } else {
            // 회원수정: 기존 회원을 제외하고 중복 여부 확인
            if (memberRepository.existsByIdAndIdNot(memberDTO.getId(), memberId)) {
                throw new IllegalArgumentException("Duplicate ID: " + memberDTO.getId());
            }
            if (memberRepository.existsByResidentNumberAndIdNot(memberDTO.getResidentNumber(), memberId)) {
                throw new IllegalArgumentException("Duplicate resident number: " + memberDTO.getResidentNumber());
            }
            if (memberRepository.existsByPhoneNumberAndIdNot(memberDTO.getPhoneNumber(), memberId)) {
                throw new IllegalArgumentException("Duplicate phone number: " + memberDTO.getPhoneNumber());
            }
            if (memberRepository.existsByEmailAndIdNot(memberDTO.getEmail(), memberId)) {
                throw new IllegalArgumentException("Duplicate email: " + memberDTO.getEmail());
            }
            if (memberRepository.existsByAccountNumberAndIdNot(memberDTO.getAccountNumber(), memberId)) {
                throw new IllegalArgumentException("Duplicate account number: " + memberDTO.getAccountNumber());
            }
        }
    }

    public boolean checkFieldDuplicate(String field, String value, boolean social) {
        if ("email".equals(field) && social) {
            return false; // 소셜 사용자의 이메일 중복 체크 제외
        }

        switch (field) {
            case "id":
                return memberRepository.existsById(value);
            case "residentNumber":
                return memberRepository.existsByResidentNumber(value);
            case "phoneNumber":
                return memberRepository.existsByPhoneNumber(value);
            case "email":
                return memberRepository.existsByEmailAndSocial(value, social);
            case "accountNumber":
                return memberRepository.existsByAccountNumber(value);
            default:
                throw new IllegalArgumentException("Invalid field: " + field);
        }
    }

    @Override
    public MemberDTO getKakaoMember(String accessToken) {
        // Kakao AccessToken을 이용해 이메일 가져오기
        String email = getEmailFromKakaoAccessToken(accessToken);

        log.info("Kakao에서 가져온 이메일: " + email);

        // 이메일로 회원 조회
        Optional<Member> result = memberRepository.findByEmail(email);

        if (result.isPresent()) {
            // 기존 회원이라면 DTO로 변환 후 반환
            MemberDTO memberDTO = entityToDTO(result.get());
            log.info("기존 회원으로 로그인 처리: " + memberDTO);
            return memberDTO;
        }

        // 신규 회원일 경우 처리
        log.info("신규 Kakao 회원 등록 시작...");

        // 닉네임은 '소셜회원', 임시 패스워드 생성
        Member socialMember = Member.builder()
                .id(email) // 이메일을 회원 ID로 사용
                .email(email)
                .password(passwordEncoder.encode("SOCIAL_MEMBER_TEMP_PASSWORD")) // 임시 패스워드
                .name("소셜회원")
                .residentNumber("") // 소셜 회원의 경우 주민등록번호 미입력 처리
                .phoneNumber("") // 소셜 회원의 경우 전화번호 미입력 처리
                .accountNumber("") // 소셜 회원의 경우 계좌번호 미입력 처리
                .nickname("소셜회원") // 기본 닉네임 설정
                .social(true) // 소셜 회원임을 표시
                .address("") // 기본 주소값 비우기
                .isLender(false) // 기본적으로 대출자로 설정하지 않음
                .accountLocked(false) // 기본적으로 계정 잠금 해제 상태
                .build();

        // 소셜 회원 등급 및 권한 추가
        socialMember.addRole(MemberRole.USER); // 기본 권한
        socialMember.addGrade(MemberGrade.BRONZE); // 기본 등급

        // DB에 저장
        memberRepository.save(socialMember);

        // DTO로 변환 후 반환
        MemberDTO memberDTO = entityToDTO(socialMember);
        log.info("신규 Kakao 회원 등록 완료: " + memberDTO);
        return memberDTO;
    }

    // accesstoken을 기반으로 사용자의 정보를 얻기위한 메서드
    private String getEmailFromKakaoAccessToken(String accessToken){

        String kakaoGetUserURL = "https://kapi.kakao.com/v2/user/me";

        if(accessToken == null){
            throw new RuntimeException("Access Token is null");
        }
        RestTemplate restTemplate = new RestTemplate();

        HttpHeaders headers = new HttpHeaders();
        headers.add("Authorization", "Bearer " + accessToken);
        headers.add("Content-Type","application/x-www-form-urlencoded");
        HttpEntity<String> entity = new HttpEntity<>(headers);

        UriComponents uriBuilder = UriComponentsBuilder.fromHttpUrl(kakaoGetUserURL).build();

        ResponseEntity<LinkedHashMap> response =
                restTemplate.exchange(
                        uriBuilder.toString(),
                        HttpMethod.GET,
                        entity,
                        LinkedHashMap.class);

        log.info(response);

        LinkedHashMap<String, LinkedHashMap> bodyMap = response.getBody();

        log.info("------------------------------");
        log.info(bodyMap);

        LinkedHashMap<String, String> kakaoAccount = bodyMap.get("kakao_account");

        log.info("kakaoAccount: " + kakaoAccount);

        return kakaoAccount.get("email");

    }

    private MemberDTO entityToDTO(Member member) {
        return new MemberDTO(
                member.getId(),
                member.getPassword(),
                member.getName(),
                member.getResidentNumber(),
                member.getPhoneNumber(),
                member.getEmail(),
                member.getAccountNumber(),
                member.getNickname(),
                member.isSocial(),
                member.getAddress(),
                member.isLender(),
                member.isAccountLocked(),
                member.getMemberRoleList().stream()
                        .map(role -> role.name()) // 역할 리스트를 문자열로 변환
                        .collect(Collectors.toList())
        );
    }


}

