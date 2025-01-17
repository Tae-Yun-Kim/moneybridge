package com.moneybridge.domain.member;


import com.moneybridge.domain.account.Account;
import com.moneybridge.dto.member.MemberDTO;

import jakarta.persistence.*;
import lombok.*;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.ArrayList;
import java.util.List;

@Entity
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@ToString(exclude = "memberRoleList")
public class Member {

    @Id
    private String id;

    private String password;

    private String name;

    @Column(unique = true, nullable = false)
    private String residentNumber;

    @Column(unique = true, nullable = false)
    private String phoneNumber;

    @Column(unique = true, nullable = false)
    private String email;


    private String nickname;

    private boolean social;

    private String address;

    private boolean isLender;

    private boolean accountLocked;

    @OneToOne(cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.EAGER)
    @JoinColumn(name = "account_number", referencedColumnName = "accountNumber", unique = true)
    private Account account;


    @ElementCollection(fetch = FetchType.LAZY)
    @Builder.Default
    private List<MemberRole> memberRoleList = new ArrayList<>();

    @ElementCollection(fetch = FetchType.LAZY)
    @Builder.Default
    private List<MemberGrade> memberGradeList = new ArrayList<>();

    public void addRole(MemberRole memberRole) {
        memberRoleList.add(memberRole);
    }

    public void addGrade(MemberGrade memberGrade) {
        memberGradeList.add(memberGrade);
    }

    public void clearRoles() {
        memberRoleList.clear();
    }

    public void clearGrades() {
        memberGradeList.clear();
    }

    public void changeIsLender(boolean isLender) {
        this.isLender = isLender;
    }

    public void setSocial(boolean social) {
        this.social = social;
    }

    public void setAccount(Account account) {
        if (account != null) {
            this.account = account;
            account.setMember(this);
        } else {
            this.account = null;
        }
    }


    public void changeMemberinfo(MemberDTO memberDTO, PasswordEncoder passwordEncoder){
        // 비밀번호 암호화 후 변경
        if (memberDTO.getPassword() != null && !memberDTO.getPassword().isEmpty()) {
            this.password = passwordEncoder.encode(memberDTO.getPassword());
        }
        if(memberDTO.getEmail() != null){
            this.email = memberDTO.getEmail();
        }
        if(memberDTO.getAddress() != null){
            this.address = memberDTO.getAddress();
        }
        if(memberDTO.getPhoneNumber() != null){
            this.phoneNumber = memberDTO.getPhoneNumber();
        }
        if(memberDTO.getNickname() != null){
            this.nickname = memberDTO.getNickname();
        }

    }
}
