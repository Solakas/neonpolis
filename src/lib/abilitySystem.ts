// NeonPolis Ability System

export type AbilityState = 'ready' | 'armed' | 'spent' | 'stored';

export interface AbilityStatus {
  state: AbilityState;
  storedDie?: string; // For Quantum Terrapin
  keptHeartThisTurn?: boolean; // For Starblade Mantis
}

export const ABILITY_STATE_ICONS: Record<AbilityState, string> = {
  ready: '◯',
  armed: '●',
  spent: '✓',
  stored: '⧉'
};

export const ABILITY_STATE_LABELS: Record<AbilityState, string> = {
  ready: 'Ready',
  armed: 'Armed',
  spent: 'Used',
  stored: 'Stored'
};

// Ability timing points
export type AbilityTiming = 
  | 'turn_start'
  | 'after_final_roll'
  | 'next_time_gain_energy'
  | 'next_time_take_damage'
  | 'resolve_hearts'
  | 'on_deal_damage'
  | 'end_of_turn'
  | 'before_reroll'
  | 'active_on_turn';

// Get ability state at turn start
export function getAbilityStateOnTurnStart(abilityId: string): AbilityState {
  switch (abilityId) {
    case 'overcharge': // Ion Wyrm
    case 'stoneplate': // Basalt Colossus
    case 'venom_siphon': // Prismfang Cobra
      return 'armed';
    default:
      return 'ready';
  }
}

// Check if ability can be used
export function canUseAbility(
  abilityId: string,
  state: AbilityState,
  context: {
    diceCount?: number;
    energy?: number;
    hp?: number;
    maxHp?: number;
    keptHearts?: number;
    rolledHearts?: number;
    healedHearts?: number;
  }
): boolean {
  if (state === 'spent') return false;

  switch (abilityId) {
    case 'misty_grapple':
      return state === 'ready' && (context.diceCount || 0) >= 2;
    
    case 'convertive_gaze':
      const canConvertToHeart = (context.energy || 0) >= 1 && (context.hp || 0) < (context.maxHp || 10);
      const canConvertToEnergy = (context.hp || 0) >= 1;
      return state === 'ready' && (canConvertToHeart || canConvertToEnergy);
    
    case 'undertow':
      const unusedHearts = (context.rolledHearts || 0) - (context.healedHearts || 0);
      return state === 'ready' && unusedHearts > 0;
    
    default:
      return state !== 'spent';
  }
}
