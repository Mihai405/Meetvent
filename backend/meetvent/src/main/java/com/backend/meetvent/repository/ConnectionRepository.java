package com.backend.meetvent.repository;

import com.backend.meetvent.domain.AppUser;
import com.backend.meetvent.domain.Connection;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ConnectionRepository extends JpaRepository<Connection, Long> {
    List<Connection> findAllByAppUser2_IdAndUser1ResponseAndUser2Response(Long appUser2Id, String user1Response, String user2Response);
    List<Connection> findAllByAppUser2_IdAndUser1Response(Long appUser2Id, String user1Response);
    List<Connection> findAllByAppUser2_IdAndUser2Response(Long appUser2Id, String user2Response);
    List<Connection> findAllByAppUser1_Id(Long appUser1Id);
    Optional<Connection> findByAppUser1_IdAndAndAppUser2_Id(Long appUser1Id, Long appUser2Id);
    List<Connection> findAllByAppUser1AndUser1ResponseAndUser2Response(AppUser appUser1Id, String user1Response, String user2Response);
    List<Connection> findAllByAppUser2AndUser1ResponseAndUser2Response(AppUser appUser2Id, String user1Response, String user2Response);
}
