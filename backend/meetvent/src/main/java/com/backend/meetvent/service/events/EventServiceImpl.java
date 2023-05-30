package com.backend.meetvent.service.events;

import com.backend.meetvent.api_error.exceptions.UserAlreadyJoinedEventException;
import com.backend.meetvent.domain.dto.events.EventDTO;
import com.backend.meetvent.repository.EventRepository;
import com.backend.meetvent.domain.AppUser;
import com.backend.meetvent.domain.Event;
import com.backend.meetvent.domain.UserInterestCounter;
import com.backend.meetvent.service.ImageUtils;
import com.backend.meetvent.service.UserInterestCounterService;
import com.backend.meetvent.service.appUser.AppUserService;
import jakarta.persistence.EntityNotFoundException;
import org.hibernate.Hibernate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.NoSuchElementException;
import java.util.Optional;

import static java.lang.Long.parseLong;

@Service
public class EventServiceImpl implements EventService{

    private EventRepository eventRepository;
    private AppUserService appUserService;
    private UserInterestCounterService userInterestCounterService;

    public EventServiceImpl(EventRepository eventRepository,
                            AppUserService appUserService,
                            UserInterestCounterService userInterestCounterService) {
        this.eventRepository = eventRepository;
        this.appUserService = appUserService;
        this.userInterestCounterService = userInterestCounterService;
    }

    @Override
    @Transactional
    public List<EventDTO> getAllEvents(String token) {
        List<Event> events = this.eventRepository.findAll();
        return this.convertToEventDTOs(events, token);
    }

    private List<EventDTO> convertToEventDTOs(List<Event> events, String token) {
        List<EventDTO> eventDTOS = new ArrayList<>();
        for(Event e:events) {
            EventDTO eventDTO = new EventDTO(e);
            AppUser appUser = this.appUserService.getUserFromToken(token);
            if(e.getAttendees().contains(appUser)) {
                eventDTO.setGoing(true);
            } else {
                eventDTO.setGoing(false);
            }
            eventDTOS.add(eventDTO);
        }
        return eventDTOS;
    }

    private Event getEventById(String id) {
        Optional<Event> eventOptional = this.eventRepository.findById(parseLong(id));
        if(eventOptional.isEmpty()) {
            throw new EntityNotFoundException("Nu exista eveniment cu id-ul " + id);
        }
        Event event = eventOptional.get();
        return event;
    }

    @Transactional
    @Override
    public Event saveEvent(Event event) {
        return this.eventRepository.save(event);
    }

    @Override
    public void deleteEventById(Long id) {
        this.eventRepository.deleteById(id);
    }

    @Override
    @Transactional
    public List<AppUser> getUserForEvents(String id) {
        Optional<Event> event = this.eventRepository.findById(parseLong(id));
        List<AppUser> attendees = event.get().getAttendees();
        Hibernate.initialize(attendees);
        return attendees;
    }

    @Override
    @Transactional
    public List<EventDTO> getEventsFromCity(String cityName, String token) {
        List<Event> events = this.eventRepository.findAllByAddress_City(cityName);
        return this.convertToEventDTOs(events, token);
    }

    @Override
    @Transactional
    public List<EventDTO> getTrendingEventsFromCity(String city, String token) {
        List<Event> events = this.eventRepository.findAllByAddress_CityOrderByAttendeesSize(city);
        return this.convertToEventDTOs(events, token);
    }

    @Override
    public Event updateEventImage(String id, MultipartFile image) throws IOException {
        Event event = this.getEventById(id);
        event.setImage(ImageUtils.compressImage(image.getBytes()));
        return event;
    }

    @Override
    public EventDTO createEvent(Event event, String token) {
        event.setOrganizer(this.appUserService.getUserFromToken(token));
        Event savedEvent  = this.saveEvent(event);
        return new EventDTO(savedEvent);
    }

    @Override
    @Transactional
    public List<UserInterestCounter> joinEvent(String userToken, String eventId) {
        AppUser appUser = this.appUserService.getUserFromToken(userToken);
        Event event = this.getEventById(eventId);
        UserInterestCounter userInterestCounter;
        if(appUser.getEvents().contains(event)) {
            throw new UserAlreadyJoinedEventException("User already joined this event");
        } else {
            appUser.saveEvent(event);
            this.eventRepository.save(event);
            try {
                userInterestCounter = this.userInterestCounterService.updateUserInterestCounter(event.getInterestKey(), appUser);
            } catch (NoSuchElementException e) {
                userInterestCounter = this.userInterestCounterService.saveNewElement(event.getInterestKey(), appUser);
            }
        }
        List<UserInterestCounter> userInterests = this.userInterestCounterService.getAllInterestsForUser(appUser);
        return userInterests;
    }

    @Override
    @Transactional
    public EventDTO getEventByIdAndToken(String id, String userToken) {
        Event event = this.getEventById(id);
        AppUser appUser = this.appUserService.getUserFromToken(userToken);
        EventDTO eventDTO = new EventDTO(event);
        if(event.getAttendees().contains(appUser)) {
            eventDTO.setGoing(true);
        } else {
            eventDTO.setGoing(false);
        }
        return eventDTO;
    }

    @Override
    public byte[] getEventImage(String id) {
        Event event = this.getEventById(id);
        byte[] image = ImageUtils.decompressImage(event.getImage());
        return image;
    }
}
