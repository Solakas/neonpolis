import { useState, useRef, useEffect } from 'react';
import { Button } from './ui/button';
import { type DiceFace, diceIcons } from '../lib/gameData';
import { Dice } from './Dice';

interface DiceRollerProps {
  onRollComplete: (dice: DiceFace[]) => void;
  onResolve: (dice: DiceFace[]) => void;
  onCombat?: (swordCount: number) => void;
  phase: 'roll' | 'resolve' | 'combat' | 'shop' | 'end';
  rollsRemaining: number;
  controlledDice?: DiceFace[]; // Dice state controlled by parent
  isBot?: boolean; // Enable auto-roll for bots
  botAutoRerollDecision?: boolean; // Bot's decision whether to reroll
  characterId?: string; // Current character ID for ability checks
  storedDie?: DiceFace; // Stored die for Time Bank ability
  onTimeBankSwap?: () => void; // Callback to trigger Time Bank swap
  abilityState?: 'ready' | 'armed' | 'spent' | 'stored'; // Current ability state
  energy?: number; // Current energy for Convertive Gaze
  hp?: number; // Current HP for Convertive Gaze
  maxHp?: number; // Max HP for Convertive Gaze
  onConvertClick?: () => void; // Callback to trigger Convertive Gaze
  onEndTurn?: () => void; // Callback to end turn in shop phase
  onRenewShop?: () => void; // Callback to renew shop cards
  onEarlyResolve?: () => void; // Callback to trigger early resolve (phase transition)
  // Ability prompt integration for resolve phase
  showAbilityPrompt?: boolean; // Show ability prompt in resolve phase
  abilityPromptMessage?: string; // Message to display
  onUseAbility?: () => void; // Callback when user clicks Use Ability
  onSkipAbility?: () => void; // Callback when user clicks Skip
}

const diceFaces: DiceFace[] = ['1', '2', '3', 'sword', 'energy', 'heart'];

export function DiceRoller({ 
  onRollComplete, 
  onResolve, 
  onCombat, 
  phase, 
  rollsRemaining, 
  controlledDice, 
  isBot, 
  botAutoRerollDecision,
  characterId,
  storedDie,
  onTimeBankSwap,
  abilityState,
  energy,
  hp,
  maxHp,
  onConvertClick,
  onEndTurn,
  onRenewShop,
  onEarlyResolve,
  showAbilityPrompt,
  abilityPromptMessage,
  onUseAbility,
  onSkipAbility
}: DiceRollerProps) {
  const [dice, setDice] = useState<DiceFace[]>([]);
  const [keptDice, setKeptDice] = useState<boolean[]>([]);
  const [isRolling, setIsRolling] = useState(false);
  const diceRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Reset dice and kept state when a new turn begins
  useEffect(() => {
    if (phase === 'roll' && rollsRemaining === 3) {
      setDice([]);
      setKeptDice([]);
    }
  }, [phase, rollsRemaining]);

  // Sync with controlled dice from parent ONLY in resolve/combat/shop phases (when abilities might modify dice)
  useEffect(() => {
    if (controlledDice && controlledDice.length > 0 && (phase === 'resolve' || phase === 'combat' || phase === 'shop')) {
      setDice(controlledDice);
    }
  }, [controlledDice, phase]);

  // Auto-roll for bots
  useEffect(() => {
    if (isBot && phase === 'roll' && !isRolling) {
      const timer = setTimeout(() => {
        if (rollsRemaining > 0) {
          rollDice();
        }
      }, 1000); // Wait 1 second before auto-rolling
      
      return () => clearTimeout(timer);
    }
  }, [isBot, phase, rollsRemaining, isRolling, dice.length]);

  // Auto-resolve or auto-combat for bots
  useEffect(() => {
    if (isBot && !isRolling) {
      if (phase === 'resolve') {
        const timer = setTimeout(() => {
          handleResolve();
        }, 800);
        return () => clearTimeout(timer);
      }
      
      if (phase === 'combat') {
        const timer = setTimeout(() => {
          handleCombat();
        }, 800);
        return () => clearTimeout(timer);
      }
    }
  }, [isBot, phase, isRolling]);

  const rollDice = () => {
    setIsRolling(true);
    
    let resultDice: DiceFace[];
    
    // If first roll, roll all 6 dice
    if (dice.length === 0) {
      resultDice = Array(6).fill(null).map(() => 
        diceFaces[Math.floor(Math.random() * diceFaces.length)]
      );
      setDice(resultDice);
      setKeptDice(Array(6).fill(false));
    } else {
      // Roll only dice that aren't kept
      resultDice = dice.map((die, idx) => {
        if (keptDice[idx]) return die;
        return diceFaces[Math.floor(Math.random() * diceFaces.length)];
      });
      setDice(resultDice);
    }

    setTimeout(() => {
      setIsRolling(false);
      onRollComplete(resultDice);
    }, 1800);
  };

  const toggleKeep = (index: number) => {
    if (phase === 'roll' && !isRolling) {
      setKeptDice(prev => {
        const newKept = [...prev];
        newKept[index] = !newKept[index];
        return newKept;
      });
    }
  };

  const handleResolve = () => {
    onResolve(dice);
  };

  const handleCombat = () => {
    // Use controlledDice if available (includes ability modifications), otherwise local dice
    const activeDice = controlledDice && controlledDice.length > 0 ? controlledDice : dice;
    const swordCount = activeDice.filter(d => d === 'sword').length;
    if (onCombat && swordCount > 0) {
      onCombat(swordCount);
    }
  };

  const canRoll = phase === 'roll' && rollsRemaining > 0 && !isRolling;
  const canResolve = phase === 'resolve' && dice.length > 0;
  const canEarlyResolve = phase === 'roll' && dice.length > 0 && rollsRemaining < 3 && !isRolling;
  const canUseTimeBank = phase === 'roll' && characterId === 'quantum_terrapin' && storedDie && dice.length > 0 && !isRolling;
  const canConvertToHeart = (energy || 0) >= 1 && (hp || 0) < (maxHp || 10);
  const canConvertToEnergy = (hp || 0) >= 1;
  const canUseConvertiveGaze = characterId === 'halo_cyclops' && abilityState === 'ready' && (canConvertToHeart || canConvertToEnergy) && !isRolling;
  
  // Use controlledDice ONLY in resolve/combat/shop phases (when abilities might have modified dice)
  // During roll phase, use local dice state to avoid sync issues
  const displayDice = (phase === 'resolve' || phase === 'combat' || phase === 'shop') && controlledDice && controlledDice.length > 0
    ? controlledDice
    : dice;
  
  // Debug logging
  console.log('=== DiceRoller Debug ===');
  console.log('Phase:', phase);
  console.log('Local dice:', dice, '→ faces:', dice.map((d, i) => `[${i}]:${d}`).join(', '));
  console.log('controlledDice prop:', controlledDice, '→ faces:', controlledDice?.map((d, i) => `[${i}]:${d}`).join(', '));
  console.log('displayDice:', displayDice, '→ faces:', displayDice.map((d, i) => `[${i}]:${d}`).join(', '));
  console.log('Sword count in displayDice:', displayDice.filter(d => d === 'sword').length);
  console.log('=======================');
  
  const canCombat = phase === 'combat' && displayDice.filter(d => d === 'sword').length > 0;

  // Auto-perform single actions for human players
  useEffect(() => {
    // Skip for bots (they have their own auto-play logic)
    if (isBot || isRolling) return;

    let actionCount = 0;
    let singleAction: (() => void) | null = null;

    // Count actions in roll phase
    if (phase === 'roll' && canRoll) {
      actionCount++;
      singleAction = rollDice;
    }
    if (phase === 'roll' && canEarlyResolve && onEarlyResolve) {
      actionCount++;
    }
    if (phase === 'roll' && canUseTimeBank && onTimeBankSwap) {
      actionCount++;
    }

    // Count actions in resolve phase
    if (phase === 'resolve' && canResolve) {
      if (showAbilityPrompt) {
        actionCount += 2; // "Resolve" + "Use Ability"
      } else {
        actionCount++;
        singleAction = handleResolve;
      }
    }

    // Count actions in combat phase
    if (phase === 'combat' && canCombat) {
      actionCount++;
      singleAction = handleCombat;
    }

    // If exactly one action available, auto-perform it
    if (actionCount === 1 && singleAction) {
      const timer = setTimeout(() => {
        singleAction();
      }, 600); // Brief delay so player sees the phase

      return () => clearTimeout(timer);
    }
  }, [isBot, isRolling, phase, canRoll, canEarlyResolve, canResolve, canCombat, canUseTimeBank, showAbilityPrompt]);

  return (
    <div className="space-y-4">
      {/* Phase Indicator */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex-1">
          <h2 
            className="font-['Fira_Sans',sans-serif] text-lg tracking-wide"
            style={{ color: '#00E5FF', fontSize: '18px', fontWeight: 600 }}
          >
            {phase === 'roll' && 'Roll Phase'}
            {phase === 'resolve' && 'Resolve Phase'}
            {phase === 'combat' && 'Combat Phase'}
            {phase === 'shop' && 'Shop Phase'}
          </h2>
          {phase === 'roll' && (
            <p 
              className="font-['Inter',sans-serif] text-sm mt-1.5 leading-relaxed"
              style={{ color: 'rgba(255, 255, 255, 0.85)' }}
            >
              {rollsRemaining === 3 && 'Start rolling your dice'}
              {rollsRemaining === 2 && `${rollsRemaining} re-rolls remaining • Click dice to keep them`}
              {rollsRemaining === 1 && `Final re-roll • Click dice to keep them`}
              {rollsRemaining === 0 && 'No re-rolls remaining'}
            </p>
          )}
          {phase === 'resolve' && !showAbilityPrompt && (
            <p 
              className="font-['Inter',sans-serif] text-sm mt-1.5 leading-relaxed"
              style={{ color: 'rgba(255, 255, 255, 0.85)' }}
            >
              Click 'Resolve Dice' to continue
            </p>
          )}
          {phase === 'resolve' && showAbilityPrompt && (
            <p 
              className="font-['Inter',sans-serif] text-sm mt-1.5 leading-relaxed"
              style={{ color: '#00E5FF' }}
            >
              {abilityPromptMessage || 'Use your ability?'}
            </p>
          )}
          {phase === 'combat' && displayDice.filter(d => d === 'sword').length > 0 && (
            <p 
              className="font-['Inter',sans-serif] text-sm mt-1.5 leading-relaxed"
              style={{ color: 'rgba(255, 255, 255, 0.85)' }}
            >
              Attack with your swords or skip to shop
            </p>
          )}
          {phase === 'combat' && displayDice.filter(d => d === 'sword').length === 0 && (
            <p 
              className="font-['Inter',sans-serif] text-sm mt-1.5 leading-relaxed"
              style={{ color: 'rgba(255, 255, 255, 0.85)' }}
            >
              No swords to attack with
            </p>
          )}
          {phase === 'shop' && (
            <p 
              className="font-['Inter',sans-serif] text-sm mt-1.5 leading-relaxed"
              style={{ color: 'rgba(255, 255, 255, 0.85)' }}
            >
              Buy cards with energy or end your turn
            </p>
          )}
        </div>
        
        {/* Dice Summary - Inline */}
        {displayDice.length > 0 && !isRolling && (
          <div className="flex gap-4 text-sm">
            <div className="flex items-center gap-1">
              <span>⚔️</span>
              <span className="text-text-muted">{displayDice.filter(d => d === 'sword').length}</span>
            </div>
            <div className="flex items-center gap-1">
              <span>⚡</span>
              <span className="text-text-muted">{displayDice.filter(d => d === 'energy').length}</span>
            </div>
            <div className="flex items-center gap-1">
              <span>❤️</span>
              <span className="text-text-muted">{displayDice.filter(d => d === 'heart').length}</span>
            </div>
          </div>
        )}
      </div>

      {/* Dice Display or Shop Controls */}
      {phase === 'shop' ? (
        <div className="flex flex-col gap-3 py-4">
          <div className="flex gap-3">
            {onRenewShop && (
              <Button
                onClick={onRenewShop}
                disabled={!energy || energy < 2}
                className="flex-1 bg-[#FF00A8]/10 hover:bg-[#FF00A8]/20 border-2 border-[#FF00A8] text-[#FF00A8]"
                size="lg"
              >
                ♻️ Renew Cards (2⚡)
              </Button>
            )}
            {onEndTurn && (
              <Button
                onClick={onEndTurn}
                className="flex-1 glow-cyan"
                size="lg"
              >
                End Turn
              </Button>
            )}
          </div>
        </div>
      ) : displayDice.length > 0 ? (
        <div className="grid grid-cols-6 gap-1 justify-items-center">
          {displayDice.map((die, idx) => (
            <Dice
              key={idx}
              face={die}
              locked={keptDice[idx]}
              accent={false}
              onToggleLock={() => toggleKeep(idx)}
              disabled={phase !== 'roll' || isRolling}
              isRolling={isRolling}
            />
          ))}
        </div>
      ) : null}

      {/* Kept Dice Indicator */}
      {dice.length > 0 && phase === 'roll' && (
        <p className="text-center text-xs text-text-muted">
          {keptDice.filter(Boolean).length > 0
            ? `${keptDice.filter(Boolean).length} kept • Click to keep/release`
            : 'Click dice to keep'}
        </p>
      )}

      {/* Action Buttons - Compact */}
      <div className="flex gap-2">
        {/* ROLL PHASE: Show Roll/Reroll + Early Resolve option */}
        {phase === 'roll' && canRoll && (
          <>
            <Button
              onClick={rollDice}
              disabled={!canRoll}
              className="flex-1 glow-cyan"
              size="sm"
            >
              {dice.length === 0 ? `Roll Dice (${rollsRemaining})` : `Reroll (${rollsRemaining})`}
            </Button>
            {canEarlyResolve && onEarlyResolve && (
              <Button
                onClick={onEarlyResolve}
                variant="outline"
                className="flex-1"
                size="sm"
              >
                Early Resolve
              </Button>
            )}
          </>
        )}
        
        {/* ROLL PHASE: Time Bank ability (Quantum Terrapin) */}
        {phase === 'roll' && canUseTimeBank && onTimeBankSwap && (
          <Button
            onClick={onTimeBankSwap}
            className="flex-1 bg-purple-600 hover:bg-purple-700 border-purple-500"
            size="sm"
            variant="outline"
          >
            Swap {diceIcons[storedDie!]}
          </Button>
        )}
        
        {/* Note: Convertive Gaze (Halo Cyclops) is only available in resolve phase via ability banner */}
        
        {/* RESOLVE PHASE: With ability prompt */}
        {phase === 'resolve' && canResolve && showAbilityPrompt && (
          <>
            <Button
              onClick={onSkipAbility}
              variant="outline"
              className="flex-1"
              size="sm"
            >
              Resolve
            </Button>
            <Button
              onClick={onUseAbility}
              className="flex-1 glow-cyan"
              size="sm"
            >
              Use Ability
            </Button>
          </>
        )}
        
        {/* RESOLVE PHASE: Without ability prompt */}
        {phase === 'resolve' && canResolve && !showAbilityPrompt && (
          <Button
            onClick={handleResolve}
            className="flex-1 glow-magenta"
            size="sm"
          >
            Resolve Dice
          </Button>
        )}
        
        {/* COMBAT PHASE: Attack with swords */}
        {phase === 'combat' && canCombat && (
          <Button
            onClick={handleCombat}
            className="flex-1 glow-red"
            size="sm"
          >
            Attack with {displayDice.filter(d => d === 'sword').length} ⚔️
          </Button>
        )}
      </div>
    </div>
  );
}
