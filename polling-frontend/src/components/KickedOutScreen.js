// frontend/src/components/KickedOutScreen.js
import React from 'react';
import styled from 'styled-components';

const ScreenContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  padding: 24px;
  background-color: #F9FAFB;
  font-family: 'Inter', sans-serif;
  text-align: center;
`;

const Lozenge = styled.div`
  background: #E0E7FF;
  color: #4338CA;
  font-weight: 600;
  padding: 8px 12px;
  border-radius: 20px;
  font-size: 14px;
  margin-bottom: 24px;
`;

const Title = styled.h1`
  font-size: 32px;
  font-weight: 700;
  color: #1F2937;
  margin-bottom: 8px;
`;

const Subtitle = styled.p`
  color: #6B7281;
  max-width: 400px;
`;

function KickedOutScreen() {
  return (
    <ScreenContainer>
      <Lozenge>Intervue Poll</Lozenge>
      <Title>You've been Kicked out !</Title>
      <Subtitle>
        Looks like the teacher has removed you from the poll system. Please
        Try again sometime.
      </Subtitle>
    </ScreenContainer>
  );
}

export default KickedOutScreen;