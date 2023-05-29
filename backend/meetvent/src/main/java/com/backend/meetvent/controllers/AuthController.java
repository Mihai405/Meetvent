package com.backend.meetvent.controllers;

import com.backend.meetvent.domain.AppUser;
import com.backend.meetvent.domain.dto.JSONMessageResponse;
import com.backend.meetvent.domain.dto.appUsers.AppUserDTO;
import com.backend.meetvent.domain.views.Views;
import com.backend.meetvent.jwt.JwtUtils;
import com.backend.meetvent.repository.AppUserRepository;
import com.backend.meetvent.service.AppUserService;
import com.backend.meetvent.service.auth.AuthService;
import com.fasterxml.jackson.annotation.JsonView;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

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
