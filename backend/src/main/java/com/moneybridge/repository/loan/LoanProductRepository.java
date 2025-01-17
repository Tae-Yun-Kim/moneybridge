package com.moneybridge.repository.loan;



import com.moneybridge.domain.loan.LoanProduct;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;



@Repository
public interface LoanProductRepository extends JpaRepository<LoanProduct, String> {
}