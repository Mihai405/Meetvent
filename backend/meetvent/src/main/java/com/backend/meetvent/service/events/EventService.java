package com.backend.meetvent.service.events;

import com.backend.meetvent.domain.AppUser;
import com.backend.meetvent.domain.Event;
import com.backend.meetvent.domain.UserInterestCounter;
import com.backend.meetvent.domain.dto.events.EventDTO;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

public interface EventService {
    List<EventDTO> getAllEvents(String token);
    Event getEventById(String id);
    Event saveEvent(Event event);
    void deleteEventById(Long id);
    List<AppUser> getUserForEvents(String id);
    List<EventDTO> getEventsFromCity(String city, String token);
    List<EventDTO> getTrendingEventsFromCity(String city, String token);
    Event updateEventImage(String id, MultipartFile image) throws IOException;
    Event createEvent(Event event, String token);
    List<UserInterestCounter> joinEvent(String userToken, String eventId);
    Event getEventByIdAndToken(String id, String userToken);
    byte[] getEventImage(String id);
}
