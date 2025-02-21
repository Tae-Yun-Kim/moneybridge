package com.moneybridge.repository.post;

import com.moneybridge.domain.post.Debt;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DebtRepository extends JpaRepository<Debt, Long> {
    // 기본적인 CRUD 메서드는 JpaRepository에서 자동으로 제공
    Debt findFirstByMemberIdAndRepaymentStatus(String memberId, Debt.RepaymentStatus repaymentStatus);

    // 특정 memberId에 해당하는 모든 부채 목록을 반환
    List<Debt> findByMemberId(String memberId);

}
