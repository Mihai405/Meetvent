package com.backend.meetvent.service;

import com.backend.meetvent.domain.AppUser;

import java.util.List;

public interface TinderService {
    public List<AppUser> findUsers(String userToken);
    public String doTinderMatchLogic(String userToken, String contactId, String tinderResponse);
    public List<AppUser> findMyMatches(String userToken);
}
