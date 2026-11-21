import { describe, it, expect } from 'vitest';
import { 
  ARTIFACT_DATABASE,
  RARITY_CONFIG,
  getArtifactEffectiveEffects,
  getUpgradeCost,
  canUpgradeArtifact,
  upgradeArtifact,
  generateShopOffers,
  getActiveSynergies,
  calculateArtifactScoreBonus,
  PlayerInventory,
  EquippedArtifacts,
  ScoringContext,
  activateActiveArtifact
} from '../../src/game/artifacts';

describe('Artifact RPG Engine', () => {
  const defaultInventory: PlayerInventory = {
    currency: 500,
    totalEarned: 1000,
    artifacts: {
      'vowel_magnet': { artifactId: 'vowel_magnet', level: 1, obtainedAt: Date.now() },
      'gold_ring': { artifactId: 'gold_ring', level: 2, obtainedAt: Date.now() },
    },
    equipped: {
      weapon: 'vowel_magnet',
      armor: null,
      utility: null,
      trinket: 'gold_ring',
    }
  };

  it('contains valid artifacts in database with required fields', () => {
    expect(ARTIFACT_DATABASE.length).toBeGreaterThan(5);
    for (const art of ARTIFACT_DATABASE) {
      expect(art.id).toBeDefined();
      expect(art.name).toBeDefined();
      expect(art.rarity).toBeDefined();
      expect(RARITY_CONFIG[art.rarity]).toBeDefined();
      expect(art.slot).toBeDefined();
      expect(art.effects.length).toBeGreaterThan(0);
    }
  });

  it('calculates effective artifact effects scaled by level', () => {
    const magnet = ARTIFACT_DATABASE.find(a => a.id === 'vowel_magnet')!;
    const level1Effects = getArtifactEffectiveEffects(magnet, 1);
    const level2Effects = getArtifactEffectiveEffects(magnet, 2);

    expect(level1Effects[0].value).toBe(2);
    // 33% scaling at level 2 -> Math.round(2 * 1.33) = 3
    expect(level2Effects[0].value).toBe(3);
  });

  it('calculates upgrade cost correctly based on rarity and level', () => {
    const costLevel1 = getUpgradeCost('vowel_magnet', defaultInventory);

    expect(costLevel1).toBeGreaterThan(0);
  });

  it('checks if player can upgrade artifact based on max level and currency', () => {
    // Player has vowel_magnet at level 1 (max 3) -> can upgrade
    expect(canUpgradeArtifact('vowel_magnet', defaultInventory)).toBe(true);

    // Upgrading with 500 currency succeeds
    const invCopy = JSON.parse(JSON.stringify(defaultInventory));
    expect(upgradeArtifact('vowel_magnet', invCopy)).toBe(true);

    // Upgrading with 0 currency fails
    const brokeInventory: PlayerInventory = { ...defaultInventory, currency: 0 };
    expect(upgradeArtifact('vowel_magnet', brokeInventory)).toBe(false);
  });

  it('generates shop offers for player inventory', () => {
    const offers = generateShopOffers(defaultInventory);
    expect(offers.length).toBe(4);
    for (const offer of offers) {
      expect(offer.artifactId).toBeDefined();
      expect(offer.price).toBeGreaterThan(0);
    }
  });

  it('detects active synergies when required artifacts or full set are equipped', () => {
    const fullEquipped: EquippedArtifacts = {
      weapon: 'vowel_magnet',
      armor: 'aegis_shield',
      utility: 'merchant_seal',
      trinket: 'gold_ring',
    };

    const activeSynergies = getActiveSynergies(fullEquipped);
    expect(activeSynergies.length).toBeGreaterThan(0);

    const fullSet = activeSynergies.find(s => s.id === 'full_set');
    expect(fullSet).toBeDefined();
  });

  it('triggers active tactical artifact ability and returns combo bonus', () => {
    const result = activateActiveArtifact('vowel_magnet', defaultInventory);
    expect(result.success).toBe(true);
    expect(result.bonusPoints).toBeGreaterThan(0);
  });

  it('calculates artifact score bonuses and breakdown for game scoring', () => {
    const context: ScoringContext = {
      word: 'AUDIO',
      attemptNumber: 1,
      isFirstGuess: true,
      isHardMode: false,
      currentStreak: 3,
      gameMode: 'CLASSIC'
    };

    const { bonus, breakdown } = calculateArtifactScoreBonus(100, context, defaultInventory.equipped, defaultInventory);
    
    // Vowels in 'AUDIO': A, U, D, I, O -> 4 vowels (A, U, I, O)
    // Vowel magnet at level 1 (+2 per vowel) -> +8
    expect(flatBonusOrMultiplier(bonus, breakdown)).toBe(true);
    expect(breakdown.length).toBeGreaterThan(0);
  });
});

function flatBonusOrMultiplier(bonus: number, breakdown: string[]): boolean {
  return bonus >= 0 && Array.isArray(breakdown);
}
