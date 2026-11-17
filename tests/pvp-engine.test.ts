import { describe, it, expect, vi, beforeEach } from 'vitest';
import { initPvPSocket, sendGuess } from '../src/game/pvp-engine';
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
    sendGuess('stare');
    expect(socket.emit).toHaveBeenCalledWith('guess', 'stare');
  });
});
