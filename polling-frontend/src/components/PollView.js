// frontend/src/components/PollView.js
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { socket } from '../socket';

const PageContainer = styled.div`
  position: relative;
  background-color: #F9FAFB;
  min-height: 100vh;
`;

const PollContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;   /* <<< keep content aligned left */
  padding: 80px 24px 48px 24px;
  font-family: 'Inter', sans-serif;
  width: 100%;
  max-width: 727px;          /* matches card */
  margin: 0 auto;            /* still centers the whole poll box */
`;

const PollBox = styled.div`
  width: 100%;
  border: 2px solid #D1C4E9; /* Light purple border from design */
  border-radius: 12px;
  padding: 24px;
  background-color: white;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
`;
const TopActionsContainer = styled.div`
  position: absolute;
  top: 32px;
  right: 32px;
  z-index: 10;
`;

const ViewHistoryButton = styled.button`
  background: #E0E7FF;
  color: #4338CA;
  font-weight: 600;
  border: none;
  padding: 10px 20px;
  border-radius: 20px;
  cursor: pointer;
  font-size: 14px;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: background-color 0.2s;
  &:hover { background-color: #C7D2FE; }
`;

const TimerContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 20px;
  font-weight: 600;
  color: #EF4444;
  margin-bottom: 16px;
`;

const SectionHeader = styled.h3`
  width: 100%;
  max-width: 700px;
  font-size: 20px;
  font-weight: 700;
  color: #111827;  /* black */
  margin: 0 0 25px 0;
`;

const QuestionCard = styled.div`
  background: linear-gradient(90deg, #343434 0%, #6E6E6E 100%);
  color: white;
  height: 50px;
  border-radius: 12px;
  width: 100%;
  max-width: 727px;
  text-align: center;
  margin-bottom: 32px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  h2 { font-size: 17px; font-weight: 600; }
`;

const OptionsContainer = styled.div`
  width: 100%;
  max-width: 700px;
  display: flex;
  flex-direction: column;
  gap: 16px;
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

const OptionButton = styled.button`
  display: flex;
  align-items: center;
  gap: 16px;
  background: ${({ isSelected }) => (isSelected ? '#EEF2FF' : 'white')};
  border: 2px solid ${({ isSelected }) => (isSelected ? '#6366F1' : '#E5E7EB')};
  border-radius: 8px;
  padding: 12px;
  width: 100%;
  text-align: left;
  font-size: 18px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  &:hover { border-color: #818CF8; }
`;

const ActionsContainer = styled.div`
  width: 100%;
  max-width: 700px;
  display: flex;
  justify-content: flex-end;
  margin-top: 24px;
`;

const SubmitButton = styled.button`
  background: linear-gradient(99.18deg, #8F64E1 -46.89%, #1D68BD 223.45%);
  border-radius: 34px;
  padding: 14px 40px;
  color: white;
  font-size: 16px;
  font-weight: 700;
  border: none;
  cursor: pointer;
  &:disabled { opacity: 0.5; cursor: not-allowed; }
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
  top: 0; left: 0;
  height: 100%;
  background: linear-gradient(99.18deg, #8F64E1 -46.89%, #1D68BD 223.45%);
  width: ${({ percentage }) => percentage}%;
  border-radius: 8px;
  transition: width 0.4s ease-in-out;
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
  color: ${({ isFilled }) => (isFilled ? 'white' : '#1F2937')};
  transition: color 0.4s ease-in-out;
`;

const CorrectTag = styled.span`
  margin-left: 8px;
  font-size: 12px;
  font-weight: 700;
  color: #10B981; /* green */
`;

const TeacherActionsContainer = styled.div`
  width: 100%;
  max-width: 700px;
  margin-top: 32px;
  display: flex;
  justify-content: flex-end;
`;

const AskNewQuestionButton = styled.button`
  background: linear-gradient(99.18deg, #8F64E1 -46.89%, #1D68BD 223.45%);
  border-radius: 34px;
  padding: 14px 32px;
  color: white;
  font-size: 16px;
  font-weight: 700;
  border: none;
  cursor: pointer;
`;

const WaitingMessage = styled.p`
  margin-top: 32px;
  font-size: 18px;
  font-weight: 600;
  color: #4B5563;
`;

function PollView({ pollState, user, onAskNewQuestion, onViewHistory }) {
  const [timer, setTimer] = useState(pollState.timer);
  const [selectedOption, setSelectedOption] = useState(null);
  const [answerLocked, setAnswerLocked] = useState(false);

  useEffect(() => {
    setTimer(pollState.timer);
    const handleTimerUpdate = (newTime) => setTimer(newTime);
    socket.on('timer_update', handleTimerUpdate);
    return () => socket.off('timer_update', handleTimerUpdate);
  }, [pollState.timer]);

  const hasVoted = pollState.studentsWhoVoted.includes(user.name);

  useEffect(() => {
    const handleLock = () => setAnswerLocked(true);
    socket.on("answer_locked", handleLock);
    return () => socket.off("answer_locked", handleLock);
  }, []);

  const handleSubmitVote = () => {
    if (selectedOption !== null) {
      socket.emit('submit_answer', { studentId: user.name, answerId: selectedOption });
      setAnswerLocked(true);
    }
  };

  const totalVotes = pollState.options.reduce((sum, opt) => sum + (opt.votes || 0), 0);

  // STUDENT V// STUDENT VOTING SCREEN
if (user.role === 'student' && timer > 0) {
  return (
    <PageContainer>
      <PollContainer>

        {/* Question + Timer inline */}
       {/* Question + Timer inline */}
{/* Question + Timer inline */}
<div style={{
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-start",   // <<< keep both together at start
  gap: "12px",
  marginBottom: "8px"
}}>
  <SectionHeader style={{ margin: 0 }}>Question 1</SectionHeader>
  <TimerContainer style={{ marginBottom: 0 }}>
    ⏱ <span>00:{String(timer).padStart(2, '0')}</span>
  </TimerContainer>
</div>


<PollBox>
        <QuestionCard><h2>{pollState.question}</h2></QuestionCard>

        <OptionsContainer>
          {pollState.options.map((option, index) => (
            <OptionButton
              key={option.id}
              isSelected={selectedOption === option.id}
              disabled={answerLocked}   // disable after submit
              onClick={() => !answerLocked && setSelectedOption(option.id)}
            >
              <OptionNumber>{index + 1}</OptionNumber>
              {option.text}
            </OptionButton>
          ))}
        </OptionsContainer>
</PollBox>
        <ActionsContainer>
          <SubmitButton 
            disabled={selectedOption === null || answerLocked}
            onClick={handleSubmitVote}
          >
            {answerLocked ? "Answer Submitted" : "Submit"}
          </SubmitButton>
        </ActionsContainer>
      </PollContainer>
    </PageContainer>
  );
}


  // RESULTS SCREEN (no countdown on teacher; label added)
  return (
    <PageContainer>
      {user.role === 'teacher' && (
        <TopActionsContainer>
          <ViewHistoryButton onClick={onViewHistory}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 4.5C7 4.5 2.73 7.61 1 12C2.73 16.39 7 19.5 12 19.5C17 19.5 21.27 16.39 23 12C21.27 7.61 17 4.5 12 4.5ZM12 17C9.24 17 7 14.76 7 12C7 9.24 9.24 7 12 7C14.76 7 17 9.24 17 12C17 14.76 14.76 17 12 17ZM12 9C10.34 9 9 10.34 9 12C9 13.66 10.34 15 12 15C13.66 15 15 13.66 15 12C15 10.34 13.66 9 12 9Z" fill="#4338CA"/>
            </svg>
            View Poll history
          </ViewHistoryButton>
        </TopActionsContainer>
      )}

      <PollContainer>
        {/* No TimerContainer here */}

        <SectionHeader>Question</SectionHeader>
        <QuestionCard><h2>{pollState.question}</h2></QuestionCard>

        <OptionsContainer>
          {pollState.options.map((option, index) => {
            const percentage = totalVotes === 0 ? 0 : Math.round(((option.votes || 0) / totalVotes) * 100);
            return (
              <ResultBarContainer key={option.id}>
                <ProgressBar percentage={percentage} />
                <ContentWrapper>
                  <OptionNumber>{index + 1}</OptionNumber>
                  <ResultText isFilled={percentage > 10}>
                    {option.text}
                    {/* show which one was correct after poll ends */}
                    {timer === 0 && option.isCorrect && <CorrectTag>Correct</CorrectTag>}
                  </ResultText>
                  <ResultText isFilled={percentage > 10} style={{ marginLeft: 'auto', fontWeight: 'bold' }}>
                    {percentage}%
                  </ResultText>
                </ContentWrapper>
              </ResultBarContainer>
            );
          })}
        </OptionsContainer>

        {user.role === 'teacher' ? (
          <TeacherActionsContainer>
            <AskNewQuestionButton onClick={onAskNewQuestion}>+ Ask a new question</AskNewQuestionButton>
          </TeacherActionsContainer>
        ) : (
          <WaitingMessage>Wait for the teacher to ask a new question..</WaitingMessage>
        )}
      </PollContainer>
    </PageContainer>
  );
}

export default PollView;
