package com.moneybridge.service.post;

import com.moneybridge.dto.DebtRequestDTO;
import com.moneybridge.dto.DebtResponseDTO;

import java.util.List;

public interface DebtService {
    DebtResponseDTO createDebt(DebtRequestDTO requestDTO);
    List<DebtResponseDTO> getAllDebts();
    DebtResponseDTO updateRepaymentStatus(Long debtId, String status);
    DebtResponseDTO requestExtension(Long debtId);

    // 상환 상태 조회 메서드 추가
    String getRepaymentStatusByMemberId(String memberId);

    // memberId로 부채 목록 조회 메서드 추가
    List<DebtResponseDTO> getDebtsByMemberId(String memberId);

    // 부채 삭제 메서드 추가
    void deleteDebt(Long debtId, String memberId);
}

