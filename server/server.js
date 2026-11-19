import { Server } from 'socket.io';
import { createServer } from 'http';
import { evaluateGuess, getRandomSecretWord } from '../src/game/engine.ts';

const httpServer = createServer();
const io = new Server(httpServer, {
  cors: {
    origin: ["http://localhost:5173", "http://127.0.0.1:5173"],
    methods: ["GET", "POST"]
  },
  allowEIO3: true,
  transports: ['websocket', 'polling']
});

const rooms = new Map();

io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);

  socket.on('create', (payload) => {
    const roomID = typeof payload === 'string' ? payload : payload?.roomID;
    if (!roomID) return;
    const secretWord = getRandomSecretWord();
    socket.join(roomID);
    rooms.set(roomID, { secretWord, host: socket.id });
    socket.emit('room_created', { roomID });
    console.log(`Socket ${socket.id} created room ${roomID}`);
  });

  socket.on('join', (payload) => {
    const roomID = typeof payload === 'string' ? payload : payload?.roomID;
    if (!roomID) return;
    socket.join(roomID);
    console.log(`Socket ${socket.id} joined room ${roomID}`);
  });

  socket.on('guess', (data) => {
    if (!data || !data.roomID || !data.guess) return;
    const room = rooms.get(data.roomID);
    if (!room) return;

    const evaluation = evaluateGuess(data.guess, room.secretWord);

    // Relay result to everyone in the room
    io.in(data.roomID).emit('evaluation_result', {
      evaluation,
      senderID: socket.id,
      guess: data.guess
    });

    // Calculate combat metrics
    const correctCount = evaluation.filter(e => e.state === 'correct').length;
    const presentCount = evaluation.filter(e => e.state === 'present').length;
    const damage = correctCount * 20;
    const gauge = correctCount * 20 + presentCount * 10;

    // Emit damage_received to opponents in the room
    socket.to(data.roomID).emit('damage_received', { damage, senderID: socket.id });

    // Emit gauge_received and damage confirmation to the sender
    socket.emit('gauge_received', { gauge, damageDealt: damage });
  });

  socket.on('request_rematch', (payload) => {
    const roomID = typeof payload === 'string' ? payload : payload?.roomID;
    if (!roomID) return;
    const newSecretWord = getRandomSecretWord();
    const existing = rooms.get(roomID) || {};
    rooms.set(roomID, { ...existing, secretWord: newSecretWord });
    io.in(roomID).emit('rematch_started');
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

httpServer.listen(3000, () => {
  console.log('PvP server running on port 3000');
});
