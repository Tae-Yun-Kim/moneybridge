package com.moneybridge.service.post;

import com.moneybridge.domain.post.ContractStatus;
import com.moneybridge.dto.post.ContractDTO;

import java.util.List;

public interface ContractService {

    // ✅ 출자자가 댓글을 선택하면 계약 생성 (PENDING 상태)
    ContractDTO createContract(ContractDTO contractDTO);

    // ✅ 특정 출자자가 체결한 모든 계약 조회
    List<ContractDTO> getContractsByLenderId(String lenderId);

    // ✅ 특정 대출자가 체결한 모든 계약 조회
    List<ContractDTO> getContractsByBorrowerId(String borrowerId);

    // ✅ 대출자가 계약을 승인하면 계약서를 자동 생성하고 WAITING_FOR_APPROVAL 상태로 변경
    ContractDTO approveContract(Long contractId, String borrowerId);

    // ✅ 출자자가 최종 계약 승인 (계약 상태: ACTIVE)
    ContractDTO approveContractByLender(Long contractId, String lenderId);

    // ✅ 계약 상태 업데이트 (관리자 또는 시스템에서 처리)
    ContractDTO updateContractStatus(Long contractId, ContractStatus status);

    // ✅ 계약 취소 (계약이 PENDING 또는 WAITING_FOR_APPROVAL 상태일 경우에만 가능)
    void cancelContract(Long contractId);

    // ✅ 계약서 내용 조회 (대출자와 출자자의 계약서를 개별적으로 조회)
    String getContractContent(Long contractId, String userId, boolean isLender);

    ContractDTO saveContractContent(Long contractId, String userId, String content, boolean isLender);

}
