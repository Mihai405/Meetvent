package com.backend.meetvent.service.chat;

import com.backend.meetvent.domain.Message;
import com.backend.meetvent.domain.dto.Chat.MessageDTO;
import com.backend.meetvent.domain.dto.Chat.ReceivedMessageDTO;

import java.util.List;

public interface MessageService {
    ReceivedMessageDTO saveMessage(MessageDTO messageDTO);
    List<ReceivedMessageDTO> getConversationMessages(String token, Long senderId);
}
