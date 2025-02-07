package com.moneybridge.dto.member;

import com.moneybridge.domain.member.LenderStatus;
import lombok.*;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Getter
@Setter
@ToString
public class MemberDTO extends User {
    private String id;
    private String password;
    private String name;
    private String residentNumber;
    private String email;
    private String phoneNumber;
    private String accountNumber;
    private String nickname;
    private boolean social;
    private String address;
    private boolean isLender;
    private boolean accountLocked;
    private List<String> lenderStatus; // LenderStatus 필드 추가
    private List<String> roleNames = new ArrayList<>();
    private List<String> memberGradeList; // 등급 추가

<<<<<<< HEAD

    public MemberDTO(String id, String password, String name, String residentNumber, String phoneNumber, String email, String accountNumber, String nickname, boolean social, String address, boolean isLender, boolean accountLocked, List<String> lenderStatus, List<String> roleNames, List<String> memberGradeList) {
=======
    public MemberDTO(String id, String password, String name, String residentNumber, String phoneNumber, String email, String accountNumber, String nickname, boolean social, String address, boolean isLender, boolean accountLocked, List<String> lenderStatus, List<String> roleNames) {
>>>>>>> c18324b9960a4447aa724017219b545b773bffeb
        super(
                id,
                password,
                // roleNames가 null이면 기본값으로 "USER" 추가
                (roleNames != null ? roleNames : List.of("USER"))
                        .stream()
                        .map(str -> new SimpleGrantedAuthority("ROLE_" + str))
                        .collect(Collectors.toList())
        );

        this.id = id;
        this.password = password;
        this.name = name;
        this.residentNumber = residentNumber;
        this.phoneNumber = phoneNumber;
        this.email = email;
        this.accountNumber = accountNumber;
        this.nickname = nickname;
        this.social = social;
        this.address = address;
        this.isLender = isLender;
        this.accountLocked = accountLocked;
        this.lenderStatus = lenderStatus;
        this.roleNames = roleNames;
        this.memberGradeList = memberGradeList;
    }

    public Map<String, Object> getClaims() {

        Map<String, Object> dataMap = new HashMap<>();

        dataMap.put("id", id);
        dataMap.put("password",password);
        dataMap.put("name", name);
        dataMap.put("residentNumber", residentNumber);
        dataMap.put("phoneNumber", phoneNumber);
        dataMap.put("email", email);
        dataMap.put("accountNumber", accountNumber);
        dataMap.put("nickname", nickname);
        dataMap.put("social", social);
        dataMap.put("address", address);
        dataMap.put("isLender", isLender);
        dataMap.put("accountLocked", accountLocked);
        dataMap.put("lenderStatus", lenderStatus);
        dataMap.put("roleNames", roleNames);
        dataMap.put("memberGradeList", memberGradeList);

        return dataMap;
    }
}
