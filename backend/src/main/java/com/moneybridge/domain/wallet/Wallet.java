package com.moneybridge.domain.wallet;

import com.moneybridge.domain.BaseEntity;
import com.moneybridge.domain.member.Member;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "wallet")
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Getter
@ToString(exclude = "member")
public class Wallet extends BaseEntity {

    @Id
    private String walletId;

    @ManyToOne
    @JoinColumn(name = "member_id", referencedColumnName = "id")
    private Member member;

    @Column(unique = true, nullable = false)
    private String accountNumber;

    @Column(nullable = false)
    private Long balance;

    @Column(nullable = false, length = 4)
    private String pinNumber;

    @Column(nullable = false)
    private int transactionCount;

    @Column(nullable = false)
    private boolean isLocked;

    public void incrementTransactionCount() {
        this.transactionCount++;
    }

    public void updateBalance(Long amount) {
        this.balance += amount;
    }

    public void changeLockStatus(boolean isLocked) {
        this.isLocked = isLocked;
    }
}
