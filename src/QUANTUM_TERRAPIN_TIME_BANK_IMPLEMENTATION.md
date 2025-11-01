# Quantum Terrapin - Time Bank Ability Implementation

## Overview
Implemented the Time Bank ability for Quantum Terrapin, which allows storing one die at end of turn and swapping it in before any reroll on a future turn.

## Ability Details

**Character**: Quantum Terrapin  
**Ability Name**: Time Bank  
**Timing**: `end_of_turn_store` + `before_reroll`  
**Description**: "End of turn: store 1 kept die (max 1). Later, swap before rerolls, then discard. (1/round)"

## Game Flow

### Phase 1: Store Die (End of Turn)

#### Human Player Flow
1. **Trigger Check** (when clicking "End Turn")
   - Ability must be `ready`
   - Player must have at least 1 kept die
   - If conditions met, show storage prompt

2. **Storage Prompt**
   ```typescript
   type: 'time_bank_store'
   data: { dice: keptDice }
   ```
   - Dialog shows all kept dice
   - Player selects one die to store
   - Buttons: "Skip" or "Confirm"

3. **After Selection**
   - Selected die face stored in `player.storedDie`
   - Ability state → `spent`
   - Log: "{Player} stored {die} for later (Time Bank)"
   - Toast: "Time Bank: Stored {die}"
   - Turn ends normally

4. **If Already Has Stored Die**
   - New selection replaces old stored die
   - Log: "{Player} replaced stored die with {die} (Time Bank)"
   - Toast: "Time Bank: Replaced with {die}"

5. **If No Kept Dice**
   - No prompt shown
   - Turn ends normally
   - Ability remains `ready`

#### Bot Player Flow
- Auto-stores a random die from keptDice
- Same logic as human, but automatic
- No prompt shown

### Phase 2: Swap Die (Before Reroll)

#### Human Player Flow
1. **Trigger Check** (after first roll completes)
   - Must be first roll (`rollsRemaining === 3`)
   - Player must have `storedDie` (not undefined)
   - Character must be Quantum Terrapin

2. **Swap Banner**
   ```typescript
   message: "Swap in stored {die}?"
   buttons: "Use" / "Skip"
   ```
   - Shows at top center of screen
   - Quick yes/no decision

3. **If "Use" Clicked**
   - Opens swap dialog
   ```typescript
   type: 'time_bank_swap'
   data: { 
     dice: keptDice,
     storedDie: player.storedDie 
   }
   ```
   - Shows stored die at top
   - Shows all current dice
   - Player selects which die to replace

4. **After Selection**
   - Selected die replaced with stored die face
   - `player.storedDie` → `undefined` (consumed)
   - Log: "{Player} swapped {oldFace} with stored {newFace} (Time Bank)"
   - Toast: "Time Bank: Swapped {old} → {new}"
   - Player continues with modified dice

5. **If "Skip" Clicked**
   - Stored die remains
   - Can use it on a future turn
   - Banner closes

#### Bot Player Flow
- Auto-swaps stored die with random die
- No banner/prompt shown
- Same outcome as human

### Next Turn
- Ability state resets to `ready` at turn start
- Stored die persists until used or replaced
- Player can store another die at end of turn (max 1 stored at a time)

## Implementation Details

### Files Modified

#### 1. `/lib/gameData.ts`
Updated ability description:

```typescript
{
  id: 'quantum_terrapin',
  name: 'Quantum Terrapin',
  tagline: 'Save now, swap later.',
  maxLife: 10,
  image: 'quantum_terrapin.png',
  ability: {
    id: 'time_bank',
    name: 'Time Bank',
    timing: 'end_of_turn_store',
    description: 'End of turn: store 1 kept die (max 1). Later, swap before rerolls, then discard. (1/round)'
  }
}
```

#### 2. `/components/Arena.tsx`

**A. Player Interface**
```typescript
interface Player {
  id: string;
  name: string;
  characterId: string;
  hp: number;
  maxHp: number;
  energy: number;
  vp: number;
  isBot: boolean;
  inCenter: boolean;
  abilityState: AbilityState;
  storedDie?: DiceFace; // Stored die for Time Bank
  keptHeartThisTurn?: boolean;
  canLeaveCenter?: boolean;
  purchasedCards: string[];
}
```

**B. Store Die at End of Turn**
```typescript
const handleEndTurn = () => {
  // Check for Quantum Terrapin's Time Bank ability - store phase
  const currentCharacter = characters.find(c => c.id === currentPlayer.characterId)!;
  if (currentCharacter.ability.id === 'time_bank' && 
      currentPlayer.abilityState === 'ready' &&
      keptDice.length > 0) {
    
    if (!currentPlayer.isBot) {
      // Show prompt for human player to store a die
      setAbilityPrompt({
        open: true,
        type: 'time_bank_store',
        data: { dice: keptDice }
      });
      return; // Don't end turn yet - wait for ability decision
    } else {
      // Bot auto-stores a random die
      const randomDie = keptDice[Math.floor(Math.random() * keptDice.length)];
      setPlayers(prev => prev.map((p, idx) => {
        if (idx === currentPlayerIndex) {
          return { ...p, storedDie: randomDie.face, abilityState: 'spent' };
        }
        return p;
      }));
      addLog(`${currentPlayer.name} stored ${diceIcons[randomDie.face]} for later (Time Bank)`, 'ability');
      toast.success(`Time Bank: Stored ${diceIcons[randomDie.face]}`);
    }
  }
  
  // ... rest of turn end logic
}
```

**C. Swap Die Before Reroll**
```typescript
const handleDiceRolled = (dice: DiceFace[]) => {
  // Update keptDice to match the current roll
  const newKeptDice = dice.map((face, idx) => ({ id: `die-${idx}`, face }));
  setKeptDice(newKeptDice);
  
  // Log the roll with dice faces
  const diceDisplay = dice.map(face => diceIcons[face]).join(' ');
  addLog(`${currentPlayer.name} rolled: ${diceDisplay}`, 'roll');
  
  // Check for Time Bank swap (before any reroll, after first roll)
  const currentCharacter = characters.find(c => c.id === currentPlayer.characterId)!;
  if (rollsRemaining === 3 && // Just completed first roll
      currentCharacter.ability.id === 'time_bank' &&
      currentPlayer.storedDie) {
    
    if (!currentPlayer.isBot) {
      // Show banner for human player
      setAbilityBanner({
        open: true,
        message: `Swap in stored ${diceIcons[currentPlayer.storedDie]}?`,
        onUse: () => {
          setAbilityBanner({ open: false });
          setAbilityPrompt({
            open: true,
            type: 'time_bank_swap',
            data: { 
              dice: newKeptDice,
              storedDie: currentPlayer.storedDie
            }
          });
        }
      });
    } else {
      // Bot auto-swaps - replace a random die
      const randomIdx = Math.floor(Math.random() * newKeptDice.length);
      const oldFace = newKeptDice[randomIdx].face;
      newKeptDice[randomIdx].face = currentPlayer.storedDie;
      setKeptDice(newKeptDice);
      
      addLog(`${currentPlayer.name} swapped ${diceIcons[oldFace]} with stored ${diceIcons[currentPlayer.storedDie]} (Time Bank)`, 'ability');
      toast.success(`Time Bank: Swapped ${diceIcons[oldFace]} → ${diceIcons[currentPlayer.storedDie]}`);
      
      // Clear stored die
      setPlayers(prev => prev.map((p, idx) => {
        if (idx === currentPlayerIndex) {
          return { ...p, storedDie: undefined };
        }
        return p;
      }));
    }
  }
  
  // ... rest of roll handling
}
```

**D. Handle Store Confirmation**
```typescript
// In AbilityPrompt onConfirm handler
if (abilityPrompt.type === 'time_bank_store') {
  const dieToStore = keptDice.find(d => d.id === result.dieId);
  
  if (dieToStore) {
    // Check if player already has a stored die
    if (currentPlayer.storedDie) {
      addLog(`${currentPlayer.name} replaced stored die with ${diceIcons[dieToStore.face]} (Time Bank)`, 'ability');
      toast.success(`Time Bank: Replaced with ${diceIcons[dieToStore.face]}`);
    } else {
      addLog(`${currentPlayer.name} stored ${diceIcons[dieToStore.face]} for later (Time Bank)`, 'ability');
      toast.success(`Time Bank: Stored ${diceIcons[dieToStore.face]}`);
    }
    
    // Store the die and mark ability as spent for this turn
    setPlayers(prev => prev.map((p, idx) => {
      if (idx === currentPlayerIndex) {
        return { ...p, storedDie: dieToStore.face, abilityState: 'spent' };
      }
      return p;
    }));
  }
  
  // After storing, proceed with turn end
  // ... (complete turn end logic here)
}
```

**E. Handle Swap Confirmation**
```typescript
// In AbilityPrompt onConfirm handler
if (abilityPrompt.type === 'time_bank_swap') {
  const dieToReplace = keptDice.find(d => d.id === result.dieId);
  
  if (dieToReplace && currentPlayer.storedDie) {
    const newDice = [...keptDice];
    const replaceIdx = newDice.findIndex(d => d.id === result.dieId);
    const oldFace = newDice[replaceIdx].face;
    newDice[replaceIdx].face = currentPlayer.storedDie;
    setKeptDice(newDice);
    
    addLog(`${currentPlayer.name} swapped ${diceIcons[oldFace]} with stored ${diceIcons[currentPlayer.storedDie]} (Time Bank)`, 'ability');
    toast.success(`Time Bank: Swapped ${diceIcons[oldFace]} → ${diceIcons[currentPlayer.storedDie]}`);
    
    // Clear stored die
    setPlayers(prev => prev.map((p, idx) => {
      if (idx === currentPlayerIndex) {
        return { ...p, storedDie: undefined };
      }
      return p;
    }));
  }
}
```

**F. Pass Stored Die to CharacterCard**
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
  storedDie={player.storedDie}
/>
```

#### 3. `/components/CharacterCard.tsx`

**A. Added Prop**
```typescript
interface CharacterCardProps {
  character: Character;
  isSelected?: boolean;
  onClick?: () => void;
  variant?: 'selection' | 'detail';
  vp?: number;
  showEnergy?: boolean;
  energy?: number;
  showLife?: boolean;
  currentHp?: number;
  purchasedCards?: string[];
  stoneplateActive?: boolean;
  precisionCutActive?: boolean;
  storedDie?: string; // NEW - Stored die face for Time Bank
}
```

**B. Import diceIcons**
```typescript
import { shopCards, diceIcons } from '../lib/gameData';
```

**C. Display Stored Die Chip**
```typescript
<div className="flex items-center gap-2 mb-[2px]">
  <h3 
    className="font-['Fira_Sans',sans-serif] text-[#00E5FF] truncate"
    style={{ 
      fontSize: isDetail ? '22px' : '18px',
      lineHeight: isDetail ? '28px' : '24px',
      fontWeight: 600
    }}
  >
    {character.name}
  </h3>
  {/* Time Bank Stored Die Chip */}
  {isDetail && storedDie && character.ability.id === 'time_bank' && (
    <Badge 
      className="bg-purple-700/90 border-purple-500 text-white px-2 py-0.5 text-xs shrink-0"
    >
      {diceIcons[storedDie as keyof typeof diceIcons]}
    </Badge>
  )}
</div>
```

#### 4. `/components/AbilityPrompt.tsx`

**Already Implemented** - Both `time_bank_store` and `time_bank_swap` UI:

**Time Bank Store:**
- Shows grid of kept dice
- Player clicks to select
- Confirm button

**Time Bank Swap:**
- Shows stored die at top in cyan box
- Shows grid of current dice below
- Player clicks die to replace
- Confirm button

## Edge Cases Handled

### 1. No Kept Dice at End of Turn
- **Scenario**: Player rolls all numbers/symbols but keeps nothing
- **Behavior**: No storage prompt shown
- **Result**: Turn ends normally, ability remains ready

### 2. Already Has Stored Die
- **Scenario**: Player has a stored die from previous turn, stores again
- **Behavior**: New die replaces old stored die
- **Log**: Shows "replaced stored die with {new}"
- **Result**: Old die is lost, new die is stored

### 3. Skip Storage Prompt
- **Scenario**: Player clicks "Skip" on storage prompt
- **Behavior**: No die stored, turn ends
- **Result**: Ability remains ready, can store on future turn

### 4. Skip Swap Banner
- **Scenario**: Player clicks "Skip" on swap banner
- **Behavior**: Stored die remains for future use
- **Result**: Continue with current dice, can swap on future turn

### 5. Bot Behavior
- **Store**: Randomly selects a die from kept dice
- **Swap**: Randomly replaces one of the current dice
- **No Prompts**: Everything happens automatically
- **Timing**: Same as human players

### 6. Stored Die Persists Across Turns
- **Scenario**: Player stores die, doesn't swap next turn
- **Behavior**: Stored die remains available
- **Result**: Can swap it in on any future turn (before any reroll)

### 7. Max 1 Stored Die
- **Scenario**: Can't store multiple dice
- **Behavior**: Storage prompt only allows selecting 1 die
- **Result**: Only 1 die stored at a time (enforced by UI)

### 8. Swap Timing: Before Any Reroll
- **Scenario**: Swap only triggers after first roll
- **Check**: `rollsRemaining === 3` (just completed first roll)
- **Result**: Cannot swap during roll 2 or 3, only before reroll 1

## Ability State Flow

### Storage Turn
```
Turn Start → ready
Roll Phase → ready
Resolve Phase → ready
Shop Phase → ready
End Turn (with kept dice) → Prompt shown
After Storage → spent
Next Turn Start → ready (resets)
```

### Swap Turn (with stored die)
```
Turn Start → ready (has storedDie)
First Roll Complete → Banner shown
If Swap → storedDie cleared, ready
If Skip → ready (storedDie persists)
```

### Combined Example
```
Turn 1:
  - Start: ready, no storedDie
  - End: Store ⚔️ → spent, storedDie=sword

Turn 2:
  - Start: ready, storedDie=sword
  - First Roll: Banner shown
  - Skip swap → ready, storedDie=sword

Turn 3:
  - Start: ready, storedDie=sword  
  - First Roll: Banner shown
  - Swap sword → ready, storedDie=undefined
  - End: Store ⚡ → spent, storedDie=energy

Turn 4:
  - Start: ready, storedDie=energy
  - ...and so on
```

## UI/UX Features

### Storage Prompt
- **Type**: Full dialog modal
- **Title**: "Time Bank"
- **Description**: "Store one die for a future turn"
- **Content**: Grid of dice (3 columns)
- **Selection**: Click to select (cyan highlight)
- **Buttons**: "Skip" (ghost) / "Confirm" (cyan glow)

### Swap Banner
- **Type**: Quick banner at top center
- **Message**: "Swap in stored {die}?"
- **Style**: Black background, cyan border, shadow
- **Buttons**: "Skip" (ghost) / "Use" (cyan glow)
- **Animation**: Slide in from top

### Swap Prompt
- **Type**: Full dialog modal
- **Title**: "Time Bank"
- **Stored Die Display**: Cyan box showing stored die icon (large)
- **Instructions**: "Select a die to replace with your stored die"
- **Content**: Grid of current dice (3 columns)
- **Selection**: Click to select (cyan highlight)
- **Buttons**: "Skip" (ghost) / "Confirm" (cyan glow)

### Stored Die Chip
- **Location**: Next to character name on card
- **Style**: Purple badge (`bg-purple-700/90 border-purple-500`)
- **Content**: Die icon emoji
- **Size**: Small (text-xs)
- **Visibility**: Only in detail view, only when die is stored

### Toast Notifications
- **Store New**: `"Time Bank: Stored {die}"`
- **Replace**: `"Time Bank: Replaced with {die}"`
- **Swap**: `"Time Bank: Swapped {old} → {new}"`

### Game Log
- **Store**: `"{Player} stored {die} for later (Time Bank)"`
- **Replace**: `"{Player} replaced stored die with {die} (Time Bank)"`
- **Swap**: `"{Player} swapped {old} with stored {new} (Time Bank)"`

## Strategic Implications

### When to Store
1. **Save a key result**: Store a ⚔️ for future combat
2. **Preserve energy**: Store ⚡ to ensure energy gain next turn
3. **Bank healing**: Store ❤️ for emergency healing
4. **Lock in numbers**: Store 1/2/3 for VP combos

### When to Swap
1. **Fix bad rolls**: Replace unwanted die with stored good result
2. **Complete sets**: Swap to complete number sets for VP
3. **Emergency healing**: Swap in stored ❤️ when low HP
4. **Combat setup**: Swap in stored ⚔️ for unexpected attack opportunity

### Strategic Depth
- **Planning ahead**: Think 1-2 turns ahead about what you'll need
- **Flexibility**: Stored die can be used any turn, not just next turn
- **Risk/reward**: Use stored die now or save for better opportunity?
- **Adaptation**: Swap in stored die to adapt to changing game state

## Bot Strategy

### Store Decision (Bot)
- Randomly selects from kept dice
- No strategic preference (equal probability)
- Future enhancement: prioritize swords/energy

### Swap Decision (Bot)
- Always swaps if has stored die
- Randomly replaces one current die
- Future enhancement: smart replacement (e.g., replace number with sword)

## Testing Scenarios

### Basic Store Flow
1. Select Quantum Terrapin
2. Play through turn, keep some dice
3. Click "End Turn"
4. **Expected**: Storage prompt appears
5. Select a die (e.g., ⚔️)
6. Click "Confirm"
7. **Expected**: 
   - Toast: "Time Bank: Stored ⚔️"
   - Purple badge appears on character card
   - Turn ends

### Basic Swap Flow
1. Have a stored die from previous turn
2. Start new turn, roll dice
3. **Expected**: Banner appears "Swap in stored ⚔️?"
4. Click "Use"
5. **Expected**: Swap dialog opens showing stored die
6. Select a die to replace
7. Click "Confirm"
8. **Expected**:
   - Toast: "Time Bank: Swapped {old} → ⚔️"
   - Badge disappears
   - Die replaced in your hand

### Skip Store
1. At end of turn with dice, storage prompt shown
2. Click "Skip"
3. **Expected**: Turn ends, no die stored, ability still ready

### Skip Swap
1. Have stored die, banner appears after roll
2. Click "Skip"
3. **Expected**: Banner closes, stored die remains (badge visible)

### Replace Stored Die
1. Have stored ⚔️ from previous turn
2. End current turn with new dice
3. Storage prompt appears
4. Store ⚡
5. **Expected**: Log shows "replaced stored die", badge shows ⚡

### Bot Auto-Store
1. Play against bot with Quantum Terrapin
2. Bot's turn, they keep dice
3. **Expected**: Log shows bot stored a die (no prompt)
4. Bot's card shows purple badge with stored die

### Bot Auto-Swap
1. Bot has stored die
2. Bot's turn, they roll
3. **Expected**: Log shows bot swapped die (no banner)
4. Badge disappears from bot's card

### Stored Die Persists Multiple Turns
1. Store a die
2. Next turn: skip swap
3. Next turn: skip swap again
4. Next turn: use swap
5. **Expected**: Stored die available all 3 turns

### Multiple Storage/Swap Cycles
1. Turn 1: Store ⚔️
2. Turn 2: Swap ⚔️
3. Turn 2 end: Store ❤️
4. Turn 3: Swap ❤️
5. Turn 3 end: Store ⚡
6. **Expected**: Can repeatedly store and swap across turns

## Summary

The Time Bank ability is fully implemented with:
- ✅ End-of-turn storage prompt (human & bot)
- ✅ Before-reroll swap banner (human & bot)
- ✅ Storage dialog UI (select die to store)
- ✅ Swap dialog UI (show stored die, select die to replace)
- ✅ Stored die chip display on character card
- ✅ Ability state management (ready → spent → ready)
- ✅ Toast notifications and game logs
- ✅ Edge case handling (no dice, replace, skip, etc.)
- ✅ Bot auto-store and auto-swap
- ✅ Stored die persistence across turns
- ✅ Max 1 stored die enforcement
- ✅ Proper timing (before any reroll)
- ✅ Turn end with storage ability integration

The ability provides significant strategic depth by allowing players to "bank" favorable results for future turns, enabling better planning and adaptability in the chaotic dice game.
