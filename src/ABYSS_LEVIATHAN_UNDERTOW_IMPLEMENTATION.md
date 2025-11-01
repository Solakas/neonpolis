# Abyss Leviathan - Undertow Ability Implementation

## Overview
Implemented the Undertow ability for Abyss Leviathan, which allows converting unused Hearts into Energy once per turn during the Resolve phase.

## Ability Details

**Character**: Abyss Leviathan  
**Ability Name**: Undertow  
**Timing**: `resolve_hearts_on_your_turn`  
**Description**: "Once per turn, when resolving Hearts on your turn, you may convert any unused Hearts into Energy (1 Heart → 1 Energy)."

## Game Flow

### Turn Start
- Ability state → `ready`

### During Resolve Hearts Phase
1. **Base Healing Applied First**
   - Hearts heal normally (max HP = 10)
   - Cannot heal while in Neonpolis center
   
2. **Calculate Unused Hearts**
   ```typescript
   actualHealing = inCenter ? 0 : min(heartsRolled, maxHp - currentHp)
   unusedHearts = heartsRolled - actualHealing
   ```

3. **Undertow Trigger Check**
   - If `unusedHearts > 0` AND `abilityState === 'ready'`:
     - **Human Player**: Show ability prompt
     - **Bot Player**: Auto-convert all unused hearts

4. **Ability Prompt (Human Only)**
   - Display: Modal dialog with slider control
   - Default: All unused hearts selected
   - Range: 0 to `unusedHearts`
   - Actions: 
     - **Convert**: Gain X ⚡ Energy → ability state becomes `spent`
     - **Skip**: No energy gained → close prompt

5. **Post-Resolution**
   - If X ≥ 1 converted: Add X energy, mark ability as `spent`
   - If X = 0 or skipped: Ability remains `ready` but cannot be used again this turn
   - Move to combat or shop phase

## Implementation Details

### Files Modified

#### 1. `/lib/gameData.ts`
Updated Abyss Leviathan ability description:

```typescript
{
  id: 'abyss_leviathan',
  name: 'Abyss Leviathan',
  tagline: 'The tide obeys me.',
  maxLife: 10,
  image: 'abyss_leviathan.png',
  ability: {
    id: 'undertow',
    name: 'Undertow',
    timing: 'resolve_hearts_on_your_turn',
    description: 'Once per turn, when resolving Hearts on your turn, you may convert any unused Hearts into Energy (1 Heart → 1 Energy).'
  }
}
```

#### 2. `/components/Arena.tsx`

**A. Calculate Unused Hearts** (in `handleResolve`):
```typescript
// Calculate actual healing and unused hearts for Undertow
const actualHealing = currentPlayer.inCenter ? 0 : Math.min(newHealing, currentPlayer.maxHp - currentPlayer.hp);
const unusedHearts = newHealing - actualHealing;
```

**B. Undertow Trigger Logic** (after stats update):
```typescript
// Check for Abyss Leviathan ability (Undertow) - only show prompt for human players
const currentCharacter = characters.find(c => c.id === currentPlayer.characterId)!;
if (currentCharacter.ability.id === 'undertow' && 
    currentPlayer.abilityState === 'ready' &&
    unusedHearts > 0) {
  
  if (!currentPlayer.isBot) {
    // Show prompt for human player
    setAbilityPrompt({
      open: true,
      type: 'undertow',
      data: { 
        unusedHearts,
        energy: currentPlayer.energy + newEnergy,
        hp: currentPlayer.hp,
        maxHp: currentPlayer.maxHp
      }
    });
    // Don't move to next phase yet - wait for ability decision
    return;
  } else {
    // Bot auto-converts all unused hearts
    const convertAmount = unusedHearts;
    setPlayers(prev => prev.map((p, idx) => {
      if (idx === currentPlayerIndex) {
        return { ...p, energy: p.energy + convertAmount, abilityState: 'spent' };
      }
      return p;
    }));
    addLog(`${currentPlayer.name} converted ${convertAmount} ❤️ to ${convertAmount} ⚡ Energy (Undertow)`, 'ability');
    toast.success(`Undertow: +${convertAmount} ⚡`, { description: `Converted ${convertAmount} unused Hearts` });
  }
}
```

**C. Ability Prompt Callback** (in `onConfirm`):
```typescript
// Handle Undertow
if (abilityPrompt.type === 'undertow') {
  const heartsToConvert = result.heartsToConvert || 0;
  
  if (heartsToConvert > 0) {
    // Add energy and mark ability as spent
    setPlayers(prev => prev.map((p, idx) => {
      if (idx === currentPlayerIndex) {
        return { ...p, energy: p.energy + heartsToConvert, abilityState: 'spent' };
      }
      return p;
    }));
    
    addLog(`${currentPlayer.name} converted ${heartsToConvert} ❤️ to ${heartsToConvert} ⚡ Energy (Undertow)`, 'ability');
    toast.success(`Undertow: +${heartsToConvert} ⚡`, { description: `Converted ${heartsToConvert} unused Hearts` });
  } else {
    addLog(`${currentPlayer.name} skipped Undertow`, 'ability');
  }
  
  // After Undertow decision, determine next phase
  const finalDice = keptDice.length > 0 ? keptDice.map(d => d.face) : [];
  const swordCount = finalDice.filter(d => d === 'sword').length;
  
  if (swordCount > 0) {
    setGamePhase('combat');
  } else {
    setGamePhase('shop');
  }
}
```

#### 3. `/components/AbilityPrompt.tsx`

**A. Updated UI** (Undertow section):
```typescript
{type === 'undertow' && (
  <div className="space-y-4">
    <p className="text-sm text-text-secondary">
      Convert unused Hearts to Energy (1 ❤️ → 1 ⚡)
    </p>
    <div className="p-3 rounded-lg bg-neon-cyan/10 border border-neon-cyan/30 mb-3">
      <p className="text-sm text-center">
        Unused Hearts: <span className="text-neon-cyan text-lg ml-2">{data?.unusedHearts || 0} ❤️</span>
      </p>
    </div>
    <div className="space-y-2">
      <div className="flex justify-between text-sm">
        <span>Hearts to convert: {convertAmount} ❤️</span>
        <span className="text-neon-cyan">+{convertAmount} ⚡</span>
      </div>
      <Slider
        value={[convertAmount]}
        onValueChange={([value]) => setConvertAmount(value)}
        max={data?.unusedHearts || 0}
        min={0}
        step={1}
        className="w-full"
      />
    </div>
  </div>
)}
```

**B. Default Value Logic**:
```typescript
// Set default convert amount for Undertow (convert all unused hearts by default)
useEffect(() => {
  if (open && type === 'undertow' && data?.unusedHearts) {
    setConvertAmount(data.unusedHearts);
  }
}, [open, type, data?.unusedHearts]);
```

## Edge Cases Handled

### 1. No Unused Hearts
- **Scenario**: Player is at full HP or in Neonpolis center
- **Behavior**: Prompt does not appear, ability remains `ready`
- **Log**: No message shown

### 2. Hearts Never Exceed Max HP
- **Formula**: `actualHealing = min(heartsRolled, maxHp - currentHp)`
- **Example**: Player at 8/10 HP rolls 4 Hearts
  - Heals: 2 HP (8 + 2 = 10)
  - Unused: 2 Hearts
  - Can convert: 2 Hearts → 2 Energy

### 3. In Neonpolis Center
- **Scenario**: Player is in center (cannot heal)
- **Behavior**: ALL hearts are unused
- **Example**: Player rolls 3 Hearts while in center
  - Healing: 0 HP
  - Unused: 3 Hearts
  - Can convert: 3 Hearts → 3 Energy

### 4. Skip or Convert 0
- **Behavior**: No energy gained, ability remains `ready`
- **Note**: Ability cannot be triggered again until next turn

### 5. Once Per Turn Limit
- Ability can only be triggered once during the Resolve phase
- If additional Hearts appear later (from effects), cannot convert again

## Bot Behavior

Bots with Abyss Leviathan automatically convert **all** unused Hearts to Energy:

```typescript
// Bot auto-converts all unused hearts
const convertAmount = unusedHearts;
setPlayers(prev => prev.map((p, idx) => {
  if (idx === currentPlayerIndex) {
    return { ...p, energy: p.energy + convertAmount, abilityState: 'spent' };
  }
  return p;
}));
```

**Rationale**: Converting unused hearts is always beneficial for bots, as:
- Energy enables card purchases
- Unused hearts provide no benefit otherwise
- Simple AI strategy maximizes resource gain

## UI/UX Features

### Ability Prompt Modal
- **Title**: "Undertow"
- **Description**: "Abyss Leviathan's ability"
- **Info Box**: Displays total unused hearts
- **Slider Control**: 
  - Default: All unused hearts
  - Range: 0 to unused hearts
  - Step: 1 heart
- **Live Preview**: Shows hearts to convert and energy gain
- **Actions**: "Skip" button, "Confirm" button (disabled if selection invalid)

### Toast Notifications
- **Success**: `"Undertow: +X ⚡"` with description `"Converted X unused Hearts"`
- **Skip**: No toast notification

### Game Log
- **Use**: `"{Player} converted X ❤️ to X ⚡ Energy (Undertow)"`
- **Skip**: `"{Player} skipped Undertow"`

## Character Card Display

The ability text is automatically displayed on the character card from `gameData.ts`:

```typescript
<p className="font-['Roboto',sans-serif] text-[#1a1b25]">
  {character.ability.description}
</p>
```

Shows: "Once per turn, when resolving Hearts on your turn, you may convert any unused Hearts into Energy (1 Heart → 1 Energy)."

## Testing Scenarios

### Basic Conversion
1. Player rolls 3 Hearts
2. Player is at 8/10 HP
3. Heals 2 HP (to 10/10)
4. 1 Heart unused
5. Prompt shows: "Convert 1 unused Heart?"
6. Player confirms → gains +1 Energy
7. Ability marked as `spent`

### Maximum Conversion
1. Player rolls 5 Hearts
2. Player is at full HP (10/10)
3. 0 healing applied
4. 5 Hearts unused
5. Prompt shows: "Convert 5 unused Hearts?"
6. Player confirms → gains +5 Energy
7. Ability marked as `spent`

### In Center Conversion
1. Player is in Neonpolis center
2. Rolls 3 Hearts
3. Cannot heal (center rule)
4. All 3 Hearts unused
5. Prompt appears
6. Player converts → gains +3 Energy

### Skip Test
1. Player has unused hearts
2. Prompt appears
3. Player clicks "Skip"
4. No energy gained
5. Ability remains `ready` but cannot be used again this turn

### Bot Auto-Convert
1. Bot rolls Hearts with unused portion
2. Bot automatically converts all unused hearts
3. Log message shows conversion
4. Toast notification appears
5. No prompt shown to user

## Integration with Existing Systems

### Ability State Management
- Uses existing `AbilityState` type: `'ready' | 'armed' | 'spent' | 'stored'`
- Integrates with `getAbilityStateOnTurnStart()` (returns `'ready'`)
- Marks as `'spent'` after use

### Ability System
- Already supported in `/lib/abilitySystem.ts`:
  ```typescript
  case 'undertow':
    const unusedHearts = (context.rolledHearts || 0) - (context.healedHearts || 0);
    return state === 'ready' && unusedHearts > 0;
  ```

### Bot Check Pattern
- Follows same pattern as Misty Grapple:
  ```typescript
  if (!currentPlayer.isBot) {
    // Show prompt
  } else {
    // Auto-execute
  }
  ```

## Summary

The Undertow ability is fully implemented with:
- ✅ Correct game flow (healing first, then conversion)
- ✅ Unused hearts calculation
- ✅ Human player prompt with slider control
- ✅ Bot auto-conversion logic
- ✅ Once-per-turn enforcement
- ✅ All edge cases handled
- ✅ Toast notifications and game logs
- ✅ Ability state management
- ✅ Updated character card text
- ✅ Integration with combat/shop phase transitions

The ability provides strategic depth by allowing players to convert wasted healing into valuable Energy for purchasing shop cards.
