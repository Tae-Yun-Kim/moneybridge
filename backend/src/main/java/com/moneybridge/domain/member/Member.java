package com.moneybridge.domain.member;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.moneybridge.domain.account.Account;
import com.moneybridge.domain.wallet.Wallet;
import com.moneybridge.dto.member.MemberDTO;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.BatchSize;
import org.hibernate.annotations.Fetch;
import org.hibernate.annotations.FetchMode;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.ArrayList;
import java.util.List;

@Entity
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@ToString(exclude = {"wallet", "account", "memberRoleList", "memberGradeList", "lenderStatus"})
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

//    @Column(unique = true, nullable = false)
//    private String accountNumber;

    private String nickname;

    private int creditScore;

    private boolean social;

    private String address;

    @Column(nullable = false)
    private int transactionCount;

    private boolean isLender;

    @ElementCollection(fetch = FetchType.EAGER) // 🔥 즉시 로딩
    @Enumerated(EnumType.STRING)
    private List<LenderStatus> lenderStatus = new ArrayList<>();

    private boolean accountLocked;

    @OneToOne(cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    @JoinColumn(name = "account_number", referencedColumnName = "accountNumber", unique = true)
    private Account account;

    @OneToOne(mappedBy = "member", cascade = CascadeType.ALL, orphanRemoval = true)
    private Wallet wallet;

    @ElementCollection(fetch = FetchType.LAZY)
    @Enumerated(EnumType.STRING)  // ✅ 반드시 STRING으로 저장하도록 변경
    @BatchSize(size = 10)
    @Fetch(FetchMode.SUBSELECT)
    @Builder.Default
    private List<MemberRole> memberRoleList = new ArrayList<>();

    @ElementCollection(fetch = FetchType.EAGER)
    @Enumerated(EnumType.STRING)  // ✅ 문자열로 저장
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

    public void incrementTransactionCount() {
        this.transactionCount++;
        updateMemberGrade(); // 거래 횟수 증가 후 등급 업데이트
    }

    private void updateMemberGrade() {
        clearGrades(); // 기존 등급 초기화
        if (transactionCount >= 20) {
            addGrade(MemberGrade.GOLD);
        } else if (transactionCount >= 10) {
            addGrade(MemberGrade.SILVER);
        } else {
            addGrade(MemberGrade.BRONZE);
        }
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
