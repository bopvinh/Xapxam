import { Server } from 'socket.io';
import { createServer } from 'http';
import { evaluateGuess } from '../src/game/engine.ts';

const httpServer = createServer();
const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"]
  }
});

const rooms = new Map();

io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);

  socket.on('create', ({ roomID, secretWord }) => {
    socket.join(roomID);
    rooms.set(roomID, { secretWord });
    console.log(`Socket ${socket.id} created room ${roomID}`);
  });

  socket.on('join', (roomID) => {
    socket.join(roomID);
    console.log(`Socket ${socket.id} joined room ${roomID}`);
  });

  socket.on('guess', (data) => {
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
    const damage = evaluation.filter(e => e.state === 'correct').length * 20;
    const gauge = evaluation.filter(e => e.state === 'present').length * 10;
    
    io.in(data.roomID).emit('damage_received', { damage, gauge });
  });

  socket.on('request_rematch', (roomID) => {
    // Reset room state for everyone
    io.in(roomID).emit('rematch_started');
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

httpServer.listen(3000, () => {
  console.log('PvP server running on port 3000');
});
