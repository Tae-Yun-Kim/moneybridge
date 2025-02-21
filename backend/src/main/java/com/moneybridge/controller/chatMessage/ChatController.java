package com.moneybridge.controller.chatMessage;

import com.moneybridge.dto.chatMessage.ChatMessageDTO;
import com.moneybridge.service.chatMessage.ChatService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequiredArgsConstructor
public class ChatController {

    private final ChatService chatService;

    @PostMapping("/api/chat/send")
    public ResponseEntity<ChatMessageDTO> sendMessageHttp(@RequestBody ChatMessageDTO chatMessageDTO, Authentication authentication) {
        chatService.saveMessage(chatMessageDTO.getContent(), authentication.getName());
        return ResponseEntity.ok(chatService.getRecentMessages().get(0));
    }

    @GetMapping("/api/chat/messages")
    public ResponseEntity<List<ChatMessageDTO>> getRecentMessages() {
        List<ChatMessageDTO> messages = chatService.getRecentMessages();
        return ResponseEntity.ok(messages);
    }
}
