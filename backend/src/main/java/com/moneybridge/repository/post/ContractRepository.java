package com.moneybridge.repository.post;

import com.moneybridge.domain.post.Contract;
import com.moneybridge.domain.post.ContractStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Repository
public interface ContractRepository extends JpaRepository<Contract, Long> {

    // ✅ 특정 계약 조회
    Optional<Contract> findById(Long contractId);

    // ✅ 특정 출자자가 체결한 모든 계약 조회
    List<Contract> findByLender_Id(String lenderId);

    // ✅ 특정 대출자가 체결한 모든 계약 조회
    List<Contract> findByBorrower_Id(String borrowerId);

    // ✅ 특정 상태(PENDING, ACTIVE 등)인 계약 조회
    List<Contract> findByStatus(ContractStatus status);

    // ✅ 특정 대출자가 아직 동의하지 않은 계약 목록 조회
    @Query("SELECT c FROM Contract c WHERE c.borrower.id = :borrowerId AND c.borrowerAgreed = false")
    List<Contract> findContractsAwaitingBorrowerAgreement(@Param("borrowerId") String borrowerId);

    // ✅ 특정 출자자가 아직 **최종 승인하지 않은** 계약 목록 조회
    @Query("SELECT c FROM Contract c WHERE c.lender.id = :lenderId AND c.lenderApproved = false")
    List<Contract> findContractsAwaitingLenderApproval(@Param("lenderId") String lenderId);

    // ✅ 특정 게시글 ID로 계약 조회
    Optional<Contract> findByLoanPost_Id(Long loanPostId);

    // ✅ 특정 계약의 대출자 계약서 내용 조회
    @Query("SELECT c.borrowerContractContent FROM Contract c WHERE c.id = :contractId")
    Optional<String> findBorrowerContractContentById(@Param("contractId") Long contractId);

    // ✅ 특정 계약의 출자자 계약서 내용 조회
    @Query("SELECT c.lenderContractContent FROM Contract c WHERE c.id = :contractId")
    Optional<String> findLenderContractContentById(@Param("contractId") Long contractId);

    // ✅ 특정 계약의 총 상환 금액 조회 (출자자 지갑으로 입금된 상환 거래 합계)
    @Query("SELECT COALESCE(SUM(wt.amount), 0) " +
            "FROM WalletTransaction wt " +
            "WHERE wt.toWallet.member.id = :lenderId " +
            "AND wt.fromWallet.member.id = :borrowerId " +
            "AND wt.transactionType = 'REPAYMENT'")
    Long getTotalPaidAmount(@Param("lenderId") String lenderId,
                            @Param("borrowerId") String borrowerId);

    // ✅ 진행 중인 계약 찾기 (대출자 기준) - 반드시 Optional<Contract> 반환
    @Query("SELECT c FROM Contract c WHERE c.borrower.id = :borrowerId AND c.status = 'ACTIVE'")
    Optional<Contract> findActiveContractByBorrower(@Param("borrowerId") String borrowerId);

    Optional<Contract> findByLoanPostId(Long postId);

    // ✅ 특정 계약의 연장 요청 횟수 조회
    @Query("SELECT c.extensionRequestCount FROM Contract c WHERE c.id = :contractId")
    Optional<Integer> findExtensionRequestCountByContractId(@Param("contractId") Long contractId);

    @Transactional
    @Modifying
    @Query("UPDATE Contract c SET c.status = :newStatus WHERE c.id = :contractId AND c.status = 'OVERDUE'")
    void updateContractStatus(@Param("contractId") Long contractId, @Param("newStatus") ContractStatus newStatus);
}
