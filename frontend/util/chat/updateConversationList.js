const getUpdatedConversationList = (conversations, receivedMessage, myId) => {
    return conversations.map((conversation) => {
        if(conversation.contact._id === receivedMessage.user._id) {
            return updateMessage(conversation, receivedMessage, myId);
        }
        return conversation
    })
}
export default getUpdatedConversationList;

const updateMessage = (conversation, receivedMessage, myId) => {
    if(conversation.contact._id === receivedMessage.user._id) {
        if(conversation.message) {
            conversation.message.text = receivedMessage.text;
            conversation.message.createdAt = receivedMessage.createdAt;
            conversation.message.read = false;
        } else {
            conversation.message = {
                receiverId: myId,
                senderId: conversation.contact._id,
                text: receivedMessage.text,
                createdAt: receivedMessage.createdAt,
                read: false
            }
        }
    }
    return conversation;
}
