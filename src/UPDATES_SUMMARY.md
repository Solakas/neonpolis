# NeonPolis Updates Summary

## Changes Made

### 1. Bot Ability Modal Fix
**File**: `/components/Arena.tsx`

Fixed an issue where ability prompts (modal dialogs) were being shown for bot players, causing the game to hang waiting for user input.

**Change**: Added `!currentPlayer.isBot` check to the Misty Grapple ability prompt condition (line 218).

**Before**:
```typescript
if (currentCharacter.ability.id === 'misty_grapple' && 
    currentPlayer.abilityState === 'ready' &&
    dice.length >= 2) {
```

**After**:
```typescript
if (currentCharacter.ability.id === 'misty_grapple' && 
    currentPlayer.abilityState === 'ready' &&
    dice.length >= 2 &&
    !currentPlayer.isBot) { // Only show prompt for human players
```

**Impact**: 
- Human players still see ability prompts and can make decisions
- Bot players no longer see prompts and the game continues automatically
- Prevents game from hanging when bots have interactive abilities

### 2. Stoneplate Badge Text Update
**File**: `/components/CharacterCard.tsx`

Changed the Stoneplate protection badge text from "🛡️ −1 Stoneplate" to "🛡️ -1 Damage" for clearer communication of the effect.

**Before**: `🛡️ −1 Stoneplate`  
**After**: `🛡️ -1 Damage`

### 3. Bot Character Abilities Documentation
**File**: `/lib/botAI.ts`

Added documentation explaining that character abilities (Overcharge, Stoneplate) work automatically for bots:

```typescript
/**
 * NeonPolis Bot AI
 * 
 * NOTE: Character abilities like Overcharge (Ion Wyrm) and Stoneplate (Basalt Colossus)
 * trigger automatically based on game state. Bots don't need decision logic for these
 * passive/reactive abilities - they work the same for both human players and bots.
 */
```

#### How Bot Abilities Work:

**Ion Wyrm (Overcharge)**:
- Ability arms at start of bot's turn automatically
- When bot gains energy from dice, +1 bonus is automatically applied
- Ability marks as spent automatically
- No bot decision-making needed - fully automatic

**Basalt Colossus (Stoneplate)**:
- Ability arms at start of bot's turn automatically
- When bot takes damage, reduction is automatically applied
- Ability marks as spent automatically
- No bot decision-making needed - fully automatic

**Why This Works**:
The ability system in Arena.tsx checks the current player's character and ability state during game events (energy gain, damage taken). Since these checks use `currentPlayer` which can be either human or bot, the abilities trigger identically for both.

### 4. Victory Points Win Condition
**File**: `/components/Arena.tsx`

Changed the win condition from 10 VP to 20 VP throughout the game.

#### Changes Made:

1. **Dice Resolution VP Cap** (line 263):
   - Before: `const newVp = Math.min(p.vp + vpEarned, 10); // Cap at 10`
   - After: `const newVp = Math.min(p.vp + vpEarned, 20); // Cap at 20`

2. **Dice Resolution Win Check** (line 266):
   - Before: `if (newVp >= 10)`
   - After: `if (newVp >= 20)`

3. **Dice Resolution Win Message** (line 269):
   - Before: `${p.name} has reached 10 VP and wins the game!`
   - After: `${p.name} has reached 20 VP and wins the game!`

4. **Neonpolis Start Bonus VP Cap** (line 540):
   - Before: `const newVp = Math.min(p.vp + 2, 10);`
   - After: `const newVp = Math.min(p.vp + 2, 20);`

5. **Neonpolis Start Bonus Win Check** (line 545):
   - Before: `if (newVp >= 10)`
   - After: `if (newVp >= 20)`

6. **Neonpolis Start Bonus Win Message** (line 548):
   - Before: `${p.name} has reached 10 VP and wins the game!`
   - After: `${p.name} has reached 20 VP and wins the game!`

7. **Enter Neonpolis VP Cap** (line 444):
   - Before: `return { ...p, inCenter: true, vp: Math.min(p.vp + 1, 10) };`
   - After: `return { ...p, inCenter: true, vp: Math.min(p.vp + 1, 20) };`

## Impact

### Gameplay Changes:
- **Longer Games**: Matches will now last approximately twice as long, allowing for more strategic depth
- **More Card Purchases**: Players have more time to buy and utilize shop cards
- **More Ability Triggers**: Character abilities will trigger more times per game
- **More Comebacks**: The longer game duration creates more opportunities for players to recover from early setbacks

### Balance Considerations:
- The +2 VP Neonpolis bonus becomes even more valuable (10% of total VP per turn in center)
- VP-earning number sets remain balanced relative to the new cap
- Cards that grant VP bonuses retain their relative value

## Testing Checklist

### Bot Ability Modal:
- [ ] Human player with Misty Grapple sees ability prompt
- [ ] Bot with Misty Grapple does NOT see prompt (game continues automatically)
- [ ] Game doesn't hang when bot has interactive ability
- [ ] Human can still use/skip interactive abilities

### Stoneplate Badge:
- [x] Badge text shows "-1 Damage" instead of "−1 Stoneplate"
- [x] Badge still displays correctly with shield emoji
- [x] Badge still has pulse animation

### Bot Abilities:
- [ ] Bot with Ion Wyrm gains +1 energy bonus automatically
- [ ] Bot with Basalt Colossus gets damage reduction automatically
- [ ] Bot ability states cycle correctly (armed → spent → armed)
- [ ] Bot ability indicators show correct state

### VP Win Condition:
- [ ] Game continues past 10 VP
- [ ] First player to reach 20 VP wins
- [ ] Win message says "reached 20 VP"
- [ ] VP counter displays correctly up to 20
- [ ] VP cannot exceed 20 (capped)
- [ ] Winning screen triggers at 20 VP
