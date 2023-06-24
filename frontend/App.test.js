import React from 'react';
import renderer from 'react-test-renderer';
import LoginScreen from "./screens/LoginScreen";
import getUpdatedConversationList from "./util/chat/updateConversationList";

test('renders correctly', () => {
    const tree = renderer.create(<LoginScreen />).toJSON();
    expect(tree).toMatchSnapshot();
});

const conversationsInputData = [{"contact": {"_id": 2, "avatar": "http://localhost:8080/users/image/2", "email": "lenghelionut@yahoo.com", "name": "Ionut Andrei"}, "message": {"createdAt": "2023-06-22T19:26:46.572", "read": false, "receiverId": "3", "senderId": "2", "text": "Ceau"}}, {"contact": {"_id": 4, "avatar": "http://localhost:8080/users/image/4", "email": "emma@yahoo.com", "name": "Ema Alexandra"}, "message": {"createdAt": "2023-06-22T19:26:24.987", "read": false, "receiverId": "3", "senderId": "4", "text": "Da"}}, {"contact": {"_id": 1, "avatar": "http://localhost:8080/users/image/1", "email": "margotrobbie@yahoo.com", "name": "Ana Ionescu"}, "message": {"createdAt": "2023-06-22T19:42:27.879", "read": false, "receiverId": "3", "senderId": "1", "text": "Test"}}]
const inputReceivedMessage = {"_id": 969, "createdAt": "2023-06-22T19:43:16.856", "text": "Test", "user": {"_id": 1, "avatar": "http://localhost:8080/users/image/1", "email": "margotrobbie@yahoo.com", "name": "Ana Ionescu"}};
const inputId = 3;
const conversationsReturnData = [{"contact": {"_id": 1, "avatar": "http://localhost:8080/users/image/1", "email": "margotrobbie@yahoo.com", "name": "Ana Ionescu"}, "message": {"createdAt": "2023-06-22T19:43:16.856", "read": false, "receiverId": 3, "senderId": 1, "text": "Test"}}, {"contact": {"_id": 2, "avatar": "http://localhost:8080/users/image/2", "email": "lenghelionut@yahoo.com", "name": "Ionut Andrei"}, "message": {"createdAt": "2023-06-22T19:26:46.572", "read": false, "receiverId": "3", "senderId": "2", "text": "Ceau"}}, {"contact": {"_id": 4, "avatar": "http://localhost:8080/users/image/4", "email": "emma@yahoo.com", "name": "Ema Alexandra"}, "message": {"createdAt": "2023-06-22T19:26:24.987", "read": false, "receiverId": "3", "senderId": "4", "text": "Da"}}]

test('update conversation list correctly', () => {
    expect(getUpdatedConversationList(conversationsInputData, inputReceivedMessage, inputId)).toEqual(conversationsReturnData);
})