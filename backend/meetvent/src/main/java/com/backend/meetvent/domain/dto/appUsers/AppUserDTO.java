package com.backend.meetvent.domain.dto.appUsers;

import com.backend.meetvent.domain.AppUser;
import com.backend.meetvent.domain.UserInterestCounter;

import java.net.URI;
import java.util.ArrayList;
import java.util.List;

public class AppUserDTO {
    private Long id;
    private String email;
    private String username;
    private List<UserInterestCounter> userInterestCounters = new ArrayList<>();
    private URI imageUri;
    private String token;

    public AppUserDTO(AppUser appUser) {
        this.id = appUser.getId();
        this.email = appUser.getEmail();
        this.username = appUser.getUsername();
        this.imageUri = appUser.getImageUri();
        this.token = appUser.getToken();
        this.userInterestCounters = appUser.getUserInterestCounters();
    }
    public Long getId() {
        return id;
    }
    public String getEmail() {
        return email;
    }

    public String getUsername() {
        return username;
    }

    public List<UserInterestCounter> getUserInterestCounters() {
        return userInterestCounters;
    }

    public URI getImageUri() {
        return imageUri;
    }

    public String getToken() {
        return token;
    }
}
