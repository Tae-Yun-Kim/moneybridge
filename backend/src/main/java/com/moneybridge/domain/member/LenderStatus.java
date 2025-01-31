package com.moneybridge.domain.member;

import com.fasterxml.jackson.annotation.JsonValue;

public enum LenderStatus {
            // 기본 상태
    PENDING,     // 신청 중
    APPROVED,    // 승인됨
    REJECTED,   // 거절됨
    PENDING_SURRENDER
}
