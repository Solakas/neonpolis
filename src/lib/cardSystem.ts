// Card Effects System for NeonPolis
// Handles all KEEP and DISCARD card effects

import { DiceFace } from './gameData';

// Card timing hooks for the event bus
export type CardTiming =
  | 'START_OF_TURN'
  | 'ROLL_PHASE_BEGIN'
  | 'AFTER_EACH_ROLL'
  | 'AFTER_FIRST_ROLL'
  | 'AFTER_FINAL_ROLL'
  | 'DICE_RESOLVE_BEGIN'
  | 'RESOLVE_NUMBERS'
  | 'RESOLVE_SWORDS'
  | 'RESOLVE_HEARTS'
  | 'RESOLVE_ENERGY'
  | 'BUY_PHASE'
  | 'ENTER_CENTER'
  | 'LEAVE_CENTER'
  | 'DAMAGE_TAKEN'
  | 'END_OF_TURN'
  | 'OPPONENT_ROLL_PHASE'
  | 'CARD_PLAYED'
  | 'INSTANT'
  | 'PASSIVE'
  | 'ACTIVE_ONCE_PER_TURN';

// Card effect state for each player
export interface CardEffectState {
  // Once per turn tracking
  plasmaAccumulatorUsed: boolean; // K002
  blackMarketUsed: boolean; // K003
  antibodiesUsed: boolean; // K011
  telekineticGripUsed: boolean; // K012
  mineHunterUsed: boolean; // K017
  turnOfFateUsed: boolean; // K019
  marketRecycleUsed: boolean; // K024
  
  // Duration effects
  rainproofShieldUntil?: number; // D008 - playerIndex when shield expires
  centerLockedUntil?: number; // D016 - playerIndex when lock expires
  shatteringOrbitActive?: boolean; // D019 - this turn only
  swiftAscentActive?: boolean; // D010 - check at end of turn
  
  // Tokens
  weakpointToken?: string; // D018 - playerId who has the token
  
  // Hearts resolved tracking (for K009 Regenerative Tissue)
  heartsResolvedThisTurn: number;
  
  // PHASE 3 tracking
  fieldMedHealedThisTurn: number; // K010 - track how much healed in center
  dieForgingUsed: boolean; // K023 - once per turn tracking
  explosiveEntryUsed: boolean; // K016 - once per entering center
  
  // Sword damage dealt tracking (for K021 Rooftop Raider)
  swordsDamageDealtThisTurn: number;
  
  // Kept all dice tracking (for K023 Die Forging)
  keptAllDiceAfterFirstRoll?: boolean;
  
  // PHASE 4 tracking
  gallopingTimeUsed: boolean; // D015 - grants extra reroll this turn
}

export function getInitialCardEffectState(): CardEffectState {
  return {
    plasmaAccumulatorUsed: false,
    blackMarketUsed: false,
    antibodiesUsed: false,
    telekineticGripUsed: false,
    mineHunterUsed: false,
    turnOfFateUsed: false,
    marketRecycleUsed: false,
    heartsResolvedThisTurn: 0,
    swordsDamageDealtThisTurn: 0,
    fieldMedHealedThisTurn: 0,
    dieForgingUsed: false,
    explosiveEntryUsed: false,
    gallopingTimeUsed: false,
  };
}

// Reset once-per-turn effects at the start of a player's turn
export function resetOncePerTurnEffects(state: CardEffectState): CardEffectState {
  return {
    ...state,
    plasmaAccumulatorUsed: false,
    blackMarketUsed: false,
    antibodiesUsed: false,
    telekineticGripUsed: false,
    mineHunterUsed: false,
    turnOfFateUsed: false,
    marketRecycleUsed: false,
    heartsResolvedThisTurn: 0,
    swordsDamageDealtThisTurn: 0,
    fieldMedHealedThisTurn: 0,
    dieForgingUsed: false,
    explosiveEntryUsed: false,
    gallopingTimeUsed: false,
    keptAllDiceAfterFirstRoll: undefined,
    shatteringOrbitActive: false,
    swiftAscentActive: false,
  };
}

// Check if a card has been purchased by a player
export function hasCard(purchasedCards: string[], cardId: string): boolean {
  return purchasedCards.includes(cardId);
}

// KEEP CARD EFFECTS

// K001 - Energy Collector: Start of turn → +1 ⚡
export function applyEnergyCollector(purchasedCards: string[]): number {
  return hasCard(purchasedCards, 'K001') ? 1 : 0;
}

// K002 - Plasma Accumulator: When gaining ≥2 ⚡ from dice → +1 ⚡ (once/turn)
export function applyPlasmaAccumulator(
  purchasedCards: string[],
  energyGainedFromDice: number,
  cardState: CardEffectState
): { bonus: number; triggered: boolean } {
  if (hasCard(purchasedCards, 'K002') && 
      energyGainedFromDice >= 2 && 
      !cardState.plasmaAccumulatorUsed) {
    return { bonus: 1, triggered: true };
  }
  return { bonus: 0, triggered: false };
}

// K004 - Charge Depot: Prevent ⚡ loss from effects
export function hasChargeDepot(purchasedCards: string[]): boolean {
  return hasCard(purchasedCards, 'K004');
}

// K005 - Blade Pulse: +1 total ⚔️ damage while in Center
export function applyBladePulse(
  purchasedCards: string[],
  inCenter: boolean,
  swordCount: number
): number {
  return hasCard(purchasedCards, 'K005') && inCenter && swordCount >= 1 ? 1 : 0;
}

// K007 - Extending Limbs: +1 damage to Center occupant if outside with ≥2 ⚔️
export function applyExtendingLimbs(
  purchasedCards: string[],
  inCenter: boolean,
  swordCount: number,
  centerHasOccupant: boolean
): number {
  return hasCard(purchasedCards, 'K007') && 
         !inCenter && 
         swordCount >= 2 && 
         centerHasOccupant ? 1 : 0;
}

// K008 - Echo Shielding: Reduce 3+ damage by 1 (min 1)
export function applyEchoShielding(
  purchasedCards: string[],
  incomingDamage: number
): number {
  if (hasCard(purchasedCards, 'K008') && incomingDamage >= 3) {
    return Math.max(1, incomingDamage - 1);
  }
  return incomingDamage;
}

// K010 - Field Med Unit: Can heal in Center (max +1 HP from dice/turn)
export function hasFieldMedUnit(purchasedCards: string[]): boolean {
  return hasCard(purchasedCards, 'K010');
}

// K013 - Cubist Fortune: +1 VP when scoring number set
export function applyCubistFortune(
  purchasedCards: string[],
  scoredNumberSet: boolean
): number {
  return hasCard(purchasedCards, 'K013') && scoredNumberSet ? 1 : 0;
}

// K014 - Scarce Supply: Opponent loses 1 ⚡ when gaining ≥3 ⚡ from dice
export function hasScarceSupply(purchasedCards: string[]): boolean {
  return hasCard(purchasedCards, 'K014');
}

// K018 - Necro-Feeder: Each ❤️ resolved also gives +1 ⚡
export function applyNecroFeeder(
  purchasedCards: string[],
  heartsApplied: number
): number {
  return hasCard(purchasedCards, 'K018') ? heartsApplied : 0;
}

// K020 - Eminent Devastator: +1 VP at start of turn if in Center
export function applyEminentDevastator(
  purchasedCards: string[],
  inCenter: boolean
): number {
  return hasCard(purchasedCards, 'K020') && inCenter ? 1 : 0;
}

// K022 - Aero Tunnels: +1 reroll cap
export function applyAeroTunnels(purchasedCards: string[]): number {
  return hasCard(purchasedCards, 'K022') ? 1 : 0;
}

// K025 - Threaded Carapace: -1 damage from every source (min 0)
export function applyThreadedCarapace(
  purchasedCards: string[],
  incomingDamage: number
): number {
  if (hasCard(purchasedCards, 'K025')) {
    return Math.max(0, incomingDamage - 1);
  }
  return incomingDamage;
}

// K026 - Blade Breath: +1 total ⚔️ damage when dealing ≥1 ⚔️
export function applyBladeBreath(
  purchasedCards: string[],
  swordCount: number
): number {
  return hasCard(purchasedCards, 'K026') && swordCount >= 1 ? 1 : 0;
}

// K027 - Rebuild Core: +1 ⚡ when healing with ❤️ while outside
export function applyRebuildCore(
  purchasedCards: string[],
  heartsApplied: number,
  inCenter: boolean
): number {
  return hasCard(purchasedCards, 'K027') && heartsApplied > 0 && !inCenter ? 1 : 0;
}

// K028 - Synchronizer: Set reroll cap to 3 (or keep higher)
export function applySynchronizer(purchasedCards: string[], currentCap: number): number {
  return hasCard(purchasedCards, 'K028') ? Math.max(currentCap, 3) : currentCap;
}

// Combined damage modifier calculation
export function calculateTotalDamageModifiers(
  purchasedCards: string[],
  inCenter: boolean,
  swordCount: number,
  centerHasOccupant: boolean
): number {
  let bonus = 0;
  
  // K005 - Blade Pulse: +1 if in Center
  bonus += applyBladePulse(purchasedCards, inCenter, swordCount);
  
  // K007 - Extending Limbs: +1 if outside with ≥2 ⚔️
  bonus += applyExtendingLimbs(purchasedCards, inCenter, swordCount, centerHasOccupant);
  
  // K026 - Blade Breath: +1 if dealing ≥1 ⚔️
  bonus += applyBladeBreath(purchasedCards, swordCount);
  
  return bonus;
}

// Combined damage reduction calculation
export function calculateDamageReduction(
  purchasedCards: string[],
  incomingDamage: number,
  rainproofShieldActive: boolean
): number {
  // D008 - Rainproof Shield: ignore all damage
  if (rainproofShieldActive) {
    return 0;
  }
  
  let damage = incomingDamage;
  
  // K025 - Threaded Carapace: -1 damage (min 0)
  damage = applyThreadedCarapace(purchasedCards, damage);
  
  // K008 - Echo Shielding: if 3+ damage, -1 (min 1)
  damage = applyEchoShielding(purchasedCards, damage);
  
  return damage;
}

// DISCARD CARD HANDLERS

// D001 - Overcharge: +3 ⚡
export function executeOvercharge(): number {
  return 3;
}

// D003 - Restoration: +3 HP (even in Center)
export function executeRestoration(): number {
  return 3;
}

// D006 - Warehouse Plunder: +X ⚡ (X = opponents, max 3)
export function executeWarehousePlunder(opponentCount: number): number {
  return Math.min(opponentCount, 3);
}

// D012 - Field Repairs: +2 HP; if outside, also +1 VP
export function executeFieldRepairs(inCenter: boolean): { hp: number; vp: number } {
  return {
    hp: 2,
    vp: inCenter ? 0 : 1
  };
}

// D017 - Energy Pump: +5 ⚡
export function executeEnergyPump(): number {
  return 5;
}

// D020 - Purgation: Remove all negative tokens and +1 HP
export function executePurgation(): number {
  return 1; // HP heal
}

// Helper: Calculate VP from dice
export function calculateVP(dice: DiceFace[]): number {
  const counts: Record<string, number> = { '1': 0, '2': 0, '3': 0 };
  
  dice.forEach(face => {
    if (face === '1' || face === '2' || face === '3') {
      counts[face]++;
    }
  });
  
  let vp = 0;
  
  // Check for triples (3 VP each)
  for (const num in counts) {
    if (counts[num] >= 3) {
      const triples = Math.floor(counts[num] / 3);
      vp += triples * 3;
      counts[num] = counts[num] % 3; // Remaining dice after triples
    }
  }
  
  // Check for remaining pairs/extras
  const remainingNumbers = Object.values(counts).filter(c => c > 0);
  if (remainingNumbers.length > 0) {
    vp += Math.max(...remainingNumbers);
  }
  
  return vp;
}
