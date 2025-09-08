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

let currentPoll = null;
let pollHistory = [];
let pollTimer;
let participants = {}; // { socketId: name }

function getResults(final = false) {
  if (!currentPoll) return null;

  let counts = currentPoll.options.map((_, i) =>
    Object.values(currentPoll.answers).filter(a => a === i).length
  );

  return {
    question: currentPoll.question,
    options: currentPoll.options,
    counts,
    final
  };
}

function endPoll() {
  if (!currentPoll) return;
  io.emit("pollEnd", getResults(true));
  pollHistory.push({ ...getResults(true), endedAt: Date.now() });
  currentPoll = null;
  clearInterval(pollTimer);
}

io.on('connection', (socket) => {
  console.log(`User connected: ${socket.id}`);

  // Join with name
  socket.on('join', (name) => {
    participants[socket.id] = name;
    io.emit('update_participants', Object.values(participants));
  });

  // Teacher creates poll
  socket.on('create_poll', (data) => {
    currentPoll = {
      question: data.question,
      options: data.options.map((opt, index) => ({
        id: index,
        text: opt.text,
        isCorrect: opt.isCorrect || false
      })),
      answers: {},   // { studentId: optionIndex }
      timer: data.timer || 60,
      startedAt: Date.now()
    };

    io.emit("pollStart", currentPoll);

    // Start countdown
    clearInterval(pollTimer);
    pollTimer = setInterval(() => {
      const timeLeft = currentPoll.timer - Math.floor((Date.now() - currentPoll.startedAt) / 1000);
      io.emit("timer_update", Math.max(timeLeft, 0));

      if (timeLeft <= 0) endPoll();
    }, 1000);
  });

  // Student submits answer
 socket.on("submitAnswer", ({ studentId, optionIndex }) => {
  if (!currentPoll) return;

  // prevent re-answer
  if (currentPoll.answers[studentId] !== undefined) return;

  currentPoll.answers[studentId] = optionIndex;

  // tell this student their answer is locked
  socket.emit("answer_locked", optionIndex);

  // broadcast updated live results
  io.emit("pollUpdate", getResults());

  // if all participants answered → end early
  if (Object.keys(currentPoll.answers).length === Object.keys(participants).length) {
    endPoll();
  }
});

// When frontend requests current participants
socket.on('get_participants', () => {
  socket.emit('update_participants', Object.values(participants));
});


  // Teacher resets poll
  socket.on('reset_poll', () => {
    endPoll();
  });

  // Teacher removes student
  socket.on('remove_student', (studentName) => {
    const socketIdToRemove = Object.keys(participants).find(
      (id) => participants[id] === studentName
    );
    if (socketIdToRemove) {
      io.to(socketIdToRemove).emit('kicked');
      io.sockets.sockets.get(socketIdToRemove)?.disconnect(true);
    }
  });

  // Chat
  socket.on('send_message', (messageData) => {
    io.emit('receive_message', messageData);
  });

  // Disconnect
  socket.on('disconnect', () => {
    console.log(`User disconnected: ${socket.id}`);
    delete participants[socket.id];
    io.emit('update_participants', Object.values(participants));
  });
});

app.get("/", (req, res) => {
  res.send("Backend is working 🚀");
});

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
