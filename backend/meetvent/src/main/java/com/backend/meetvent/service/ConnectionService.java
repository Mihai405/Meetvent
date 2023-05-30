package com.backend.meetvent.service;

import com.backend.meetvent.domain.AppUser;

import java.util.List;

public interface ConnectionService {
    List<AppUser> findUsers(String userToken);
    String doTinderMatchLogic(String userToken, String contactId, String tinderResponse);
    List<AppUser> findMyMatches(String userToken);
}
