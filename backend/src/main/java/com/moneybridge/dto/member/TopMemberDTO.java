package com.moneybridge.dto.member;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class TopMemberDTO {
    private String id;
    private String name;
    private int transactionCount;
}