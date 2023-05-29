package com.backend.meetvent.controllers;

import com.backend.meetvent.domain.AppUser;
import com.backend.meetvent.service.auth.AuthService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
public class AuthController {
    private AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/signin")
    public ResponseEntity<?> authenticateUser(@RequestBody AppUser loginRequest) {
        return ResponseEntity.ok(this.authService.signIn(loginRequest.getEmail(), loginRequest.getPassword()));
    }

    @PostMapping("/signup")
    public ResponseEntity<?> registerUser(@RequestBody AppUser appUser) {
        return ResponseEntity.ok(this.authService.register(appUser));
    }

}
