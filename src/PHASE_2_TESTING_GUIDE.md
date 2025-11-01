# Phase 2 Card Testing Guide - Interactive KEEP Cards

Phase 2 adds 6 interactive KEEP cards that require player decisions through prompts. This guide shows you how to test each card.

## Cards Implemented in Phase 2

### 1. K003 - Black Market (Once/Turn)
**Cost:** 2⚡ | **Type:** KEEP | **Timing:** BUY_PHASE

**Effect:** Once per turn, pay 1 HP to peek at the top 3 cards of the deck. You may buy one of them with a -1⚡ discount (minimum 0⚡).

**How to Test:**
1. Buy Black Market (K003) from the shop for 2⚡
2. On a subsequent turn during the shop phase, you'll see a "🎴 Use Black Market" button above the shop cards
3. Click it (costs 1 HP, disabled if you have ≤1 HP)
4. A dialog appears showing 3 cards from the deck
5. Select one to purchase it with -1⚡ discount, or cancel
6. The button disappears until your next turn (once-per-turn limit)

**Expected Behavior:**
- Button only appears during shop phase on your turn
- Costs 1 HP when clicked
- Shows 3 random cards from the deck (not currently in shop)
- Discount applies: 3⚡ card costs 2⚡, 2⚡ card costs 1⚡, 1⚡ card costs 0⚡
- Toast notification: "Black Market: [Card Name] purchased!"
- Game log: "[Player] used Black Market! Bought [Card] for X⚡ (-1⚡ discount)"

---

### 2. K011 - Antibodies (Once/Turn)
**Cost:** 1⚡ | **Type:** KEEP | **Timing:** RESOLVE_HEARTS

**Effect:** Once per turn during heart resolution, you may heal +1 extra HP.

**How to Test:**
1. Buy Antibodies (K011) from the shop for 1⚡
2. On your next turn, roll dice and keep some hearts (❤️)
3. After final roll, click "Resolve"
4. **Before hearts are applied**, a dialog appears asking if you want to use Antibodies
5. Click "Use Antibodies" to heal +1 extra HP, or "Skip" to decline
6. Hearts are then applied with the bonus

**Expected Behavior:**
- Prompt only appears if you have ❤️ faces and are outside the center
- Shows how many hearts you rolled
- Shows total healing: "Will heal X + 1 = Y HP"
- If used, healing applies immediately
- Toast notification: "+X ❤️ HP (Antibodies +1!)"
- Game log: "[Player] healed X ❤️ HP (Y from dice, +1 Antibodies)"
- Only triggers once per turn (won't prompt again if you somehow heal multiple times)

---

### 3. K012 - Telekinetic Grip (Once/Turn)
**Cost:** 2⚡ | **Type:** KEEP | **Timing:** AFTER_FINAL_ROLL

**Effect:** Once per turn after your final roll, set 1 die to ⚡ or ⚔️.

**How to Test:**
1. Buy Telekinetic Grip (K012) from the shop for 2⚡
2. On your next turn, roll dice until your 3rd/final roll
3. **Immediately after the final roll**, a dialog appears showing all your dice
4. Click a die to select it
5. Choose either ⚡ Energy or ⚔️ Sword
6. Click "Apply" to change the die, or "Skip" to decline

**Expected Behavior:**
- Prompt appears right after final roll, **before** any ability prompts
- Shows all your current dice faces
- Selected die highlights in magenta
- Must select both a die AND a new face to enable "Apply" button
- Die changes to chosen face immediately
- Toast notification: "Telekinetic Grip: [old face] → [new face]"
- Game log: "[Player] used Telekinetic Grip! Changed [old] to [new]"
- Only triggers once per turn

---

### 4. K017 - Mine Hunter (Once/Turn)
**Cost:** 1⚡ | **Type:** KEEP | **Timing:** AFTER_FINAL_ROLL

**Effect:** Once per turn after your final roll, you may reroll 1 die.

**How to Test:**
1. Buy Mine Hunter (K017) from the shop for 1⚡
2. On your next turn, roll dice until your 3rd/final roll
3. **If you also have K012, the K017 prompt appears first**
4. A dialog appears showing all your dice
5. Click a die to select it
6. Click "Reroll" to reroll it, or "Skip" to decline

**Expected Behavior:**
- Prompt appears right after final roll
- If you have both K012 and K017, K017 prompt shows first
- Shows all your current dice faces
- Selected die highlights in magenta
- Die rerolls to a random face (1, 2, 3, ⚔️, ⚡, ❤️)
- Toast notification: "Mine Hunter: [old face] → [new face]"
- Game log: "[Player] used Mine Hunter! Rerolled [old] → [new]"
- Only triggers once per turn

---

### 5. K019 - Turn of Fate (Once/Turn)
**Cost:** 3⚡ | **Type:** KEEP | **Timing:** DAMAGE_TAKEN

**Effect:** Once per turn when you would take damage, you may prevent 1 damage and choose an opponent to lose 1 HP.

**How to Test:**
1. Buy Turn of Fate (K019) from the shop for 3⚡
2. Wait for an opponent to attack you with swords (or have another player attack you)
3. When you take damage, a dialog appears showing all opponents
4. Select an opponent to deal 1 damage to them
5. Click "Confirm" to use the ability, or "Skip" to decline

**Expected Behavior:**
- Prompt appears when you take damage (before damage is applied)
- Shows list of all opponents with their current HP
- 1 damage is automatically prevented from the incoming attack
- Selected opponent takes 1 HP damage
- Toast notification: "Turn of Fate: [opponent] takes 1 damage"
- Game log: "[Player] used Turn of Fate! Prevented 1 damage and dealt 1 to [opponent]"
- Only triggers once per turn
- **For bots:** Auto-uses and deals 1 damage to a random opponent

---

### 6. K024 - Market Recycle (Once/Turn)
**Cost:** 1⚡ | **Type:** KEEP | **Timing:** BUY_PHASE

**Effect:** Once per turn, pay 1⚡ to replace one of the 3 shop cards with a new random card from the deck.

**How to Test:**
1. Buy Market Recycle (K024) from the shop for 1⚡
2. On a subsequent turn during the shop phase, you'll see a "🔄 Use Market Recycle" button above the shop cards
3. Click it (costs 1⚡, disabled if you have 0⚡)
4. A dialog appears showing the current 3 shop cards
5. Click a card to select which one to replace
6. Click "Replace (1⚡)" to replace it with a new random card, or "Cancel"
7. The button disappears until your next turn (once-per-turn limit)

**Expected Behavior:**
- Button only appears during shop phase on your turn
- Costs 1⚡ when clicked
- Shows current 3 shop cards with their costs and effects
- Selected card highlights in magenta
- Card is replaced with a new random card from the deck
- Toast notification: "Market Recycle: Shop refreshed!"
- Game log: "[Player] used Market Recycle! Replaced a shop card for 1⚡"
- Shop updates immediately with the new card

---

## Testing Checklist

### K003 - Black Market
- [ ] Button appears in shop phase after purchasing K003
- [ ] Button costs 1 HP (disabled at 1 HP)
- [ ] Shows 3 cards from deck (not in shop)
- [ ] -1⚡ discount applies correctly
- [ ] Card is added to purchased cards
- [ ] Energy is deducted correctly
- [ ] Button disappears until next turn
- [ ] Toast and log messages appear

### K011 - Antibodies
- [ ] Prompt appears after final roll if hearts are kept
- [ ] Shows correct number of hearts rolled
- [ ] +1 healing applies correctly
- [ ] Prompt doesn't appear if in center (can't heal)
- [ ] Only triggers once per turn
- [ ] Toast and log messages appear

### K012 - Telekinetic Grip
- [ ] Prompt appears immediately after final roll
- [ ] Shows all current dice
- [ ] Can select a die and choose ⚡ or ⚔️
- [ ] Die changes to selected face
- [ ] Only triggers once per turn
- [ ] Toast and log messages appear

### K017 - Mine Hunter
- [ ] Prompt appears immediately after final roll
- [ ] Shows all current dice
- [ ] Can select a die to reroll
- [ ] Die rerolls to random face
- [ ] Only triggers once per turn
- [ ] Toast and log messages appear

### K019 - Turn of Fate
- [ ] Prompt appears when taking damage
- [ ] Shows all opponents with HP
- [ ] Prevents 1 damage from incoming attack
- [ ] Deals 1 damage to selected opponent
- [ ] Only triggers once per turn
- [ ] Toast and log messages appear
- [ ] Bots auto-use correctly

### K024 - Market Recycle
- [ ] Button appears in shop phase after purchasing K024
- [ ] Button costs 1⚡ (disabled at 0⚡)
- [ ] Shows current 3 shop cards
- [ ] Selected card is replaced with new card
- [ ] Button disappears until next turn
- [ ] Toast and log messages appear

---

## Bot Behavior

**K003 Black Market:** Not implemented for bots (too complex)
**K011 Antibodies:** Bots auto-use if they have hearts
**K012 Telekinetic Grip:** Not implemented for bots (strategic decision)
**K017 Mine Hunter:** Not implemented for bots (strategic decision)
**K019 Turn of Fate:** Bots auto-use and deal 1 damage to random opponent
**K024 Market Recycle:** Not implemented for bots (strategic decision)

---

## Integration Points

All Phase 2 cards are integrated into Arena.tsx:
- **K012 & K017:** Check in `handleDiceRolled()` after final roll
- **K011:** Check in `executeResolve()` before heart healing
- **K019:** Check in `dealDamage()` when damage is dealt
- **K003 & K024:** Buttons rendered in ArenaBoard shop section

All prompts use the `CardEffectPrompt` component with appropriate data passed via `cardEffectPrompt` state.
