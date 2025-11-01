# Card System Implementation Guide

## Overview
This document outlines the complete implementation of the 48-card shop system for NeonPolis, consisting of 28 KEEP cards and 20 DISCARD cards.

## Files Created/Modified

### New Files
1. `/lib/cardSystem.ts` - Core card effect logic and helpers
2. `/components/CardEffectPrompt.tsx` - UI for card effect prompts

### Modified Files
1. `/lib/gameData.ts` - Updated card descriptions (removed skull references, updated to match new spec)

## Card System Architecture

### 1. Player State Extensions
Add to `Player` interface in `Arena.tsx`:
```typescript
interface Player {
  // ... existing fields
  purchasedCards: string[]; // Already exists
  cardEffectState: CardEffectState; // NEW - tracks card effect states
}
```

### 2. Card Effect State
The `CardEffectState` interface tracks:
- Once-per-turn usage for cards like K002, K003, K011, K012, K017, K019, K024
- Duration effects (D008 Rainproof Shield, D016 Exile, D019 Shattering Orbit, D010 Swift Ascent)
- Tokens (D018 Weakpoint Marker)
- Turn tracking (hearts resolved, sword damage dealt)

## Implementation Phases

### Phase 1: Core Integration (Priority 1)
Integrate passive KEEP cards that modify dice resolution:

**START_OF_TURN hooks:**
- K001 Energy Collector: +1⚡ at start of turn
- K020 Eminent Devastator: +1 VP if in Center

**ROLL_PHASE_BEGIN hooks:**
- K022 Aero Tunnels: +1 reroll cap
- K028 Synchronizer: Set reroll cap to 3

**RESOLVE_ENERGY hooks:**
- K002 Plasma Accumulator: +1⚡ when gaining ≥2⚡ from dice (once/turn)
- K014 Scarce Supply: Opponent loses 1⚡ when gaining ≥3⚡

**RESOLVE_HEARTS hooks:**
- K018 Necro-Feeder: Each ❤️ also gives +1⚡
- K027 Rebuild Core: +1⚡ when healing while outside

**RESOLVE_SWORDS hooks:**
- K005 Blade Pulse: +1 total damage while in Center
- K007 Extending Limbs: +1 damage to Center occupant if outside with ≥2⚔️
- K026 Blade Breath: +1 total damage when dealing ≥1⚔️

**RESOLVE_NUMBERS hooks:**
- K013 Cubist Fortune: +1 VP when scoring number set

**DAMAGE_TAKEN hooks:**
- K008 Echo Shielding: Reduce 3+ damage by 1 (min 1)
- K025 Threaded Carapace: -1 damage from every source (min 0)

**END_OF_TURN hooks:**
- K009 Regenerative Tissue: +1 HP if resolved no ❤️ this turn
- K021 Rooftop Raider: +1 VP if outside and dealt ≥2⚔️

### Phase 2: Interactive KEEP Cards (Priority 2)
Cards requiring player prompts:

- K003 Black Market: Once/turn, pay 1 HP to peek top 3 cards, buy 1 with -1⚡
- K011 Antibodies: Once/turn during ❤️ resolution, +1 extra heal
- K012 Telekinetic Grip: Once/turn after final roll, set 1 die to ⚡ or ⚔️
- K017 Mine Hunter: Once/turn after final roll, reroll 1 die
- K019 Turn of Fate: Once/turn when taking damage, prevent 1 and deal 1 to opponent
- K024 Market Recycle: Once/turn, pay 1⚡ to replace 1 shop card

### Phase 3: Special KEEP Cards (Priority 3)
Cards with unique mechanics:

- K004 Charge Depot: Prevent ⚡ loss from effects
- K006 Seismic Stride: When entering Center, all others -1 HP
- K010 Field Med Unit: Can heal in Center (max +1/turn from dice)
- K015 Core Anchor: +1 VP when voluntarily leaving Center
- K016 Explosive Entry: When entering Center, roll 1 bonus die (⚔️/⚡ only)
- K023 Die Forging: +1⚡ and +1 VP if keeping all dice after 1st roll

### Phase 4: Instant DISCARD Cards (Priority 4)
Simple instant-effect cards:

- D001 Overcharge: +3⚡
- D003 Restoration: +3 HP (even in Center)
- D006 Warehouse Plunder: +X⚡ (X = opponents, max 3)
- D012 Field Repairs: +2 HP; if outside, +1 VP
- D015 Galloping Time: +1 reroll this turn
- D017 Energy Pump: +5⚡
- D020 Purgation: Remove all negative tokens, +1 HP

### Phase 5: Complex DISCARD Cards (Priority 5)
Cards requiring target selection or special mechanics:

- D002 Blade Burst: +2⚔️ to all opponents
- D004 Form Reversal: Enter Center (boot occupant if needed)
- D005 Regroup: Reroll all dice, apply only ⚔️/⚡
- D009 Power Strike: Choose opponent, deal X⚔️ where X = ⚡ paid (0-3)
- D011 Cyber Heist: Steal 2⚡ from one opponent
- D014 Ambush: Roll 2 dice, apply only ⚔️/⚡
- D016 Exile: Eject Center occupant, lock Center until your next turn
- D018 Weakpoint Marker: Give token, next ⚔️ damage +1 extra
- D019 Shattering Orbit: This turn, each ⚔️ also gives +1⚡

### Phase 6: Advanced DISCARD Cards (Priority 6)
Cards with reaction/duration mechanics:

- D007 Market Turmoil: Force opponent to reroll ⚡ (during their roll)
- D008 Rainproof Shield: Ignore all damage until your next turn
- D010 Swift Ascent: At end of turn, if Center empty, enter and +1 VP
- D013 Diversion: Cancel a Discard/Instant just played by another player

## Integration Points in Arena.tsx

### 1. Player Initialization
```typescript
const humanPlayer: Player = {
  // ... existing fields
  purchasedCards: [],
  cardEffectState: getInitialCardEffectState()
};
```

### 2. Start of Turn
```typescript
// Reset once-per-turn effects
setPlayers(prev => prev.map((p, idx) => {
  if (idx === currentPlayerIndex) {
    return {
      ...p,
      cardEffectState: resetOncePerTurnEffects(p.cardEffectState)
    };
  }
  return p;
}));

// Apply K001 Energy Collector
const collectorBonus = applyEnergyCollector(currentPlayer.purchasedCards);
if (collectorBonus > 0) {
  // Grant energy and show toast
}

// Apply K020 Eminent Devastator
const devastatorVP = applyEminentDevastator(currentPlayer.purchasedCards, currentPlayer.inCenter);
if (devastatorVP > 0) {
  // Grant VP and show toast
}
```

### 3. Roll Phase Begin
```typescript
// Calculate reroll cap with K022 Aero Tunnels
let rerollCap = 3;
rerollCap += applyAeroTunnels(currentPlayer.purchasedCards);

// Apply K028 Synchronizer
rerollCap = applySynchronizer(currentPlayer.purchasedCards, rerollCap);
```

### 4. Dice Resolution
```typescript
// In executeResolve function:

// RESOLVE ENERGY
const baseEnergyGain = energyCount;
const { bonus: plasmaBonus, triggered: plasmaTriggered } = applyPlasmaAccumulator(
  currentPlayer.purchasedCards,
  baseEnergyGain,
  currentPlayer.cardEffectState
);
const totalEnergyGain = baseEnergyGain + plasmaBonus;

// K018 Necro-Feeder
const necroBonus = applyNecroFeeder(currentPlayer.purchasedCards, heartCount);

// K027 Rebuild Core
const rebuildBonus = applyRebuildCore(currentPlayer.purchasedCards, heartCount, currentPlayer.inCenter);

// RESOLVE NUMBERS
const baseVP = calculateVP(finalDice);
const cubistBonus = applyCubistFortune(currentPlayer.purchasedCards, baseVP > 0);
const totalVP = baseVP + cubistBonus;

// RESOLVE SWORDS
const baseDamage = swordCount;
const damageBonus = calculateTotalDamageModifiers(
  currentPlayer.purchasedCards,
  currentPlayer.inCenter,
  swordCount,
  centerHasOccupant
);
const totalDamage = baseDamage + damageBonus;
```

### 5. Damage Taken
```typescript
const modifiedDamage = calculateDamageReduction(
  defender.purchasedCards,
  rawDamage,
  defender.cardEffectState.rainproofShieldUntil === currentPlayerIndex
);

// Check for K019 Turn of Fate prompt
if (hasCard(defender.purchasedCards, 'K019') && 
    !defender.cardEffectState.turnOfFateUsed &&
    modifiedDamage > 0) {
  // Show prompt to use Turn of Fate
}
```

### 6. Shop Phase
```typescript
// Add "Play Card" button for DISCARD cards in hand
// When clicked, execute card effect based on cardId

// Check for K003 Black Market prompt
if (hasCard(currentPlayer.purchasedCards, 'K003') && 
    !currentPlayer.cardEffectState.blackMarketUsed) {
  // Show "Use Black Market?" button
}

// Check for K024 Market Recycle prompt
if (hasCard(currentPlayer.purchasedCards, 'K024') && 
    !currentPlayer.cardEffectState.marketRecycleUsed) {
  // Show "Use Market Recycle?" button
}
```

## Testing Checklist

### Phase 1 Cards (Passive Effects)
- [ ] K001: Verify +1⚡ at start of turn
- [ ] K002: Verify +1⚡ when gaining ≥2⚡ from dice (once/turn)
- [ ] K005: Verify +1 damage while in Center
- [ ] K007: Verify +1 damage to Center occupant when outside with ≥2⚔️
- [ ] K008: Verify 3+ damage reduced by 1 (min 1)
- [ ] K009: Verify +1 HP at end of turn if no ❤️ resolved
- [ ] K013: Verify +1 VP when scoring number set
- [ ] K014: Verify opponent loses 1⚡ when gaining ≥3⚡
- [ ] K018: Verify +1⚡ per ❤️ resolved
- [ ] K020: Verify +1 VP at start of turn if in Center
- [ ] K021: Verify +1 VP at end of turn if outside and dealt ≥2⚔️
- [ ] K022: Verify +1 reroll cap
- [ ] K025: Verify -1 damage from every source (min 0)
- [ ] K026: Verify +1 damage when dealing ≥1⚔️
- [ ] K027: Verify +1⚡ when healing while outside
- [ ] K028: Verify reroll cap set to 3

### Phase 2-3 Cards (Interactive)
- [ ] K003: Black Market purchase flow
- [ ] K011: Antibodies prompt and effect
- [ ] K012: Telekinetic Grip die selection
- [ ] K017: Mine Hunter reroll
- [ ] K019: Turn of Fate target selection
- [ ] K024: Market Recycle replacement

### Phase 4-6 Cards (DISCARD)
- [ ] All instant effects apply correctly
- [ ] Cards are removed from hand after use
- [ ] Target selection works for interactive cards
- [ ] Duration effects persist correctly

## UI Enhancements Needed

1. **Card Hand Display**: Show purchased DISCARD cards with "Play" button
2. **Card Effect Indicators**: Show active card effects on player HUD (e.g., shield icon for Rainproof Shield)
3. **Token Display**: Show Weakpoint tokens on players
4. **Once-Per-Turn Badges**: Show "Ready/Spent" status for cards like K003, K011, K012, K017, K019, K024
5. **Animation**: Card purchase animation (already implemented)
6. **Toast Notifications**: Show when card effects trigger

## Notes

- All card IDs use the format K### for KEEP cards and D### for DISCARD cards
- Once-per-turn effects reset at START_OF_TURN
- Duration effects track which playerIndex they expire at
- Bot AI should automatically use beneficial card effects
- Some cards (D007, D013) require implementing opponent's turn hooks
- Card effects stack unless explicitly stated otherwise
- Costs are paid before effects resolve (can't use gained resources to pay for the effect that grants them)
