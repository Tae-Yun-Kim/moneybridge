package com.moneybridge.domain.wallet;

import com.moneybridge.domain.BaseEntity;
import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;

@Entity
@Table(name = "wallet_transaction")
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@ToString
public class WalletTransaction extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String transactionId;

    @ManyToOne
    @JoinColumn(name = "fromWalletId", referencedColumnName = "walletId", nullable = false)
    private Wallet fromWallet;

    @ManyToOne
    @JoinColumn(name = "toWalletId", referencedColumnName = "walletId", nullable = false)
    private Wallet toWallet;

    @Column(nullable = false)
    private Long amount;

    @Column(nullable = false)
    private String transactionType;
}
