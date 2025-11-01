import type { DiceFace } from './gameData';

/**
 * NeonPolis Bot AI
 * 
 * NOTE: Character abilities like Overcharge (Ion Wyrm) and Stoneplate (Basalt Colossus)
 * trigger automatically based on game state. Bots don't need decision logic for these
 * passive/reactive abilities - they work the same for both human players and bots.
 */

interface BotDecision {
  shouldReroll: boolean;
  diceToKeep: boolean[]; // Array matching dice positions - true to keep, false to reroll
}

interface BotCombatDecision {
  shouldAttack: boolean;
}

interface BotShopDecision {
  cardIndexToBuy: number | null; // null means don't buy
}

/**
 * Bot AI for deciding which dice to keep/reroll
 * Strategy:
 * - Keep all swords (for attacking)
 * - Keep all energy (for buying cards)
 * - Keep hearts if low on HP
 * - Try to build sets of numbers for VP
 */
export function getBotRerollDecision(
  dice: DiceFace[],
  rollNumber: number,
  currentHp: number,
  maxHp: number,
  currentEnergy: number,
  inCenter: boolean
): BotDecision {
  // On first roll, always reroll unless we have a great hand
  if (rollNumber === 1) {
    const swords = dice.filter(d => d === 'sword').length;
    const energy = dice.filter(d => d === 'energy').length;
    const vpScore = calculateVPPotential(dice);
    
    // Keep everything if we have 3+ swords or great VP potential
    if (swords >= 3 || vpScore >= 3 || (energy >= 3 && swords >= 2)) {
      return { shouldReroll: false, diceToKeep: dice.map(() => true) };
    }
    
    // Keep swords, energy, and any number triples/pairs
    const diceToKeep = dice.map(die => {
      if (die === 'sword' || die === 'energy') return true;
      if (die === 'heart' && currentHp < maxHp / 2 && !inCenter) return true;
      if ((die === '1' || die === '2' || die === '3') && dice.filter(d => d === die).length >= 2) return true;
      return false;
    });
    
    return { shouldReroll: true, diceToKeep };
  }
  
  // On second roll, be more selective
  if (rollNumber === 2) {
    const swords = dice.filter(d => d === 'sword').length;
    const vpScore = calculateVPPotential(dice);
    
    // Stop if we have 2+ swords or 2+ VP potential
    if (swords >= 2 || vpScore >= 2) {
      return { shouldReroll: false, diceToKeep: dice.map(() => true) };
    }
    
    // Keep valuable dice
    const diceToKeep = dice.map(die => {
      if (die === 'sword' || die === 'energy') return true;
      if (die === 'heart' && currentHp < maxHp * 0.6 && !inCenter) return true;
      if ((die === '1' || die === '2' || die === '3') && dice.filter(d => d === die).length >= 2) return true;
      return false;
    });
    
    return { shouldReroll: true, diceToKeep };
  }
  
  // Final roll - keep everything
  return { shouldReroll: false, diceToKeep: dice.map(() => true) };
}

/**
 * Calculate VP potential from current dice
 */
function calculateVPPotential(dice: DiceFace[]): number {
  const counts: Record<string, number> = { '1': 0, '2': 0, '3': 0 };
  
  dice.forEach(die => {
    if (die === '1' || die === '2' || die === '3') {
      counts[die]++;
    }
  });
  
  let totalVP = 0;
  Object.entries(counts).forEach(([face, count]) => {
    if (count >= 3) {
      const baseValue = parseInt(face);
      const extraDice = count - 3;
      totalVP += baseValue + extraDice;
    }
  });
  
  return totalVP;
}

/**
 * Bot AI for deciding whether to attack in combat
 * Strategy:
 * - Always attack if we have swords
 * - Prefer to enter/stay in Neonpolis for VP bonuses
 */
export function getBotCombatDecision(
  swordCount: number,
  inCenter: boolean,
  currentHp: number,
  centerOccupantHp: number | null
): BotCombatDecision {
  // Always attack if we have swords
  return { shouldAttack: swordCount > 0 };
}

/**
 * Bot AI for deciding which card to buy from shop
 * Strategy:
 * - Buy cards that cost <= current energy
 * - Prefer cheaper cards to save energy
 * - Randomly decide whether to buy (70% chance if affordable)
 */
export function getBotShopDecision(
  availableCards: Array<{ id: string; cost: number; nameEn: string }>,
  currentEnergy: number
): BotShopDecision {
  // Filter affordable cards
  const affordableCards = availableCards
    .map((card, index) => ({ card, index }))
    .filter(({ card }) => card.cost <= currentEnergy);
  
  if (affordableCards.length === 0) {
    return { cardIndexToBuy: null };
  }
  
  // 70% chance to buy if we can afford
  if (Math.random() > 0.7) {
    return { cardIndexToBuy: null };
  }
  
  // Sort by cost (prefer cheaper cards)
  affordableCards.sort((a, b) => a.card.cost - b.card.cost);
  
  // Buy the cheapest card
  return { cardIndexToBuy: affordableCards[0].index };
}

/**
 * Bot AI for deciding whether to leave Neonpolis after taking damage
 * Strategy:
 * - Leave if HP is low (< 3)
 * - 50% chance to leave otherwise
 */
export function getBotLeaveDecision(currentHp: number): boolean {
  if (currentHp <= 2) return true;
  return Math.random() > 0.5;
}

/**
 * Bot AI for deciding whether to use Convertive Gaze
 * Strategy:
 * - Convert Energy → Heart if HP is low (< 4) and we have energy to spare (>= 2)
 * - Convert Heart → Energy if HP is high (>= 8) and we need energy (< 3)
 * - Otherwise don't use it
 */
export function getBotConvertiveGazeDecision(
  currentHp: number,
  maxHp: number,
  currentEnergy: number
): 'to_heart' | 'to_energy' | null {
  // Convert to Heart if low HP and have spare energy
  if (currentHp < 4 && currentHp < maxHp && currentEnergy >= 2) {
    return 'to_heart';
  }
  
  // Convert to Energy if high HP and low energy
  if (currentHp >= 8 && currentEnergy < 3) {
    return 'to_energy';
  }
  
  return null;
}
