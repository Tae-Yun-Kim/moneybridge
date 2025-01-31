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
    @JoinColumn(name = "from_wallet_id", referencedColumnName = "walletId", nullable = true)
    private Wallet fromWallet;

    @ManyToOne
    @JoinColumn(name = "to_wallet_id", referencedColumnName = "walletId", nullable = true)
    private Wallet toWallet;

    @Column(nullable = false)
    private Long amount;

    @Column(nullable = false)
    private String transactionType;
}
