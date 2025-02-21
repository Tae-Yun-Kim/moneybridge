package com.moneybridge.domain.wallet;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.moneybridge.domain.BaseEntity;
import com.moneybridge.domain.account.Account;
import com.moneybridge.domain.member.Member;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "wallet")
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@ToString(exclude = "member")
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class Wallet extends BaseEntity {

    @Id
    private String walletId;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "member_id", referencedColumnName = "id", unique = true)
    @JsonIgnore
    private Member member;

    @OneToOne(fetch = FetchType.LAZY) // 선택적 관계로 설정)
    @JoinColumn(name = "account_id", referencedColumnName = "aid", unique = true)
    @JsonIgnore // 🔹 직렬화에서 제외
    private Account account;

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

        // Member와 연동된 경우, Member의 transactionCount도 증가
        if (this.member != null) {
            this.member.incrementTransactionCount();
        }
    }

    // 계좌와 연동된 지갑 잔액 업데이트 (계좌 -> 지갑 또는 지갑 -> 계좌)
    public void updateBalance(Long amount) {
        if (this.account == null) {
            throw new IllegalStateException("연결된 계좌가 없습니다.");
        }

        // 계좌 잔액 체크
        if (amount > 0 && this.account.getBalance() < amount) {
            throw new IllegalArgumentException("계좌 잔액이 부족합니다.");
        }

        // 계좌 잔액 갱신
        this.account.updateBalance(-amount);

        // 지갑 잔액 갱신
        this.balance += amount;
    }

    // 단순 지갑 잔액 업데이트 (회원 간 거래 시 사용)
    public void updateBalanceWithWallet(Long amount) {
        if (this.balance + amount < 0) {
            throw new IllegalArgumentException("잔액이 부족합니다.");
        }
        this.balance += amount;
    }

    public void transferFromAccount(Long amount) {
        if (account.getBalance() < amount) {
            throw new IllegalArgumentException("Insufficient account balance");
        }
        account.decreaseBalance(amount);
        this.updateBalance(amount);
    }

    public void transferToAccount(Long amount) {
        if (this.balance < amount) {
            throw new IllegalArgumentException("잔액이 부족합니다.");
        }
        // 지갑에서 금액 차감
        this.balance -= amount;

        // 계좌로 금액 추가
        this.account.deposit(amount); // Account 클래스에 deposit 메서드 필요
    }

    public void changeLockStatus(boolean isLocked) {
        this.isLocked = isLocked;
    }

}
