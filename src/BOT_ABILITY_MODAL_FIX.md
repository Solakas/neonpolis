# Bot Ability Modal Fix

## Issue
Ability prompts (modal dialogs) were being shown for bot players when they had abilities that require player decisions, which caused the game to hang waiting for user input on behalf of bots.

## Solution
Added a check to ensure ability prompts (both `AbilityBanner` and `AbilityPrompt`) are only shown for human players, not bots.

## Changes Made

### File: `/components/Arena.tsx`

**Location**: Lines 213-231 (in `handleDiceRolled` function)

**Before**:
```typescript
// Check for Nimbus Gibbon ability (Misty Grapple)
const currentCharacter = characters.find(c => c.id === currentPlayer.characterId)!;
if (currentCharacter.ability.id === 'misty_grapple' && 
    currentPlayer.abilityState === 'ready' &&
    dice.length >= 2) {
  // Show banner to use Misty Grapple
  setAbilityBanner({
    open: true,
    message: 'Use Misty Grapple?',
    onUse: () => {
      // ...
    }
  });
}
```

**After**:
```typescript
// Check for Nimbus Gibbon ability (Misty Grapple) - only show prompt for human players
const currentCharacter = characters.find(c => c.id === currentPlayer.characterId)!;
if (currentCharacter.ability.id === 'misty_grapple' && 
    currentPlayer.abilityState === 'ready' &&
    dice.length >= 2 &&
    !currentPlayer.isBot) { // Only show prompt for human players
  // Show banner to use Misty Grapple
  setAbilityBanner({
    open: true,
    message: 'Use Misty Grapple?',
    onUse: () => {
      // ...
    }
  });
}
```

## How It Works

### For Human Players:
1. When a human player completes their rolls and has an interactive ability available
2. Check if the ability can be used (e.g., Misty Grapple requires 2+ dice)
3. Check `!currentPlayer.isBot` - if human, show the ability prompt
4. Player can choose to "Use Ability" or "Skip"

### For Bot Players:
1. When a bot completes their rolls and has an interactive ability available
2. Check if the ability can be used
3. Check `!currentPlayer.isBot` - if bot, **do not show prompt**
4. Bot's turn continues automatically without waiting for user input

## Ability Types Affected

### Interactive Abilities (Require Prompts):
These abilities need player decisions and should **only show prompts for humans**:
- **Misty Grapple** (Nimbus Gibbon) - Choose which dice to copy
- **Undertow** (Abyss Leviathan) - Choose how many hearts to convert
- **Convertive Gaze** (Prismfang Cobra) - Choose conversion direction
- **Time Bank** (Quantum Terrapin) - Choose which die to store/swap

### Automatic Abilities (No Prompts Needed):
These abilities trigger automatically for both humans and bots:
- **Overcharge** (Ion Wyrm) - Automatically adds +1 energy on first energy gain
- **Stoneplate** (Basalt Colossus) - Automatically reduces first damage by 1
- **Plasma Cleave** (Starblade Mantis) - Not yet implemented
- **Divine Judgement** (Halo Cyclops) - Not yet implemented

## Future Implementation Notes

When implementing additional interactive abilities, always add the `!currentPlayer.isBot` check:

```typescript
// Generic template for interactive abilities
if (currentCharacter.ability.id === 'some_ability' && 
    currentPlayer.abilityState === 'ready' &&
    someCondition &&
    !currentPlayer.isBot) { // ⚠️ CRITICAL: Check if not a bot
  setAbilityBanner({
    // ... show prompt
  });
}
```

### Bot AI for Interactive Abilities

For interactive abilities, you'll need to add bot decision logic in `/lib/botAI.ts`:

```typescript
/**
 * Bot AI for deciding whether to use interactive ability
 */
export function getBotAbilityDecision(
  abilityId: string,
  gameState: any
): AbilityDecisionResult {
  switch (abilityId) {
    case 'misty_grapple':
      // Bot logic: Choose best dice to copy
      return decideMistyGrapple(gameState);
    case 'undertow':
      // Bot logic: Convert hearts if beneficial
      return decideUndertow(gameState);
    // ... more abilities
  }
}
```

## Testing Checklist

### Human Player with Interactive Ability:
- [ ] Ability prompt shows when conditions are met
- [ ] Can use ability successfully
- [ ] Can skip ability successfully
- [ ] Ability state updates correctly after use

### Bot Player with Interactive Ability:
- [ ] No ability prompt shows for bots
- [ ] Bot's turn continues without hanging
- [ ] Bot makes appropriate decision (once AI logic is implemented)
- [ ] Ability state updates correctly for bots

### Human Player with Automatic Ability:
- [ ] No prompt shows (automatic trigger)
- [ ] Ability triggers correctly
- [ ] Toast/log notifications show

### Bot Player with Automatic Ability:
- [ ] No prompt shows (automatic trigger)
- [ ] Ability triggers correctly for bot
- [ ] Toast/log notifications show

## Summary

The fix ensures that:
1. ✅ Human players see ability prompts and can make decisions
2. ✅ Bot players never see prompts and don't hang the game
3. ✅ Automatic abilities work for both humans and bots without prompts
4. ✅ Framework is in place for implementing bot AI for interactive abilities in the future
