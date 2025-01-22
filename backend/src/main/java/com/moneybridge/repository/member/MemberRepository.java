package com.moneybridge.repository.member;

import com.moneybridge.domain.member.Member;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;


@Repository
public interface MemberRepository extends JpaRepository<Member, String> {

    @EntityGraph(attributePaths = {"memberRoleList"})
    @Query("select m from Member m where m.id = :id")
    Member getWithRoles(@Param("id") String id);

    Optional<Member> findByEmail(String email);

    // 중복 확인
    boolean existsById(String id); // 아이디 중복 확인
    boolean existsByResidentNumber(String residentNumber); // 주민번호 중복 확인
    boolean existsByPhoneNumber(String phoneNumber); // 전화번호 중복 확인
    boolean existsByEmail(String email); // 이메일 중복 확인
<<<<<<< HEAD
    boolean existsByAccountNumber(String accountNumber); // 계좌번호 중복 확인
=======
    boolean existsByAccount_AccountNumber(String accountNumber); // 계좌번호 중복 확인
>>>>>>> 1ad78b99e14620fe3d0b28be2235ba78585b6f1e

    boolean existsByIdAndIdNot(String id, String memberId);
    boolean existsByResidentNumberAndIdNot(String residentNumber, String memberId);
    boolean existsByEmailAndIdNot(String email, String memberId);
    boolean existsByPhoneNumberAndIdNot(String phoneNumber, String memberId);
<<<<<<< HEAD
    boolean existsByAccountNumberAndIdNot(String accountNumber, String memberId);
    boolean existsByEmailAndSocial(String email, boolean social);

=======
    boolean existsByAccount_AccountNumberAndIdNot(String accountNumber, String memberId);
    boolean existsByEmailAndSocial(String email, boolean social);


    @Query("SELECT m FROM Member m JOIN FETCH m.account WHERE m.id = :id")
    Member findMemberWithAccount(@Param("id") String id);
>>>>>>> 1ad78b99e14620fe3d0b28be2235ba78585b6f1e
}
