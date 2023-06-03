package com.backend.meetvent.repository;

import com.backend.meetvent.domain.Message;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface MessageRepository extends JpaRepository<Message, Long> {
    List<Message> findAllByReceiverIdAndSenderId(Long receiverId, Long senderId);
}
