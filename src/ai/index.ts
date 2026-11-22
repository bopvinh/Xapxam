// Word++ — AI Opponent Factory
// Public entry point for creating AI moves at any difficulty level.
// Single function: makeAIMove(ctx, config) -> AIMove.

import { makeEasyMove, EASY_CONFIG } from './ai-easy';
import { makeNormalMove, NORMAL_CONFIG } from './ai-normal';
import { makeHardMove, HARD_CONFIG } from './ai-hard';
import type { AIDifficulty, AIConfig, AIContext, AIMove, AIPersonality, AIPersonalityId } from './types';

export const AI_PERSONALITIES: AIPersonality[] = [
  {
    id: 'LEXICAL_DUELIST',
    name: 'Sir Words-a-Lot',
    title: 'The Lexical Duelist',
    icon: '⚔️',
    difficulty: 'EASY',
    description: 'Quick-striking novice who relies on vowel frequency and bold openers.',
    avatarColor: '#38bdf8',
    quote: 'En garde! Prepare to feel the weight of my vocabulary!'
  },
  {
    id: 'SCRABBLE_WIZARD',
    name: 'Grandmaster Vowel',
    title: 'The Scrabble Wizard',
    icon: '🧙‍♂️',
    difficulty: 'NORMAL',
    description: 'Master of anagrams and entropy maximization. Prefers balanced letter variance.',
    avatarColor: '#a855f7',
    quote: 'The arcane runes of syntax reveal all secrets in due time.'
  },
  {
    id: 'CHAOS_JESTER',
    name: 'Harlequin Jack',
    title: 'The Chaos Jester',
    icon: '🃏',
    difficulty: 'NORMAL',
    description: 'Unpredictable wild card that tests unexpected letter combinations with high flair.',
    avatarColor: '#f43f5e',
    quote: 'Why so serious? Let us throw consonants to the wind!'
  },
  {
    id: 'CRYPTIC_ORACLE',
    name: 'Pythia Nine',
    title: 'The Cryptic Oracle',
    icon: '🔮',
    difficulty: 'HARD',
    description: 'Deep expected-attempts lookahead oracle. Analyzes all potential guess branches.',
    avatarColor: '#f59e0b',
    quote: 'I have calculated 10,000 possibilities. Yours end in defeat.'
  },
  {
    id: 'WORDMASTER_SUPREME',
    name: 'Lexicon Omega',
    title: 'The Wordmaster Supreme',
    icon: '👑',
    difficulty: 'HARD',
    description: 'The ultimate AI champion. Zero-mistake lookahead with artifact synergy prediction.',
    avatarColor: '#ec4899',
    quote: 'To conquer the Word++ realm, one must embody the dictionary itself.'
  }
];

export function getAIPersonality(id?: AIPersonalityId): AIPersonality {
  return AI_PERSONALITIES.find((p) => p.id === id) || AI_PERSONALITIES[0];
}

/** Resolve defaults for a given difficulty if config fields are missing. */
function defaultConfig(difficulty: AIConfig['difficulty'], seed?: number, personalityId?: AIPersonalityId): AIConfig {
  const base = seed !== undefined ? { seed } : {};
  switch (difficulty) {
    case 'EASY':
      return { ...EASY_CONFIG, personalityId: personalityId || 'LEXICAL_DUELIST', ...base };
    case 'NORMAL':
      return { ...NORMAL_CONFIG, personalityId: personalityId || 'SCRABBLE_WIZARD', ...base };
    case 'HARD':
      return { ...HARD_CONFIG, personalityId: personalityId || 'CRYPTIC_ORACLE', ...base };
  }
}

/** Produce the AI's next guess given the current game context. */
export function makeAIMove(ctx: AIContext, config: AIConfig): AIMove {
  const cfg = defaultConfig(config.difficulty, config.seed, config.personalityId);
  const personality = getAIPersonality(cfg.personalityId);

  let move: AIMove;
  switch (cfg.difficulty) {
    case 'EASY':
      move = makeEasyMove(ctx, cfg);
      break;
    case 'NORMAL':
      move = makeNormalMove(ctx, cfg);
      break;
    case 'HARD':
      move = makeHardMove(ctx, cfg);
      break;
    default:
      move = makeEasyMove(ctx, { ...EASY_CONFIG, seed: cfg.seed });
      break;
  }

  return {
    ...move,
    personalityName: `${personality.icon} ${personality.name} (${personality.title})`
  };
}

export { EASY_CONFIG, NORMAL_CONFIG, HARD_CONFIG };
export type { AIDifficulty, AIConfig, AIContext, AIMove, AIPersonality, AIPersonalityId };
