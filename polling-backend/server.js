// backend/server.js
const express = require('express');
const http = require('http');
const { Server } = require("socket.io");
const cors = require('cors');

const app = express();
app.use(cors());
const server = http.createServer(app);

const io = new Server(server, {
  cors: { origin: "*", methods: ["GET", "POST"] }
});

let pollState = {
  question: "",
  options: [],
  isPollActive: false,
  timer: 60,
  studentsWhoVoted: new Set()
};
let pollHistory = [];
let pollTimer;
let participants = {};

const resetPoll = () => {
  clearInterval(pollTimer);
  pollState = {
    question: "", options: [], isPollActive: false, timer: 60, studentsWhoVoted: new Set()
  };
};

io.on('connection', (socket) => {
  console.log(`User connected: ${socket.id}`);

  const broadcastUpdate = () => {
    io.emit('poll_update', {
      ...pollState,
      studentsWhoVoted: Array.from(pollState.studentsWhoVoted)
    });
    io.emit('update_participants', Object.values(participants));
  };

  broadcastUpdate();
  socket.emit('update_history', pollHistory);

  socket.on('join', (name) => {
    participants[socket.id] = name;
    io.emit('update_participants', Object.values(participants));
  });

  socket.on('create_poll', (data) => {
    pollState = {
      question: data.question,
      options: data.options.map((opt, index) => ({ id: index, text: opt.text, isCorrect: opt.isCorrect, votes: 0 })),
      isPollActive: true,
      timer: data.timer || 60,
      studentsWhoVoted: new Set()
    };
    broadcastUpdate();
    
    clearInterval(pollTimer);
    pollTimer = setInterval(() => {
      pollState.timer--;
      io.emit('timer_update', pollState.timer);
      if (pollState.timer <= 0) {
        clearInterval(pollTimer);
        pollHistory.push({ ...pollState, studentsWhoVoted: Array.from(pollState.studentsWhoVoted) });
        pollState.isPollActive = false;
        io.emit('poll_ended', pollState);
        io.emit('update_history', pollHistory);
      }
    }, 1000);
  });

  socket.on('submit_answer', ({ studentId, answerId }) => {
    if (pollState.isPollActive && !pollState.studentsWhoVoted.has(studentId)) {
      const option = pollState.options.find(opt => opt.id === answerId);
      if (option) {
        option.votes++;
        pollState.studentsWhoVoted.add(studentId);
        broadcastUpdate();
      }
    }
  });

  socket.on('reset_poll', () => {
    resetPoll();
    broadcastUpdate();
  });

  // THIS LISTENER WAS MISSING
  socket.on('remove_student', (studentName) => {
    const socketIdToRemove = Object.keys(participants).find(
      (id) => participants[id] === studentName
    );
    if (socketIdToRemove) {
      io.to(socketIdToRemove).emit('kicked');
      io.sockets.sockets.get(socketIdToRemove)?.disconnect(true);
    }
  });

  socket.on('get_history', () => {
    socket.emit('update_history', pollHistory);
  });

  socket.on('get_participants', () => {
    socket.emit('update_participants', Object.values(participants));
  });

  socket.on('send_message', (messageData) => {
    io.emit('receive_message', messageData);
  });
  
  socket.on('disconnect', () => {
    console.log(`User disconnected: ${socket.id}`);
    delete participants[socket.id];
    io.emit('update_participants', Object.values(participants));
});

});

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));