package com.moneybridge.domain.post;

public enum ContractStatus {
    PENDING,  // 계약 대기 (출자자가 선택한 후)
    WAITING_FOR_APPROVAL, // 대출자의 승인 대기 상태
    ACTIVE,   // 계약 진행 중 (대출 실행됨)
    COMPLETED, // 계약 완료 (상환 완료)
    OVERDUE,  // 연체 상태
    CANCELLED // 계약 취소됨
}
