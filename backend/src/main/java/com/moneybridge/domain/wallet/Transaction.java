package com.moneybridge.domain.wallet;

import com.moneybridge.domain.BaseEntity;
import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;

@Entity
@Table(name = "transaction")
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@ToString
public class Transaction extends BaseEntity {

    @Id
    private String transactionId;

    @Column(nullable = false)
    private String walletId;

    @Column(nullable = false)
    private String accountNumber;

    @Column(nullable = false)
    private BigDecimal amount;

    @Column(nullable = false)
    private String transactionType;
}
