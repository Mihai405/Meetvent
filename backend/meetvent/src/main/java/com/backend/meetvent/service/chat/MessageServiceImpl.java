package com.backend.meetvent.service.chat;

import com.backend.meetvent.domain.Message;
import com.backend.meetvent.domain.dto.Chat.MessageDTO;
import com.backend.meetvent.domain.dto.Chat.ReceivedMessageDTO;
import com.backend.meetvent.repository.MessageRepository;
import com.backend.meetvent.service.appUser.AppUserService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class MessageServiceImpl implements MessageService{
    private MessageRepository messageRepository;
    private AppUserService appUserService;

    public MessageServiceImpl(MessageRepository messageRepository,
                              AppUserService appUserService) {
        this.messageRepository = messageRepository;
        this.appUserService = appUserService;
    }

    @Override
    @Transactional
    public ReceivedMessageDTO saveMessage(MessageDTO messageDTO) {
        Message message = this.convertMessageDTOToMessage(messageDTO);
        return new ReceivedMessageDTO(this.messageRepository.save(message));
    }

    @Override
    @Transactional
    public List<ReceivedMessageDTO> getConversationMessages(String token, Long senderId) {
        Long receiverId = this.appUserService.getUserFromToken(token).getId();
        return messageRepository.findAllByReceiverIdAndSenderId(receiverId, senderId).stream()
                .map(ReceivedMessageDTO::new)
                .collect(Collectors.toList());
    }

    private Message convertMessageDTOToMessage(MessageDTO messageDTO) {
        Message message = new Message();
        message.setReceiver(this.appUserService.getAppUserById(messageDTO.getReceiverId()));
        message.setSender(this.appUserService.getAppUserById(messageDTO.getSenderId()));
        message.setText(messageDTO.getText());
        message.setCreatedAt(messageDTO.getCreatedAt());
        return message;
    }

}
