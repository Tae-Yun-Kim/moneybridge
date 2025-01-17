package com.moneybridge.repository;



import com.moneybridge.domain.LoanProduct;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;



@Repository
public interface LoanProductRepository extends JpaRepository<LoanProduct, String> {
}