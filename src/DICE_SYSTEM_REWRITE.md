# Dice System Rewrite - Complete Documentation

## Overview
Rewrote the entire dice resolution system from scratch to follow the official dice rules exactly. The system now has a single source of truth for dice state and follows the proper resolution order.

## Dice Rules Implementation

### Dice Faces
- **6 dice by default** with faces: 1, 2, 3, ⚔️ (sword), ⚡ (energy), ❤️ (heart)
- Base dice use primary stroke; extra dice from cards use accent stroke (functionally identical)

### Roll Sequence (Push-Your-Luck)
1. **Initial roll**: Roll all 6 dice
2. **Lock/Keep**: Choose any subset of dice to lock
3. **Re-rolls**: Up to 3 re-rolls, can change which dice are locked between rolls
4. **Finalize**: After last re-roll (or early resolve), final result is resolved

### Resolution Order (CRITICAL - Must Follow Exactly)
The system resolves dice in this exact sequence:

1. **VP (Stars) from number sets**
   - Triples score VP equal to the number: 1-1-1 → 1 VP, 2-2-2 → 2 VP, 3-3-3 → 3 VP
   - Each extra matching die beyond three adds +1 VP
   - Example: 3-3-3-3 → 4 VP (3 base + 1 extra)
   - Multiple sets add up: 3-3-3 + 1-1-1 → 4 VP total
   - ⚔️, ⚡, ❤️ never grant VP

2. **Hearts (Healing & Evolution)**
   - Each ❤️ restores 1 HP, up to max HP
   - Cannot heal while in Neonpolis center
   - Unused hearts can be converted via Undertow ability (Abyss Leviathan)
   - 3+ ❤️ unlocks 1 Evolution/Augment

3. **Energy (Gain & Spend)**
   - Gain 1 ⚡ per energy face
   - Can be spent immediately or banked
   - Overcharge ability (Ion Wyrm) adds +1 ⚡ if armed

4. **Swords (Damage)**
   - Each ⚔️ deals 1 damage
   - All swords target one opponent (cannot split unless card allows)
   - Phase transitions to combat if swordCount > 0

5. **Eliminations & End-of-Turn**
   - Check if any player HP ≤ 0
   - Apply all abilities and status effects

## Code Architecture

### Single Source of Truth: `keptDice`
- `keptDice` is an array of `{ id: string, face: DiceFace }` objects
- Updated every time dice are rolled via `handleDiceRolled`
- Can be modified by abilities (Misty Grapple, Time Bank, etc.)
- Passed to DiceRoller as `controlledDice` prop during resolve/combat/shop phases

### Key Functions

#### `calculateVP(dice: DiceFace[]): number`
- Counts number faces (1, 2, 3) only
- Calculates VP for triples + extras
- Example: [3,3,3,3,1,1] → 4 VP (3 base + 1 extra for fourth 3)

#### `handleDiceRolled(dice: DiceFace[])`
- Called when dice finish rolling
- Updates `keptDice` with new dice values
- Logs roll to game log
- Checks for abilities that trigger after final roll (Time Bank swap, Misty Grapple)

#### `executeResolve(dice: DiceFace[])`
**The core resolution function following official rules:**

1. Get final dice: `const finalDice = keptDice.length > 0 ? keptDice.map(d => d.face) : dice;`
2. Count all faces: numbers, hearts, energy, swords
3. Calculate VP from number sets
4. Calculate healing (actual + unused for Undertow)
5. Apply energy gain (with Overcharge if applicable)
6. Update player stats (VP, HP, Energy)
7. Log and notify results
8. Check for Undertow ability (convert unused hearts)
9. Transition to combat phase if swordCount > 0, else shop

#### `handleCombatAction(swordCount: number)`
- Receives sword count from DiceRoller
- Recalculates from `keptDice` to ensure accuracy: `keptDice.filter(d => d.face === 'sword').length`
- Handles Neonpolis combat rules (inside vs outside)
- Applies damage modifiers (Precision Cut, Stoneplate, Venom Siphon)

### State Flow

```
1. Roll Phase:
   - User clicks "Roll Dice"
   - DiceRoller.rollDice() generates random faces
   - After animation, calls onRollComplete(dice)
   - Arena.handleDiceRolled(dice) updates keptDice
   - If rollsRemaining > 1, can reroll or early resolve
   - If rollsRemaining === 1 (final roll), moves to resolve phase

2. Resolve Phase:
   - keptDice contains final dice (may have been modified by abilities)
   - User clicks "Resolve Dice"
   - Arena.handleResolve(dice) checks for pre-resolve abilities
   - Arena.executeResolve(dice) processes dice following resolution order
   - Transitions to combat (if swords) or shop (if no swords)

3. Combat Phase:
   - DiceRoller shows "Attack" button if swordCount > 0
   - User clicks "Attack"
   - onCombat callback recalculates swordCount from keptDice
   - Arena.handleCombatAction(swordCount) executes combat
   - Transitions to shop phase after combat resolves

4. Shop Phase:
   - User can buy cards or end turn
   - "End Turn" button visible
   - After ending turn, next player's turn begins
```

### DiceRoller Component Integration

**controlledDice Prop:**
```typescript
controlledDice={gamePhase === 'roll' ? undefined : keptDice.map(d => d.face)}
```
- During roll phase: `undefined` (DiceRoller uses local dice state)
- During resolve/combat/shop: `keptDice.map(d => d.face)` (shows dice modified by abilities)

**displayDice Logic:**
```typescript
const displayDice = (phase === 'resolve' || phase === 'combat' || phase === 'shop') && controlledDice
  ? controlledDice
  : dice;
```
- Ensures dice display matches the authoritative state
- Abilities that modify dice (Misty Grapple, Time Bank) are reflected correctly

### Combat Handler

```typescript
onCombat={(swordCount) => {
  if (gamePhase === 'combat') {
    // CRITICAL: Recalculate from keptDice (includes ability modifications)
    const actualSwordCount = keptDice.filter(d => d.face === 'sword').length;
    console.log('Combat - actualSwordCount:', actualSwordCount);
    
    if (actualSwordCount > 0) {
      handleCombatAction(actualSwordCount);
    } else {
      toast.error('No swords to attack with!');
      setGamePhase('shop');
    }
  }
}}
```

**Why recalculate?**
- keptDice is the single source of truth
- Abilities may have modified dice between resolve and combat
- Prevents desync between displayed dice and actual dice

## Debug Logging

Added comprehensive console logging at critical points:

### executeResolve:
```
=== DICE RESOLUTION START ===
Final dice: [...]
Counts - Numbers: [...] Hearts: X Energy: Y Swords: Z
Healing - Actual: X Unused: Y
=== DICE RESOLUTION END ===
Swords: Z - Next phase: combat/shop
```

### Combat Handler:
```
=== COMBAT HANDLER ===
Passed swordCount: X
Combat - keptDice: [...]
Combat - actualSwordCount: Y
======================
```

### DiceRoller:
```
=== DiceRoller Debug ===
Phase: resolve/combat/shop
Local dice: [...] → faces: [0]:sword, [1]:energy, ...
controlledDice prop: [...] → faces: [0]:sword, [1]:energy, ...
displayDice: [...] → faces: [0]:sword, [1]:energy, ...
Sword count in displayDice: X
=======================
```

## Testing Scenarios

### Test 1: Basic Sword Resolution
1. Roll dice: [sword, sword, 1, 2, 3, energy]
2. Resolve → swordCount should be 2
3. Combat phase should show 2 swords
4. Attack button should work

### Test 2: Triple VP Scoring
1. Roll dice: [3, 3, 3, energy, heart, sword]
2. Resolve → VP should be +3
3. Energy should be +1, Healing should be +1, Swords should be 1

### Test 3: Extra Dice VP Scoring
1. Roll dice: [1, 1, 1, 1, 2, 3]
2. Resolve → VP should be +2 (1 base + 1 extra)

### Test 4: Multiple Sets
1. Roll dice: [3, 3, 3, 1, 1, 1]
2. Resolve → VP should be +4 (3 from 3s + 1 from 1s)

### Test 5: No Swords
1. Roll dice: [1, 2, 3, energy, energy, heart]
2. Resolve → Should go directly to shop phase
3. Combat phase should be skipped

### Test 6: Ability Modified Dice
1. Use Misty Grapple to swap dice
2. Resolve → Modified dice should be counted
3. Combat should use modified sword count

## Bug Fixes

### Issue: Swords Not Responding
**Root Cause:** Potential desync between `keptDice`, local dice state in DiceRoller, and `controlledDice` prop

**Solution:**
1. Made `keptDice` the single source of truth in Arena.tsx
2. Always recalculate sword count from `keptDice` in combat handler
3. Pass `keptDice.map(d => d.face)` as `controlledDice` during resolve/combat/shop
4. DiceRoller uses `controlledDice` when available for display and calculations
5. Added extensive logging to track dice state through all phases

## Key Takeaways

1. **Single Source of Truth**: `keptDice` in Arena.tsx
2. **Resolution Order Matters**: VP → Hearts → Energy → Swords → Eliminations
3. **Recalculate in Combat**: Always use `keptDice` to count swords, not passed parameters
4. **controlledDice Sync**: Pass `keptDice.map(d => d.face)` to DiceRoller in non-roll phases
5. **Comprehensive Logging**: Console logs at every critical transition help debug issues

## Future Enhancements

- [ ] Support for extra dice from cards (extend array beyond 6)
- [ ] Visual indicator for which dice are base vs extra
- [ ] Animation for dice that are modified by abilities
- [ ] Sound effects for different resolution results
- [ ] Tutorial mode explaining resolution order
