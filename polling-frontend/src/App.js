// frontend/src/App.js
import React, { useState, useEffect } from 'react';
import { ThemeProvider } from 'styled-components';
import { socket } from './socket';
import PollHistoryScreen from './components/PollHistoryScreen';
import RoleSelectionScreen from './components/RoleSelectionScreen';
import StudentLoginScreen from './components/StudentLoginScreen';
import TeacherDashboard from './components/TeacherDashboard';
import StudentWaitingScreen from './components/StudentWaitingScreen';
import PollView from './components/PollView';
import ChatPopup from './components/ChatPopup';
import KickedOutScreen from './components/KickedOutScreen'; 

const theme = {
  colors: {
    primary: '#6366F1',
    primaryHover: '#4F46E5',
    background: '#F9FAFB',
    cardBackground: '#FFFFFF',
    text: '#111827',
    textSecondary: '#6B7281',
    border: '#E5E7EB',
  },
  borderRadius: '8px',
  boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
};

function App() {
  const [view, setView] = useState('role_selection');
  const [user, setUser] = useState({ name: '', role: '' });
  const [pollState, setPollState] = useState(null);

  useEffect(() => {
    socket.connect();
    socket.on('poll_update', setPollState);
     socket.on('kicked', () => {
      setView('kicked_out');
    });
    return () => {
      socket.disconnect();
      socket.off('poll_update');
      socket.off('kicked');
    };
  }, []);

  const handleAskNewQuestion = () => {
    socket.emit('reset_poll');
    setView('teacher_dashboard');
  };

  const renderView = () => {
    if (view === 'kicked_out') {
      return <KickedOutScreen />;
    }
    if (view === 'poll_history') {
      return <PollHistoryScreen onViewDashboard={() => setView('teacher_dashboard')} />;
    }
    // if (view === 'teacher_dashboard') {
    //   return <TeacherDashboard />;
    // }
    
    if (pollState && pollState.isPollActive && user.role) {
    //   if (view === 'poll_history') {
    //     return <PollHistoryScreen onViewDashboard={() => setView('teacher_dashboard')} />;
    //   }
    //    if (view === 'kicked_out') {
    //   return <KickedOutScreen />;
    // }
      
      // Otherwise, continue showing the poll view as normal.
      return <PollView 
        pollState={pollState} 
        user={user} 
        onAskNewQuestion={handleAskNewQuestion}
        onViewHistory={() => setView('poll_history')} 
      />;
    }
    
    // The rest of your code remains unchanged.
    switch (view) {
      case 'poll_history':
        return <PollHistoryScreen onViewDashboard={() => setView('teacher_dashboard')} />;
      case 'student_login':
        return <StudentLoginScreen onLogin={(name) => {
          socket.emit('join', name.trim());
          setUser({ name, role: 'student' });
          setView('student_waiting');
        }} />;
      case 'teacher_dashboard':
        return <TeacherDashboard />;
      case 'student_waiting':
        return <StudentWaitingScreen />;
      case 'role_selection':
      default:
        return <RoleSelectionScreen onSelect={(role) => {
          if (role === 'teacher') {
            const teacherName = 'Teacher';
            socket.emit('join', teacherName);
            setUser({ name: teacherName, role: 'teacher' });
            setView('teacher_dashboard');
          } else {
            setUser({ name: '', role: 'student' });
            setView('student_login');
          }
        }} />;
    }
  };

  return (
    <ThemeProvider theme={theme}>
      {renderView()}
      {user.name && <ChatPopup user={user} />}
    </ThemeProvider>
  );
}

export default App;






