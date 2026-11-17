import React, { useState, useMemo } from 'react';
import { 
  ArtifactRarity, 
  EquippedArtifacts, 
  PlayerInventory,
  ARTIFACT_DATABASE,
  RARITY_CONFIG,
  ARTIFACT_SYNERGIES,
  generateShopOffers,
  ShopItem,
  getActiveSynergies,
  canUpgradeArtifact,
  getUpgradeCost,
  getArtifactEffectiveEffects
} from '../game/artifacts';

interface ArtifactSystemProps {
  isOpen: boolean;
  inventory: PlayerInventory;
  onInventoryChange: (inventory: PlayerInventory) => void;
  onClose: () => void;
}

const SLOT_ORDER: ('weapon' | 'armor' | 'utility' | 'trinket')[] = ['weapon', 'armor', 'utility', 'trinket'];
const SLOT_LABELS: Record<string, string> = {
  weapon: 'WEAPON',
  armor: 'ARMOR', 
  utility: 'UTILITY',
  trinket: 'TRINKET'
};
const SLOT_ICONS: Record<string, string> = {
  weapon: '⚔️',
  armor: '🛡️',
  utility: '🔧',
  trinket: '💍'
};

export const ArtifactSystem: React.FC<ArtifactSystemProps> = ({ 
  isOpen,
  inventory, 
  onInventoryChange, 
  onClose 
}) => {
  if (!isOpen) return null;
  const [activeTab, setActiveTab] = useState<'equip' | 'inventory' | 'shop' | 'synergies'>('equip');
  const [shopOffers, setShopOffers] = useState<ShopItem[]>(() => generateShopOffers(inventory));
  const [shopRefreshCost] = useState(10);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);

  const equippedArtifacts = useMemo(() => 
    SLOT_ORDER.map(slot => ({
      slot,
      artifactId: inventory.equipped[slot],
      artifact: inventory.equipped[slot] ? ARTIFACT_DATABASE.find(a => a.id === inventory.equipped[slot]) : null,
      level: inventory.equipped[slot] ? inventory.artifacts[inventory.equipped[slot]!]?.level || 1 : 0
    })), [inventory]);

  const ownedArtifacts = useMemo(() => 
    Object.entries(inventory.artifacts)
      .map(([id, data]) => ({
        artifact: ARTIFACT_DATABASE.find(a => a.id === id)!,
        level: data.level,
        obtainedAt: data.obtainedAt
      }))
      .filter(a => a.artifact)
      .sort((a, b) => {
        // Sort by rarity, then level
        const rarityOrder = { legendary: 5, epic: 4, rare: 3, uncommon: 2, common: 1 };
        const rDiff = rarityOrder[b.artifact.rarity] - rarityOrder[a.artifact.rarity];
        if (rDiff !== 0) return rDiff;
        return b.level - a.level;
      }), [inventory.artifacts]);

  const activeSynergies = useMemo(() => getActiveSynergies(inventory.equipped), [inventory.equipped, inventory.artifacts]);

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleEquip = (slot: string, artifactId: string | null) => {
    const newEquipped = { ...inventory.equipped, [slot]: artifactId };
    const newInventory = { ...inventory, equipped: newEquipped as EquippedArtifacts };
    onInventoryChange(newInventory);
    showToast(artifactId ? `Equipped ${ARTIFACT_DATABASE.find(a => a.id === artifactId)?.name}` : 'Unequipped', 'success');
  };

  const handleBuy = (offer: ShopItem) => {
    const artifact = ARTIFACT_DATABASE.find(a => a.id === offer.artifactId)!;
    if (inventory.currency < offer.price) {
      showToast('Not enough Lexicons!', 'error');
      return;
    }

    const newInventory = { ...inventory };
    newInventory.currency -= offer.price;
    newInventory.totalEarned += offer.price; // Track spending
    
    if (newInventory.artifacts[offer.artifactId]) {
      newInventory.artifacts[offer.artifactId].level = Math.min(
        newInventory.artifacts[offer.artifactId].level + 1,
        artifact.maxLevel
      );
    } else {
      newInventory.artifacts[offer.artifactId] = { 
        artifactId: offer.artifactId, 
        level: 1, 
        obtainedAt: Date.now() 
      };
    }

    // Remove from shop
    newInventory.artifacts = { ...newInventory.artifacts };
    setShopOffers(prev => prev.filter(o => o !== offer));
    onInventoryChange(newInventory);
    showToast(`Purchased ${artifact.name}!`, 'success');
  };

  const handleUpgrade = (artifactId: string) => {
    if (!canUpgradeArtifact(artifactId, inventory)) return;
    const cost = getUpgradeCost(artifactId, inventory);
    if (inventory.currency < cost) {
      showToast('Not enough Lexicons!', 'error');
      return;
    }

    const newInventory = { ...inventory };
    newInventory.currency -= cost;
    newInventory.artifacts[artifactId] = {
      ...newInventory.artifacts[artifactId],
      level: newInventory.artifacts[artifactId].level + 1
    };
    onInventoryChange(newInventory);
    showToast(`Upgraded to level ${newInventory.artifacts[artifactId].level}!`, 'success');
  };

  const handleSell = (artifactId: string) => {
    const artifact = ARTIFACT_DATABASE.find(a => a.id === artifactId)!;
    const owned = inventory.artifacts[artifactId];
    if (!owned || owned.level > 1) {
      showToast('Cannot sell upgraded artifacts', 'error');
      return;
    }

    // Check if equipped
    if (Object.values(inventory.equipped).includes(artifactId)) {
      showToast('Unequip first!', 'error');
      return;
    }

    const sellPrice = Math.round(artifact.baseValue * RARITY_CONFIG[artifact.rarity].priceMultiplier * 0.5);
    const newInventory = { ...inventory };
    newInventory.currency += sellPrice;
    delete newInventory.artifacts[artifactId];
    onInventoryChange(newInventory);
    showToast(`Sold ${artifact.name} for ${sellPrice} Lexicons`, 'success');
  };

  const handleRefreshShop = () => {
    if (inventory.currency < shopRefreshCost) {
      showToast('Not enough Lexicons to refresh!', 'error');
      return;
    }
    const newInventory = { ...inventory, currency: inventory.currency - shopRefreshCost };
    setShopOffers(generateShopOffers(newInventory));
    onInventoryChange(newInventory);
    showToast('Shop refreshed!', 'info');
  };

  const getRarityStyle = (rarity: ArtifactRarity) => {
    const config = RARITY_CONFIG[rarity];
    return {
      borderColor: config.borderColor,
      background: `linear-gradient(135deg, ${config.color}15, transparent)`,
      boxShadow: `0 0 12px ${config.glowColor}`,
    };
  };

  return (
    <div className="artifact-system-overlay" onClick={onClose}>
      <div className="artifact-system-modal" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="artifact-header">
          <div className="artifact-title">
            <span className="title-icon">🎒</span>
            <h2>ARTIFACT SYSTEM</h2>
            <span className="title-icon">🎒</span>
          </div>
          <div className="artifact-currency">
            <span className="currency-icon">📚</span>
            <span className="currency-amount">{inventory.currency.toLocaleString()}</span>
            <span className="currency-label">LEXICONS</span>
          </div>
          <button className="artifact-close" onClick={onClose}>✕</button>
        </div>

        {/* Tab Bar */}
        <div className="artifact-tabs">
          {(['equip', 'inventory', 'shop', 'synergies'] as const).map(tab => (
            <button
              key={tab}
              className={`artifact-tab ${activeTab === tab ? 'active' : ''}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab === 'equip' && '⚔️'} {tab === 'inventory' && '🎒'} 
              {tab === 'shop' && '🏪'} {tab === 'synergies' && '⚗️'}
              <span>{tab.toUpperCase()}</span>
            </button>
          ))}
        </div>

        {/* Content Panels */}
        <div className="artifact-content">
          {/* EQUIP PANEL */}
          {activeTab === 'equip' && (
            <div className="equip-panel">
              <div className="equip-grid">
                {equippedArtifacts.map(({ slot, artifact, level }) => (
                  <div key={slot} className={`equip-slot ${slot} ${artifact ? 'filled' : 'empty'}`}>
                    <div className="slot-label">
                      <span className="slot-icon">{SLOT_ICONS[slot]}</span>
                      <span>{SLOT_LABELS[slot]}</span>
                    </div>
                    {artifact ? (
                      <div className="equipped-artifact" style={getRarityStyle(artifact.rarity)}>
                        <div className="artifact-icon-large">{artifact.icon}</div>
                        <div className="artifact-name">{artifact.name}</div>
                        <div className="artifact-level">LV.{level}/{artifact.maxLevel}</div>
                        <div className="artifact-effects">
                          {artifact.effects.map((e, i) => (
                            <span key={i} className="effect-tag">{e.type.replace(/_/g, ' ')}: +{e.value}</span>
                          ))}
                        </div>
                        <button 
                          className="unequip-btn" 
                          onClick={() => handleEquip(slot, null)}
                        >
                          UNEQUIP
                        </button>
                      </div>
                    ) : (
                      <div className="empty-slot" style={{ borderColor: RARITY_CONFIG.common.color }}>
                        <span className="empty-text">CLICK TO EQUIP</span>
                        <span className="empty-hint">Drag artifact here or click</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Available artifacts for each slot */}
              <div className="available-artifacts">
                <h3>AVAILABLE FOR SELECTED SLOT</h3>
                <div className="artifact-scroll">
                  {ownedArtifacts
                    .filter(a => a.artifact.slot === (equippedArtifacts.find(e => e.artifact)?.slot || 'weapon'))
                    .map(({ artifact, level }) => (
                      <div 
                        key={artifact.id} 
                        className={`artifact-card ${inventory.equipped[artifact.slot] === artifact.id ? 'equipped' : ''}`}
                        style={getRarityStyle(artifact.rarity)}
                        onClick={() => handleEquip(artifact.slot, inventory.equipped[artifact.slot] === artifact.id ? null : artifact.id)}
                      >
                        <div className="card-header">
                          <span className="card-icon">{artifact.icon}</span>
                          <span className="card-name">{artifact.name}</span>
                          <span className="card-level">LV.{level}/{artifact.maxLevel}</span>
                        </div>
                        <div className="card-desc">{artifact.description}</div>
                        <div className="card-effects">
                          {getArtifactEffectiveEffects(artifact, level).map((e, i) => (
                            <span key={i} className="effect-tag">{e.type.replace(/_/g, ' ')}: +{e.value}</span>
                          ))}
                        </div>
                        {canUpgradeArtifact(artifact.id, inventory) && (
                          <button 
                            className="upgrade-btn-small" 
                            onClick={e => { e.stopPropagation(); handleUpgrade(artifact.id); }}
                          >
                            UPGRADE ({getUpgradeCost(artifact.id, inventory)}) 📚
                          </button>
                        )}
                      </div>
                    ))}
                  {ownedArtifacts.length === 0 && (
                    <div className="no-artifacts">No artifacts owned yet. Visit the SHOP!</div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* INVENTORY PANEL */}
          {activeTab === 'inventory' && (
            <div className="inventory-panel">
              <div className="inventory-stats">
                <div className="stat"><span>{Object.keys(inventory.artifacts).length}</span> ARTIFACTS OWNED</div>
                <div className="stat"><span>{Object.values(inventory.equipped).filter(Boolean).length}/4</span> SLOTS FILLED</div>
                <div className="stat"><span>{activeSynergies.length}</span> ACTIVE SYNERGIES</div>
                <div className="stat"><span>{inventory.totalEarned.toLocaleString()}</span> LIFETIME EARNED</div>
              </div>
              <div className="inventory-grid">
                {ownedArtifacts.map(({ artifact, level }) => (
                  <div key={artifact.id} className="artifact-card-large" style={getRarityStyle(artifact.rarity)}>
                    <div className="card-top">
                      <span className="card-icon-large">{artifact.icon}</span>
                      <div>
                        <div className="card-name-large">{artifact.name}</div>
                        <div className="card-meta">
                          <span className="card-rarity">{artifact.rarity.toUpperCase()}</span>
                          <span className="card-slot">{SLOT_LABELS[artifact.slot]}</span>
                          <span className="card-level">LV.{level}/{artifact.maxLevel}</span>
                        </div>
                      </div>
                    </div>
                    <div className="card-desc-large">{artifact.description}</div>
                    {artifact.flavorText && <div className="card-flavor">"{artifact.flavorText}"</div>}
                    <div className="card-effects-large">
                      {getArtifactEffectiveEffects(artifact, level).map((e, i) => (
                        <span key={i} className="effect-tag-large">{e.type.replace(/_/g, ' ')}: +{e.value}</span>
                      ))}
                    </div>
                    <div className="card-actions">
                      {Object.values(inventory.equipped).includes(artifact.id) ? (
                        <button className="btn-unequip" onClick={() => {
                          const slot = Object.entries(inventory.equipped).find(([,v]) => v === artifact.id)?.[0];
                          if (slot) handleEquip(slot, null);
                        }}>UNEQUIP</button>
                      ) : (
                        <button className="btn-equip" onClick={() => handleEquip(artifact.slot, artifact.id)}>
                          EQUIP TO {SLOT_LABELS[artifact.slot]}
                        </button>
                      )}
                      {canUpgradeArtifact(artifact.id, inventory) && (
                        <button className="btn-upgrade" onClick={() => handleUpgrade(artifact.id)}>
                          UPGRADE ({getUpgradeCost(artifact.id, inventory)} 📚)
                        </button>
                      )}
                      <button className="btn-sell" onClick={() => handleSell(artifact.id)}>
                        SELL ({Math.round(artifact.baseValue * RARITY_CONFIG[artifact.rarity].priceMultiplier * 0.5)} 📚)
                      </button>
                    </div>
                  </div>
                ))}
                {ownedArtifacts.length === 0 && (
                  <div className="empty-inventory">
                    <span className="empty-icon">🎒</span>
                    <p>Your backpack is empty</p>
                    <p className="empty-hint">Visit the SHOP to acquire artifacts</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* SHOP PANEL */}
          {activeTab === 'shop' && (
            <div className="shop-panel">
              <div className="shop-header">
                <h3>ARTIFACT SHOP</h3>
                <div className="shop-controls">
                  <button className="refresh-btn" onClick={handleRefreshShop} disabled={inventory.currency < shopRefreshCost}>
                    🔄 REFRESH ({shopRefreshCost} 📚)
                  </button>
                  {inventory.equipped.utility === 'merchant_seal' && (
                    <span className="discount-badge">🤝 MERCHANT'S SEAL: 20% OFF</span>
                  )}
                </div>
              </div>
              <div className="shop-grid">
                {shopOffers.map((offer, i) => {
                  const artifact = ARTIFACT_DATABASE.find(a => a.id === offer.artifactId)!;
                  const owned = inventory.artifacts[offer.artifactId];
                  const isMaxed = owned && owned.level >= artifact.maxLevel;
                  const effectivePrice = owned ? Math.round(offer.price * 1.5) : offer.price;
                  
                  return (
                    <div key={i} className="shop-item" style={getRarityStyle(artifact.rarity)}>
                      <div className="shop-item-header">
                        <span className="shop-icon">{artifact.icon}</span>
                        <span className="shop-rarity">{artifact.rarity.toUpperCase()}</span>
                      </div>
                      <div className="shop-name">{artifact.name}</div>
                      <div className="shop-desc">{artifact.description}</div>
                      <div className="shop-effects">
                        {artifact.effects.map((e, idx) => (
                          <span key={idx} className="effect-tag">{e.type.replace(/_/g, ' ')}: +{e.value}</span>
                        ))}
                      </div>
                      {owned ? (
                        <div className="shop-owned">OWNED - LV.{owned.level}/{artifact.maxLevel}</div>
                      ) : (
                        <div className="shop-new">NEW ACQUISITION</div>
                      )}
                      <div className="shop-footer">
                        <span className="shop-price">{effectivePrice} 📚</span>
                        <button 
                          className="btn-buy" 
                          onClick={() => handleBuy(offer)}
                          disabled={inventory.currency < effectivePrice || isMaxed}
                        >
                          {isMaxed ? 'MAX LEVEL' : owned ? 'UPGRADE' : 'BUY'}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* SYNERGIES PANEL */}
          {activeTab === 'synergies' && (
            <div className="synergies-panel">
              <div className="synergies-header">
                <h3>ACTIVE SYNERGIES</h3>
                <span className="synergy-count">{activeSynergies.length}/{ARTIFACT_SYNERGIES.length}</span>
              </div>
              <div className="synergies-grid">
                {ARTIFACT_SYNERGIES.map(synergy => {
                  const isActive = activeSynergies.some(s => s.id === synergy.id);
                  return (
                    <div key={synergy.id} className={`synergy-card ${isActive ? 'active' : 'inactive'}`}>
                      <div className="synergy-icon">{isActive ? '⚗️' : '🔒'}</div>
                      <div className="synergy-name">{synergy.name}</div>
                      <div className="synergy-desc">{synergy.description}</div>
                      <div className="synergy-bonus">
                        {isActive ? (
                          <>
                            <span className="active-badge">ACTIVE</span>
                            <span className="bonus-desc">{synergy.bonus.description}</span>
                          </>
                        ) : (
                                                  <>
                                                    <span className="requirement">REQUIRES:</span>
                                                    {synergy.requiredArtifacts && synergy.requiredArtifacts.length > 0 && (
                                                      <span>{synergy.requiredArtifacts.map(id => ARTIFACT_DATABASE.find(a => a.id === id)?.name).join(' + ')}</span>
                                                    )}
                                                    {synergy.requiredSlots && (
                                                      <span>{synergy.requiredSlots.map(s => SLOT_LABELS[s]).join(' + ')}</span>
                                                    )}
                                                  </>
                                                )}
                      </div>
                    </div>
                  );
                })}
              </div>
              
              {/* Potential synergies hint */}
              <div className="synergy-hints">
                <h4>SYNERGY COMBINATIONS</h4>
                <ul>
                  <li>⚔️ + 🛡️ = <strong>Balanced Build</strong> (+25% all effects)</li>
                  <li>🧲 + 🔨 = <strong>Alphabet Mastery</strong> (+50% letter bonuses)</li>
                  <li>All 4 slots = <strong>Complete Arsenal</strong> (1.5x final score)</li>
                  <li>3+ Rare+ = <strong>Collector's Pride</strong> (+50% Lexicon earnings)</li>
                </ul>
              </div>
            </div>
          )}
        </div>

        {/* Toast */}
        {toast && (
          <div className={`artifact-toast ${toast.type}`}>
            {toast.message}
          </div>
        )}
      </div>
    </div>
  );
};