import { io, Socket } from 'socket.io-client';

let pvpSocket: Socket | null = null;

export function initPvPSocket(_roomID: string): Socket {
  pvpSocket = io('http://localhost:3000', { autoConnect: false });
  return pvpSocket;
}

export function createRoom(roomID: string, secretWord: string): void {
  if (pvpSocket) {
    pvpSocket.emit('create', { roomID, secretWord });
  }
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

export function onEvaluationReceived(callback: (data: { evaluation: any; guess: string; senderID: string }) => void): void {
  if (pvpSocket) {
    pvpSocket.on('evaluation_result', callback);
  }
}
