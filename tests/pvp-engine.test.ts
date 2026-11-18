import { describe, it, expect, vi, beforeEach } from 'vitest';
import { initPvPSocket, sendGuess, onGuessReceived } from '../src/game/pvp-engine';
import { io } from 'socket.io-client';

vi.mock('socket.io-client', () => {
  const mockSocket = {
    emit: vi.fn(),
    on: vi.fn(),
  };
  return {
    io: vi.fn(() => mockSocket),
  };
});

describe('pvp-engine', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should initialize a socket connection', () => {
    const socket = initPvPSocket('test-room');
    expect(socket).toBeDefined();
    expect(io).toHaveBeenCalledWith('http://localhost:3000', { autoConnect: false });
  });

  it('should send a guess over the initialized socket', () => {
    const socket = initPvPSocket('test-room');
    sendGuess('stare', 'ROOM');
    expect(socket.emit).toHaveBeenCalledWith('guess', { roomID: 'ROOM', guess: 'stare' });
  });

  it('should register a listener for guess_received', () => {
    const socket = initPvPSocket('test-room');
    const callback = vi.fn();
    onGuessReceived(callback);
    expect(socket.on).toHaveBeenCalledWith('guess_received', callback);
  });
});
