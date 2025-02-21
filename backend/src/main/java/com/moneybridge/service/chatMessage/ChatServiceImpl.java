package com.moneybridge.service.chatMessage;

import com.moneybridge.domain.chatMessage.ChatMessage;
import com.moneybridge.domain.member.Member;
import com.moneybridge.dto.chatMessage.ChatMessageDTO;
import com.moneybridge.repository.chatMessage.ChatMessageRepository;
import com.moneybridge.repository.member.MemberRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ChatServiceImpl implements ChatService {

    private final ChatMessageRepository chatMessageRepository;
    private final MemberRepository memberRepository;

    @Override
    @Transactional
    public void saveMessage(String content, String senderId) {
        Member sender = memberRepository.findById(senderId)
                .orElseThrow(() -> new RuntimeException("Member not found"));

        ChatMessage chatMessage = ChatMessage.builder()
                .sender(sender)
                .content(content)
                .build();

        chatMessageRepository.save(chatMessage);
    }

    @Override
    @Transactional(readOnly = true)
    public List<ChatMessageDTO> getRecentMessages() {
        return chatMessageRepository.findTop100ByOrderByCreatedAtDesc().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    private ChatMessageDTO convertToDTO(ChatMessage chatMessage) {
        Member sender = chatMessage.getSender();
        String grade = sender.getMemberGradeList().isEmpty() ? "NONE" : sender.getMemberGradeList().get(0).name(); // 등급 가져오기

        return ChatMessageDTO.builder()
                .id(chatMessage.getId())
                .senderId(sender.getId())
                .senderNickname(sender.getNickname()) // 닉네임 설정
                .senderGrade(grade)                   // 등급 설정
                .content(chatMessage.getContent())
                .createdAt(chatMessage.getCreatedAt()) // BaseEntity의 createdAt 사용
                .build();
    }
}
