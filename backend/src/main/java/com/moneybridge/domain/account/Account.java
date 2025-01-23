package com.moneybridge.domain.account;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.moneybridge.domain.member.Member;
import com.moneybridge.domain.wallet.Wallet;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@ToString(exclude = "member")
public class Account {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long aid;

    @Column(unique = true, nullable = false)
    private String accountNumber;

    @Column(nullable = false)
    private String accountPassword;

    @Column(nullable = false)
    private String bankName;

    @Column(nullable = false)
    private String accountHolderName;

    @Column(nullable = false)
    private Long balance;

//    @OneToOne(fetch = FetchType.LAZY)
//    @JoinColumn(name = "member_id", nullable = false)
//    private Member member; // Member와 연관 관계
    @OneToOne(mappedBy = "account", fetch = FetchType.LAZY)
    @JsonIgnore
    private Member member;

    @OneToOne(mappedBy = "account", cascade = CascadeType.ALL, orphanRemoval = true) // 선택적 관계로 설정)
    private Wallet wallet;

    // 계좌 잔액 변경 메서드
    public void deposit(Long amount) {
        if (amount <= 0) {
            throw new IllegalArgumentException("입금 금액은 0보다 커야 합니다.");
        }
        this.balance += amount;
    }

    public void withdraw(Long amount) {
        if (amount <= 0) {
            throw new IllegalArgumentException("출금 금액은 0보다 커야 합니다.");
        }
        if (this.balance < amount) {
            throw new IllegalArgumentException("잔액이 부족합니다.");
        }
        this.balance -= amount;
    }

    public void updateBalance(Long amount) {
        if (this.balance + amount < 0) {
            throw new IllegalArgumentException("Insufficient account balance");
        }
        this.balance += amount;
    }

    public void decreaseBalance(Long amount) {
        if (this.balance - amount < 0) {
            throw new IllegalArgumentException("Insufficient account balance");
        }
        this.balance -= amount;
    }

    public boolean isLinkedToMember() {
        return this.member != null;
    }


}
