import { io, Socket } from 'socket.io-client';

let pvpSocket: Socket | null = null;

export function initPvPSocket(_roomID: string): Socket {
  pvpSocket = io('http://localhost:3000', { autoConnect: false });
  return pvpSocket;
}

export function createRoom(): string {
  const roomID = Math.random().toString(36).substring(2, 6).toUpperCase();
  if (pvpSocket) {
    pvpSocket.emit('create', roomID);
  }
  return roomID;
}

export function joinRoom(roomID: string): void {
  if (pvpSocket) {
    pvpSocket.emit('join', roomID);
  }
}

export function sendGuess(guess: string, roomID: string): void {
  if (pvpSocket) {
    pvpSocket.emit('guess', { roomID, guess });
  }
}
