package com.moneybridge.repository.post;

import com.moneybridge.domain.member.Member;
import com.moneybridge.domain.post.LoanPost;
import com.moneybridge.domain.post.Notification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface NotificationRepository extends JpaRepository<Notification, Long> {

    // 멤버의 모든 알림을 생성일자 내림차순으로 조회
    List<Notification> findByMemberOrderByCreatedAtDesc(Member member);

    // 읽지 않은 알림 조회
    // List<Notification> findByMemberAndIsReadFalseOrderByCreatedAtDesc(Member member);

    // 특정 타입의 알림 조회
    List<Notification> findByMemberAndType(Member member, Notification.NotificationType type);

    // 특정 기간 내의 알림 조회를 위한 JPQL 쿼리
    @Query("SELECT n FROM Notification n WHERE n.member = :member AND n.createdAt >= :startDate AND n.createdAt <= :endDate ORDER BY n.createdAt DESC")
    List<Notification> findByMemberAndDateRange(@Param("member") Member member,
                                                @Param("startDate") LocalDateTime startDate,
                                                @Param("endDate") LocalDateTime endDate);

    // 읽지 않은 알림 개수 조회
    // Long countByMemberAndIsReadFalse(Member member);

    // 특정 멤버와 게시글에 관련된 알림 조회
    List<Notification> findByMemberAndPostId(Member member, LoanPost postId);

    // 오래된 알림 삭제를 위한 쿼리
    @Query("DELETE FROM Notification n WHERE n.createdAt < :date")
    void deleteOldNotifications(@Param("date") LocalDateTime date);

    // 특정 멤버의 특정 타입 알림 중 가장 최근 것 조회
    Optional<Notification> findFirstByMemberAndTypeOrderByCreatedAtDesc(Member member, Notification.NotificationType type);

    List<Notification> findByPostId(LoanPost loanPost);
}
