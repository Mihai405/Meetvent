package com.backend.meetvent.service.connection;

import com.backend.meetvent.domain.AppUser;
import com.backend.meetvent.domain.Connection;
import com.backend.meetvent.domain.dto.Chat.ContactUserVO;
import com.backend.meetvent.domain.dto.Chat.ConversationDTO;
import com.backend.meetvent.domain.dto.Chat.MessageDTO;
import com.backend.meetvent.repository.ConnectionRepository;
import com.backend.meetvent.service.appUser.AppUserService;
import com.backend.meetvent.service.chat.MessageService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@Transactional
public class ConnectionServiceImpl implements ConnectionService {
    private AppUserService appUserService;
    private ConnectionRepository connectionRepository;
    private MessageService messageService;

    public ConnectionServiceImpl(AppUserService appUserService,
                                 ConnectionRepository connectionRepository,
                                 MessageService messageService) {
        this.appUserService = appUserService;
        this.connectionRepository = connectionRepository;
        this.messageService = messageService;
    }

    @Override
    public List<AppUser> findUsers(String userToken) {
        List<AppUser> yourNextUsers = new ArrayList<>();
        AppUser appUser = this.appUserService.getUserFromToken(userToken);
        List<Connection> likeMatches = this.connectionRepository.findAllByAppUser2_IdAndUser1ResponseAndUser2Response(appUser.getId(), "YES", null);
        List<Long> peopleIds = this.getPeopleWhoLikesYouIdsFromMatches(likeMatches);
        yourNextUsers.addAll(this.getPeopleWhoLikesYou(peopleIds));
        List<Long> notWantedProfilesIds = new ArrayList<>();
        notWantedProfilesIds.addAll(peopleIds);
        notWantedProfilesIds.addAll(this.alreadyViewedProfilesIds(appUser.getId()));
        yourNextUsers.addAll(this.getOtherPeople(notWantedProfilesIds, appUser.getId()));
        return yourNextUsers;
    }

    @Override
    public String doTinderMatchLogic(String userToken, String contactId, String tinderResponse) {
        AppUser appUser = this.appUserService.getUserFromToken(userToken);
        AppUser contactUser = this.appUserService.getAppUserById(contactId);
        Optional<Connection> tinderMatch = this.connectionRepository.findByAppUser1_IdAndAndAppUser2_Id(contactUser.getId(), appUser.getId());
        if(tinderMatch.isPresent()) {
            if(tinderResponse.equals("YES")) {
                tinderMatch.get().setUser2Response("YES");
                this.connectionRepository.save(tinderMatch.get());
                return "MATCH";
            } else {
                tinderMatch.get().setAppUser2(appUser);
                tinderMatch.get().setUser2Response("NO");
                this.connectionRepository.save(tinderMatch.get());
                return "FAILED";
            }
        } else {
            if(tinderResponse.equals("YES")) {
                this.createNewContact(appUser, contactUser, "YES");
                return "CONTACT";
            } else {
                this.createNewContact(appUser, contactUser, "NO");
                return "FAILED";
            }
        }
    }

    private List<Long> getPeopleWhoLikesYouIdsFromMatches(List<Connection> matches) {
        ArrayList<Long> peopleIds = new ArrayList<>();
        for(Connection match:matches) {
            peopleIds.add(match.getAppUser1().getId());
        }
        return peopleIds;
    }

    private List<AppUser> getPeopleWhoLikesYou(List<Long> peopleIds) {
        return this.appUserService.getAppUsersWithIdsInList(peopleIds);
    }

    private List<AppUser> getOtherPeople(List<Long> peopleWhoLikesYou, Long yourId) {
        List<Long> yourContactsIds = new ArrayList<>(peopleWhoLikesYou);
        yourContactsIds.add(yourId);
        return this.appUserService.getAppUsersWithIdsNotInList(yourContactsIds);
    }

    private List<Long> alreadyViewedProfilesIds(Long myId) {
        List<Connection> seenProfileMatchesFirst = this.connectionRepository.findAllByAppUser1_Id(myId);
        List<Connection> seenProfileMatchesSecondYes = this.connectionRepository.findAllByAppUser2_IdAndUser2Response(myId, "YES");
        List<Connection> seenProfileMatchesSecondNO = this.connectionRepository.findAllByAppUser2_IdAndUser2Response(myId, "NO");
        List<Connection> declineMyProfile = this.connectionRepository.findAllByAppUser2_IdAndUser1Response(myId, "NO");
        List<Long> idsForSeenUsers = new ArrayList<>();
        for(Connection match:seenProfileMatchesFirst) {
            idsForSeenUsers.add(match.getAppUser2().getId());
        }
        for(Connection match:seenProfileMatchesSecondYes) {
            idsForSeenUsers.add(match.getAppUser1().getId());
        }
        for(Connection match:seenProfileMatchesSecondNO) {
            idsForSeenUsers.add(match.getAppUser1().getId());
        }
        for(Connection match:declineMyProfile) {
            idsForSeenUsers.add(match.getAppUser1().getId());
        }
        return idsForSeenUsers;
    }

    private Connection createNewContact(AppUser appUser1, AppUser appUser2, String tinderResponse) {
        Connection connection = new Connection();
        connection.setAppUser1(appUser1);
        connection.setAppUser2(appUser2);
        connection.setUser1Response(tinderResponse);
        return this.connectionRepository.save(connection);
    }

    @Override
    public List<ConversationDTO> findMyConversations(String userToken) {
        AppUser appUser = this.appUserService.getUserFromToken(userToken);
        List<ContactUserVO> contactUserVOS = this.findMyContacts(appUser.getId());
        return contactUserVOS.stream()
                .map(contactUserVO -> {
                    MessageDTO messageDTO = this.messageService.getLastMessageFromConversation(appUser.getId(),contactUserVO.get_id());
                    return new ConversationDTO(contactUserVO, messageDTO);
                })
                .collect(Collectors.toList());
    }

    private List<ContactUserVO> findMyContacts(Long id) {
        List<AppUser> contacts = this.connectionRepository.findUserConnectionsByUser1Id(id);
        contacts.addAll(this.connectionRepository.findUserConnectionsByUser2Id(id));
        return contacts.stream()
                .map(user -> new ContactUserVO(user))
                .collect(Collectors.toList());
    }
}
