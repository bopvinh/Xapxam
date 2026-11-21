/**
 * Artifact System - Backpack Brawl inspired inventory/equipment for Word++
 * Adds strategic depth through equippable modifiers with synergies
 */

export type ArtifactRarity = 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';

export type ArtifactSlot = 'weapon' | 'armor' | 'utility' | 'trinket';

export interface ArtifactEffect {
  type: 
    | 'score_multiplier'      // Multiply word score
    | 'letter_bonus'          // Bonus points for specific letters
    | 'vowel_bonus'           // Bonus for vowels
    | 'consonant_bonus'       // Bonus for consonants
    | 'length_bonus'          // Bonus based on word length
    | 'streak_bonus'          // Bonus that scales with streak
    | 'hint_reveal'           // Reveal a letter
    | 'extra_guess'           // Grant extra guess
    | 'hard_mode_ease'        // Reduce hard mode penalty
    | 'timer_bonus'           // Extra time in timed mode
    | 'shop_discount'         // Discount in shop
    | 'rarity_find'           // Increase rare find chance
    | 'synergy_trigger';      // Triggers when combined with specific artifacts
  
  value: number;           // Primary value
  condition?: string;      // Optional condition (e.g., "letter:E", "length:5")
  synergyId?: string;      // For synergy effects
}

export interface Artifact {
  id: string;
  name: string;
  description: string;
  rarity: ArtifactRarity;
  slot: ArtifactSlot;
  effects: ArtifactEffect[];
  flavorText?: string;
  icon: string;           // Emoji or icon identifier
  maxLevel: number;       // Can be upgraded
  baseValue: number;      // Base shop price
}

export interface EquippedArtifacts {
  weapon: string | null;
  armor: string | null;
  utility: string | null;
  trinket: string | null;
}

export interface PlayerInventory {
  artifacts: Record<string, { artifactId: string; level: number; obtainedAt: number }>;
  equipped: EquippedArtifacts;
  currency: number;        // "Lexicons" - earned from games
  totalEarned: number;     // Lifetime earnings
}

// Rarity configuration
export const RARITY_CONFIG: Record<ArtifactRarity, { 
  color: string; 
  glowColor: string;
  borderColor: string;
  nameColor: string;
  dropWeight: number;
  priceMultiplier: number;
}> = {
  common: { 
    color: '#9ca3af', 
    glowColor: 'rgba(156, 163, 175, 0.3)', 
    borderColor: '#6b7280',
    nameColor: '#d1d5db',
    dropWeight: 100,
    priceMultiplier: 1.0
  },
  uncommon: { 
    color: '#22c55e', 
    glowColor: 'rgba(34, 197, 94, 0.4)', 
    borderColor: '#16a34a',
    nameColor: '#4ade80',
    dropWeight: 50,
    priceMultiplier: 2.5
  },
  rare: { 
    color: '#3b82f6', 
    glowColor: 'rgba(59, 130, 246, 0.5)', 
    borderColor: '#2563eb',
    nameColor: '#60a5fa',
    dropWeight: 20,
    priceMultiplier: 6.0
  },
  epic: { 
    color: '#a855f7', 
    glowColor: 'rgba(168, 85, 247, 0.6)', 
    borderColor: '#9333ea',
    nameColor: '#c084fc',
    dropWeight: 8,
    priceMultiplier: 15.0
  },
  legendary: { 
    color: '#f59e0b', 
    glowColor: 'rgba(245, 158, 11, 0.7)', 
    borderColor: '#d97706',
    nameColor: '#fbbf24',
    dropWeight: 2,
    priceMultiplier: 40.0
  }
};

// Artifact Database
export const ARTIFACT_DATABASE: Artifact[] = [
  // WEAPONS - Offensive artifacts that boost scoring
  {
    id: 'vowel_magnet',
    name: "Vowel Magnet",
    description: "Vowels worth +2 points each. 'Words flow like rivers.'",
    rarity: 'uncommon',
    slot: 'weapon',
    effects: [{ type: 'vowel_bonus', value: 2 }],
    icon: '🧲',
    maxLevel: 3,
    baseValue: 50
  },
  {
    id: 'consonant_crusher',
    name: "Consonant Crusher",
    description: "Consonants worth +3 points. 'Hard sounds hit harder.'",
    rarity: 'rare',
    slot: 'weapon',
    effects: [{ type: 'consonant_bonus', value: 3 }],
    icon: '🔨',
    maxLevel: 3,
    baseValue: 150
  },
  {
    id: 'length_lance',
    name: "Length Lance",
    description: "+15% score per letter beyond 4. 'Long words pierce defenses.'",
    rarity: 'rare',
    slot: 'weapon',
    effects: [{ type: 'length_bonus', value: 15, condition: 'minLength:5' }],
    icon: '🏹',
    maxLevel: 3,
    baseValue: 200
  },
  {
    id: 'perfect_strike',
    name: "Perfect Strike",
    description: "First guess correct = 3x score. 'One shot, one kill.'",
    rarity: 'epic',
    slot: 'weapon',
    effects: [{ type: 'score_multiplier', value: 3, condition: 'attempts:1' }],
    icon: '🎯',
    maxLevel: 2,
    baseValue: 500
  },
  {
    id: 'lexicon_blade',
    name: "Lexicon Blade",
    description: "All letters +1 point. Upgradable. 'The scholar's sword.'",
    rarity: 'legendary',
    slot: 'weapon',
    effects: [{ type: 'letter_bonus', value: 1 }],
    flavorText: "Forged from the first dictionary.",
    icon: '⚔️',
    maxLevel: 5,
    baseValue: 2000
  },

  // ARMOR - Defensive artifacts that reduce penalties / provide safety
  {
    id: 'mistake_shield',
    name: "Mistake Shield",
    description: "First wrong guess doesn't count. 'Everyone deserves a second chance.'",
    rarity: 'uncommon',
    slot: 'armor',
    effects: [{ type: 'extra_guess', value: 1, condition: 'firstMiss' }],
    icon: '🛡️',
    maxLevel: 2,
    baseValue: 75
  },
  {
    id: 'hard_mode_ward',
    name: "Hard Mode Ward",
    description: "Hard mode revealed letters stay locked. 'Structure persists.'",
    rarity: 'rare',
    slot: 'armor',
    effects: [{ type: 'hard_mode_ease', value: 1 }],
    icon: '🗝️',
    maxLevel: 1,
    baseValue: 180
  },
  {
    id: 'streak_preserver',
    name: "Streak Preserver",
    description: "Lose streak? 50% chance to keep it. 'Momentum is precious.'",
    rarity: 'epic',
    slot: 'armor',
    effects: [{ type: 'streak_bonus', value: 50, condition: 'streakSave' }],
    icon: '🔗',
    maxLevel: 2,
    baseValue: 600
  },
  {
    id: 'aegis_of_words',
    name: "Aegis of Words",
    description: "Immune to streak loss once per day. 'Unbreakable resolve.'",
    rarity: 'legendary',
    slot: 'armor',
    effects: [{ type: 'streak_bonus', value: 100, condition: 'dailyStreakSave' }],
    flavorText: "Blessed by the Muses themselves.",
    icon: '🏛️',
    maxLevel: 1,
    baseValue: 3000
  },

  // UTILITY - Functional artifacts that provide hints, time, or convenience
  {
    id: 'whispering_quill',
    name: "Whispering Quill",
    description: "Reveal 1 random letter per game. 'It knows what you seek.'",
    rarity: 'common',
    slot: 'utility',
    effects: [{ type: 'hint_reveal', value: 1 }],
    icon: '🪶',
    maxLevel: 3,
    baseValue: 30
  },
  {
    id: 'hourglass_sand',
    name: "Hourglass Sand",
    description: "+15 seconds in Timed mode. 'Time flows differently here.'",
    rarity: 'uncommon',
    slot: 'utility',
    effects: [{ type: 'timer_bonus', value: 15 }],
    icon: '⏳',
    maxLevel: 3,
    baseValue: 60
  },
  {
    id: 'merchant_seal',
    name: "Merchant's Seal",
    description: "20% discount in shop. 'A fair trade.'",
    rarity: 'rare',
    slot: 'utility',
    effects: [{ type: 'shop_discount', value: 20 }],
    icon: '🤝',
    maxLevel: 2,
    baseValue: 250
  },
  {
    id: 'divining_rod',
    name: "Divining Rod",
    description: "Rare artifacts appear 2x more often. 'Fortune favors the bold.'",
    rarity: 'epic',
    slot: 'utility',
    effects: [{ type: 'rarity_find', value: 100 }],
    icon: '🔮',
    maxLevel: 2,
    baseValue: 800
  },
  {
    id: 'chronos_inkwell',
    name: "Chronos Inkwell",
    description: "Pause timer once per game for 10s. 'Time bends to the writer.'",
    rarity: 'legendary',
    slot: 'utility',
    effects: [{ type: 'timer_bonus', value: 10, condition: 'pauseOnce' }],
    flavorText: "Contains a drop of eternity.",
    icon: '🕰️',
    maxLevel: 1,
    baseValue: 4000
  },

  // TRINKETS - Passive bonuses, synergies, and unique effects
  {
    id: 'lucky_charm',
    name: "Lucky Charm",
    description: "5% chance for double score on any guess. 'Fortune smiles.'",
    rarity: 'common',
    slot: 'trinket',
    effects: [{ type: 'score_multiplier', value: 2, condition: 'chance:5' }],
    icon: '🍀',
    maxLevel: 3,
    baseValue: 40
  },
  {
    id: 'streak_ember',
    name: "Streak Ember",
    description: "Each win adds +5% score (max +50%). 'Fire feeds fire.'",
    rarity: 'uncommon',
    slot: 'trinket',
    effects: [{ type: 'streak_bonus', value: 5, condition: 'compounding' }],
    icon: '🌑',
    maxLevel: 3,
    baseValue: 100
  },
  {
    id: 'synergy_catalyst',
    name: "Synergy Catalyst",
    description: "Weapon + Armor equipped = +25% all bonuses. 'Unity is strength.'",
    rarity: 'rare',
    slot: 'trinket',
    effects: [{ type: 'synergy_trigger', value: 25, synergyId: 'weapon_armor', condition: 'slots:weapon,armor' }],
    icon: '⚗️',
    maxLevel: 1,
    baseValue: 300
  },
  {
    id: 'vowel_consonant_harmony',
    name: "Vowel-Consonant Harmony",
    description: "Vowel Magnet + Consonant Crusher = +50% both effects. 'Perfect balance.'",
    rarity: 'epic',
    slot: 'trinket',
    effects: [{ type: 'synergy_trigger', value: 50, synergyId: 'vowel_consonant', condition: 'artifacts:vowel_magnet,consonant_crusher' }],
    icon: '☯️',
    maxLevel: 1,
    baseValue: 1000
  },
  {
    id: 'artifact_of_the_first_word',
    name: "Artifact of the First Word",
    description: "All artifacts +1 max level. All synergies doubled. 'In the beginning...'",
    rarity: 'legendary',
    slot: 'trinket',
    effects: [{ type: 'synergy_trigger', value: 100, synergyId: 'omni_synergy', condition: 'any' }],
    flavorText: "The primordial artifact. Myths speak of its power.",
    icon: '📜',
    maxLevel: 1,
    baseValue: 10000
  }
];

// Synergy definitions
export interface ArtifactSynergy {
  id: string;
  name: string;
  description: string;
  requiredArtifacts?: string[];      // Artifact IDs required
  requiredSlots?: ArtifactSlot[];   // Or slots required
  bonus: { type: string; value: number; description: string };
}

export const ARTIFACT_SYNERGIES: ArtifactSynergy[] = [
  {
    id: 'weapon_armor',
    name: "Balanced Build",
    description: "Weapon and Armor equipped together",
    requiredSlots: ['weapon', 'armor'],
    bonus: { type: 'all_bonus', value: 25, description: '+25% to all artifact effects' }
  },
  {
    id: 'vowel_consonant',
    name: "Alphabet Mastery",
    description: "Vowel Magnet + Consonant Crusher",
    requiredArtifacts: ['vowel_magnet', 'consonant_crusher'],
    bonus: { type: 'letter_bonus_mult', value: 50, description: '+50% to vowel/consonant bonuses' }
  },
  {
    id: 'full_set',
    name: "Complete Arsenal",
    description: "All 4 slots filled",
    requiredSlots: ['weapon', 'armor', 'utility', 'trinket'],
    bonus: { type: 'score_multiplier', value: 1.5, description: '1.5x final score' }
  },
  {
    id: 'rare_collection',
    name: "Collector's Pride",
    description: "3+ Rare or higher artifacts equipped",
    requiredArtifacts: [], // Dynamic check
    bonus: { type: 'currency_bonus', value: 50, description: '+50% Lexicon earnings' }
  }
];

// Shop generation
export interface ShopItem {
  artifactId: string;
  price: number;
  refreshCost: number;
}

export function generateShopOffers(inventory: PlayerInventory, count: number = 4): ShopItem[] {
  const offers: ShopItem[] = [];
  
  for (let i = 0; i < count; i++) {
    // Weighted random selection
    const totalWeight = ARTIFACT_DATABASE.reduce((sum, a) => sum + RARITY_CONFIG[a.rarity].dropWeight, 0);
    let roll = Math.random() * totalWeight;
    
    let selected = ARTIFACT_DATABASE[0];
    for (const artifact of ARTIFACT_DATABASE) {
      roll -= RARITY_CONFIG[artifact.rarity].dropWeight;
      if (roll <= 0) { selected = artifact; break; }
    }
    
    // Don't offer already max-level owned artifacts
    const owned = inventory.artifacts[selected.id];
    if (owned && owned.level >= selected.maxLevel) {
      i--; continue;
    }
    
    const price = Math.round(selected.baseValue * RARITY_CONFIG[selected.rarity].priceMultiplier * 
      (owned ? 1.5 : 1.0) * (1 - (inventory.equipped.utility === 'merchant_seal' ? 0.2 : 0)));
    
    offers.push({ artifactId: selected.id, price, refreshCost: 10 });
  }
  
  return offers;
}

// Calculate effective artifact stats with level scaling
export function getArtifactEffectiveEffects(artifact: Artifact, level: number): ArtifactEffect[] {
  const scale = 1 + (level - 1) * 0.33; // 33% per level
  return artifact.effects.map(e => ({ ...e, value: Math.round(e.value * scale) }));
}

// Check active synergies
export function getActiveSynergies(equipped: EquippedArtifacts): ArtifactSynergy[] {
  const active: ArtifactSynergy[] = [];
  const equippedIds = Object.values(equipped).filter(Boolean) as string[];
  const equippedCount = equippedIds.length;
  
  for (const synergy of ARTIFACT_SYNERGIES) {
    let satisfied = false;
    
    if (synergy.requiredArtifacts && synergy.requiredArtifacts.length > 0) {
      satisfied = synergy.requiredArtifacts.every(id => equippedIds.includes(id));
    } else if (synergy.requiredSlots) {
      satisfied = synergy.requiredSlots.every(slot => equipped[slot]);
    } else if (synergy.id === 'rare_collection') {
      // Check for 3+ rare+ artifacts
      const rareCount = equippedIds.filter(id => {
        const art = ARTIFACT_DATABASE.find(a => a.id === id);
        return art && ['rare', 'epic', 'legendary'].includes(art.rarity);
      }).length;
      satisfied = rareCount >= 3;
    } else if (synergy.id === 'full_set') {
      satisfied = equippedCount === 4;
    }
    
    if (satisfied) active.push(synergy);
  }
  
  return active;
}

// Apply artifact effects to game scoring
export interface ScoringContext {
  word: string;
  attemptNumber: number;
  isFirstGuess: boolean;
  isHardMode: boolean;
  currentStreak: number;
  timeRemaining?: number;
  gameMode: string;
}

export function calculateArtifactScoreBonus(
  baseScore: number, 
  context: ScoringContext, 
  equipped: EquippedArtifacts, 
  inventory: PlayerInventory
): { bonus: number; breakdown: string[] } {
  let totalMultiplier = 1;
  let flatBonus = 0;
  const breakdown: string[] = [];
  
  // Get all equipped artifact effects
  const equippedArtifacts = Object.entries(equipped)
    .filter(([_, id]) => id)
    .map(([slot, id]) => ({ 
      slot, 
      artifact: ARTIFACT_DATABASE.find(a => a.id === id)!,
      level: inventory.artifacts[id!]?.level || 1
    }))
    .filter(a => a.artifact);
  
  // Apply individual effects
  for (const { artifact, level } of equippedArtifacts) {
    const effects = getArtifactEffectiveEffects(artifact, level);
    
    for (const effect of effects) {
      switch (effect.type) {
        case 'letter_bonus':
          if (!effect.condition || context.word.includes(effect.condition.split(':')[1])) {
            const count = effect.condition 
              ? context.word.split(effect.condition.split(':')[1]).length - 1
              : context.word.length;
            flatBonus += count * effect.value;
            breakdown.push(`${artifact.name}: +${count * effect.value} (letter bonus)`);
          }
          break;
          
        case 'vowel_bonus':
          const vowels = context.word.match(/[AEIOU]/gi)?.length || 0;
          flatBonus += vowels * effect.value;
          breakdown.push(`${artifact.name}: +${vowels * effect.value} (${vowels} vowels)`);
          break;
          
        case 'consonant_bonus':
          const consonants = context.word.match(/[BCDFGHJKLMNPQRSTVWXYZ]/gi)?.length || 0;
          flatBonus += consonants * effect.value;
          breakdown.push(`${artifact.name}: +${consonants * effect.value} (${consonants} consonants)`);
          break;
          
        case 'length_bonus':
          if (context.word.length >= 5) {
            const bonus = Math.round(baseScore * (effect.value / 100) * (context.word.length - 4));
            flatBonus += bonus;
            breakdown.push(`${artifact.name}: +${bonus} (length bonus)`);
          }
          break;
          
        case 'score_multiplier':
          let shouldApply = true;
          if (effect.condition === 'attempts:1' && !context.isFirstGuess) shouldApply = false;
          if (effect.condition?.startsWith('chance:')) {
            const chance = parseInt(effect.condition.split(':')[1]);
            shouldApply = Math.random() * 100 < chance;
          }
          if (shouldApply) {
            totalMultiplier *= effect.value;
            breakdown.push(`${artifact.name}: x${effect.value} multiplier`);
          }
          break;
          
        case 'streak_bonus':
          if (effect.condition === 'compounding') {
            const streakMult = 1 + Math.min(context.currentStreak, 10) * (effect.value / 100);
            totalMultiplier *= streakMult;
            breakdown.push(`${artifact.name}: x${streakMult.toFixed(2)} (streak)`);
          }
          break;
      }
    }
  }
  
  // Apply synergies
  const synergies = getActiveSynergies(equipped);
  for (const synergy of synergies) {
    if (synergy.bonus.type === 'all_bonus') {
      totalMultiplier *= (1 + synergy.bonus.value / 100);
      breakdown.push(`${synergy.name}: +${synergy.bonus.value}% all effects`);
    } else if (synergy.bonus.type === 'letter_bonus_mult') {
      // This would multiply letter bonuses - handled in individual effects
      breakdown.push(`${synergy.name}: +${synergy.bonus.value}% letter bonuses`);
    } else if (synergy.bonus.type === 'score_multiplier') {
      totalMultiplier *= synergy.bonus.value;
      breakdown.push(`${synergy.name}: x${synergy.bonus.value} final score`);
    } else if (synergy.bonus.type === 'currency_bonus') {
      breakdown.push(`${synergy.name}: +${synergy.bonus.value}% Lexicon earnings`);
    }
  }
  
  const finalScore = Math.round(baseScore * totalMultiplier + flatBonus);
  return { bonus: finalScore - baseScore, breakdown };
}

// Artifact upgrade logic
export function canUpgradeArtifact(artifactId: string, inventory: PlayerInventory): boolean {
  const artifact = ARTIFACT_DATABASE.find(a => a.id === artifactId);
  const owned = inventory.artifacts[artifactId];
  if (!artifact || !owned) return false;
  return owned.level < artifact.maxLevel;
}

export function getUpgradeCost(artifactId: string, inventory: PlayerInventory): number {
  const artifact = ARTIFACT_DATABASE.find(a => a.id === artifactId);
  const owned = inventory.artifacts[artifactId];
  if (!artifact || !owned) return 0;
  
  const baseCost = artifact.baseValue * RARITY_CONFIG[artifact.rarity].priceMultiplier;
  return Math.round(baseCost * Math.pow(1.8, owned.level - 1));
}

export function upgradeArtifact(artifactId: string, inventory: PlayerInventory): boolean {
  if (!canUpgradeArtifact(artifactId, inventory)) return false;
  const cost = getUpgradeCost(artifactId, inventory);
  if (inventory.currency < cost) return false;
  
  inventory.currency -= cost;
  inventory.artifacts[artifactId].level += 1;
  return true;
}

export interface ActiveArtifactResult {
  success: boolean;
  bonusPoints: number;
  message: string;
}

export function activateActiveArtifact(artifactId: string, inventory: PlayerInventory): ActiveArtifactResult {
  const owned = inventory.artifacts[artifactId];
  const artifact = ARTIFACT_DATABASE.find(a => a.id === artifactId);
  if (!owned || !artifact) {
    return { success: false, bonusPoints: 0, message: 'Artifact not found' };
  }
  const bonus = owned.level * 15;
  return {
    success: true,
    bonusPoints: bonus,
    message: `Activated ${artifact.name}! +${bonus} Combo Synergy Bonus!`
  };
}
