# Ion Wyrm — Overcharge Implementation

## Overview
Implemented the Ion Wyrm's "Overcharge" ability that grants +1 bonus Energy the first time the player gains Energy each turn.

## Ability Details
- **Character**: Ion Wyrm
- **Ability Name**: Overcharge
- **Description**: "The next time you gain Energy this turn, gain +1 additional Energy."
- **Timing**: `next_time_gain_energy`

## Implementation

### Files Modified
1. `/components/Arena.tsx`
   - Added `applyOvercharge()` utility function (lines 184-194)
   - Modified `handleResolve()` to apply overcharge bonus (lines 252-254)
   - Updated player state to mark ability as 'spent' when triggered (line 279)
   - Enhanced energy gain toast notification to show overcharge trigger (lines 290-297)

### Key Features
1. **Automatic Arming**: Ability automatically becomes 'armed' at the start of each turn (already configured in `abilitySystem.ts`)

2. **Energy Gain Detection**: The `applyOvercharge()` function checks:
   - If energy gain > 0
   - If current player is Ion Wyrm
   - If ability state is 'armed'

3. **Bonus Application**: When triggered:
   - Adds +1 to energy gain
   - Marks ability as 'spent'
   - Shows special toast notification: "Overcharge +1 ⚡"

4. **Edge Cases Handled**:
   - ✅ If net gain is 0, no trigger (check: `energyGain <= 0`)
   - ✅ Only triggers once per turn (state: armed → spent)
   - ✅ Simultaneous gains count as one event (all dice energy calculated together)

### Flow Example
```
Turn Start → Ability: armed (●)
↓
Roll dice → Get 2 ⚡ faces
↓
Resolve → applyOvercharge(2)
  - Base energy: 2
  - Overcharge bonus: +1
  - Final energy: 3 ⚡
  - Ability: armed → spent (✓)
↓
Toast: "+3 ⚡ Energy" with description "Overcharge +1 ⚡"
Log: "Ion Wyrm gained 3 ⚡ Energy (Overcharge +1 ⚡)"
↓
Next Turn → Ability resets to armed (●)
```

### Future Enhancement Opportunities
If you want to support Overcharge for card-based or effect-based energy gains:
1. Create a centralized `gainEnergy(playerId, amount, source)` function
2. Apply overcharge in that function instead of in `handleResolve`
3. All energy gains throughout the game would automatically benefit from overcharge

### Testing Checklist
- [ ] Select Ion Wyrm as character
- [ ] Start turn - verify ability shows as Armed (●)
- [ ] Roll and keep some energy dice
- [ ] Resolve - verify gained energy = dice count + 1
- [ ] Verify toast shows "Overcharge +1 ⚡"
- [ ] Verify ability shows as Spent (✓)
- [ ] End turn and start new turn - verify ability resets to Armed (●)
- [ ] Roll 0 energy - verify overcharge doesn't trigger
- [ ] Verify works correctly for both human player and bots
