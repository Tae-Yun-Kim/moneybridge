package com.moneybridge.repository.chatMessage;

import com.moneybridge.domain.chatMessage.ChatMessage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ChatMessageRepository extends JpaRepository<ChatMessage, Long> {
    List<ChatMessage> findTop100ByOrderByCreatedAtDesc();
    @Query("SELECT c FROM ChatMessage c WHERE c.sender.id = :memberId")
    List<ChatMessage> findBySenderId(@Param("memberId") String memberId);
}
