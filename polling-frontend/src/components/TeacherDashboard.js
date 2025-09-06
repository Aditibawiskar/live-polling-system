// frontend/src/components/TeacherDashboard.js
import React, { useState } from 'react';
import styled from 'styled-components';
import { socket } from '../socket';

// Main container
const DashboardContainer = styled.div`
  background-color: #F9FAFB;
  min-height: 100vh;
  padding: 48px;
  display: flex;
  justify-content: center;
  font-family: 'Inter', sans-serif;
`;

const FormCard = styled.div`
  background: white;
  width: 100%;
  max-width: 800px;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  padding: 32px;
`;

// Header section
const Header = styled.div`
  h1 { font-size: 32px; font-weight: 700; color: #1F2937; }
  p { color: #6B7281; margin-top: 8px; }
`;

const FormRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 24px 0 8px 0;
`;

const Label = styled.label`
  font-weight: 600;
  color: #374151;
`;

// Question Text Area with Character Counter
const TextAreaContainer = styled.div`
  position: relative;
`;

const TextArea = styled.textarea`
  width: 100%;
  height: 120px;
  border: 1px solid #D1D5DB;
  border-radius: 8px;
  padding: 12px;
  font-size: 16px;
  resize: vertical;
  &:focus {
    outline: none;
    border-color: #6366F1;
    box-shadow: 0 0 0 2px rgba(99, 102, 241, 0.2);
  }
`;

const CharCounter = styled.span`
  position: absolute;
  bottom: 12px;
  right: 12px;
  color: #9CA3AF;
  font-size: 12px;
`;

// Options Section
const OptionItem = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 12px;
`;

const OptionNumber = styled.div`
  width: 24px;
  height: 24px;
  border-radius: 22px;
  background-color: #EEF2FF;
 background: linear-gradient(243.94deg, #8F64E1 -50.82%, #4E377B 216.33%);
color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  flex-shrink: 0;
  font-size: 11px; 
`;

const OptionInput = styled.input`
  flex-grow: 1;
  padding: 12px;
  border: 1px solid #D1D5DB;
  border-radius: 8px;
  font-size: 11px;
  background-color: #F9FAFB;
`;

const CorrectnessLabel = styled.span`
  font-weight: 600;
  color: #374151;
  margin-right: 8px;
`;

const RadioGroup = styled.div`
  display: flex;
  gap: 16px;
`;

const RadioLabel = styled.label`
  display: flex;
  align-items: center;
  cursor: pointer;
  input { display: none; }
  span {
    color: #6B7281;
  }
  div {
    width: 20px;
    height: 20px;
    border-radius: 50%;
   border: 2px solid #8F64E1;
    margin-right: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    &::after {
      content: '';
      width: 14px;
      height: 14px;
      border-radius: 50%;
background: #8F64E1;

      display: block;
      transform: scale(0);
      transition: transform 0.15s;
    }
  }
  input:checked + div::after {
    transform: scale(1);
  }
`;

const AddOptionButton = styled.button`
  background: none;
  border: 1px solid #7451B6;
  color: #7C57C2;

  font-weight: 600;
  padding: 10px 16px;
  border-radius: 8px;
  cursor: pointer;
  margin-top: 8px;
`;

// Footer and Submit Button
const Footer = styled.div`
  border-top: 1px solid #E5E7EB;
  margin-top: 32px;
  padding-top: 24px;
  display: flex;
  justify-content: flex-end;
`;

const AskQuestionButton = styled.button`
  background: linear-gradient(99.18deg, #8F64E1 -46.89%, #1D68BD 223.45%);
  border-radius: 34px;
  padding: 14px 40px;
  color: white;
  font-size: 16px;
  font-weight: 700;
  border: none;
  cursor: pointer;
`;

// Timer display (non-functional dropdown for looks)
const TimerDisplay = styled.div`
  border: 1px solid #D1D5DB;
  border-radius: 8px;
  padding: 8px 12px;
  color: #374151;
`;


function TeacherDashboard() {
  const [question, setQuestion] = useState('');
  const [options, setOptions] = useState([
    { text: '', isCorrect: false },
    { text: '', isCorrect: false }
  ]);
  const [timer, setTimer] = useState(60);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleOptionChange = (index, value) => {
    const newOptions = [...options];
    newOptions[index].text = value;
    setOptions(newOptions);
  };

 const handleCorrectnessChange = (optionIndex) => {
    const newOptions = options.map((option, index) => ({
      ...option,
      isCorrect: index === optionIndex,
    }));
    setOptions(newOptions);
  };

  const handleAddOption = () => {
    setOptions([...options, { text: '', isCorrect: false }]);
  };
  
  // const handleSubmit = () => {
  //   if (question.trim() && options.every(opt => opt.text.trim())) {
  //     const pollData = {
  //       question,
  //       options: options.map(opt => opt.text), // Sending only text for now
  //       timer,
  //     };
  //     socket.emit('create_poll', pollData);
  //     console.log('Poll created:', pollData);
  //   } else {
  //     alert('Please fill out the question and all option fields.');
  //   }
  // };

  const handleSubmit = () => {
    if (!question.trim() || !options.every(opt => opt.text.trim())) {
      alert('Please fill out the question and all option fields.');
      return;
    }
    if (!options.some(opt => opt.isCorrect)) {
      alert('Please mark one of the options as the correct answer.');
      return;
    }

    setIsSubmitting(true); // Disable button and show loading text

    const pollData = {
      question,
      options: options, 
      timer,
    };
    socket.emit('create_poll', pollData);
  };


  return (
    <DashboardContainer>
      <FormCard>
        <Header>
          <h1>Let's Get Started</h1>
          <p>You'll have the ability to create and manage polls, ask questions, and monitor your students' responses in real-time.</p>
        </Header>
        
        <FormRow>
          <Label htmlFor="question">Enter your question</Label>
          <TimerDisplay>{timer} seconds ▼</TimerDisplay>
        </FormRow>
        <TextAreaContainer>
          <TextArea 
            id="question"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="e.g., Which planet is known as the Red Planet?"
            maxLength={100}
          />
          <CharCounter>{question.length}/100</CharCounter>
        </TextAreaContainer>
        
        <Label>Edit Options</Label>
        {options.map((option, index) => (
          <OptionItem key={index}>
            <OptionNumber>{index + 1}</OptionNumber>
            <OptionInput 
              type="text"
              value={option.text}
              onChange={(e) => handleOptionChange(index, e.target.value)}
              placeholder={`Option ${index + 1}`}
            />
            <CorrectnessLabel>Is it Correct?</CorrectnessLabel>
            <RadioGroup>
                <RadioLabel>
                    <input 
                  type="radio" 
                  name={`correct-option`} 
                  checked={option.isCorrect} 
                  onChange={() => handleCorrectnessChange(index)} 
                />
                    <div></div>
                    <span>Yes</span>
                </RadioLabel>
                <RadioLabel>
                    <input type="radio" name={`correct-option-${index}`} checked={option.isCorrect === false} onChange={() => handleCorrectnessChange(index, false)} />
                    <div></div>
                    <span>No</span>
                </RadioLabel>
            </RadioGroup>
          </OptionItem>
        ))}

        <AddOptionButton onClick={handleAddOption}>
          + Add More option
        </AddOptionButton>

        <Footer>
         <AskQuestionButton onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? 'Asking...' : 'Ask Question'}
          </AskQuestionButton>
        </Footer>
      </FormCard>
    </DashboardContainer>
  );
}

export default TeacherDashboard;