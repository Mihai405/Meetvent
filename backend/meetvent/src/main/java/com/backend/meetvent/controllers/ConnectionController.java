package com.backend.meetvent.controllers;

import com.backend.meetvent.constants.SecurityConstants;
import com.backend.meetvent.domain.AppUser;
import com.backend.meetvent.domain.dto.Chat.ContactUserVO;
import com.backend.meetvent.domain.dto.JSONMessageResponse;
import com.backend.meetvent.domain.dto.TinderResponseDTO;
import com.backend.meetvent.domain.views.Views;
import com.backend.meetvent.service.connection.ConnectionService;
import com.fasterxml.jackson.annotation.JsonView;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/tinder")
public class ConnectionController {
    private ConnectionService connectionService;

    public ConnectionController(ConnectionService connectionService) {
        this.connectionService = connectionService;
    }

    @GetMapping("/users")
    @JsonView(Views.Public.class)
    public List<AppUser> findUsers(@RequestHeader(SecurityConstants.JWT_HEADER) String token) {
        return this.connectionService.findUsers(token);
    }

    @GetMapping("/contacts")
    public List<ContactUserVO> findMyContacts(@RequestHeader(SecurityConstants.JWT_HEADER) String token) {
        return this.connectionService.findMyContacts(token);
    }

    @PostMapping("/response/user/{id}")
    public ResponseEntity<?> yourResponseForUser(@RequestHeader(SecurityConstants.JWT_HEADER) String token, @PathVariable String id, @RequestBody TinderResponseDTO tinderResponse) {
        String statusAfterTinderLogic = this.connectionService.doTinderMatchLogic(token, id, tinderResponse.getResponse());
        return new ResponseEntity<>(new JSONMessageResponse(statusAfterTinderLogic), HttpStatus.OK);
    }

}
