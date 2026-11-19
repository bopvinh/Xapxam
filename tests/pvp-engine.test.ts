import { describe, it, expect, vi, beforeEach } from 'vitest';
import { initPvPSocket, sendGuess, onEvaluationReceived, createRoom } from '../src/game/pvp-engine';
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

  it('should create a room with a secret word', () => {
    const socket = initPvPSocket('test-room');
    createRoom('ROOM1', 'APPLE');
    expect(socket.emit).toHaveBeenCalledWith('create', { roomID: 'ROOM1', secretWord: 'APPLE' });
  });

  it('should send a guess over the initialized socket', () => {
    const socket = initPvPSocket('test-room');
    sendGuess('stare', 'ROOM');
    expect(socket.emit).toHaveBeenCalledWith('guess', { roomID: 'ROOM', guess: 'stare' });
  });

  it('should register a listener for evaluation_result', () => {
    const socket = initPvPSocket('test-room');
    const callback = vi.fn();
    onEvaluationReceived(callback);
    expect(socket.on).toHaveBeenCalledWith('evaluation_result', callback);
  });
});
