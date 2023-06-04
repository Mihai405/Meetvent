package com.backend.meetvent.service;

import com.backend.meetvent.domain.AppUser;
import com.backend.meetvent.domain.dto.Chat.ContactUserVO;

import java.util.List;

public interface ConnectionService {
    List<AppUser> findUsers(String userToken);
    String doTinderMatchLogic(String userToken, String contactId, String tinderResponse);
    List<ContactUserVO> findMyContacts(String userToken);
}
