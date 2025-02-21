package com.moneybridge.dto.chatMessage;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ChatMessageDTO {
    private Long id;
    private String senderId;
    private String senderNickname; // 닉네임 추가
    private String senderGrade;   // 등급 추가
    private String content;
    private LocalDateTime createdAt; // 메시지 생성 시간
}
