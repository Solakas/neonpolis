# Time Bank Ability Enhancements

## Changes Implemented

### 1. CTA Button in Roll Phase

**Location**: DiceRoller component

**What it does**:
- Added a "Swap {die}" button that appears during the roll phase
- Only shows when:
  - Character is Quantum Terrapin
  - Player has a stored die
  - Player has rolled at least once (dice.length > 0)
  - Not currently rolling
  - In roll phase

**Button Style**:
- Purple background (`bg-purple-600 hover:bg-purple-700`)
- Purple border (`border-purple-500`)
- Shows die icon from stored die
- Positioned alongside other action buttons (Reroll/Early Resolve)

**Behavior**:
- Clicking the button immediately opens the Time Bank swap dialog
- Player can swap their stored die at ANY time during rolling (not just after final roll)
- No banner prompt - direct access to swap functionality

### 2. Interactive Dice Selection States

**Location**: AbilityPrompt component

**What it does**:
- Dice in ability modals now have clear interaction states
- Added toggle behavior for selection

**States**:

1. **Resting (Unselected)**:
   - Border: `border-border`
   - Hover: `hover:border-neon-cyan/50`
   - No special effects

2. **Selected**:
   - Border: `border-neon-cyan`
   - Background: `bg-neon-cyan/10`
   - Shadow: `shadow-[0_0_15px_rgba(0,229,255,0.4)]` (cyan glow)
   - Visual feedback shows clearly which die is selected

**Interaction Behavior**:
- **Click unselected die**: Selects it
- **Click selected die**: Deselects it (clears selection)
- **Click different die**: Switches selection to that die
- Works for both Time Bank abilities (store & swap)

**Technical Implementation**:
```tsx
onClick={() => setSelectedTarget(selectedTarget === die.id ? null : die.id)}
```

This toggle logic allows:
- `selectedTarget === die.id ? null : die.id`
- If clicking the currently selected die, set to null (deselect)
- If clicking a different die, set to that die's id (select it)

### Files Modified

1. **`/components/DiceRoller.tsx`**
   - Added props: `characterId`, `storedDie`, `onTimeBankSwap`
   - Added `canUseTimeBank` condition
   - Added Time Bank button in action buttons section
   - Button shows die icon and triggers swap dialog

2. **`/components/Arena.tsx`**
   - Added `handleTimeBankSwap()` function
   - Passes `characterId`, `storedDie`, and `onTimeBankSwap` to both DiceRoller instances (human & bot)
   - Handler opens Time Bank swap dialog with current dice

3. **`/components/AbilityPrompt.tsx`**
   - Updated `time_bank_store` dice selection with toggle behavior
   - Updated `time_bank_swap` dice selection with toggle behavior
   - Added cyan glow shadow to selected dice for better visual feedback

## User Experience Flow

### Before (Old Flow):
1. Player rolls dice (up to 3 times)
2. After final roll, banner auto-appears: "Swap in stored die?"
3. Click "Use" to open swap dialog
4. Select die to replace
5. Confirm swap

### After (New Flow):
1. Player rolls dice
2. **NEW**: Purple "Swap {die}" button appears alongside roll buttons
3. Player can click it **at any time** during rolling
4. Swap dialog opens immediately (no banner)
5. **NEW**: Click dice to select/deselect with visual feedback
6. Selected die glows cyan
7. Can click again to deselect and choose a different die
8. Confirm swap

### Benefits:
- **More control**: Swap at any time, not forced to wait until final roll
- **Better feedback**: Clear visual states show what's selected
- **More flexible**: Can change your mind and pick a different die
- **Faster**: Direct button access, no banner step needed
- **Strategic**: Swap early if you get a good roll on roll 1 or 2

## Strategic Implications

### Before:
- Had to finish all 3 rolls to swap
- Swap timing was fixed (after final roll)
- Less flexible strategy

### After:
- Can swap immediately after roll 1 if desired
- Can swap after roll 2 to see what you get before final roll
- More strategic decision-making:
  - "Do I swap now or keep rolling?"
  - "If I swap this bad die now, I might reroll the stored die next turn"
  - "I got exactly what I need on roll 2, let me swap now and resolve early"

## Visual Design

### Time Bank Button:
```tsx
<Button
  onClick={onTimeBankSwap}
  className="flex-1 bg-purple-600 hover:bg-purple-700 border-purple-500"
  size="sm"
  variant="outline"
>
  Swap {diceIcons[storedDie!]}
</Button>
```

### Selected Die Glow:
```tsx
className={`p-4 rounded-lg border-2 transition-all ${
  die.id === selectedTarget
    ? 'border-neon-cyan bg-neon-cyan/10 shadow-[0_0_15px_rgba(0,229,255,0.4)]'
    : 'border-border hover:border-neon-cyan/50'
}`}
```

## Testing Scenarios

### Test 1: Swap Button Appears
1. Select Quantum Terrapin
2. Store a die at end of turn
3. Next turn, roll dice
4. **Expected**: Purple "Swap {die}" button appears

### Test 2: Immediate Swap
1. Have stored die
2. Roll dice (first roll)
3. Click "Swap {die}" button
4. **Expected**: Dialog opens immediately, no banner

### Test 3: Swap During Any Roll
1. Have stored die
2. Roll once → can swap
3. Reroll → can still swap
4. **Expected**: Button available throughout roll phase

### Test 4: Dice Selection Toggle
1. Open any ability dialog with dice (Time Bank store/swap)
2. Click a die → **Expected**: Die glows cyan
3. Click same die again → **Expected**: Glow disappears (deselected)
4. Click different die → **Expected**: First die deselects, new die selects

### Test 5: Visual Feedback
1. Open Time Bank swap dialog
2. Click different dice
3. **Expected**: Only one die glows at a time
4. **Expected**: Cyan glow effect visible on selected die
5. **Expected**: Hover states work on unselected dice

## Implementation Notes

- Button only shows for human players (bots auto-swap)
- Button respects all Time Bank conditions (character, stored die, etc.)
- Selection state persists until dialog closed or confirmed
- Glow effect uses same cyan color as game theme
- Toggle behavior is intuitive and follows standard UI patterns

## Summary

These enhancements make the Time Bank ability more accessible and user-friendly:
1. **Direct access** via CTA button eliminates waiting for auto-banner
2. **Flexible timing** allows strategic swapping at any point
3. **Clear feedback** shows selection state with visual glow
4. **Better UX** with toggle selection (deselect/reselect)

The ability now feels more integrated into the roll phase and gives players more agency over when and how they use their stored die.
