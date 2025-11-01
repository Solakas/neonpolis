# Basalt Colossus — Stoneplate Implementation

## Overview
Implemented the Basalt Colossus's "Stoneplate" ability that reduces the first damage taken each turn by 1.

## Ability Details
- **Character**: Basalt Colossus
- **Ability Name**: Stoneplate
- **Description**: "The next time you would take damage, reduce it by 1."
- **Timing**: `next_time_take_damage`

## Implementation

### Files Modified

#### 1. `/components/Arena.tsx`
**`dealDamage()` function (lines 402-437)**
- Added damage reduction logic with mini resolve stack
- Checks if target has Stoneplate ability armed
- Reduces final damage by 1 (minimum 0)
- Only triggers if damage ≥ 1 (edge case handling)
- Marks ability as 'spent' after use
- Enhanced logging and toast notifications

**`CharacterCard` render (line 772)**
- Added `stoneplateActive` prop to show visual badge when ability is armed

#### 2. `/components/CharacterCard.tsx`
**Interface (lines 18-30)**
- Added `stoneplateActive?: boolean` prop

**Component function (line 161)**
- Added `stoneplateActive = false` parameter

**Visual Badge (lines 197-206)**
- Added animated shield badge when Stoneplate is armed
- Shows "🛡️ −1 Stoneplate" with amber glow
- Positioned at top-left of character card
- Uses pulse animation to draw attention

### Key Features

#### 1. **Automatic Arming**
- Ability automatically becomes 'armed' at the start of each turn (configured in `abilitySystem.ts`)

#### 2. **Damage Resolution Stack**
The damage calculation follows this order:
```
Incoming Damage
    ↓
Future: Shields 🛡️ (not yet implemented)
    ↓
Stoneplate → reduce by 1 (if armed & damage ≥ 1)
    ↓
Future: Other Reductions
    ↓
Apply Final Damage
```

#### 3. **Smart Triggering**
```typescript
if (targetCharacter.ability.id === 'stoneplate' && 
    target.abilityState === 'armed' && 
    finalDamage >= 1) {
  finalDamage = Math.max(0, finalDamage - 1);
  stoneplateTriggered = true;
}
```

#### 4. **Edge Case: Zero Damage**
- If damage becomes 0 before Stoneplate can trigger, ability stays Armed
- Example: If shields reduce 2 damage to 0, Stoneplate doesn't consume
- Only consumes when it actually reduces damage ≥ 1

#### 5. **Visual Feedback**
- **Badge**: Animated shield badge "🛡️ −1 Stoneplate" appears on character card when armed
- **Toast**: Shows "Stoneplate −1 damage!" with damage reduction details
- **Log**: Records damage with notation "(X reduced by Stoneplate)"

### Flow Example

```
Turn Start → Ability: armed (●)
             Badge: "🛡️ −1 Stoneplate" visible
↓
Opponent attacks for 3 damage
↓
Damage Resolution:
  - Incoming: 3
  - Stoneplate check: armed ✓, damage ≥ 1 ✓
  - Reduce: 3 → 2
  - Ability: armed → spent (✓)
  - Badge: disappears
↓
Toast: "Stoneplate −1 damage!" (3 → 2 damage)
Log: "Basalt Colossus took 2 ⚔️ damage (3 reduced by Stoneplate)! (10 → 8 HP)"
↓
Next Turn → Ability resets to armed (●)
             Badge: "🛡️ −1 Stoneplate" reappears
```

### Edge Case Examples

#### Example 1: Normal Trigger
```
Incoming: 3 damage
Stoneplate: armed
Result: 2 damage, ability → spent
```

#### Example 2: 1 Damage (Minimum)
```
Incoming: 1 damage
Stoneplate: armed
Result: 0 damage, ability → spent
```

#### Example 3: Already Spent
```
Incoming: 2 damage
Stoneplate: spent (already used this turn)
Result: 2 damage, no reduction
```

#### Example 4: Future Shield Interaction
```
Incoming: 2 damage
Shield: reduces to 0
Stoneplate: armed (damage is 0, so no trigger)
Result: 0 damage, Stoneplate stays armed!
```

### Visual Design

The Stoneplate badge uses:
- **Color**: Amber (#d97706 background)
- **Border**: Amber (#f59e0b)
- **Icon**: 🛡️ shield emoji
- **Animation**: Pulse effect to draw attention
- **Position**: Top-left of character card
- **Z-index**: 10 (above other elements)

### Testing Checklist

- [ ] Select Basalt Colossus as character
- [ ] Start turn - verify badge shows "🛡️ −1 Stoneplate"
- [ ] Verify ability indicator shows Armed (●)
- [ ] Take 3 damage - verify reduced to 2
- [ ] Verify toast shows "Stoneplate −1 damage! (3 → 2)"
- [ ] Verify badge disappears after trigger
- [ ] Verify ability shows as Spent (✓)
- [ ] Take more damage same turn - verify no reduction
- [ ] End turn and start new turn
- [ ] Verify ability resets to Armed (●) and badge reappears
- [ ] Take 1 damage - verify reduced to 0
- [ ] Verify works for both human player and bots

### Future Enhancements

#### 1. Multiple Damage Reduction Sources
When implementing shields or other damage reduction:
```typescript
// Example future damage resolution
let finalDamage = baseDamage;

// 1. Apply shields first
finalDamage = applyShields(finalDamage, target);

// 2. Apply Stoneplate if damage > 0
if (finalDamage >= 1) {
  const { damage: afterStoneplate, triggered } = applyStoneplate(finalDamage, target);
  finalDamage = afterStoneplate;
}

// 3. Apply other reductions
finalDamage = applyOtherReductions(finalDamage, target);
```

#### 2. Stoneplate Upgrade Cards
Potential shop cards that interact with Stoneplate:
- "Reinforced Armor" - Stoneplate reduces by 2 instead of 1
- "Reactive Plating" - Stoneplate triggers twice per turn
- "Energy Shield" - When Stoneplate triggers, gain +1 ⚡

#### 3. Visual Enhancements
- Add particle effect when damage is reduced
- Show damage number with strikethrough animation
- Add shield breaking sound effect
