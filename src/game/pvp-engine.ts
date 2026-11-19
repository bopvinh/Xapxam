import { io, Socket } from 'socket.io-client';

let pvpSocket: Socket | null = null;

export function initPvPSocket(_roomID?: string): Socket {
  if (!pvpSocket) {
    pvpSocket = io('http://localhost:3000', {
      autoConnect: true,
      transports: ['websocket', 'polling'],
    });
  }
  return pvpSocket;
}

export function getPvPSocket(): Socket | null {
  return pvpSocket;
}

export function createRoom(roomID: string): void {
  if (pvpSocket && roomID) {
    pvpSocket.emit('create', roomID);
  }
}

export function joinRoom(roomID: string): void {
  if (pvpSocket && roomID) {
    pvpSocket.emit('join', roomID);
  }
}

export function sendGuess(guess: string, roomID: string): void {
  if (pvpSocket && roomID && guess) {
    pvpSocket.emit('guess', { roomID, guess });
  }
}

export function onEvaluationReceived(
  callback: (data: { evaluation: any; guess: string; senderID: string }) => void
): () => void {
  if (pvpSocket) {
    pvpSocket.on('evaluation_result', callback);
  }
  return () => {
    if (pvpSocket) {
      pvpSocket.off('evaluation_result', callback);
    }
  };
}

export function onDamageReceived(
  callback: (data: { damage: number; senderID: string }) => void
): () => void {
  if (pvpSocket) {
    pvpSocket.on('damage_received', callback);
  }
  return () => {
    if (pvpSocket) {
      pvpSocket.off('damage_received', callback);
    }
  };
}

export function onGaugeReceived(
  callback: (data: { gauge: number; damageDealt?: number }) => void
): () => void {
  if (pvpSocket) {
    pvpSocket.on('gauge_received', callback);
  }
  return () => {
    if (pvpSocket) {
      pvpSocket.off('gauge_received', callback);
    }
  };
}

export function disconnectPvP(): void {
  if (pvpSocket) {
    pvpSocket.disconnect();
    pvpSocket = null;
  }
}

