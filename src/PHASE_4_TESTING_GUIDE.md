# Phase 4 Card Testing Guide - Instant DISCARD Cards

Phase 4 adds 7 instant DISCARD cards that provide immediate effects when played and are then discarded from your hand. This guide shows you how to test each card.

## What are DISCARD Cards?

DISCARD cards are one-time use cards that:
- Appear in your hand after purchase (displayed in a separate "Your Instant Cards" section)
- Can be played at any time during your turn (some have phase restrictions)
- Have immediate effects when played
- Are automatically removed from your hand after use
- Cannot be used again (unlike KEEP cards which stay permanently)

---

## Cards Implemented in Phase 4

### 1. D001 - Overcharge
**Cost:** 2⚡ | **Type:** DISCARD | **Timing:** INSTANT

**Effect:** Immediate: +3 ⚡.

**How to Test:**
1. Buy Overcharge (D001) from the shop for 2⚡
2. Card appears in "Your Instant Cards" section
3. Click the "Play" button on the card
4. Immediately gain +3 ⚡ Energy
5. Card is removed from your hand

**Expected Behavior:**
- Toast notification: "Overcharge: +3 ⚡ Energy"
- Game log: "[Player] played Overcharge!"
- Game log: "[Player] gained 3 ⚡ from Overcharge"
- Energy increases by 3
- Card disappears from instant cards section
- Game log: "[Player] discarded Overcharge"

**Use Case:** Great for quickly gaining energy to buy expensive cards or use abilities.

---

### 2. D003 - Restoration
**Cost:** 2⚡ | **Type:** DISCARD | **Timing:** INSTANT

**Effect:** Heal +3 HP (even if you are in the Center).

**How to Test:**
1. Buy Restoration (D003) from the shop for 2⚡
2. Take some damage (from combat or abilities)
3. Click "Play" on Restoration card
4. Heal +3 HP (up to your max HP)
5. Works even if you're in the center!

**Expected Behavior:**
- Toast notification: "Restoration: +3 HP" (or less if you're near max HP)
- Game log: "[Player] played Restoration!"
- Game log: "[Player] healed X HP from Restoration (in Center)" if in center
- HP increases by up to 3
- Works even when in center (breaks normal healing rules)
- Card is discarded after use

**Use Case:** Emergency healing, especially valuable when in the center where normal healing is blocked.

---

### 3. D006 - Warehouse Plunder
**Cost:** 3⚡ | **Type:** DISCARD | **Timing:** INSTANT

**Effect:** Gain +X ⚡ (X = number of opponents, max 3).

**How to Test:**
1. Buy Warehouse Plunder (D006) from the shop for 3⚡
2. Click "Play" on the card
3. Gain energy equal to the number of active opponents (max 3)
4. With 3 opponents alive: +3 ⚡
5. With 2 opponents alive: +2 ⚡
6. With 1 opponent alive: +1 ⚡

**Expected Behavior:**
- Toast notification: "Warehouse Plunder: +X ⚡"
- Game log: "[Player] played Warehouse Plunder!"
- Game log: "[Player] gained X ⚡ from Warehouse Plunder (Y opponents)"
- Energy increases based on opponent count
- Max bonus is +3 ⚡ even if more than 3 opponents
- Card is discarded after use

**Use Case:** Best in 4-player games for maximum energy gain. Essentially breaks even or profits after playing.

---

### 4. D012 - Field Repairs
**Cost:** 2⚡ | **Type:** DISCARD | **Timing:** INSTANT

**Effect:** +2 HP; if you are outside, also gain +1 VP.

**How to Test:**
1. Buy Field Repairs (D012) from the shop for 2⚡
2. Make sure you're OUTSIDE the center
3. Click "Play" on the card
4. Heal +2 HP AND gain +1 ★ VP

**Test Variation - In Center:**
1. Buy Field Repairs while in the center
2. Play the card
3. Heal +2 HP but NO VP bonus

**Expected Behavior (Outside Center):**
- Toast notification: "Field Repairs: +2 HP and +1 ★ VP"
- Game log: "[Player] played Field Repairs!"
- Game log: "[Player] healed 2 HP and gained 1 ★ VP from Field Repairs"
- HP increases by 2
- VP increases by 1
- Card is discarded

**Expected Behavior (In Center):**
- Toast notification: "Field Repairs: +2 HP"
- Game log: "[Player] healed 2 HP from Field Repairs"
- HP increases by 2
- NO VP bonus
- Card is discarded

**Use Case:** Great outside the center for both healing and VP. Less valuable but still useful in center.

---

### 5. D015 - Galloping Time
**Cost:** 2⚡ | **Type:** DISCARD | **Timing:** INSTANT (Roll Phase Only)

**Effect:** +1 additional reroll this turn.

**How to Test:**
1. Buy Galloping Time (D015) from the shop for 2⚡
2. On your next turn, during the ROLL PHASE, click "Play"
3. You gain +1 extra reroll (4 total instead of 3)
4. The extra reroll is available immediately

**Test Error Case:**
1. Try to play Galloping Time during Shop Phase
2. You get error: "Can only play during roll phase!"
3. Card is NOT discarded (you can play it next turn)

**Expected Behavior:**
- Can only be played during roll phase
- Toast notification: "Galloping Time: +1 reroll!"
- Game log: "[Player] played Galloping Time!"
- Game log: "[Player] gained 1 extra reroll from Galloping Time"
- Rolls remaining increases by 1
- Card is discarded after successful play
- Extra reroll only lasts this turn

**Use Case:** Perfect for bad rolls when you need one more chance to get the faces you want.

---

### 6. D017 - Energy Pump
**Cost:** 4⚡ | **Type:** DISCARD | **Timing:** INSTANT

**Effect:** Immediate: +5 ⚡.

**How to Test:**
1. Buy Energy Pump (D017) from the shop for 4⚡
2. Click "Play" on the card
3. Immediately gain +5 ⚡ Energy
4. Net gain is +1 ⚡ after paying the cost

**Expected Behavior:**
- Toast notification: "Energy Pump: +5 ⚡ Energy"
- Game log: "[Player] played Energy Pump!"
- Game log: "[Player] gained 5 ⚡ from Energy Pump"
- Energy increases by 5
- Card is discarded

**Use Case:** Useful for converting future energy into immediate energy when you need it now. Essentially you pay 4⚡ to get 5⚡ back immediately.

---

### 7. D020 - Purgation
**Cost:** 2⚡ | **Type:** DISCARD | **Timing:** INSTANT

**Effect:** Remove all your negative tokens and heal +1 HP.

**How to Test:**
1. Get a negative token (e.g., Weakpoint from D018 if implemented)
2. Buy Purgation (D020) from the shop for 2⚡
3. Click "Play" on the card
4. All negative tokens are removed
5. Heal +1 HP

**Test Without Tokens:**
1. Buy and play Purgation without any tokens
2. You still heal +1 HP

**Expected Behavior (With Tokens):**
- Toast notification: "Purgation: +1 HP and removed tokens"
- Game log: "[Player] played Purgation!"
- Game log: "[Player] healed 1 HP and removed negative tokens from Purgation"
- All weakpoint tokens removed
- HP increases by 1
- Card is discarded

**Expected Behavior (Without Tokens):**
- Toast notification: "Purgation: +1 HP"
- Game log: "[Player] healed 1 HP and removed negative tokens from Purgation"
- HP increases by 1
- Card is discarded

**Use Case:** Cleanse negative effects while getting a small heal. More valuable when you have multiple negative tokens.

---

## Testing Checklist

### D001 - Overcharge
- [ ] Appears in instant cards section after purchase
- [ ] Play button works
- [ ] Grants +3 ⚡ Energy
- [ ] Toast and log messages appear
- [ ] Card is discarded after use

### D003 - Restoration
- [ ] Heals +3 HP (up to max)
- [ ] Works outside center
- [ ] Works INSIDE center (breaks normal rules)
- [ ] Toast and log messages appear
- [ ] Card is discarded after use

### D006 - Warehouse Plunder
- [ ] Grants energy based on opponent count
- [ ] Max +3 ⚡ with 3+ opponents
- [ ] Works with 1-2 opponents
- [ ] Toast shows correct energy amount
- [ ] Log shows opponent count
- [ ] Card is discarded after use

### D012 - Field Repairs
- [ ] Heals +2 HP in all cases
- [ ] Grants +1 VP when outside center
- [ ] Does NOT grant VP when in center
- [ ] Toast reflects correct bonuses
- [ ] Card is discarded after use

### D015 - Galloping Time
- [ ] Can be played during roll phase
- [ ] Cannot be played during shop phase
- [ ] Grants +1 extra reroll
- [ ] Reroll count increases visibly
- [ ] Card is discarded after successful play
- [ ] Card is NOT discarded if played at wrong time

### D017 - Energy Pump
- [ ] Grants +5 ⚡ Energy
- [ ] Toast and log messages appear
- [ ] Card is discarded after use

### D020 - Purgation
- [ ] Heals +1 HP
- [ ] Removes negative tokens (if present)
- [ ] Works without tokens
- [ ] Toast shows correct message
- [ ] Card is discarded after use

---

## UI Behavior

### Instant Cards Display
- **Location:** Appears between the dice roller and "End Turn" button during your turn
- **Header:** "Your Instant Cards (X)" in magenta neon
- **Card Layout:** Horizontal row of card boxes
- **Card Styling:** 
  - Magenta border with glow effect
  - Card name in top-left
  - Energy cost in top-right
  - Effect text in middle
  - "Play" button at bottom

### Play Button States
- **Enabled:** Normal magenta glow, clickable
- **Disabled:** Greyed out (only for D015 when not in roll phase)
- **After Click:** Card executes effect and disappears

---

## Bot Behavior

Bots will automatically play DISCARD cards based on simple heuristics:

| Card | Bot Play Condition |
|------|-------------------|
| **D001 Overcharge** | Energy < 3 |
| **D003 Restoration** | HP < Max HP - 2 |
| **D006 Warehouse Plunder** | Always (free energy!) |
| **D012 Field Repairs** | HP < Max HP - 1 |
| **D015 Galloping Time** | Never (bots don't play this during roll) |
| **D017 Energy Pump** | Energy < 5 |
| **D020 Purgation** | HP < Max HP (always heals) |

**Note:** Bots play DISCARD cards BEFORE shopping, so they may use the energy gained to buy cards in the same turn.

---

## Integration Points

All Phase 4 cards are integrated into Arena.tsx:

**Card Display:**
- Appears in new "Your Instant Cards" section
- Filters purchased cards to show only DISCARD type
- Displays during player's turn only
- Shows count of instant cards owned

**handlePlayDiscardCard Function:**
- Validates card ownership
- Validates card type (DISCARD only)
- Executes card-specific effects via switch statement
- Removes card from purchasedCards array
- Adds game log entries
- Shows toast notifications

**Bot Integration:**
- Bot checks for DISCARD cards at start of shop phase
- Applies simple heuristics to decide which cards to play
- Plays beneficial cards automatically
- Uses gained resources for shopping

---

## Card Strategy Tips

**D001 Overcharge vs D017 Energy Pump:**
- Overcharge: Better early game (2⚡ for +3⚡ = +1 net)
- Energy Pump: Better mid-game when you have 4⚡ to spare (4⚡ for +5⚡ = +1 net, same ratio but larger numbers)

**D003 Restoration vs D012 Field Repairs:**
- Restoration: Better when in center or need more healing (+3 HP)
- Field Repairs: Better when outside for VP bonus (+2 HP + 1 VP)

**D006 Warehouse Plunder:**
- Best value in 4-player games (+3⚡ for 3⚡ cost = break even + card effect)
- Less valuable in 2-player games (+1⚡ for 3⚡ cost = -2⚡ net)

**D015 Galloping Time:**
- Play early in roll phase before you've used all rerolls
- Wasted if played when you've already decided to keep all dice
- Combos well with K023 Die Forging (extra reroll lets you reroll without losing Die Forging bonus)

**D020 Purgation:**
- More valuable if you have multiple negative tokens
- Still decent for +1 HP even without tokens
- Cheap emergency heal

---

## Known Limitations

1. **D015 Galloping Time:** Currently only works during roll phase. Error message if played at wrong time, but card is NOT discarded.

2. **D020 Purgation:** Currently only removes weakpoint tokens. Future negative tokens will also be cleansed.

3. **Bot D015 Logic:** Bots don't play Galloping Time during roll phase (would require more complex roll phase bot AI).

4. **Card Animation:** Cards disappear immediately after playing. Future enhancement could add discard animation.

---

## Common Issues

**Issue:** "You do not own this card!" error
- **Cause:** Trying to play a card you don't have
- **Fix:** Make sure you purchased the card first

**Issue:** "This card cannot be played instantly!" error
- **Cause:** Trying to play a KEEP card as instant
- **Fix:** Only DISCARD cards can be played

**Issue:** "Can only play during roll phase!" error
- **Cause:** Playing D015 Galloping Time during shop phase
- **Fix:** Play it during roll phase instead

**Issue:** Card doesn't appear in instant section
- **Cause:** Card might be a KEEP type
- **Fix:** Check that card ID starts with 'D' for DISCARD

**Issue:** Card used but no effect
- **Cause:** Effect might be at max (e.g., healing at max HP)
- **Fix:** Use cards when their effects are needed

---

## Conclusion

Phase 4 adds tactical decision-making through one-time-use instant effects:
- **Resource generation** (D001, D006, D017)
- **Healing** (D003, D012, D020)
- **Utility** (D015, D020)
- **Conditional bonuses** (D012 VP outside center)

DISCARD cards create interesting strategic choices about when to use limited resources for maximum impact!
