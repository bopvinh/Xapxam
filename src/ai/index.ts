// Word++ — AI Opponent Factory
// Public entry point for creating AI moves at any difficulty level.
// Single function: makeAIMove(ctx, config) -> AIMove.

import { makeEasyMove, EASY_CONFIG } from './ai-easy';
import { makeNormalMove, NORMAL_CONFIG } from './ai-normal';
import { makeHardMove, HARD_CONFIG } from './ai-hard';
import type { AIDifficulty, AIConfig, AIContext, AIMove } from './types';

/** Resolve defaults for a given difficulty if config fields are missing. */
function defaultConfig(difficulty: AIConfig['difficulty'], seed?: number): AIConfig {
  const base = seed !== undefined ? { seed } : {};
  switch (difficulty) {
    case 'EASY':
      return { ...EASY_CONFIG, ...base };
    case 'NORMAL':
      return { ...NORMAL_CONFIG, ...base };
    case 'HARD':
      return { ...HARD_CONFIG, ...base };
  }
}

/** Produce the AI's next guess given the current game context. */
export function makeAIMove(ctx: AIContext, config: AIConfig): AIMove {
  const cfg = defaultConfig(config.difficulty, config.seed);

  switch (cfg.difficulty) {
    case 'EASY':
      return makeEasyMove(ctx, cfg);
    case 'NORMAL':
      return makeNormalMove(ctx, cfg);
    case 'HARD':
      return makeHardMove(ctx, cfg);
    default:
      return makeEasyMove(ctx, { ...EASY_CONFIG, seed: cfg.seed });
  }
}

export { EASY_CONFIG, NORMAL_CONFIG, HARD_CONFIG };
export type { AIDifficulty, AIConfig, AIContext, AIMove };
