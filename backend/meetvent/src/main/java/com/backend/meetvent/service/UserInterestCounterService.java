package com.backend.meetvent.service;

import com.backend.meetvent.domain.AppUser;
import com.backend.meetvent.domain.UserInterestCounter;

import java.util.List;

public interface UserInterestCounterService {
    UserInterestCounter updateUserInterestCounter(int id, AppUser appUser);
    UserInterestCounter saveNewElement(int id, AppUser appUser);
    List<UserInterestCounter> getAllInterestsForUser(AppUser appUser);
}
