import { io, Socket } from 'socket.io-client';

export function initPvPSocket(roomID: string): Socket {
  // TODO: Point to real PvP server
  return io('http://localhost:3000', { autoConnect: false });
}

export function sendGuess(guess: string): void {
  // TODO: Implement
}
