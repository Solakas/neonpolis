# Starblade Mantis - Precision Cut Ability Implementation

## Overview
Implemented the Precision Cut ability for Starblade Mantis, which adds +1 damage when dealing damage if the player kept ≥1 Heart this turn.

## Ability Details

**Character**: Starblade Mantis  
**Ability Name**: Precision Cut  
**Timing**: `on_deal_damage`  
**Description**: "When you deal damage and you kept ≥1 Heart this turn, deal +1. (1/round)"

## Game Flow

### Turn Start
- Ability state → `ready`
- `keptHeartThisTurn` flag → `false`

### During Final Roll (Resolve Phase)
1. **Heart Detection**
   - At resolve phase, check if final dice contain any Hearts
   - If Hearts present: `keptHeartThisTurn = true`
   - This flag persists for the entire turn

2. **Player Stats Update**
   ```typescript
   keptHeartThisTurn: hasHearts // true if newHealing > 0
   ```

### When Dealing Damage (Combat Phase)
1. **Precision Cut Check** (before Stoneplate reduction)
   ```typescript
   if (precision_cut && ready && keptHeartThisTurn && baseDamage > 0) {
     finalDamage += 1;
     precisionCutTriggered = true;
   }
   ```

2. **Damage Calculation Order**
   - Base sword damage
   - ➕ Precision Cut +1 (if conditions met)
   - ➖ Stoneplate -1 (defender, if active)
   - = Final damage applied

3. **Ability Marked as Spent**
   - After dealing bonus damage, ability state → `spent`
   - Badge disappears
   - Cannot trigger again until next turn

4. **Badge Display**
   - Shows "⚔️ Precision Cut +1" when:
     - Ability is `ready`
     - `keptHeartThisTurn === true`
     - During combat phase

### Turn End
- `keptHeartThisTurn` reset to `false`
- Ability state reset to `ready` (at next turn start)

## Implementation Details

### Files Modified

#### 1. `/lib/gameData.ts`
Updated ability description:

```typescript
{
  id: 'starblade_mantis',
  name: 'Starblade Mantis',
  tagline: 'A cut above fate.',
  maxLife: 10,
  image: 'starblade_mantis.png',
  ability: {
    id: 'precision_cut',
    name: 'Precision Cut',
    timing: 'on_deal_damage',
    description: 'When you deal damage and you kept ≥1 Heart this turn, deal +1. (1/round)'
  }
}
```

#### 2. `/components/Arena.tsx`

**A. Track Hearts in Resolve Phase**
```typescript
const handleResolve = (dice: DiceFace[]) => {
  const finalDice = keptDice.length > 0 ? keptDice.map(d => d.face) : dice;
  
  let newHealing = 0;
  finalDice.forEach(die => {
    if (die === 'heart') newHealing++;
  });

  // Track if player kept hearts this turn (for Precision Cut ability)
  const hasHearts = newHealing > 0;

  // Update player stats
  setPlayers(prev => prev.map((p, idx) => {
    if (idx === currentPlayerIndex) {
      return {
        ...p,
        keptHeartThisTurn: hasHearts, // Set flag
        // ... other updates
      };
    }
    return p;
  }));
}
```

**B. Apply Precision Cut in dealDamage**
```typescript
const dealDamage = (targetId: string, damage: number) => {
  let finalDamage = damage;
  let precisionCutTriggered = false;
  let stoneplateTriggered = false;

  // Check for Starblade Mantis's Precision Cut ability (attacker)
  const attackerCharacter = characters.find(c => c.id === currentPlayer.characterId)!;
  if (attackerCharacter.ability.id === 'precision_cut' && 
      currentPlayer.abilityState === 'ready' &&
      currentPlayer.keptHeartThisTurn === true &&
      damage > 0) { // Only trigger if base damage > 0
    finalDamage += 1;
    precisionCutTriggered = true;
  }

  // Check for Basalt Colossus's Stoneplate ability (defender)
  const targetCharacter = characters.find(c => c.id === target.characterId)!;
  if (targetCharacter.ability.id === 'stoneplate' && 
      target.abilityState === 'armed' && 
      finalDamage >= 1) {
    finalDamage = Math.max(0, finalDamage - 1);
    stoneplateTriggered = true;
  }
  
  // ... apply damage and mark attacker's ability as spent
}
```

**C. Enhanced Logging**
```typescript
// Log damage with ability info if triggered
if (precisionCutTriggered && stoneplateTriggered) {
  logMessage = `${p.name} took ${finalDamage} ⚔️ damage (${damage} +1 Precision Cut, −1 Stoneplate)! (${p.hp} → ${newHp} HP)`;
  toast.success(`Precision Cut +1 damage!`, { description: 'Then reduced by Stoneplate' });
} else if (precisionCutTriggered) {
  logMessage = `${p.name} took ${finalDamage} ⚔️ damage (${damage} +1 Precision Cut)! (${p.hp} → ${newHp} HP)`;
  toast.success(`Precision Cut +1 damage!`, { description: `${damage} → ${finalDamage} damage` });
}
```

**D. Mark Attacker's Ability as Spent**
```typescript
setPlayers(prev => prev.map(p => {
  if (p.id === targetId) {
    // Update defender's HP
  }
  // Mark attacker's Precision Cut as spent if it triggered
  if (p.id === currentPlayer.id && precisionCutTriggered) {
    return { ...p, abilityState: 'spent' };
  }
  return p;
}));
```

**E. Reset Flag at Turn Start**
```typescript
const handleEndTurn = () => {
  // Move to next player
  setPlayers(prev => prev.map((p, idx) => {
    if (idx === nextIndex) {
      return {
        ...p,
        abilityState: getAbilityStateOnTurnStart(nextCharacter.ability.id),
        keptHeartThisTurn: false // Reset flag
      };
    }
    return p;
  }));
  
  setCurrentPlayerIndex(nextIndex);
  setGamePhase('roll');
  setRollsRemaining(3);
  setKeptDice([]);
}
```

**F. Pass Badge State to CharacterCard**
```typescript
<CharacterCard
  character={char}
  variant="detail"
  vp={player.vp}
  showEnergy={true}
  energy={player.energy}
  showLife={true}
  currentHp={player.hp}
  purchasedCards={player.purchasedCards}
  stoneplateActive={char.ability.id === 'stoneplate' && player.abilityState === 'armed'}
  precisionCutActive={char.ability.id === 'precision_cut' && player.abilityState === 'ready' && player.keptHeartThisTurn === true}
/>
```

#### 3. `/components/CharacterCard.tsx`

**A. Added Prop**
```typescript
interface CharacterCardProps {
  // ... existing props
  stoneplateActive?: boolean;
  precisionCutActive?: boolean; // NEW
}
```

**B. Precision Cut Badge Display**
```typescript
{/* Precision Cut Damage Boost Badge - shown above character when active */}
{isDetail && precisionCutActive && character.ability.id === 'precision_cut' && (
  <div className="absolute left-[16px] top-[16px] z-10">
    <Badge 
      className="bg-red-700/90 border-red-500 text-white px-3 py-1.5 shadow-lg animate-pulse"
      style={{ fontSize: '12px', fontWeight: 600 }}
    >
      ⚔️ Precision Cut +1
    </Badge>
  </div>
)}
```

## Edge Cases Handled

### 1. No Hearts Kept
- **Scenario**: Player rolls no Hearts in final dice
- **Behavior**: `keptHeartThisTurn = false`
- **Result**: Precision Cut does not trigger
- **Badge**: Not shown

### 2. Base Damage = 0
- **Scenario**: Player has 0 swords (shouldn't happen in combat, but defensive check)
- **Behavior**: Precision Cut does not trigger even if hearts were kept
- **Code**: `damage > 0` check prevents activation
- **Result**: No bonus damage added

### 3. Ability Already Spent
- **Scenario**: Player already used Precision Cut this round
- **Behavior**: Ability does not trigger again
- **Result**: Normal damage dealt

### 4. Hearts Kept but In Center
- **Scenario**: Player is in Neonpolis center (cannot heal)
- **Behavior**: Hearts are still counted as "kept" for Precision Cut
- **Calculation**: `hasHearts = newHealing > 0` (based on dice, not actual healing)
- **Result**: Precision Cut can still trigger!

### 5. Precision Cut + Stoneplate Interaction
- **Scenario**: Attacker has Precision Cut active, defender has Stoneplate active
- **Order**: Precision Cut adds +1, then Stoneplate subtracts -1
- **Example**: 
  - Base: 2 swords
  - After Precision Cut: 3 damage
  - After Stoneplate: 2 damage
- **Log**: Shows both abilities triggered

### 6. Multiple Targets
- **Scenario**: Player in center attacks all outside players
- **Behavior**: Precision Cut triggers once (on first damage dealt)
- **Subsequent Attacks**: Normal damage (ability now spent)
- **Note**: Currently dealDamage is called separately for each target, and ability is marked spent after first call

## Damage Calculation Examples

### Example 1: Precision Cut Only
- **Setup**: Starblade Mantis with 2 Hearts kept, attacks for 3 swords
- **Calculation**:
  - Base damage: 3
  - Precision Cut: +1 → 4
  - Final: 4 damage
- **Log**: "Player took 4 ⚔️ damage (3 +1 Precision Cut)!"
- **Badge**: ⚔️ Precision Cut +1 (shown during combat phase)

### Example 2: Precision Cut vs Stoneplate
- **Setup**: Starblade Mantis (2 Hearts) attacks Basalt Colossus (Stoneplate armed) for 2 swords
- **Calculation**:
  - Base damage: 2
  - Precision Cut: +1 → 3
  - Stoneplate: -1 → 2
  - Final: 2 damage
- **Log**: "Basalt took 2 ⚔️ damage (2 +1 Precision Cut, −1 Stoneplate)!"
- **Result**: Both abilities spent

### Example 3: No Hearts Kept
- **Setup**: Starblade Mantis with 0 Hearts, attacks for 3 swords
- **Calculation**:
  - Base damage: 3
  - Precision Cut: Not triggered
  - Final: 3 damage
- **Log**: "Player took 3 ⚔️ damage!"
- **Badge**: Not shown

### Example 4: Hearts in Center
- **Setup**: Starblade Mantis in Neonpolis rolls 2 Hearts, 2 Swords (cannot heal in center)
- **Roll Result**: 2 Hearts counted as "kept"
- **Combat**: Attacks all outside players
- **First Target**: 2 swords +1 Precision Cut = 3 damage
- **Remaining Targets**: 2 swords (ability spent)
- **Badge**: Shown until first attack

## Bot Behavior

Bots with Starblade Mantis automatically benefit from Precision Cut:
- No special AI logic needed
- Flag is set automatically when hearts are in final roll
- Damage bonus applied automatically in combat
- Works seamlessly with bot combat decisions

## UI/UX Features

### Badge Display
- **Color**: Red background (`bg-red-700/90`)
- **Border**: Red accent (`border-red-500`)
- **Icon**: ⚔️ sword emoji
- **Text**: "Precision Cut +1"
- **Animation**: Pulsing glow (`animate-pulse`)
- **Position**: Top-left of character card
- **Visibility**: Only when ability is ready AND hearts were kept

### Toast Notifications
- **Precision Cut Only**: `"Precision Cut +1 damage!"` with `"X → Y damage"`
- **With Stoneplate**: `"Precision Cut +1 damage!"` with `"Then reduced by Stoneplate"`

### Game Log
- **Precision Cut Only**: `"{Target} took Y ⚔️ damage (X +1 Precision Cut)!"`
- **Both Abilities**: `"{Target} took Y ⚔️ damage (X +1 Precision Cut, −1 Stoneplate)!"`

## Integration with Existing Systems

### Ability State Management
- Uses existing `AbilityState` type: `'ready' | 'armed' | 'spent' | 'stored'`
- Starts as `'ready'` at turn start
- Becomes `'spent'` after triggering
- No special "armed" state needed

### Damage System
- Integrates with existing `dealDamage` function
- Applied before Stoneplate reduction (proper order)
- Works with multiple target scenarios

### Player State
- Uses existing `keptHeartThisTurn` field in Player interface
- Flag managed automatically through resolve flow
- Reset on turn transition

## Character Card Display

The ability text is automatically displayed from `gameData.ts`:

```typescript
<p className="font-['Roboto',sans-serif] text-[#1a1b25]">
  {character.ability.description}
</p>
```

Shows: "When you deal damage and you kept ≥1 Heart this turn, deal +1. (1/round)"

## Testing Scenarios

### Basic Activation
1. Select Starblade Mantis
2. Roll and keep at least 1 Heart (any number)
3. Roll at least 1 Sword
4. Resolve
5. Enter combat
6. **Expected**: Badge appears on character card
7. Deal damage
8. **Expected**: +1 damage applied, toast notification, ability marked spent

### No Hearts Scenario
1. Select Starblade Mantis
2. Roll without keeping any Hearts
3. Roll Swords
4. Enter combat
5. **Expected**: No badge, normal damage, ability still ready

### Multiple Attacks (Center)
1. Starblade Mantis enters center
2. Next turn: Roll Hearts + Swords
3. Attack all outside players
4. **Expected**: First target gets +1, others get normal damage

### Precision Cut vs Stoneplate
1. Starblade Mantis (with Hearts kept) vs Basalt Colossus (Stoneplate armed)
2. Attack with 2+ swords
3. **Expected**: Damage = swords +1 -1, both abilities spent, both toasts shown

### Badge Persistence
1. Keep Hearts in final roll
2. **Expected**: Badge appears immediately
3. Stay in resolve phase (don't attack yet)
4. **Expected**: Badge still visible
5. Deal damage
6. **Expected**: Badge disappears after damage dealt

## Summary

The Precision Cut ability is fully implemented with:
- ✅ Heart tracking in final dice roll
- ✅ `keptHeartThisTurn` flag management
- ✅ +1 damage bonus application (before Stoneplate)
- ✅ Ability state management (ready → spent)
- ✅ Visual badge indicator
- ✅ Toast notifications and game logs
- ✅ Edge case handling (no hearts, 0 damage, etc.)
- ✅ Proper interaction with Stoneplate
- ✅ Turn start/end flag reset
- ✅ Bot compatibility
- ✅ Updated character card text

The ability provides a tactical incentive to balance offense (Swords) with survival (Hearts), rewarding players who can keep both in their final roll.
