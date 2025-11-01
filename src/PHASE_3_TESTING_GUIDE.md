# Phase 3 Card Testing Guide - Special KEEP Cards

Phase 3 adds 6 special KEEP cards with unique mechanics that affect gameplay in specific situations. This guide shows you how to test each card.

## Cards Implemented in Phase 3

### 1. K004 - Charge Depot (Passive)
**Cost:** 2⚡ | **Type:** KEEP | **Timing:** PASSIVE

**Effect:** You do not lose ⚡ from overflow or effects.

**How to Test:**
1. Buy Charge Depot (K004) from the shop for 2⚡
2. Face an opponent with **Prismfang Cobra** (Venom Siphon ability)
3. When the Cobra attacks you, normally you would lose 1⚡ in addition to taking damage
4. With Charge Depot, the ⚡ loss is prevented

**Expected Behavior:**
- When Venom Siphon triggers, you see: "Charge Depot: ⚡ protected!"
- Toast notification: "Charge Depot: ⚡ protected! Energy loss prevented"
- Game log: "[Player] protected ⚡ with Charge Depot!"
- Your energy remains unchanged
- You still take the damage from the attack

**Note:** Currently only protects against Venom Siphon. Future card effects that cause ⚡ loss will also be blocked.

---

### 2. K006 - Seismic Stride (On Enter Center)
**Cost:** 4⚡ | **Type:** KEEP | **Timing:** ON_ENTER_CENTER

**Effect:** When you enter the Center: all others lose 1 HP.

**How to Test:**
1. Buy Seismic Stride (K006) from the shop for 4⚡
2. Deal damage to the center occupant (or wait until center is empty)
3. Enter the center by dealing damage or when it's empty
4. All other players (including ones outside the center) immediately take 1 HP damage

**Expected Behavior:**
- When you enter center, all other players lose 1 HP
- Toast notification: "Seismic Stride! All opponents take 1 HP damage"
- Game log: "[Player] triggered Seismic Stride! All others take 1 HP damage"
- Damage applies to ALL other players, not just the previous occupant
- Players reduced to 0 HP are eliminated
- You still get +1 VP for entering center as normal

---

### 3. K010 - Field Med Unit (Passive)
**Cost:** 3⚡ | **Type:** KEEP | **Timing:** PASSIVE

**Effect:** You may heal from ❤️ while in Center (max +1/turn from dice).

**How to Test:**
1. Buy Field Med Unit (K010) from the shop for 3⚡
2. Enter the center (normally healing is disabled in center)
3. On your next turn, roll and keep hearts ❤️
4. Click Resolve - you will heal up to +1 HP even while in center

**Expected Behavior:**
- While in center WITHOUT K010: "cannot heal in the Center" message
- While in center WITH K010: You heal, but capped at +1 HP per turn
- If you have 2 hearts, you only heal +1 HP (not 2)
- If you use K011 Antibodies (+1 heal), the total is still capped at +1
- Toast notification: "+1 ❤️ HP Field Med Unit: healing in Center!"
- Game log: "[Player] healed 1 ❤️ HP in Center (X from dice, Field Med Unit (max +1))"
- After healing +1 HP this turn, subsequent hearts do nothing
- Cap resets at the start of your next turn

---

### 4. K015 - Core Anchor (On Leave Center)
**Cost:** 2⚡ | **Type:** KEEP | **Timing:** ON_LEAVE_CENTER

**Effect:** When you voluntarily leave the Center: gain +1 VP.

**How to Test:**
1. Buy Core Anchor (K015) from the shop for 2⚡
2. Enter the center
3. When attacked while in center, choose "Leave" from the modal
4. You gain +1 VP bonus in addition to the attacker gaining +1 VP for entering

**Expected Behavior:**
- When you VOLUNTARILY leave (choose "Leave" option): +1 VP bonus
- When you're FORCED out (choose "Stay" and lose HP to 0): NO bonus
- Toast notification: "Core Anchor: +1 ★ VP"
- Game log: "[Player] triggered Core Anchor! +1 ★ VP for leaving voluntarily"
- Works every time you voluntarily leave (no once-per-turn limit)
- Does NOT trigger if you're eliminated while in center

---

### 5. K016 - Explosive Entry (On Enter Center)
**Cost:** 3⚡ | **Type:** KEEP | **Timing:** ON_ENTER_CENTER

**Effect:** When you enter the Center: roll 1 extra die and apply only ⚔️/⚡.

**How to Test:**
1. Buy Explosive Entry (K016) from the shop for 3⚡
2. Deal damage to the center occupant or wait until center is empty
3. Enter the center
4. A bonus die is rolled (50% chance ⚔️, 50% chance ⚡)
5. If ⚡: You gain +1 energy immediately
6. If ⚔️: You deal 1 damage to a target (center occupant if exists, otherwise random)

**Expected Behavior:**
- Triggers when entering the center
- Rolls a bonus die (only ⚔️ or ⚡ possible)
- Toast notification: "Explosive Entry: [⚔️ or ⚡]!"
- If ⚡: Toast shows "+1 ⚡ Energy" and energy increases
- If ⚔️: Toast shows "Dealt 1 ⚔️ damage" and target takes damage
- Game log: "[Player] triggered Explosive Entry! Rolled bonus [⚔️/⚡]"
- Effect applies after entering (you're already in center when it triggers)
- Triggers every time you enter (no once-per-turn limit in current implementation)

**Note:** Currently triggers every time you enter. If you want once-per-entry behavior, it's tracked but resets aren't fully implemented yet.

---

### 6. K023 - Die Forging (After First Roll)
**Cost:** 3⚡ | **Type:** KEEP | **Timing:** AFTER_FIRST_ROLL

**Effect:** If you keep all dice after your 1st roll: gain +1 ⚡ and +1 VP.

**How to Test:**
1. Buy Die Forging (K023) from the shop for 3⚡
2. On your next turn, roll your first roll (you'll have 6 dice)
3. WITHOUT clicking any reroll, click "Resolve Dice" immediately
4. You trigger Die Forging and gain +1 ⚡ and +1 VP

**Expected Behavior:**
- Only triggers if you resolve after the FIRST roll (rollsRemaining === 2)
- If you reroll even once, it won't trigger
- Toast notification: "Die Forging! +1 ⚡ Energy and +1 ★ VP"
- Game log: "[Player] triggered Die Forging! Kept all dice after 1st roll"
- VP gain shows "+1 Die Forging" in the breakdown
- Energy gain shows "+1 Die Forging" in the breakdown
- Can only trigger once per turn
- Resets at the start of your next turn

**Common Mistakes:**
- ❌ Clicking any die to "keep" it - this doesn't affect Die Forging, you just need to resolve early
- ❌ Rerolling even once - this prevents Die Forging from triggering
- ✅ Roll once, then immediately click "Resolve Dice"

---

## Testing Checklist

### K004 - Charge Depot
- [ ] Prevents ⚡ loss from Venom Siphon
- [ ] Toast and log messages appear
- [ ] Energy remains unchanged when protected
- [ ] Still takes damage from the attack

### K006 - Seismic Stride
- [ ] All other players take 1 HP when you enter center
- [ ] Works every time you enter (not once-per-turn)
- [ ] Toast and log messages appear
- [ ] Players eliminated if reduced to 0 HP
- [ ] Still get +1 VP for entering as normal

### K010 - Field Med Unit
- [ ] Can heal in center (normally prohibited)
- [ ] Healing capped at +1 HP per turn from dice
- [ ] Works with multiple hearts (capped at +1 total)
- [ ] Works with K011 Antibodies (still capped at +1)
- [ ] Toast and log messages appear
- [ ] Cap resets at start of next turn

### K015 - Core Anchor
- [ ] +1 VP when voluntarily leaving center
- [ ] No bonus when forced out
- [ ] Works every time you voluntarily leave
- [ ] Toast and log messages appear
- [ ] Does NOT trigger on elimination

### K016 - Explosive Entry
- [ ] Rolls bonus die when entering center
- [ ] Die is either ⚔️ or ⚡ (50/50 chance)
- [ ] If ⚡: Gain +1 energy
- [ ] If ⚔️: Deal 1 damage to target
- [ ] Toast and log messages appear
- [ ] Triggers every time you enter

### K023 - Die Forging
- [ ] Triggers when resolving after 1st roll
- [ ] Does NOT trigger if you reroll
- [ ] Grants +1 ⚡ and +1 VP
- [ ] Toast and log messages appear
- [ ] Bonuses appear in resolution breakdown
- [ ] Only triggers once per turn
- [ ] Resets at start of next turn

---

## Integration Points

All Phase 3 cards are integrated into Arena.tsx:

**K004 Charge Depot:**
- Check in `dealDamage()` when Venom Siphon triggers
- Prevents energy loss if card is owned

**K006 Seismic Stride:**
- Check in `enterNeonpolis()` when player enters center
- Deals 1 HP damage to all other players

**K010 Field Med Unit:**
- Check in `executeResolve()` during healing calculation
- Allows healing in center with max +1/turn cap
- Tracked via `cardEffectState.fieldMedHealedThisTurn`

**K015 Core Anchor:**
- Check in `leaveNeonpolis()` when player leaves center
- Grants +1 VP if `voluntary` parameter is true
- Called with `voluntary: true` from LeaveNeonpolisModal when player chooses "Leave"

**K016 Explosive Entry:**
- Check in `enterNeonpolis()` when player enters center
- Rolls bonus die (⚔️ or ⚡)
- Applies effect immediately
- Tracked via `cardEffectState.explosiveEntryUsed`

**K023 Die Forging:**
- Check in `executeResolve()` at start of resolution
- Detects if `rollsRemaining === 2` (after first roll)
- Grants +1 ⚡ and +1 VP
- Tracked via `cardEffectState.dieForgingUsed`

---

## Bot Behavior

All Phase 3 cards work passively for bots:

**K004 Charge Depot:** ✅ Auto-protects bot's energy
**K006 Seismic Stride:** ✅ Auto-damages all others when bot enters
**K010 Field Med Unit:** ✅ Auto-heals bot in center (max +1/turn)
**K015 Core Anchor:** ✅ Auto-grants +1 VP when bot voluntarily leaves
**K016 Explosive Entry:** ✅ Auto-rolls bonus die when bot enters
**K023 Die Forging:** ✅ Auto-triggers if bot resolves after 1st roll (unlikely for bots)

---

## Card Interactions

**K010 + K011 (Field Med + Antibodies):**
- In center with both cards: Still capped at +1 HP per turn
- Outside center with both cards: Normal healing + Antibodies bonus

**K006 + K016 (Seismic Stride + Explosive Entry):**
- When entering center, BOTH trigger:
  1. Seismic Stride damages all others
  2. Explosive Entry rolls bonus die
- Both toast notifications appear

**K015 + Normal Entry Bonus:**
- When voluntarily leaving: Get +1 VP from Core Anchor
- Attacker still gets +1 VP for entering
- Total: +2 VP awarded (1 to you, 1 to attacker)

---

## Known Limitations

1. **K004 Charge Depot:** Currently only protects against Venom Siphon. Future overflow mechanics or other energy-loss effects will also be blocked.

2. **K016 Explosive Entry:** The `explosiveEntryUsed` flag is tracked but currently resets each turn. In future, this might be changed to once-per-entry-event.

3. **K023 Die Forging:** Bots rarely trigger this since bot AI tends to reroll for optimal results rather than resolving after 1st roll.

---

## Conclusion

Phase 3 cards add strategic depth through:
- **Defensive utility** (K004 protects energy)
- **Aggressive entry** (K006 damages all, K016 gets bonus)
- **Center healing** (K010 breaks the no-heal rule)
- **Strategic positioning** (K015 rewards voluntary departure)
- **High-risk/high-reward** (K023 rewards early commitment)

All cards work automatically during gameplay with proper toast notifications and game log integration!
