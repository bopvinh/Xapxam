import { describe, it, expect, vi, beforeEach } from 'vitest';
import { 
  initPvPSocket, 
  sendGuess, 
  onEvaluationReceived, 
  onDamageReceived,
  onGaugeReceived,
  createRoom 
} from '../src/game/pvp-engine';
import { io } from 'socket.io-client';

vi.mock('socket.io-client', () => {
  const mockSocket = {
    emit: vi.fn(),
    on: vi.fn(),
    off: vi.fn(),
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
    expect(io).toHaveBeenCalledWith('http://localhost:3000', {
      autoConnect: true,
      transports: ['websocket', 'polling'],
    });
  });

  it('should create a room with roomID only', () => {
    const socket = initPvPSocket('test-room');
    createRoom('ROOM1');
    expect(socket.emit).toHaveBeenCalledWith('create', 'ROOM1');
  });

  it('should send a guess over the initialized socket', () => {
    const socket = initPvPSocket('test-room');
    sendGuess('stare', 'ROOM');
    expect(socket.emit).toHaveBeenCalledWith('guess', { roomID: 'ROOM', guess: 'stare' });
  });

  it('should register and cleanup listeners for evaluation, damage, and gauge', () => {
    const socket = initPvPSocket('test-room');
    
    const evalCb = vi.fn();
    const cleanupEval = onEvaluationReceived(evalCb);
    expect(socket.on).toHaveBeenCalledWith('evaluation_result', evalCb);
    cleanupEval();
    expect(socket.off).toHaveBeenCalledWith('evaluation_result', evalCb);

    const dmgCb = vi.fn();
    const cleanupDmg = onDamageReceived(dmgCb);
    expect(socket.on).toHaveBeenCalledWith('damage_received', dmgCb);
    cleanupDmg();
    expect(socket.off).toHaveBeenCalledWith('damage_received', dmgCb);

    const gaugeCb = vi.fn();
    const cleanupGauge = onGaugeReceived(gaugeCb);
    expect(socket.on).toHaveBeenCalledWith('gauge_received', gaugeCb);
    cleanupGauge();
    expect(socket.off).toHaveBeenCalledWith('gauge_received', gaugeCb);
  });
});
