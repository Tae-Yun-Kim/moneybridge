package com.moneybridge.service.chatMessage;

import com.moneybridge.dto.chatMessage.ChatMessageDTO;

import java.util.List;

public interface ChatService {
    void saveMessage(String content, String senderId);
    List<ChatMessageDTO> getRecentMessages();
}
