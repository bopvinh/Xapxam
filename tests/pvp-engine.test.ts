import { describe, it, expect, vi } from 'vitest';
import { initPvPSocket } from '../src/game/pvp-engine';
import { Socket } from 'socket.io-client';

describe('pvp-engine', () => {
  it('should initialize a socket connection', () => {
    const socket = initPvPSocket('test-room');
    expect(socket).toBeDefined();
    // Socket.io-client might have different connection state on init,
    // but the object should be there.
  });
});
