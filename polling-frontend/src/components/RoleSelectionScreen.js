// frontend/src/components/RoleSelectionScreen.js
import React, { useState } from 'react';
import styled from 'styled-components';

const ScreenContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  padding: 24px;
  background-color: #F9FAFB; /* Use your theme background color */
  font-family: 'Inter', sans-serif; /* Make sure you've imported this font */
`;

const Title = styled.h1`
  font-size: 32px;
  font-weight: 700;
  color: #1F2937;
  margin-bottom: 8px;
`;

const Subtitle = styled.p`
  color: #6B7281;
  max-width: 450px;
  text-align: center;
  margin-bottom: 32px;
`;

const RolesContainer = styled.div`
  display: flex;
  gap: 24px;
  margin-bottom: 32px;
`;

const RoleCard = styled.div`
  background: white;
  border: 2px solid ${({ isSelected }) => isSelected ? '#6366F1' : '#E5E7EB'};
  border-radius: 12px;
  padding: 24px;
  width: 250px;
  cursor: pointer;
  box-shadow: ${({ isSelected }) => isSelected ? '0 4px 12px rgba(0, 0, 0, 0.1)' : 'none'};
  transform: ${({ isSelected }) => isSelected ? 'translateY(-4px)' : 'none'};
  transition: all 0.2s ease-in-out;

  h3 {
    color: #1F2937;
    margin-bottom: 8px;
  }
  p {
    color: #6B7281;
    font-size: 14px;
  }
`;

const ContinueButton = styled.button`
  /* Copied from Figma */
  background: linear-gradient(99.18deg, #8F64E1 -46.89%, #1D68BD 223.45%);
  border-radius: 34px;
  padding: 17px 70px;
  
  /* Static styles */
  color: white;
  font-size: 16px;
  font-weight: 700;
  border: none;
  cursor: ${({ disabled }) => disabled ? 'not-allowed' : 'pointer'};
  opacity: ${({ disabled }) => disabled ? 0.6 : 1};
  transition: all 0.2s ease-in-out;
  
  &:hover {
    ${({ disabled }) => !disabled && 'box-shadow: 0 4px 12px rgba(143, 100, 225, 0.4);'}
  }
`;

function RoleSelectionScreen({ onSelect }) {
  const [selectedRole, setSelectedRole] = useState(null);

  return (
    <ScreenContainer>
      <Title>Welcome to the Live Polling System</Title>
      <Subtitle>Please select the role that best describes you to begin using the live polling system</Subtitle>
      <RolesContainer>
        <RoleCard isSelected={selectedRole === 'student'} onClick={() => setSelectedRole('student')}>
          <h3>I'm a Student</h3>
          <p>You can submit answers to the polls and view the live results in real-time.</p>
        </RoleCard>
        <RoleCard isSelected={selectedRole === 'teacher'} onClick={() => setSelectedRole('teacher')}>
          <h3>I'm a Teacher</h3>
          <p>You can create polls, manage questions, and monitor student responses.</p>
        </RoleCard>
      </RolesContainer>
      <ContinueButton disabled={!selectedRole} onClick={() => onSelect(selectedRole)}>
        Continue
      </ContinueButton>
    </ScreenContainer>
  );
}

export default RoleSelectionScreen;