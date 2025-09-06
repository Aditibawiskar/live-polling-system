// frontend/src/components/StudentLoginScreen.js
import React, { useState } from 'react';
import styled from 'styled-components';
import { socket } from '../socket'; // Make sure socket is imported

const ScreenContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  padding: 24px;
  background-color: #F9FAFB;
  font-family: 'Inter', sans-serif;
`;

const Card = styled.form`
  background: white;
  padding: 32px;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  width: 100%;
  max-width: 450px;
  text-align: center;
`;

const Title = styled.h1`
  font-size: 32px;
  font-weight: 700;
  color: #1F2937;
  margin-bottom: 8px;
`;

const Subtitle = styled.p`
  color: #6B7281;
  margin-bottom: 32px;
`;

const InputLabel = styled.label`
  display: block;
  text-align: left;
  font-weight: 600;
  margin-bottom: 8px;
  color: #374151;
`;

const Input = styled.input`
  width: 100%;
  padding: 12px;
  border: 1px solid #D1D5DB;
  border-radius: 8px;
  font-size: 16px;
  margin-bottom: 24px;
  
  &:focus {
    outline: none;
    border-color: #6366F1;
    box-shadow: 0 0 0 2px rgba(99, 102, 241, 0.2);
  }
`;

const ContinueButton = styled.button`
  width: 100%;
  background: linear-gradient(99.18deg, #8F64E1 -46.89%, #1D68BD 223.45%);
  border-radius: 34px;
  padding: 14px;
  color: white;
  font-size: 16px;
  font-weight: 700;
  border: none;
  cursor: pointer;
  transition: all 0.2s ease-in-out;

  &:hover {
    box-shadow: 0 4px 12px rgba(143, 100, 225, 0.4);
  }
`;

function StudentLoginScreen({ onLogin }) {
  const [name, setName] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (name.trim()) {
      // THIS IS THE FIX: Tell the server the student has joined
      socket.emit('join', name.trim());
      onLogin(name);
    }
  };

  return (
    <ScreenContainer>
      <Card onSubmit={handleSubmit}>
        <Title>Let's Get Started</Title>
        <Subtitle>
          If you're a student, you'll be able to submit your answers, participate in live polls, and see how your responses compare with your classmates
        </Subtitle>
        <InputLabel htmlFor="name">Enter your Name</InputLabel>
        <Input
          id="name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Rahul Bajaj"
          required
        />
        <ContinueButton type="submit">Continue</ContinueButton>
      </Card>
    </ScreenContainer>
  );
}

export default StudentLoginScreen;