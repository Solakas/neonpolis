# Phase 1 Card System Testing Guide

## What's Implemented

Phase 1 includes all **passive KEEP cards** that automatically trigger during gameplay. No player prompts are needed - they just work!

## Cards to Test

### START_OF_TURN Cards

**K001 - Energy Collector (Cost: 3⚡)**
- ✅ Effect: Gain +1⚡ at the start of your turn
- 🧪 Test: Buy this card, end your turn, and check that you gain +1⚡ automatically when your next turn starts
- 📊 Expected: Toast notification "Energy Collector: +1 ⚡"

**K020 - Eminent Devastator (Cost: 4⚡)**
- ✅ Effect: Gain +1 VP at start of turn IF you're in the Center
- 🧪 Test: Buy this card, enter the Center, end turn. Your next turn should grant +1 VP (in addition to the +2 VP Neonpolis bonus)
- 📊 Expected: Toast notification "Eminent Devastator: +1 ★ VP"

### ROLL_PHASE_BEGIN Cards

**K022 - Aero Tunnels (Cost: 3⚡)**
- ✅ Effect: +1 reroll (4 total instead of 3)
- 🧪 Test: Buy this card, end turn, start new turn. Check the reroll counter shows 4 instead of 3
- 📊 Expected: You can roll 4 times total

**K028 - Synchronizer (Cost: 3⚡)**
- ✅ Effect: Reroll cap set to 3 (or keep higher if already boosted)
- 🧪 Test: This card sets your rerolls to 3 (which is already the default). Stack it with K022 to see it maintain 4 rerolls
- 📊 Expected: Works with other reroll bonuses

### RESOLVE_NUMBERS Cards

**K013 - Cubist Fortune (Cost: 3⚡)**
- ✅ Effect: When you score any number set (triple), gain +1 VP
- 🧪 Test: Buy this card, roll a triple (e.g., 1-1-1 or 2-2-2 or 3-3-3)
- 📊 Expected: 
  - 1-1-1 normally scores 1 VP → becomes 2 VP with Cubist Fortune
  - 2-2-2 normally scores 2 VP → becomes 3 VP with Cubist Fortune
  - 3-3-3 normally scores 3 VP → becomes 4 VP with Cubist Fortune
  - Toast shows "Cubist Fortune +1!"

### RESOLVE_ENERGY Cards

**K002 - Plasma Accumulator (Cost: 4⚡)** [ONCE PER TURN]
- ✅ Effect: When you gain ≥2⚡ from dice, gain +1⚡ (first time each turn)
- 🧪 Test: Buy this card, roll 2+ ⚡ symbols
- 📊 Expected: 
  - 2 ⚡ dice → receive 3⚡ total (Toast shows "Plasma Acc. +1")
  - Works only once per turn (second energy gain in same turn doesn't trigger it)
  - Resets next turn

**K018 - Necro-Feeder (Cost: 4⚡)**
- ✅ Effect: Each ❤️ you resolve also gives +1⚡
- 🧪 Test: Buy this card, roll hearts while OUTSIDE the Center
- 📊 Expected:
  - 2 ❤️ → heal 2 HP AND gain 2⚡
  - 3 ❤️ → heal 3 HP AND gain 3⚡
  - Toast shows "Necro-Feeder +X"

**K027 - Rebuild Core (Cost: 4⚡)**
- ✅ Effect: When you heal with ❤️ while OUTSIDE, gain +1⚡
- 🧪 Test: Buy this card, roll hearts while OUTSIDE the Center
- 📊 Expected:
  - Any hearts resolved while outside → gain +1⚡
  - Does NOT trigger if you're in the Center
  - Toast shows "Rebuild Core +1"

**K014 - Scarce Supply (Cost: 3⚡)** [Affects Opponents]
- ✅ Effect: When an OPPONENT gains ≥3⚡ from dice, they lose 1⚡
- 🧪 Test: Buy this card, wait for an opponent to roll 3+ ⚡ symbols
- 📊 Expected: Opponent's energy gain is reduced by 1
- ⚠️ Note: This is a passive debuff card - watch opponent turns!

### RESOLVE_SWORDS Cards

**K005 - Blade Pulse (Cost: 5⚡)**
- ✅ Effect: While in Center, your ⚔️ deal +1 TOTAL damage
- 🧪 Test: Buy this card, enter the Center, roll swords
- 📊 Expected:
  - 2 ⚔️ → deals 3 damage total
  - 3 ⚔️ → deals 4 damage total
  - Log shows "damage boosted by Blade Pulse"

**K007 - Extending Limbs (Cost: 3⚡)**
- ✅ Effect: If OUTSIDE and you roll ≥2⚔️, deal +1 extra damage to Center occupant
- 🧪 Test: Buy this card, stay outside, roll 2+ swords, attack the Center occupant
- 📊 Expected:
  - 2 ⚔️ → deals 3 damage to Center occupant
  - Does NOT trigger if you're in the Center
  - Does NOT trigger if you only rolled 1 ⚔️
  - Log shows "damage boosted by Extending Limbs"

**K026 - Blade Breath (Cost: 4⚡)**
- ✅ Effect: When you deal ≥1⚔️, your total damage +1
- 🧪 Test: Buy this card, roll any swords
- 📊 Expected:
  - 1 ⚔️ → deals 2 damage
  - 2 ⚔️ → deals 3 damage
  - Works in Center OR outside
  - Log shows "damage boosted by Blade Breath"

### DAMAGE_TAKEN Cards

**K008 - Echo Shielding (Cost: 4⚡)**
- ✅ Effect: When you would take 3+ damage, reduce it by 1 (min 1)
- 🧪 Test: Buy this card, let an opponent attack you with 3+ swords
- 📊 Expected:
  - 3 damage → reduced to 2
  - 5 damage → reduced to 4
  - 1-2 damage → no reduction
  - Toast shows "Echo Shielding: -1 damage"

**K025 - Threaded Carapace (Cost: 5⚡)**
- ✅ Effect: -1 damage from EVERY source (min 0 per resolution)
- 🧪 Test: Buy this card, take damage from any source
- 📊 Expected:
  - 3 damage → reduced to 2
  - 1 damage → reduced to 0
  - Toast shows "Threaded Carapace: -1 damage"
  - Stacks with K008!

### END_OF_TURN Cards

**K009 - Regenerative Tissue (Cost: 5⚡)**
- ✅ Effect: At end of turn, if you resolved NO ❤️ this turn, heal +1 HP
- 🧪 Test: Buy this card, complete a turn without rolling/resolving any hearts
- 📊 Expected:
  - If you rolled NO hearts → gain +1 HP at end of turn
  - If you rolled any hearts → no effect
  - Toast shows "Regenerative Tissue: +1 HP"

**K021 - Rooftop Raider (Cost: 3⚡)**
- ✅ Effect: At end of turn, if OUTSIDE and you dealt ≥2⚔️ this turn, gain +1 VP
- 🧪 Test: Buy this card, stay outside, deal 2+ damage with swords, end turn
- 📊 Expected:
  - If outside AND dealt 2+ damage → gain +1 VP
  - Does NOT trigger if in Center
  - Does NOT trigger if you dealt 0-1 damage
  - Toast shows "Rooftop Raider: +1 ★ VP"

## Card Combos to Test

### Energy Engine Combo
1. **K001 Energy Collector** → Free 1⚡ every turn
2. **K002 Plasma Accumulator** → Bonus when rolling 2+ ⚡
3. **K018 Necro-Feeder** → Convert hearts to energy
4. **K027 Rebuild Core** → Extra energy when healing

Roll hearts while outside to trigger both K018 and K027!

### Damage Stack Combo
1. **K005 Blade Pulse** (in Center) → +1 damage
2. **K026 Blade Breath** → +1 damage
3. **Both together** → 2 ⚔️ becomes 4 damage!

OR (from outside):

1. **K007 Extending Limbs** (outside, 2+ swords) → +1 damage
2. **K026 Blade Breath** → +1 damage
3. **Both together** → 2 ⚔️ becomes 4 damage to Center occupant!

### Defense Stack Combo
1. **K025 Threaded Carapace** → -1 damage
2. **K008 Echo Shielding** → -1 damage (if 3+)
3. **Both together** → 5 damage becomes 3 damage!

### VP Generation Combo
1. **K020 Eminent Devastator** → +1 VP at start of turn (in Center)
2. **K013 Cubist Fortune** → +1 VP on number sets
3. **K021 Rooftop Raider** → +1 VP at end of turn (outside)

## Testing Checklist

- [ ] K001 Energy Collector: +1⚡ at start of turn
- [ ] K002 Plasma Accumulator: +1⚡ when gaining ≥2⚡ (once/turn)
- [ ] K005 Blade Pulse: +1 damage in Center
- [ ] K007 Extending Limbs: +1 damage to Center (outside, 2+ swords)
- [ ] K008 Echo Shielding: Reduce 3+ damage by 1
- [ ] K009 Regenerative Tissue: +1 HP if no hearts resolved
- [ ] K013 Cubist Fortune: +1 VP on number sets
- [ ] K014 Scarce Supply: Opponent loses 1⚡ (when they gain ≥3⚡)
- [ ] K018 Necro-Feeder: +1⚡ per heart resolved
- [ ] K020 Eminent Devastator: +1 VP at start (in Center)
- [ ] K021 Rooftop Raider: +1 VP at end (outside, 2+ damage dealt)
- [ ] K022 Aero Tunnels: +1 reroll
- [ ] K025 Threaded Carapace: -1 damage from every source
- [ ] K026 Blade Breath: +1 damage when dealing ≥1⚔️
- [ ] K027 Rebuild Core: +1⚡ when healing outside
- [ ] K028 Synchronizer: Reroll cap set to 3

## Quick Test Scenario

**Turn 1:**
1. Roll dice and gather energy
2. Buy **K001 Energy Collector** (3⚡)

**Turn 2:**
3. Check you automatically gained +1⚡ ✅
4. Buy **K013 Cubist Fortune** (3⚡)

**Turn 3:**
5. Roll a triple (e.g., 2-2-2)
6. Check you gained 3 VP (2 from triple + 1 from Cubist) ✅

**Turn 4:**
7. Buy **K026 Blade Breath** (4⚡)
8. Roll 2 swords
9. Check you deal 3 damage (2 + 1 from Blade Breath) ✅

Success! Phase 1 is working! 🎉

## Notes

- All Phase 1 cards are **passive** - they work automatically
- Toast notifications will appear when cards trigger
- Game log shows detailed information about card effects
- Card effects apply BEFORE ability effects (like Ion Wyrm's Overcharge)
- Damage modifiers stack additively (K005 + K026 = +2 damage)
- Damage reductions stack additively (K008 + K025 can reduce damage by -2)

## What's NOT in Phase 1

Phase 1 does NOT include:
- Interactive cards requiring prompts (K003, K011, K012, K017, K019, K024)
- Special mechanics (K004, K006, K010, K015, K016, K023)
- Any DISCARD cards (D001-D020)

These will be implemented in Phases 2-6!
