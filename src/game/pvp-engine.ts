import { io, Socket } from 'socket.io-client';

let pvpSocket: Socket | null = null;

export function initPvPSocket(_roomID: string): Socket {
  pvpSocket = io('http://localhost:3000', { autoConnect: false });
  return pvpSocket;
}

export function sendGuess(guess: string): void {
  if (pvpSocket) {
    pvpSocket.emit('guess', guess);
  }
}
