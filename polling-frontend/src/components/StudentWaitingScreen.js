// frontend/src/components/StudentWaitingScreen.js
import React from 'react';
import styled, { keyframes } from 'styled-components';

const rotate = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`;

const ScreenContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background-color: #F9FAFB;
  font-family: 'Inter', sans-serif;
`;

const Spinner = styled.div`
  border: 5px solid #E5E7EB; /* Light grey border */
  border-top: 5px solid #6366F1; /* Purple border for spinning part */
  border-radius: 50%;
  width: 50px;
  height: 50px;
  animation: ${rotate} 1s linear infinite;
`;

const WaitingText = styled.p`
  font-size: 20px;
  font-weight: 600;
  color: #4B5563;
  margin-top: 24px;
`;

const ChatBubble = styled.button`
  position: fixed;
  bottom: 24px;
  right: 24px;
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: linear-gradient(99.18deg, #8F64E1 -46.89%, #1D68BD 223.45%);
  border: none;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  // Simple chat icon using SVG
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='white' width='28px' height='28px'%3E%3Cpath d='M21.99 4c0-1.1-.89-2-1.99-2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h14l4 4-.01-18zM18 14H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: center;
`;

function StudentWaitingScreen() {
  return (
    <ScreenContainer>
      <Spinner />
      <WaitingText>Wait for the teacher to ask questions..</WaitingText>
      <ChatBubble />
    </ScreenContainer>
  );
}

export default StudentWaitingScreen;