package com.backend.meetvent.domain.dto.appUsers;

import com.backend.meetvent.domain.UserInterestCounter;

import java.net.URI;
import java.util.ArrayList;
import java.util.List;

public class AppUserVO {
    private String email;
    private String username;
    private URI imageUri;

    public AppUserVO(String email, String username, URI imageUri) {
        this.email = email;
        this.username = username;
        this.imageUri = imageUri;
    }

    public String getEmail() {
        return email;
    }

    public String getUsername() {
        return username;
    }

    public URI getImageUri() {
        return imageUri;
    }
}