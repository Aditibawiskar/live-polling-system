// frontend/src/components/PollHistoryScreen.js
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { socket } from '../socket';

// --- STYLES ---
const HistoryPageContainer = styled.div`
  padding: 48px;
  background-color: #F9FAFB;
  min-height: 100vh;
  font-family: 'Inter', sans-serif;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 800px;
  margin: 0 auto 32px auto;
`;

const Title = styled.h1`
  font-size: 32px;
  font-weight: 700;
`;

const BackButton = styled.button`
  background: #E0E7FF;
  color: #4338CA;
  font-weight: 600;
  border: none;
  padding: 10px 20px;
  border-radius: 20px;
  cursor: pointer;
  font-size: 14px;
`;

const PollRecord = styled.div`
  max-width: 800px;
  margin: 0 auto 48px auto;
`;

const QuestionTitle = styled.h2`
  font-size: 20px;
  font-weight: 600;
  margin-bottom: 16px;
`;

const QuestionCard = styled.div`
  background: #374151;
  color: white;
  padding: 24px;
  border-radius: 12px;
  width: 100%;
  text-align: center;
  margin-bottom: 16px;
  h2 {
    font-size: 20px;
    font-weight: 700;
  }
`;

const OptionsContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const OptionNumber = styled.div`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background-color: #EEF2FF;
  color: #6366F1;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 14px;
  flex-shrink: 0;
`;

const ResultBarContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  background: white;
  border: 1px solid #E5E7EB;
  border-radius: 8px;
  padding: 12px;
  width: 100%;
  font-size: 18px;
  font-weight: 600;
  position: relative;
  overflow: hidden;
`;

const ProgressBar = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  background: linear-gradient(99.18deg, #8F64E1 -46.89%, #1D68BD 223.45%);
  width: ${({ percentage }) => percentage}%;
  border-radius: 8px;
  z-index: 1;
`;

const ContentWrapper = styled.div`
  position: relative;
  z-index: 2;
  display: flex;
  align-items: center;
  gap: 16px;
  width: 100%;
`;

const ResultText = styled.span`
  color: ${({ $isFilled }) => ($isFilled ? 'white' : '#1F2937')};
`;


// --- COMPONENT ---
function PollHistoryScreen({ onViewDashboard }) {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const handleUpdateHistory = (pollHistory) => {
      setHistory(pollHistory);
    };
    socket.on('update_history', handleUpdateHistory);
    socket.emit('get_history'); // Ask for history on load
    return () => socket.off('update_history', handleUpdateHistory);
  }, []);

  if (history.length === 0) {
    return (
      <HistoryPageContainer>
        <Header>
          <Title>View Poll History</Title>
          <BackButton onClick={onViewDashboard}>← Back to Dashboard</BackButton>
        </Header>
        <p>No polls have been completed yet.</p>
      </HistoryPageContainer>
    );
  }

  return (
    <HistoryPageContainer>
      <Header>
        <Title>View Poll History</Title>
        <BackButton onClick={onViewDashboard}>← Back to Dashboard</BackButton>
      </Header>

      {history.map((poll, index) => {
        const totalVotes = poll.options.reduce((sum, opt) => sum + opt.votes, 0);
        return (
          <PollRecord key={index}>
            <QuestionTitle>Question {index + 1}</QuestionTitle>
            <QuestionCard>
              <h2>{poll.question}</h2>
            </QuestionCard>
            <OptionsContainer>
              {poll.options.map((option, idx) => {
                const percentage = totalVotes === 0 ? 0 : Math.round((option.votes / totalVotes) * 100);
                return (
                  <ResultBarContainer key={idx}>
                    <ProgressBar percentage={percentage} />
                    <ContentWrapper>
                      <OptionNumber>{idx + 1}</OptionNumber>
                      <ResultText $isFilled={percentage > 10}>{option.text}</ResultText>
                      <ResultText $isFilled={percentage > 10} style={{ marginLeft: 'auto', fontWeight: 'bold' }}>
                        {percentage}%
                      </ResultText>
                    </ContentWrapper>
                  </ResultBarContainer>
                );
              })}
            </OptionsContainer>
          </PollRecord>
        );
      })}
    </HistoryPageContainer>
  );
}

export default PollHistoryScreen;