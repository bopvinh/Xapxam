import { Server } from 'socket.io';
import { createServer } from 'http';

const httpServer = createServer();
const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"]
  }
});

io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);

  socket.on('join', (roomID) => {
    socket.join(roomID);
    console.log(`Socket ${socket.id} joined room ${roomID}`);
  });

  socket.on('guess', (data) => {
    // Relay guess to others in the same room
    socket.to(data.roomID).emit('guess_received', { ...data, senderID: socket.id });
    
    // Skill-based combat: calculate damage/gauge based on evaluation
    const { evaluateGuess } = require('./engine.js'); // Assuming engine is available via build/CJS
    const evaluation = evaluateGuess(data.guess, data.secretWord); // Need to pass secretWord
    const damage = evaluation.filter(e => e.state === 'correct').length * 20;
    const gauge = evaluation.filter(e => e.state === 'present').length * 10;
    
    socket.to(data.roomID).emit('damage_received', { damage, gauge });
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

httpServer.listen(3000, () => {
  console.log('PvP server running on port 3000');
});
