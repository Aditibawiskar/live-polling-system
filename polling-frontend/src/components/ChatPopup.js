// frontend/src/components/ChatPopup.js
import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { socket } from '../socket';

const ChatWidget = styled.div`
  position: fixed;
  bottom: 24px;
  right: 24px;
  z-index: 1000;
`;

const ChatBubble = styled.button`
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: #5A66D1;
  border: none;
  cursor: pointer;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  transition: transform 0.2s ease-in-out, background-image 0.2s ease-in-out;
  background-repeat: no-repeat;
  background-position: center;

  /* Dynamically switch the icon based on the isOpen prop */
  background-image: ${({ isOpen }) =>
    isOpen
      ? `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' height='28' viewBox='0 -960 960 960' width='28' fill='white'%3E%3Cpath d='m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z'/%3E%3C/svg%3E")` // Close (X) Icon
      : `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' height='28px' viewBox='0 0 24 24' width='28px' fill='white'%3E%3Cpath d='M0 0h24v24H0V0z' fill='none'/%3E%3Cpath d='M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z'/%3E%3C/svg%3E")`}; /* CORRECTED clean chat icon */

  &:hover {
    transform: scale(1.1);
  }
`;
const ChatWindow = styled.div`
  position: absolute;
  bottom: 80px;
  right: 0;
  width: 350px;
  height: 450px;
  background: white;
  border-radius: 12px;
  border: 1px solid #E5E7EB;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.2);
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;

const ChatHeader = styled.div`
  display: flex;
  padding: 0 12px;
  border-bottom: 1px solid #E5E7EB;
`;

const TabButton = styled.button`
  padding: 14px 16px;
  background: none;
  border: none;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  color: ${({ isActive }) => (isActive ? '#1D68BD' : '#6B7281')};
  border-bottom: 2px solid ${({ isActive }) => (isActive ? '#1D68BD' : 'transparent')};
  margin-bottom: -1px;
`;

const MessagesContainer = styled.div`
  flex-grow: 1;
  padding: 12px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const Message = styled.div`
  padding: 8px 14px;
  border-radius: 8px;
  max-width: 80%;
  align-self: ${({ isMe }) => (isMe ? 'flex-end' : 'flex-start')};
  background: ${({ isMe }) => (isMe ? '#8F64E1' : '#374151')};
  color: white;
`;

const MessageAuthor = styled.div`
  font-size: 12px;
  font-weight: bold;
  margin-bottom: 4px;
  color: ${({ isMe }) => (isMe ? '#E1D9F2' : '#9CA3AF')};
`;

const InputArea = styled.form`
  display: flex;
  border-top: 1px solid #E5E7EB;
  padding: 8px;
`;

const ChatInput = styled.input`
  flex-grow: 1;
  border: none;
  padding: 8px;
  font-size: 14px;
  background: transparent;
  &:focus { outline: none; }
`;

const SendButton = styled.button`
  background: #6366F1;
  border: none;
  color: white;
  font-weight: bold;
  padding: 8px 16px;
  border-radius: 8px;
  cursor: pointer;
`;

const ParticipantsContainer = styled.div`
  flex-grow: 1;
  padding: 8px 0;
  overflow-y: auto;
`;

const ListHeader = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 10px 16px;
  background-color: #F9FAFB; /* Light grey background */
  color: #6B7281; /* Grey text */
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
 
`;

const ParticipantItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  font-weight: 500;
 
`;

const KickButton = styled.button`
  background: none;
  border: none;
  color: #1D68BD; /* Blue color from design */
  font-weight: 600;
  cursor: pointer;
  text-decoration: underline;
  padding: 4px;
`;

function ChatPopup({ user }) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [activeTab, setActiveTab] = useState('chat');
  const [participants, setParticipants] = useState([]);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  
  useEffect(scrollToBottom, [messages]);

  useEffect(() => {
    function onReceiveMessage(message) {
      setMessages(prevMessages => [...prevMessages, message]);
    }
    socket.on('receive_message', onReceiveMessage);

    function onUpdateParticipants(participantList) {
      setParticipants(participantList);
    }
    socket.on('update_participants', onUpdateParticipants);
    
    socket.emit('get_participants');

    return () => {
      socket.off('receive_message', onReceiveMessage);
      socket.off('update_participants', onUpdateParticipants);
    };
  }, []);
  
  const handleKickOut = (studentName) => {
    socket.emit('remove_student', studentName);
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (newMessage.trim()) {
      socket.emit('send_message', { user: user.name, text: newMessage });
      setNewMessage('');
    }
  };

  return (
    <ChatWidget>
      {isOpen && (
        <ChatWindow>
          <ChatHeader>
            <TabButton isActive={activeTab === 'chat'} onClick={() => setActiveTab('chat')}>
              Chat
            </TabButton>
            <TabButton isActive={activeTab === 'participants'} onClick={() => setActiveTab('participants')}>
              Participants
            </TabButton>
          </ChatHeader>
          
          {/* CORRECTED: Replaced comments with the actual UI */}
          {activeTab === 'chat' ? (
            <>
              <MessagesContainer>
                {messages.map((msg, index) => (
                  <Message key={index} isMe={msg.user === user.name}>
                    <MessageAuthor isMe={msg.user === user.name}>
                      {msg.user}
                    </MessageAuthor>
                    {msg.text}
                  </Message>
                ))}
                <div ref={messagesEndRef} />
              </MessagesContainer>
              <InputArea onSubmit={handleSendMessage}>
                <ChatInput
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type a message..."
                />
                <SendButton type="submit">Send</SendButton>
              </InputArea>
            </>
          ) : (
            <ParticipantsContainer>
              <ListHeader>
                <span>Name</span>
                <span>Action</span>
              </ListHeader>
              {participants
                .filter(name => name !== user.name) // This removes the teacher's own name from the list
                .map((name, index) => (
                  <ParticipantItem key={index}>
                    <span>{name}</span>
                    {user.role === 'teacher' && (
                      <KickButton onClick={() => handleKickOut(name)}>
                        Kick out
                      </KickButton>
                    )}
                  </ParticipantItem>
              ))}
            </ParticipantsContainer>
          )}
        </ChatWindow>
      )}
      <ChatBubble onClick={() => setIsOpen(!isOpen)} isOpen={isOpen} />
    </ChatWidget>
  );
}

export default ChatPopup;