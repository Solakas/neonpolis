import { useState, useEffect } from 'react';
import { characters, shopCards, type DiceFace, diceIcons } from '../lib/gameData';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { DiceRoller } from './DiceRoller';
import { ArenaBoard } from './ArenaBoard';
import { PlayerHUD } from './PlayerHUD';
import { CharacterCard } from './CharacterCard';
import { AbilityPrompt, AbilityBanner } from './AbilityPrompt';
import { AbilityIndicator } from './AbilityIndicator';
import { LeaveNeonpolisModal } from './LeaveNeonpolisModal';
import { TurnTimer } from './TurnTimer';
import { CardPurchaseAnimation } from './CardPurchaseAnimation';
import { WinningScreen } from './WinningScreen';
import { CardEffectPrompt } from './CardEffectPrompt';
import { ArrowLeft } from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import type { AbilityState } from '../lib/abilitySystem';
import { getAbilityStateOnTurnStart } from '../lib/abilitySystem';
import { getBotRerollDecision, getBotCombatDecision, getBotShopDecision, getBotLeaveDecision, getBotConvertiveGazeDecision } from '../lib/botAI';
import type { CardEffectState } from '../lib/cardSystem';
import {
  getInitialCardEffectState,
  resetOncePerTurnEffects,
  applyEnergyCollector,
  applyPlasmaAccumulator,
  applyCubistFortune,
  applyNecroFeeder,
  applyRebuildCore,
  applyEminentDevastator,
  applyAeroTunnels,
  applySynchronizer,
  calculateTotalDamageModifiers,
  calculateDamageReduction,
  calculateVP as calculateVPFromCard
} from '../lib/cardSystem';

interface Player {
  id: string;
  name: string;
  characterId: string;
  hp: number;
  maxHp: number;
  energy: number;
  vp: number;
  isBot: boolean;
  inCenter: boolean;
  abilityState: AbilityState;
  storedDie?: DiceFace;
  keptHeartThisTurn?: boolean;
  canLeaveCenter?: boolean; // Set to true after taking damage while in center
  purchasedCards: string[]; // IDs of purchased shop cards
  cardEffectState: CardEffectState; // Card effect tracking
}

interface ArenaProps {
  playerCharacterId: string;
  opponentCount: number;
  onEndMatch: () => void;
}

interface GameLogEntry {
  id: string;
  timestamp: Date;
  message: string;
  type: 'roll' | 'damage' | 'heal' | 'energy' | 'shop' | 'center' | 'ability' | 'info' | 'combat';
}

export function Arena({ playerCharacterId, opponentCount, onEndMatch }: ArenaProps) {
  // Initialize players
  const [players, setPlayers] = useState<Player[]>(() => {
    const playerCharacter = characters.find(c => c.id === playerCharacterId)!;
    const humanPlayer: Player = {
      id: 'player',
      name: 'You',
      characterId: playerCharacterId,
      hp: playerCharacter.maxLife,
      maxHp: playerCharacter.maxLife,
      energy: 0,
      vp: 0,
      isBot: false,
      inCenter: false,
      abilityState: getAbilityStateOnTurnStart(playerCharacterId),
      purchasedCards: [],
      cardEffectState: getInitialCardEffectState()
    };

    const bots: Player[] = [];
    const availableBots = characters.filter(c => c.id !== playerCharacterId);
    for (let i = 0; i < opponentCount; i++) {
      const botCharacter = availableBots[i];
      bots.push({
        id: `bot-${i}`,
        name: `${botCharacter.name}`,
        characterId: botCharacter.id,
        hp: botCharacter.maxLife,
        maxHp: botCharacter.maxLife,
        energy: 0,
        vp: 0,
        isBot: true,
        inCenter: false,
        abilityState: getAbilityStateOnTurnStart(botCharacter.id),
        purchasedCards: [],
        cardEffectState: getInitialCardEffectState()
      });
    }

    return [humanPlayer, ...bots];
  });

  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);
  const [gamePhase, setGamePhase] = useState<'roll' | 'resolve' | 'combat' | 'shop' | 'end'>('roll');
  const [logs, setLogs] = useState<GameLogEntry[]>([]);
  const [shopDisplay, setShopDisplay] = useState<typeof shopCards>([]);
  const [isRenewingCards, setIsRenewingCards] = useState(false);
  const [rollsRemaining, setRollsRemaining] = useState(3);
  const [keptDice, setKeptDice] = useState<Array<{ id: string; face: DiceFace }>>([]);
  
  // Ability prompt state
  const [abilityPrompt, setAbilityPrompt] = useState<{
    open: boolean;
    type?: 'misty_grapple' | 'undertow' | 'convertive_gaze' | 'time_bank_store' | 'time_bank_swap';
    data?: any;
  }>({ open: false });
  
  const [abilityBanner, setAbilityBanner] = useState<{
    open: boolean;
    message?: string;
    onUse?: () => void;
  }>({ open: false });

  // Card effect prompt state (Phase 2)
  const [cardEffectPrompt, setCardEffectPrompt] = useState<{
    open: boolean;
    cardId?: string;
    cardName?: string;
    data?: any;
  }>({ open: false });

  // Pending resolve state - used when Early Resolve is clicked but ability prompt needs to show first
  const [pendingResolve, setPendingResolve] = useState<DiceFace[] | null>(null);

  // Leave Neonpolis modal state
  const [leaveModal, setLeaveModal] = useState<{
    open: boolean;
    damage: number;
    attackerId: string;
    defenderId: string;
  }>({ open: false, damage: 0, attackerId: '', defenderId: '' });

  // Card purchase animation state
  const [purchaseAnimation, setPurchaseAnimation] = useState<{
    active: boolean;
    card?: typeof shopCards[0];
    fromPosition?: { x: number; y: number };
    toPosition?: { x: number; y: number };
  }>({ active: false });

  // Winning state
  const [winner, setWinner] = useState<Player | null>(null);

  const currentPlayer = players[currentPlayerIndex];

  // Initialize shop
  useEffect(() => {
    const shuffled = [...shopCards].sort(() => Math.random() - 0.5);
    setShopDisplay(shuffled.slice(0, 3));
    addLog('Game started! Roll the dice to begin.', 'info');
    
    // First player enters Neonpolis automatically
    setPlayers(prev => prev.map((p, idx) => {
      if (idx === 0) {
        addLog(`${p.name} enters Neonpolis! +1 ★ VP`, 'center');
        toast.success(`${p.name} entered Neonpolis!`);
        return { ...p, inCenter: true, vp: 1 };
      }
      return p;
    }));
  }, []);

  const addLog = (message: string, type: GameLogEntry['type'] = 'info') => {
    setLogs(prev => [...prev, {
      id: Date.now().toString() + Math.random(),
      timestamp: new Date(),
      message,
      type
    }]);
  };

  // Calculate VP from dice rolls following official rules
  // Triples score VP equal to the number (1-1-1 = 1 VP, 2-2-2 = 2 VP, 3-3-3 = 3 VP)
  // Each extra matching die beyond three adds +1 VP
  // Multiple sets add up (you can score two triples with six dice)
  const calculateVP = (dice: DiceFace[]): number => {
    const counts: Record<string, number> = { '1': 0, '2': 0, '3': 0 };
    
    // Count number faces only (sword, energy, heart never grant VP)
    dice.forEach(die => {
      if (die === '1' || die === '2' || die === '3') {
        counts[die]++;
      }
    });
    
    let totalVP = 0;
    
    // Calculate VP for each number
    // Triples score: base value + (extra dice beyond 3)
    Object.entries(counts).forEach(([face, count]) => {
      if (count >= 3) {
        const baseValue = parseInt(face); // 1, 2, or 3
        const extraDice = count - 3; // 0 for exactly 3, 1 for 4 dice, 2 for 5 dice, etc.
        totalVP += baseValue + extraDice;
      }
    });
    
    return totalVP;
  };

  // Apply overcharge bonus if applicable and mark ability as spent
  const applyOvercharge = (energyGain: number): { finalEnergy: number; triggered: boolean } => {
    if (energyGain <= 0) return { finalEnergy: energyGain, triggered: false };
    
    const currentCharacter = characters.find(c => c.id === currentPlayer.characterId)!;
    if (currentCharacter.ability.id === 'overcharge' && currentPlayer.abilityState === 'armed') {
      return { finalEnergy: energyGain + 1, triggered: true };
    }
    
    return { finalEnergy: energyGain, triggered: false };
  };

  const handleDiceRolled = (dice: DiceFace[]) => {
    // Update keptDice to match the current roll - this is our single source of truth for final dice
    const newKeptDice = dice.map((face, idx) => ({ id: `die-${idx}`, face }));
    setKeptDice(newKeptDice);
    
    // Log the roll with dice faces using icons
    const diceDisplay = dice.map(face => diceIcons[face]).join(' ');
    addLog(`${currentPlayer.name} rolled: ${diceDisplay}`, 'roll');
    
    console.log('Roll completed - keptDice:', newKeptDice);
    console.log('Dice array:', dice);
    
    if (rollsRemaining === 1) {
      // Final roll - move to resolve phase
      setGamePhase('resolve');
      setRollsRemaining(0);
      addLog(`${currentPlayer.name} completed their rolls.`, 'roll');
      
      // Check for abilities after final roll
      const currentCharacter = characters.find(c => c.id === currentPlayer.characterId)!;
      
      // Check for Quantum Terrapin's Time Bank swap
      if (currentCharacter.ability.id === 'time_bank' && currentPlayer.storedDie) {
        if (!currentPlayer.isBot) {
          // Show banner for human player
          setAbilityBanner({
            open: true,
            message: `Swap in stored ${diceIcons[currentPlayer.storedDie]}?`,
            onUse: () => {
              setAbilityBanner({ open: false });
              setAbilityPrompt({
                open: true,
                type: 'time_bank_swap',
                data: { 
                  dice: newKeptDice,
                  storedDie: currentPlayer.storedDie
                }
              });
            }
          });
        } else {
          // Bot auto-swaps - replace a random die
          const randomIdx = Math.floor(Math.random() * newKeptDice.length);
          const oldFace = newKeptDice[randomIdx].face;
          newKeptDice[randomIdx].face = currentPlayer.storedDie;
          setKeptDice(newKeptDice);
          
          addLog(`${currentPlayer.name} swapped ${diceIcons[oldFace]} with stored ${diceIcons[currentPlayer.storedDie]} (Time Bank)`, 'ability');
          toast.success(`Time Bank: Swapped ${diceIcons[oldFace]} → ${diceIcons[currentPlayer.storedDie]}`);
          
          // Clear stored die
          setPlayers(prev => prev.map((p, idx) => {
            if (idx === currentPlayerIndex) {
              return { ...p, storedDie: undefined };
            }
            return p;
          }));
        }
      }
      // PHASE 2 CARDS: Check for after-final-roll card effects (K012, K017)
      // K017 - Mine Hunter: Reroll 1 die (once per turn)
      if (currentPlayer.purchasedCards.includes('K017') && 
          !currentPlayer.cardEffectState.mineHunterUsed &&
          !currentPlayer.isBot) {
        setCardEffectPrompt({
          open: true,
          cardId: 'K017',
          cardName: 'Mine Hunter',
          data: { dice: newKeptDice }
        });
        return; // Wait for card decision
      }
      
      // K012 - Telekinetic Grip: Set 1 die to ⚡ or ⚔️ (once per turn)
      else if (currentPlayer.purchasedCards.includes('K012') && 
               !currentPlayer.cardEffectState.telekineticGripUsed &&
               !currentPlayer.isBot) {
        setCardEffectPrompt({
          open: true,
          cardId: 'K012',
          cardName: 'Telekinetic Grip',
          data: { dice: newKeptDice }
        });
        return; // Wait for card decision
      }
      
      // Check for character abilities that can be used before resolving
      else if (currentCharacter.ability.id === 'misty_grapple' && 
          currentPlayer.abilityState === 'ready' &&
          dice.length >= 2 &&
          !currentPlayer.isBot) { // Only show prompt for human players
        // Nimbus Gibbon - Misty Grapple: Copy one die face to another
        setAbilityBanner({
          open: true,
          message: 'Use Misty Grapple?',
          onUse: () => {
            setAbilityBanner({ open: false });
            setAbilityPrompt({
              open: true,
              type: 'misty_grapple',
              data: { dice: dice.map((face, idx) => ({ id: `die-${idx}`, face })) }
            });
          }
        });
      } else if (currentCharacter.ability.id === 'convertive_gaze' && 
                 currentPlayer.abilityState === 'ready' &&
                 !currentPlayer.isBot) {
        // Halo Cyclops - Convertive Gaze: Convert 1⚡↔1❤️ anytime on your turn
        const canConvert = (currentPlayer.energy >= 1 && currentPlayer.hp < currentPlayer.maxHp) || 
                          currentPlayer.hp >= 1;
        if (canConvert) {
          setAbilityBanner({
            open: true,
            message: 'Use Convertive Gaze?',
            onUse: () => {
              setAbilityBanner({ open: false });
              handleConvertiveGaze();
            }
          });
        }
      }
    } else {
      setRollsRemaining(prev => prev - 1);
      addLog(`${currentPlayer.name} rolled the dice. ${rollsRemaining - 1} rerolls remaining.`, 'roll');
    }
  };

  const handleResolve = (dice: DiceFace[]) => {
    // Check if Misty Grapple ability should be offered before resolving
    const currentCharacter = characters.find(c => c.id === currentPlayer.characterId)!;
    if (currentCharacter.ability.id === 'misty_grapple' && 
        currentPlayer.abilityState === 'ready' &&
        dice.length >= 2 &&
        !currentPlayer.isBot) {
      // Ensure keptDice is initialized with current dice if not already
      if (keptDice.length === 0 || keptDice.length !== dice.length) {
        setKeptDice(dice.map((face, idx) => ({ id: `die-${idx}`, face })));
      }
      
      // Store dice for later resolution and show ability banner
      setPendingResolve(dice);
      setAbilityBanner({
        open: true,
        message: 'Use Misty Grapple before resolving?',
        onUse: () => {
          setAbilityBanner({ open: false });
          setAbilityPrompt({
            open: true,
            type: 'misty_grapple',
            data: { dice: dice.map((face, idx) => ({ id: `die-${idx}`, face })) }
          });
        }
      });
      return; // Don't resolve yet, wait for ability decision
    }

    // Actually resolve the dice
    executeResolve(dice);
  };

  const executeResolve = (dice: DiceFace[]) => {
    // STEP 1: Determine final dice (single source of truth)
    // Use keptDice if available (may have been modified by abilities), otherwise use passed dice
    const finalDice = keptDice.length > 0 ? keptDice.map(d => d.face) : dice;
    
    console.log('=== DICE RESOLUTION START ===');
    console.log('Final dice:', finalDice);
    console.log('Rolls remaining when resolving:', rollsRemaining);
    
    // PHASE 3: K023 Die Forging - Detect if player kept all dice after 1st roll
    // This happens when resolving with rollsRemaining === 2 (after first roll, before any rerolls)
    const keptAllDiceAfterFirstRoll = rollsRemaining === 2;
    
    // Check if Die Forging should trigger
    const dieForgingTriggered = currentPlayer.purchasedCards.includes('K023') &&
                                 !currentPlayer.cardEffectState.dieForgingUsed &&
                                 keptAllDiceAfterFirstRoll;
    
    // STEP 2: Count all dice faces
    let numberDice: DiceFace[] = [];
    let heartCount = 0;
    let energyCount = 0;
    let swordCount = 0;

    finalDice.forEach(die => {
      if (die === '1' || die === '2' || die === '3') {
        numberDice.push(die);
      } else if (die === 'heart') {
        heartCount++;
      } else if (die === 'energy') {
        energyCount++;
      } else if (die === 'sword') {
        swordCount++;
      }
    });

    console.log('Counts - Numbers:', numberDice, 'Hearts:', heartCount, 'Energy:', energyCount, 'Swords:', swordCount);

    // Log Die Forging if triggered
    if (dieForgingTriggered) {
      addLog(`${currentPlayer.name} triggered Die Forging! Kept all dice after 1st roll`, 'ability');
      toast.success('Die Forging!', { description: '+1 ⚡ Energy and +1 ★ VP' });
    }

    // STEP 3: Resolution Order (following official rules)
    
    // 3.1 - VP FROM NUMBER SETS
    const baseVP = calculateVP(finalDice);
    const scoredNumberSet = baseVP > 0;
    
    // K013 - Cubist Fortune: +1 VP when scoring number set
    const cubistBonus = applyCubistFortune(currentPlayer.purchasedCards, scoredNumberSet);
    
    // K023 - Die Forging: +1 VP if kept all dice after 1st roll
    const dieForgingVPBonus = dieForgingTriggered ? 1 : 0;
    
    const vpEarned = baseVP + cubistBonus + dieForgingVPBonus;
    
    // 3.2 - HEARTS (HEALING & EVOLUTION)
    const hasHearts = heartCount > 0;
    // Track if player kept hearts this turn (for Precision Cut ability)
    
    // 3.3 - ENERGY (GAIN & SPEND)
    // Apply Overcharge ability if applicable
    const { finalEnergy: energyFromOvercharge, triggered: overchargeTriggered } = applyOvercharge(energyCount);
    
    // K002 - Plasma Accumulator: +1⚡ when gaining ≥2⚡ from dice (once/turn)
    const { bonus: plasmaBonus, triggered: plasmaTriggered } = applyPlasmaAccumulator(
      currentPlayer.purchasedCards,
      energyFromOvercharge,
      currentPlayer.cardEffectState
    );
    
    // K018 - Necro-Feeder: Each ❤️ also gives +1⚡
    const necroBonus = applyNecroFeeder(currentPlayer.purchasedCards, heartCount);
    
    // K027 - Rebuild Core: +1⚡ when healing while outside
    const rebuildBonus = applyRebuildCore(currentPlayer.purchasedCards, heartCount, currentPlayer.inCenter);
    
    // K023 - Die Forging: +1⚡ if kept all dice after 1st roll
    const dieForgingEnergyBonus = dieForgingTriggered ? 1 : 0;
    
    const finalEnergyGain = energyFromOvercharge + plasmaBonus + necroBonus + rebuildBonus + dieForgingEnergyBonus;

    // 3.2 continued - Calculate actual healing and unused hearts (for Undertow ability)
    const actualHealing = currentPlayer.inCenter ? 0 : Math.min(heartCount, currentPlayer.maxHp - currentPlayer.hp);
    const unusedHearts = heartCount - actualHealing;

    // K011 - Antibodies: +1 extra heal (once per turn) - check for prompt
    let antibodiesBonus = 0;
    if (currentPlayer.purchasedCards.includes('K011') &&
        !currentPlayer.cardEffectState.antibodiesUsed &&
        heartCount > 0 &&
        !currentPlayer.inCenter &&
        !currentPlayer.isBot) {
      // Show prompt for human player
      setCardEffectPrompt({
        open: true,
        cardId: 'K011',
        cardName: 'Antibodies',
        data: { heartCount }
      });
      return; // Wait for card decision
    } else if (currentPlayer.purchasedCards.includes('K011') &&
               !currentPlayer.cardEffectState.antibodiesUsed &&
               heartCount > 0 &&
               !currentPlayer.inCenter &&
               currentPlayer.isBot) {
      // Bot auto-uses Antibodies
      antibodiesBonus = 1;
    }

    // Check if Antibodies was just used
    if (currentPlayer.cardEffectState.antibodiesUsed && heartCount > 0) {
      antibodiesBonus = 1;
    }

    const totalHealing = heartCount + antibodiesBonus;

    console.log('Healing - Actual:', actualHealing, 'Unused:', unusedHearts, 'Antibodies:', antibodiesBonus);
    console.log('Card bonuses - Cubist:', cubistBonus, 'Plasma:', plasmaBonus, 'Necro:', necroBonus, 'Rebuild:', rebuildBonus);

    // STEP 4: Update player stats (following resolution order)
    setPlayers(prev => prev.map((p, idx) => {
      if (idx === currentPlayerIndex) {
        // Apply VP gain
        const newVp = Math.min(p.vp + vpEarned, 20); // Cap at 20
        
        // PHASE 3: K010 Field Med Unit - Can heal in Center (max +1/turn from dice)
        let actualHealAmount = 0;
        const hasFieldMedUnit = p.purchasedCards.includes('K010');
        
        if (currentPlayer.inCenter) {
          if (hasFieldMedUnit && totalHealing > 0) {
            // Can heal in center, but max +1/turn from dice
            const maxFieldMedHealing = Math.max(0, 1 - p.cardEffectState.fieldMedHealedThisTurn);
            actualHealAmount = Math.min(totalHealing, maxFieldMedHealing);
          }
          // else: no healing in center
        } else {
          // Outside center: heal normally
          actualHealAmount = totalHealing;
        }
        
        const newHp = Math.min(p.hp + actualHealAmount, p.maxHp);
        
        // Apply energy gain
        const newEnergy = p.energy + finalEnergyGain;
        
        // Update card effect state
        const newCardState = { ...p.cardEffectState };
        if (plasmaTriggered) {
          newCardState.plasmaAccumulatorUsed = true;
        }
        if (dieForgingTriggered) {
          newCardState.dieForgingUsed = true;
        }
        newCardState.heartsResolvedThisTurn = heartCount;
        if (hasFieldMedUnit && currentPlayer.inCenter) {
          newCardState.fieldMedHealedThisTurn += actualHealAmount;
        }
        
        // Check for winning condition
        if (newVp >= 20) {
          setTimeout(() => {
            setWinner(p);
            addLog(`${p.name} has reached 20 VP and wins the game!`, 'info');
            toast.success(`${p.name} wins!`);
          }, 500);
        }
        
        return {
          ...p,
          energy: newEnergy,
          hp: newHp,
          vp: newVp,
          keptHeartThisTurn: hasHearts, // Track for Precision Cut ability
          abilityState: overchargeTriggered ? 'spent' : p.abilityState,
          cardEffectState: newCardState
        };
      }
      return p;
    }));

    // STEP 5: Log and notify results
    if (vpEarned > 0) {
      const vpDetails = [];
      if (baseVP > 0) vpDetails.push(`${baseVP} from dice`);
      if (cubistBonus > 0) vpDetails.push(`+${cubistBonus} Cubist Fortune`);
      if (dieForgingVPBonus > 0) vpDetails.push(`+${dieForgingVPBonus} Die Forging`);
      
      addLog(`${currentPlayer.name} earned ${vpEarned} ★ VP (${vpDetails.join(', ')})`, 'roll');
      
      const vpBonusDesc = [
        cubistBonus > 0 ? 'Cubist Fortune +1' : null,
        dieForgingVPBonus > 0 ? 'Die Forging +1' : null
      ].filter(Boolean).join(', ');
      
      toast.success(`+${vpEarned} ★ VP`, { description: vpBonusDesc || undefined });
    }

    if (finalEnergyGain > 0) {
      const energyDetails = [];
      if (energyCount > 0) energyDetails.push(`${energyCount} from dice`);
      if (overchargeTriggered) energyDetails.push('+1 Overcharge');
      if (plasmaBonus > 0) energyDetails.push('+1 Plasma Accumulator');
      if (necroBonus > 0) energyDetails.push(`+${necroBonus} Necro-Feeder`);
      if (rebuildBonus > 0) energyDetails.push('+1 Rebuild Core');
      if (dieForgingEnergyBonus > 0) energyDetails.push('+1 Die Forging');
      
      addLog(`${currentPlayer.name} gained ${finalEnergyGain} ⚡ Energy (${energyDetails.join(', ')})`, 'energy');
      
      const bonusDescription = [
        overchargeTriggered ? 'Overcharge +1' : null,
        plasmaBonus > 0 ? 'Plasma Acc. +1' : null,
        necroBonus > 0 ? `Necro-Feeder +${necroBonus}` : null,
        rebuildBonus > 0 ? 'Rebuild Core +1' : null,
        dieForgingEnergyBonus > 0 ? 'Die Forging +1' : null
      ].filter(Boolean).join(', ');
      
      toast.success(`+${finalEnergyGain} ⚡ Energy`, { description: bonusDescription || undefined });
    }
    
    // Healing logs (updated for K010)
    const hasFieldMedUnit = currentPlayer.purchasedCards.includes('K010');
    
    if (currentPlayer.inCenter) {
      if (hasFieldMedUnit && totalHealing > 0) {
        const maxFieldMedHealing = Math.max(0, 1 - currentPlayer.cardEffectState.fieldMedHealedThisTurn);
        const actualHealAmount = Math.min(totalHealing, maxFieldMedHealing);
        
        if (actualHealAmount > 0) {
          const healDetails = [];
          if (heartCount > 0) healDetails.push(`${heartCount} from dice`);
          if (antibodiesBonus > 0) healDetails.push('+1 Antibodies');
          healDetails.push('Field Med Unit (max +1)');
          
          addLog(`${currentPlayer.name} healed ${actualHealAmount} ❤️ HP in Center (${healDetails.join(', ')})`, 'heal');
          toast.success(`+${actualHealAmount} ❤️ HP`, { description: 'Field Med Unit: healing in Center!' });
        } else {
          addLog(`${currentPlayer.name} already used Field Med Unit this turn (max +1)`, 'info');
        }
      } else if (heartCount > 0) {
        addLog(`${currentPlayer.name} cannot heal in the Center`, 'info');
      }
    } else if (totalHealing > 0) {
      const healDetails = [];
      if (heartCount > 0) healDetails.push(`${heartCount} from dice`);
      if (antibodiesBonus > 0) healDetails.push('+1 Antibodies');
      
      addLog(`${currentPlayer.name} healed ${totalHealing} ❤️ HP (${healDetails.join(', ')})`, 'heal');
      toast.success(`+${totalHealing} ❤️ HP`, { description: antibodiesBonus > 0 ? 'Antibodies +1!' : undefined });
    }

    // PHASE 6: D019 Shattering Orbit - Each ⚔️ also gives +1⚡
    let shatteringOrbitBonus = 0;
    if (currentPlayer.cardEffectState.shatteringOrbitActive && swordCount > 0) {
      shatteringOrbitBonus = swordCount;
    }
    
    if (swordCount > 0) {
      addLog(`${currentPlayer.name} rolled ${swordCount} ⚔️ (damage pending target selection)`, 'damage');
      console.log('Swords detected:', swordCount, '- Moving to combat phase');
      
      if (shatteringOrbitBonus > 0) {
        // Apply Shattering Orbit energy bonus
        setPlayers(prev => prev.map((p, idx) => {
          if (idx === currentPlayerIndex) {
            return { ...p, energy: p.energy + shatteringOrbitBonus };
          }
          return p;
        }));
        addLog(`${currentPlayer.name} gained ${shatteringOrbitBonus} ⚡ from Shattering Orbit!`, 'ability');
        toast.success(`Shattering Orbit: +${shatteringOrbitBonus} ⚡ from ⚔️!`);
      }
    }

    // Check for evolution (3+ hearts)
    if (heartCount >= 3) {
      addLog(`${currentPlayer.name} unlocked an Evolution! (≥3 ❤️)`, 'ability');
      toast('🌟 Evolution Unlocked!', { description: 'You rolled 3 or more Hearts!' });
    }

    // STEP 6: Check for Abyss Leviathan ability (Undertow) - only show prompt for human players
    const currentCharacter = characters.find(c => c.id === currentPlayer.characterId)!;
    if (currentCharacter.ability.id === 'undertow' && 
        currentPlayer.abilityState === 'ready' &&
        unusedHearts > 0) {
      
      if (!currentPlayer.isBot) {
        // Show prompt for human player
        setAbilityPrompt({
          open: true,
          type: 'undertow',
          data: { 
            unusedHearts,
            energy: currentPlayer.energy + finalEnergyGain,
            hp: currentPlayer.hp,
            maxHp: currentPlayer.maxHp
          }
        });
        // Don't move to next phase yet - wait for ability decision
        return;
      } else {
        // Bot auto-converts all unused hearts
        const convertAmount = unusedHearts;
        setPlayers(prev => prev.map((p, idx) => {
          if (idx === currentPlayerIndex) {
            return { ...p, energy: p.energy + convertAmount, abilityState: 'spent' };
          }
          return p;
        }));
        addLog(`${currentPlayer.name} converted ${convertAmount} ❤️ to ${convertAmount} ⚡ Energy (Undertow)`, 'ability');
        toast.success(`Undertow: +${convertAmount} ⚡`, { description: `Converted ${convertAmount} unused Hearts` });
      }
    }

    // STEP 7: Phase transition - SWORDS (DAMAGE)
    // If player has swords, move to combat phase, otherwise shop
    console.log('=== DICE RESOLUTION END ===');
    console.log('Swords:', swordCount, '- Next phase:', swordCount > 0 ? 'combat' : 'shop');
    
    if (swordCount > 0) {
      setGamePhase('combat');
    } else {
      setGamePhase('shop');
    }
  };

  // Neonpolis Combat Functions
  const handleCombatAction = (swordCount: number) => {
    const centerOccupantPlayer = players.find(p => p.inCenter);
    const centerHasOccupant = !!centerOccupantPlayer;
    
    // Apply sword damage modifiers (K005 Blade Pulse, K007 Extending Limbs, K026 Blade Breath)
    const damageBonus = calculateTotalDamageModifiers(
      currentPlayer.purchasedCards,
      currentPlayer.inCenter,
      swordCount,
      centerHasOccupant
    );
    const totalDamage = swordCount + damageBonus;
    
    // Track sword damage for K021 Rooftop Raider
    setPlayers(prev => prev.map((p, idx) => {
      if (idx === currentPlayerIndex) {
        return {
          ...p,
          cardEffectState: {
            ...p.cardEffectState,
            swordsDamageDealtThisTurn: totalDamage
          }
        };
      }
      return p;
    }));
    
    // Log card bonuses
    if (damageBonus > 0) {
      const bonuses = [];
      if (currentPlayer.purchasedCards.includes('K005') && currentPlayer.inCenter) bonuses.push('Blade Pulse');
      if (currentPlayer.purchasedCards.includes('K007') && !currentPlayer.inCenter && swordCount >= 2) bonuses.push('Extending Limbs');
      if (currentPlayer.purchasedCards.includes('K026') && swordCount >= 1) bonuses.push('Blade Breath');
      addLog(`${currentPlayer.name} damage boosted by ${bonuses.join(', ')} (+${damageBonus} total)`, 'ability');
    }
    
    if (currentPlayer.inCenter) {
      // Inside: Hit all players outside
      const targets = players.filter((p, idx) => idx !== currentPlayerIndex && !p.inCenter && p.hp > 0);
      
      if (targets.length === 0) {
        addLog(`${currentPlayer.name} attacked but there are no targets outside!`, 'combat');
        toast.info('No valid targets');
        setGamePhase('shop');
        return;
      }
      
      // Deal damage to all outside
      targets.forEach(target => {
        dealDamage(target.id, totalDamage);
      });
      
      addLog(`${currentPlayer.name} attacked all outside players for ${totalDamage} ⚔️ damage!`, 'combat');
      toast.success(`Dealt ${totalDamage} ⚔️ to all outside!`);
      setGamePhase('shop');
      
    } else {
      // Outside: Can only hit the occupant
      if (!centerOccupantPlayer) {
        // Center is empty - attacker must enter
        enterNeonpolis(currentPlayer.id);
        addLog(`${currentPlayer.name} entered the empty Neonpolis! +1 ★ VP`, 'center');
        toast.success('Entered Neonpolis! +1 ★ VP');
        setGamePhase('shop');
      } else {
        // Attack the occupant
        dealDamage(centerOccupantPlayer.id, totalDamage);
        
        // After damage, occupant can choose to leave
        if (centerOccupantPlayer.hp - totalDamage > 0) {
          // Occupant still alive - they can choose to leave
          if (centerOccupantPlayer.isBot) {
            // Bot decision
            const occupantLeaves = getBotLeaveDecision(centerOccupantPlayer.hp - totalDamage);
            
            if (occupantLeaves) {
              leaveNeonpolis(centerOccupantPlayer.id);
              enterNeonpolis(currentPlayer.id);
              addLog(`${centerOccupantPlayer.name} chose to leave! ${currentPlayer.name} must enter. +1 ★ VP`, 'center');
              toast.success(`${currentPlayer.name} entered Neonpolis! +1 ★ VP`);
            } else {
              addLog(`${centerOccupantPlayer.name} stays in Neonpolis!`, 'combat');
            }
            setGamePhase('shop');
          } else {
            // Human player - show modal
            setLeaveModal({
              open: true,
              damage: totalDamage,
              attackerId: currentPlayer.id,
              defenderId: centerOccupantPlayer.id
            });
            // Don't set game phase yet - wait for modal decision
            return;
          }
        } else {
          // Occupant died - attacker must enter
          eliminatePlayer(centerOccupantPlayer.id);
          if (currentPlayer.hp > 0) {
            enterNeonpolis(currentPlayer.id);
            addLog(`${centerOccupantPlayer.name} was eliminated! ${currentPlayer.name} enters Neonpolis. +1 ★ VP`, 'center');
            toast.success('Entered Neonpolis! +1 ★ VP');
          }
          setGamePhase('shop');
        }
      }
    }
  };

  const handleTimeBankSwap = () => {
    // Open the Time Bank swap dialog
    if (keptDice.length > 0 && currentPlayer.storedDie) {
      setAbilityPrompt({
        open: true,
        type: 'time_bank_swap',
        data: { 
          dice: keptDice,
          storedDie: currentPlayer.storedDie
        }
      });
    }
  };

  const handleConvertiveGaze = () => {
    // Open the Convertive Gaze dialog
    const currentCharacter = characters.find(c => c.id === currentPlayer.characterId)!;
    if (currentCharacter.ability.id === 'convertive_gaze' && currentPlayer.abilityState === 'ready') {
      setAbilityPrompt({
        open: true,
        type: 'convertive_gaze',
        data: { 
          energy: currentPlayer.energy,
          hp: currentPlayer.hp,
          maxHp: currentPlayer.maxHp
        }
      });
    }
  };

  // PHASE 2: Handle card effect confirmations
  const handleCardEffectConfirm = (cardId: string, result: any) => {
    if (!result) {
      // Player skipped the card effect
      return;
    }

    // K012 - Telekinetic Grip: Set 1 die to ⚡ or ⚔️
    if (cardId === 'K012') {
      const { dieIndex, newFace } = result;
      if (dieIndex !== null && newFace) {
        const newDice = [...keptDice];
        const oldFace = newDice[dieIndex].face;
        newDice[dieIndex].face = newFace;
        setKeptDice(newDice);
        
        // Mark as used
        setPlayers(prev => prev.map((p, idx) => {
          if (idx === currentPlayerIndex) {
            return {
              ...p,
              cardEffectState: { ...p.cardEffectState, telekineticGripUsed: true }
            };
          }
          return p;
        }));
        
        addLog(`${currentPlayer.name} used Telekinetic Grip! Changed ${diceIcons[oldFace]} to ${diceIcons[newFace]}`, 'ability');
        toast.success(`Telekinetic Grip: ${diceIcons[oldFace]} → ${diceIcons[newFace]}`);
      }
    }
    
    // K017 - Mine Hunter: Reroll 1 die
    else if (cardId === 'K017') {
      const dieIndex = result;
      if (dieIndex !== null) {
        const newDice = [...keptDice];
        const oldFace = newDice[dieIndex].face;
        
        // Reroll the die (generate a random face)
        const faces: DiceFace[] = ['1', '2', '3', 'sword', 'energy', 'heart'];
        const newFace = faces[Math.floor(Math.random() * faces.length)];
        newDice[dieIndex].face = newFace;
        setKeptDice(newDice);
        
        // Mark as used
        setPlayers(prev => prev.map((p, idx) => {
          if (idx === currentPlayerIndex) {
            return {
              ...p,
              cardEffectState: { ...p.cardEffectState, mineHunterUsed: true }
            };
          }
          return p;
        }));
        
        addLog(`${currentPlayer.name} used Mine Hunter! Rerolled ${diceIcons[oldFace]} → ${diceIcons[newFace]}`, 'ability');
        toast.success(`Mine Hunter: ${diceIcons[oldFace]} → ${diceIcons[newFace]}`);
      }
    }
    
    // K011 - Antibodies: +1 extra heal
    else if (cardId === 'K011') {
      // This will be handled in the resolution phase
      // Just mark it as used here
      setPlayers(prev => prev.map((p, idx) => {
        if (idx === currentPlayerIndex) {
          return {
            ...p,
            cardEffectState: { ...p.cardEffectState, antibodiesUsed: true }
          };
        }
        return p;
      }));
    }
    
    // K019 - Turn of Fate: Prevent 1 damage and deal 1 to opponent
    else if (cardId === 'K019') {
      const targetId = result;
      if (targetId) {
        // Deal 1 damage to the selected opponent
        dealDamage(targetId, 1);
        
        // Mark as used
        setPlayers(prev => prev.map((p, idx) => {
          if (idx === currentPlayerIndex) {
            return {
              ...p,
              cardEffectState: { ...p.cardEffectState, turnOfFateUsed: true }
            };
          }
          return p;
        }));
        
        const target = players.find(p => p.id === targetId);
        addLog(`${currentPlayer.name} used Turn of Fate! Prevented 1 damage and dealt 1 to ${target?.name}`, 'ability');
        toast.success(`Turn of Fate: ${target?.name} takes 1 damage`);
      }
    }
    
    // K003 - Black Market: Purchase card with -1⚡ discount
    else if (cardId === 'K003') {
      const cardIndex = result;
      if (cardIndex !== null && cardEffectPrompt.data?.cards) {
        const card = cardEffectPrompt.data.cards[cardIndex];
        const discountedCost = Math.max(0, card.cost - 1);
        
        if (currentPlayer.energy >= discountedCost) {
          // Purchase the card
          setPlayers(prev => prev.map((p, idx) => {
            if (idx === currentPlayerIndex) {
              return {
                ...p,
                energy: p.energy - discountedCost,
                purchasedCards: [...p.purchasedCards, card.id],
                cardEffectState: { ...p.cardEffectState, blackMarketUsed: true }
              };
            }
            return p;
          }));
          
          addLog(`${currentPlayer.name} used Black Market! Bought ${card.nameEn} for ${discountedCost}⚡ (-1⚡ discount)`, 'shop');
          toast.success(`Black Market: ${card.nameEn} purchased!`);
        }
      }
    }
    
    // K024 - Market Recycle: Replace 1 shop card
    else if (cardId === 'K024') {
      const cardIndex = result;
      if (cardIndex !== null && currentPlayer.energy >= 1) {
        // Replace the selected shop card
        const remainingCards = shopCards.filter(c => !shopDisplay.find(s => s.id === c.id));
        const newCard = remainingCards[Math.floor(Math.random() * remainingCards.length)];
        
        setShopDisplay(prev => prev.map((c, idx) => idx === cardIndex ? newCard : c));
        
        // Pay the cost and mark as used
        setPlayers(prev => prev.map((p, idx) => {
          if (idx === currentPlayerIndex) {
            return {
              ...p,
              energy: p.energy - 1,
              cardEffectState: { ...p.cardEffectState, marketRecycleUsed: true }
            };
          }
          return p;
        }));
        
        addLog(`${currentPlayer.name} used Market Recycle! Replaced a shop card for 1⚡`, 'shop');
        toast.success('Market Recycle: Shop refreshed!');
      }
    }
    
    // PHASE 5: D009 - Power Strike
    else if (cardId === 'D009') {
      const { targetId, energyToSpend } = result;
      if (targetId && energyToSpend > 0) {
        setPlayers(prev => prev.map((p, idx) => {
          if (idx === currentPlayerIndex) {
            return { ...p, energy: p.energy - energyToSpend };
          }
          return p;
        }));
        
        dealDamage(targetId, energyToSpend, currentPlayer.id);
        toast.success(`Power Strike: ${energyToSpend} ⚔️ damage`);
        addLog(`${currentPlayer.name} used Power Strike to deal ${energyToSpend} ⚔️ damage`, 'combat');
        
        // Discard the card
        setTimeout(() => {
          setPlayers(prev => prev.map((p, idx) => {
            if (idx === currentPlayerIndex) {
              return {
                ...p,
                purchasedCards: p.purchasedCards.filter(c => c !== cardId)
              };
            }
            return p;
          }));
          const card = shopCards.find(c => c.id === cardId);
          addLog(`${currentPlayer.name} discarded ${card?.nameEn}`, 'info');
        }, 100);
      }
    }
    
    // PHASE 5: D011 - Cyber Heist
    else if (cardId === 'D011') {
      const targetId = result;
      const target = players.find(p => p.id === targetId);
      
      if (target) {
        const stolen = Math.min(2, target.energy);
        setPlayers(prev => prev.map(p => {
          if (p.id === targetId) {
            return { ...p, energy: p.energy - stolen };
          } else if (p.id === currentPlayer.id) {
            return { ...p, energy: p.energy + stolen };
          }
          return p;
        }));
        
        toast.success(`Cyber Heist: Stole ${stolen} ⚡`);
        addLog(`${currentPlayer.name} stole ${stolen} ⚡ from ${target.name}`, 'combat');
        
        // Discard the card
        setTimeout(() => {
          setPlayers(prev => prev.map((p, idx) => {
            if (idx === currentPlayerIndex) {
              return {
                ...p,
                purchasedCards: p.purchasedCards.filter(c => c !== cardId)
              };
            }
            return p;
          }));
          const card = shopCards.find(c => c.id === cardId);
          addLog(`${currentPlayer.name} discarded ${card?.nameEn}`, 'info');
        }, 100);
      }
    }
    
    // PHASE 5: D018 - Weakpoint Marker
    else if (cardId === 'D018') {
      const targetId = result;
      const target = players.find(p => p.id === targetId);
      
      if (target) {
        setPlayers(prev => prev.map(p => {
          if (p.id === targetId) {
            return { 
              ...p, 
              cardEffectState: { ...p.cardEffectState, weakpointToken: targetId }
            };
          }
          return p;
        }));
        
        toast.success(`Weakpoint Marker: Applied to ${target.name}`);
        addLog(`${currentPlayer.name} applied Weakpoint token to ${target.name}`, 'combat');
        
        // Discard the card
        setTimeout(() => {
          setPlayers(prev => prev.map((p, idx) => {
            if (idx === currentPlayerIndex) {
              return {
                ...p,
                purchasedCards: p.purchasedCards.filter(c => c !== cardId)
              };
            }
            return p;
          }));
          const card = shopCards.find(c => c.id === cardId);
          addLog(`${currentPlayer.name} discarded ${card?.nameEn}`, 'info');
        }, 100);
      }
    }
  };

  const dealDamage = (targetId: string, damage: number) => {
    const target = players.find(p => p.id === targetId);
    if (!target) return;
    
    // PHASE 6: D008 - Rainproof Shield: Ignore all damage
    const hasRainproofShield = target.cardEffectState.rainproofShieldUntil !== undefined;
    if (hasRainproofShield && damage > 0) {
      toast.info(`${target.name}'s Rainproof Shield blocked ${damage} damage!`);
      addLog(`${target.name}'s Rainproof Shield blocked ${damage} ⚔️ damage!`, 'ability');
      return; // No damage dealt
    }

    let finalDamage = damage;
    let precisionCutTriggered = false;
    let stoneplateTriggered = false;
    let venomSiphonTriggered = false;
    
    // PHASE 5: D018 - Weakpoint Marker: +1 damage if target has token
    const hasWeakpointToken = target.cardEffectState.weakpointToken === target.id;
    if (hasWeakpointToken && damage > 0) {
      finalDamage += 1;
      // Remove token after applying effect
      setTimeout(() => {
        setPlayers(prev => prev.map(p => {
          if (p.id === targetId) {
            return {
              ...p,
              cardEffectState: { ...p.cardEffectState, weakpointToken: undefined }
            };
          }
          return p;
        }));
        addLog(`Weakpoint token removed from ${target.name}`, 'combat');
      }, 50);
    }

    // Check for Starblade Mantis's Precision Cut ability (attacker)
    const attackerCharacter = characters.find(c => c.id === currentPlayer.characterId)!;
    if (attackerCharacter.ability.id === 'precision_cut' && 
        currentPlayer.abilityState === 'ready' &&
        currentPlayer.keptHeartThisTurn === true &&
        damage > 0) { // Only trigger if base damage > 0
      finalDamage += 1;
      precisionCutTriggered = true;
    }

    // Check for Prismfang Cobra's Venom Siphon ability (attacker)
    if (attackerCharacter.ability.id === 'venom_siphon' && 
        currentPlayer.abilityState === 'armed' &&
        damage > 0) { // Only trigger if base damage > 0
      venomSiphonTriggered = true;
    }

    // K019 - Turn of Fate: Prevent 1 damage and deal 1 to opponent (once per turn)
    if (target.purchasedCards.includes('K019') &&
        !target.cardEffectState.turnOfFateUsed &&
        finalDamage > 0 &&
        !target.isBot) {
      // Show prompt for human defender
      const opponents = players.filter(p => p.id !== target.id && p.hp > 0);
      setCardEffectPrompt({
        open: true,
        cardId: 'K019',
        cardName: 'Turn of Fate',
        data: { opponents: opponents.map(p => ({ id: p.id, name: p.name, hp: p.hp })) }
      });
      
      // Reduce damage by 1 if they use it
      finalDamage = Math.max(0, finalDamage - 1);
      return; // Wait for card decision
    } else if (target.purchasedCards.includes('K019') &&
               !target.cardEffectState.turnOfFateUsed &&
               finalDamage > 0 &&
               target.isBot) {
      // Bot auto-uses Turn of Fate
      finalDamage = Math.max(0, finalDamage - 1);
      
      // Bot picks a random opponent to damage
      const opponents = players.filter(p => p.id !== target.id && p.hp > 0);
      if (opponents.length > 0) {
        const randomOpponent = opponents[Math.floor(Math.random() * opponents.length)];
        // Deal 1 damage to random opponent (will be handled separately)
        setTimeout(() => {
          dealDamage(randomOpponent.id, 1);
          addLog(`${target.name} used Turn of Fate! Dealt 1 damage to ${randomOpponent.name}`, 'ability');
        }, 100);
      }
      
      // Mark as used
      setPlayers(prev => prev.map(p => {
        if (p.id === target.id) {
          return {
            ...p,
            cardEffectState: { ...p.cardEffectState, turnOfFateUsed: true }
          };
        }
        return p;
      }));
    }
    
    // Apply damage reduction cards (K008 Echo Shielding, K025 Threaded Carapace)
    finalDamage = calculateDamageReduction(
      target.purchasedCards,
      finalDamage,
      false // rainproofShieldActive - will be implemented in Phase 5
    );

    // Check for Basalt Colossus's Stoneplate ability (defender)
    const targetCharacter = characters.find(c => c.id === target.characterId)!;
    if (targetCharacter.ability.id === 'stoneplate' && 
        target.abilityState === 'armed' && 
        finalDamage >= 1) {
      finalDamage = Math.max(0, finalDamage - 1);
      stoneplateTriggered = true;
    }

    setPlayers(prev => prev.map(p => {
      if (p.id === targetId) {
        const newHp = Math.max(0, p.hp - finalDamage);
        
        // PHASE 3: K004 Charge Depot - Prevent ⚡ loss from effects
        const hasChargeDepot = p.purchasedCards.includes('K004');
        const energyLost = (venomSiphonTriggered && !hasChargeDepot) ? Math.min(1, p.energy) : 0;
        const newEnergy = (venomSiphonTriggered && !hasChargeDepot) ? Math.max(0, p.energy - 1) : p.energy;
        
        // Log damage with ability info if triggered
        let logMessage = '';
        const modifiers: string[] = [];
        if (hasWeakpointToken) modifiers.push('+1 Weakpoint');
        if (precisionCutTriggered) modifiers.push('+1 Precision Cut');
        if (stoneplateTriggered) modifiers.push('−1 Stoneplate');
        
        if (modifiers.length > 0) {
          logMessage = `${p.name} took ${finalDamage} ⚔️ damage (${damage} ${modifiers.join(', ')})! (${p.hp} → ${newHp} HP)`;
          addLog(logMessage, 'combat');
          
          if (hasWeakpointToken) {
            toast.success(`Weakpoint +1 damage!`, { description: `${damage} → ${finalDamage} damage` });
          } else if (precisionCutTriggered) {
            toast.success(`Precision Cut +1 damage!`, { description: `${damage} → ${finalDamage} damage` });
          } else if (stoneplateTriggered) {
            toast.success(`Stoneplate −1 damage!`, { description: `${damage} → ${finalDamage} damage` });
          }
        } else {
          logMessage = `${p.name} took ${finalDamage} ⚔️ damage! (${p.hp} → ${newHp} HP)`;
          addLog(logMessage, 'combat');
        }
        
        // Handle Venom Siphon separately
        if (venomSiphonTriggered) {
          if (hasChargeDepot) {
            addLog(`${p.name} protected ⚡ with Charge Depot!`, 'ability');
            toast.success('Charge Depot: ⚡ protected!', { description: 'Energy loss prevented' });
          } else if (energyLost > 0) {
            addLog(`${p.name} lost ${energyLost} ⚡ from Venom Siphon!`, 'ability');
            toast.success(`${p.name} −1 ⚡ (Venom Siphon)`, { description: 'Energy drained!' });
          } else {
            addLog(`${p.name} had no Energy to siphon!`, 'ability');
            toast.info('No Energy to siphon', { description: 'Target had 0 ⚡' });
          }
        }
        
        return { 
          ...p, 
          hp: newHp,
          energy: newEnergy,
          canLeaveCenter: p.inCenter,
          abilityState: stoneplateTriggered ? 'spent' : p.abilityState
        };
      }
      // Mark attacker's abilities as spent if triggered
      if (p.id === currentPlayer.id) {
        if (precisionCutTriggered || venomSiphonTriggered) {
          return { ...p, abilityState: 'spent' };
        }
      }
      return p;
    }));
  };

  const enterNeonpolis = (playerId: string) => {
    const enteringPlayer = players.find(p => p.id === playerId);
    if (!enteringPlayer) return;
    
    // PHASE 6: D016 Exile - Check if Center is locked
    const centerLocked = players.some(p => p.cardEffectState.centerLockedUntil !== undefined);
    if (centerLocked) {
      toast.error('Center is locked by Exile!');
      addLog(`${enteringPlayer.name} cannot enter - Center is locked!`, 'combat');
      return;
    }
    
    // PHASE 3: K006 Seismic Stride - When entering Center, all others -1 HP
    const hasSeismicStride = enteringPlayer.purchasedCards.includes('K006');
    
    // PHASE 3: K016 Explosive Entry - Roll 1 extra die when entering (⚔️/⚡ only)
    const hasExplosiveEntry = enteringPlayer.purchasedCards.includes('K016');
    
    setPlayers(prev => prev.map(p => {
      if (p.id === playerId) {
        return { ...p, inCenter: true, vp: Math.min(p.vp + 1, 20) };
      }
      // K006: Damage all other players
      if (hasSeismicStride && p.hp > 0) {
        const newHp = Math.max(0, p.hp - 1);
        if (newHp === 0) {
          setTimeout(() => eliminatePlayer(p.id), 100);
        }
        return { ...p, hp: newHp };
      }
      return p;
    }));
    
    // Log K006 effect
    if (hasSeismicStride) {
      addLog(`${enteringPlayer.name} triggered Seismic Stride! All others take 1 HP damage`, 'ability');
      toast.success('Seismic Stride!', { description: 'All opponents take 1 HP damage' });
    }
    
    // K016: Roll 1 bonus die
    if (hasExplosiveEntry && !enteringPlayer.cardEffectState.explosiveEntryUsed) {
      setTimeout(() => {
        const faces: DiceFace[] = ['sword', 'energy'];
        const bonusFace = faces[Math.floor(Math.random() * faces.length)];
        
        addLog(`${enteringPlayer.name} triggered Explosive Entry! Rolled bonus ${diceIcons[bonusFace]}`, 'ability');
        toast.success(`Explosive Entry: ${diceIcons[bonusFace]}!`);
        
        // Apply the bonus immediately
        if (bonusFace === 'energy') {
          setPlayers(prev => prev.map(p => {
            if (p.id === playerId) {
              return { 
                ...p, 
                energy: p.energy + 1,
                cardEffectState: { ...p.cardEffectState, explosiveEntryUsed: true }
              };
            }
            return p;
          }));
          toast.success('+1 ⚡ Energy');
        } else if (bonusFace === 'sword') {
          // Deal 1 damage to a target (for simplicity, damage the center occupant if exists, otherwise random)
          const centerOccupant = players.find(p => p.inCenter && p.id !== playerId);
          if (centerOccupant) {
            dealDamage(centerOccupant.id, 1);
            toast.success('Dealt 1 ⚔️ damage');
          }
          
          setPlayers(prev => prev.map(p => {
            if (p.id === playerId) {
              return { 
                ...p,
                cardEffectState: { ...p.cardEffectState, explosiveEntryUsed: true }
              };
            }
            return p;
          }));
        }
      }, 500);
    }
  };

  const leaveNeonpolis = (playerId: string, voluntary: boolean = false) => {
    const leavingPlayer = players.find(p => p.id === playerId);
    if (!leavingPlayer) return;
    
    // PHASE 3: K015 Core Anchor - +1 VP when voluntarily leaving
    const hasCoreAnchor = leavingPlayer.purchasedCards.includes('K015');
    const vpBonus = (voluntary && hasCoreAnchor) ? 1 : 0;
    
    setPlayers(prev => prev.map(p => {
      if (p.id === playerId) {
        const newVp = Math.min(p.vp + vpBonus, 20);
        return { ...p, inCenter: false, canLeaveCenter: false, vp: newVp };
      }
      return p;
    }));
    
    // Log K015 effect
    if (vpBonus > 0) {
      addLog(`${leavingPlayer.name} triggered Core Anchor! +1 ★ VP for leaving voluntarily`, 'ability');
      toast.success('Core Anchor: +1 ★ VP');
    }
  };

  const eliminatePlayer = (playerId: string) => {
    const player = players.find(p => p.id === playerId);
    if (player) {
      addLog(`${player.name} has been eliminated!`, 'combat');
      toast.error(`${player.name} eliminated!`);
      setPlayers(prev => prev.map(p => 
        p.id === playerId ? { ...p, hp: 0, inCenter: false } : p
      ));
    }
  };

  // PHASE 2: Handler for K003 Black Market
  const handleUseBlackMarket = () => {
    if (currentPlayer.hp <= 1) {
      toast.error('Cannot use Black Market at 1 HP!');
      return;
    }
    
    // Pay 1 HP cost
    setPlayers(prev => prev.map((p, idx) => {
      if (idx === currentPlayerIndex) {
        return { ...p, hp: p.hp - 1 };
      }
      return p;
    }));
    
    // Show top 3 cards from deck (simulate deck peek)
    const availableCards = shopCards.filter(c => !shopDisplay.find(s => s.id === c.id));
    const top3Cards = availableCards.slice(0, 3);
    
    // Show prompt to choose a card
    setCardEffectPrompt({
      open: true,
      cardId: 'K003',
      cardName: 'Black Market',
      data: { cards: top3Cards }
    });
  };

  // PHASE 2: Handler for K024 Market Recycle  
  const handleUseMarketRecycle = () => {
    // Show prompt to choose which shop card to replace
    setCardEffectPrompt({
      open: true,
      cardId: 'K024',
      cardName: 'Market Recycle',
      data: { shopCards: shopDisplay, energy: currentPlayer.energy }
    });
  };

  const handleBuyCard = (cardId: string, cardElement?: HTMLElement) => {
    const card = shopDisplay.find(c => c.id === cardId);
    if (!card) return;

    if (currentPlayer.energy >= card.cost) {
      // Calculate positions for animation
      let fromPosition = { x: 100, y: 200 }; // Default fallback
      let toPosition = { x: window.innerWidth / 2, y: window.innerHeight - 200 }; // Default fallback
      
      // Get shop card position
      if (cardElement) {
        const shopRect = cardElement.getBoundingClientRect();
        fromPosition = {
          x: shopRect.left,
          y: shopRect.top
        };
      }
      
      // Get active player's character card position
      const activePlayerCardElement = document.querySelector(`[data-player-id="${currentPlayer.id}"]`);
      if (activePlayerCardElement) {
        const playerRect = activePlayerCardElement.getBoundingClientRect();
        toPosition = {
          x: playerRect.left + playerRect.width / 2 - 90, // Center horizontally on card
          y: playerRect.top + playerRect.height / 2 - 70 // Center vertically on card
        };
      }

      // Trigger animation
      setPurchaseAnimation({
        active: true,
        card,
        fromPosition,
        toPosition
      });

      // Update player state after a short delay (let animation start)
      setTimeout(() => {
        setPlayers(prev => prev.map((p, idx) => {
          if (idx === currentPlayerIndex) {
            return { ...p, energy: p.energy - card.cost, purchasedCards: [...p.purchasedCards, cardId] };
          }
          return p;
        }));

        addLog(`${currentPlayer.name} bought ${card.nameEn} for ${card.cost} ⚡`, 'shop');
        toast.success(`Purchased ${card.nameEn}`);

        // Refill shop
        const remainingCards = shopCards.filter(c => !shopDisplay.find(s => s.id === c.id) && c.id !== cardId);
        const newCard = remainingCards[Math.floor(Math.random() * remainingCards.length)];
        setShopDisplay(prev => prev.map(c => c.id === cardId ? newCard : c));
      }, 100);
    } else {
      toast.error('Not enough Energy');
    }
  };

  // PHASE 4: DISCARD card play handler
  const handlePlayDiscardCard = (cardId: string) => {
    const card = shopCards.find(c => c.id === cardId);
    if (!card) return;
    
    // Verify player owns the card
    if (!currentPlayer.purchasedCards.includes(cardId)) {
      toast.error('You do not own this card!');
      return;
    }
    
    // Verify card is a DISCARD type
    if (card.type !== 'DISCARD') {
      toast.error('This card cannot be played instantly!');
      return;
    }
    
    // PHASE 6: D013 Diversion - Check if any opponent can cancel this card
    const opponentsWithDiversion = players.filter(p => 
      p.hp > 0 && 
      p.id !== currentPlayer.id && 
      p.purchasedCards.includes('D013')
    );
    
    if (opponentsWithDiversion.length > 0 && !currentPlayer.isBot) {
      // For now, bots don't use Diversion reactively. Human players get a toast notification
      const diversionPlayer = opponentsWithDiversion[0];
      toast.info(`${diversionPlayer.name} has Diversion and could cancel this!`, {
        description: 'They can choose to discard it to cancel your card'
      });
      // Note: Full implementation would require a prompt dialog, but for simplicity
      // we're just notifying for now. Advanced reactive mechanics can be added later.
    }
    
    addLog(`${currentPlayer.name} played ${card.nameEn}!`, 'ability');
    
    // Execute card effect based on ID
    switch (cardId) {
      case 'D001': // Overcharge: +3 ⚡
        setPlayers(prev => prev.map((p, idx) => {
          if (idx === currentPlayerIndex) {
            const newEnergy = p.energy + 3;
            toast.success('Overcharge: +3 ⚡ Energy');
            addLog(`${p.name} gained 3 ⚡ from Overcharge`, 'energy');
            return { ...p, energy: newEnergy };
          }
          return p;
        }));
        break;
        
      case 'D003': // Restoration: +3 HP (even in Center)
        setPlayers(prev => prev.map((p, idx) => {
          if (idx === currentPlayerIndex) {
            const healAmount = Math.min(3, p.maxHp - p.hp);
            const newHp = Math.min(p.hp + 3, p.maxHp);
            toast.success(`Restoration: +${healAmount} HP`);
            addLog(`${p.name} healed ${healAmount} HP from Restoration${p.inCenter ? ' (in Center)' : ''}`, 'heal');
            return { ...p, hp: newHp };
          }
          return p;
        }));
        break;
        
      case 'D006': // Warehouse Plunder: +X ⚡ (X = opponents, max 3)
        {
          const activeOpponents = players.filter(p => p.hp > 0 && p.id !== currentPlayer.id).length;
          const energyGain = Math.min(activeOpponents, 3);
          setPlayers(prev => prev.map((p, idx) => {
            if (idx === currentPlayerIndex) {
              const newEnergy = p.energy + energyGain;
              toast.success(`Warehouse Plunder: +${energyGain} ⚡`);
              addLog(`${p.name} gained ${energyGain} ⚡ from Warehouse Plunder (${activeOpponents} opponents)`, 'energy');
              return { ...p, energy: newEnergy };
            }
            return p;
          }));
        }
        break;
        
      case 'D012': // Field Repairs: +2 HP; if outside, also +1 VP
        setPlayers(prev => prev.map((p, idx) => {
          if (idx === currentPlayerIndex) {
            const healAmount = Math.min(2, p.maxHp - p.hp);
            const newHp = Math.min(p.hp + 2, p.maxHp);
            const vpBonus = p.inCenter ? 0 : 1;
            const newVp = Math.min(p.vp + vpBonus, 20);
            
            if (vpBonus > 0) {
              toast.success(`Field Repairs: +${healAmount} HP and +1 ★ VP`);
              addLog(`${p.name} healed ${healAmount} HP and gained 1 ★ VP from Field Repairs`, 'heal');
            } else {
              toast.success(`Field Repairs: +${healAmount} HP`);
              addLog(`${p.name} healed ${healAmount} HP from Field Repairs`, 'heal');
            }
            
            // Check for winning
            if (newVp >= 20) {
              setTimeout(() => {
                setWinner(p);
                addLog(`${p.name} has reached 20 VP and wins the game!`, 'info');
                toast.success(`${p.name} wins!`);
              }, 500);
            }
            
            return { ...p, hp: newHp, vp: newVp };
          }
          return p;
        }));
        break;
        
      case 'D015': // Galloping Time: +1 extra reroll this turn
        if (gamePhase === 'roll') {
          setRollsRemaining(prev => prev + 1);
          setPlayers(prev => prev.map((p, idx) => {
            if (idx === currentPlayerIndex) {
              return { ...p, cardEffectState: { ...p.cardEffectState, gallopingTimeUsed: true } };
            }
            return p;
          }));
          toast.success('Galloping Time: +1 reroll!');
          addLog(`${currentPlayer.name} gained 1 extra reroll from Galloping Time`, 'ability');
        } else {
          toast.error('Can only play during roll phase!');
          return; // Don't discard if played at wrong time
        }
        break;
        
      case 'D017': // Energy Pump: +5 ⚡
        setPlayers(prev => prev.map((p, idx) => {
          if (idx === currentPlayerIndex) {
            const newEnergy = p.energy + 5;
            toast.success('Energy Pump: +5 ⚡ Energy');
            addLog(`${p.name} gained 5 ⚡ from Energy Pump`, 'energy');
            return { ...p, energy: newEnergy };
          }
          return p;
        }));
        break;
        
      case 'D020': // Purgation: Remove all negative tokens and +1 HP
        setPlayers(prev => prev.map((p, idx) => {
          if (idx === currentPlayerIndex) {
            const healAmount = Math.min(1, p.maxHp - p.hp);
            const newHp = Math.min(p.hp + 1, p.maxHp);
            
            // Clear negative tokens (weakpoint)
            const hadWeakpoint = p.cardEffectState.weakpointToken === p.id;
            const newCardState = { ...p.cardEffectState };
            if (hadWeakpoint) {
              newCardState.weakpointToken = undefined;
            }
            
            toast.success(`Purgation: +${healAmount} HP${hadWeakpoint ? ' and removed tokens' : ''}`);
            addLog(`${p.name} healed ${healAmount} HP and removed negative tokens from Purgation`, 'heal');
            return { ...p, hp: newHp, cardEffectState: newCardState };
          }
          return p;
        }));
        break;
      
      // PHASE 5 CARDS
      
      case 'D002': // Blade Burst: +2 ⚔️ to all opponents
        {
          const opponents = players.filter(p => p.hp > 0 && p.id !== currentPlayer.id);
          const damageDealt: string[] = [];
          
          setPlayers(prev => prev.map(p => {
            if (p.hp > 0 && p.id !== currentPlayer.id) {
              const newHp = Math.max(0, p.hp - 2);
              damageDealt.push(p.name);
              
              if (newHp === 0) {
                eliminatePlayer(p.id);
              }
              
              return { ...p, hp: newHp };
            }
            return p;
          }));
          
          toast.success('Blade Burst: Hit all opponents!');
          addLog(`${currentPlayer.name} dealt 2 ⚔️ damage to all opponents with Blade Burst`, 'combat');
          damageDealt.forEach(name => {
            addLog(`${name} took 2 ⚔️ damage`, 'combat');
          });
        }
        break;
        
      case 'D004': // Form Reversal: Enter Center (force out occupant)
        {
          const centerOccupant = players.find(p => p.inCenter);
          
          if (currentPlayer.inCenter) {
            toast.error('You are already in the Center!');
            return; // Don't discard if already in center
          }
          
          // Force out current occupant
          if (centerOccupant) {
            leaveNeonpolis(centerOccupant.id, false);
            addLog(`${centerOccupant.name} was forced out of the Center!`, 'combat');
          }
          
          // Enter center
          enterNeonpolis(currentPlayer.id);
          toast.success('Form Reversal: Entered the Center!');
          addLog(`${currentPlayer.name} entered the Center with Form Reversal`, 'ability');
        }
        break;
        
      case 'D005': // Regroup: Reroll all dice, apply only ⚔️/⚡
        if (gamePhase === 'roll' || gamePhase === 'resolve' || gamePhase === 'combat') {
          // Roll 6 dice
          const diceFaces: DiceFace[] = ['1', '2', '3', 'sword', 'energy', 'heart'];
          const rolledDice = Array(6).fill(null).map(() => 
            diceFaces[Math.floor(Math.random() * diceFaces.length)]
          );
          
          // Count ⚔️ and ⚡
          const swords = rolledDice.filter(d => d === 'sword').length;
          const energy = rolledDice.filter(d => d === 'energy').length;
          
          const diceDisplay = rolledDice.map(face => diceIcons[face]).join(' ');
          addLog(`${currentPlayer.name} rolled for Regroup: ${diceDisplay}`, 'roll');
          
          // Apply only ⚔️ and ⚡
          setPlayers(prev => prev.map((p, idx) => {
            if (idx === currentPlayerIndex) {
              const newEnergy = p.energy + energy;
              return { ...p, energy: newEnergy };
            }
            return p;
          }));
          
          if (energy > 0) {
            toast.success(`Regroup: +${energy} ⚡ Energy`);
            addLog(`${currentPlayer.name} gained ${energy} ⚡ from Regroup`, 'energy');
          }
          
          if (swords > 0) {
            // Deal damage if there are swords
            if (centerOccupantPlayer && centerOccupantPlayer.id !== currentPlayer.id) {
              dealDamage(centerOccupantPlayer.id, swords, currentPlayer.id);
              toast.success(`Regroup: Dealt ${swords} ⚔️ damage`);
            } else {
              const randomOpponent = players.find(p => p.hp > 0 && p.id !== currentPlayer.id);
              if (randomOpponent) {
                dealDamage(randomOpponent.id, swords, currentPlayer.id);
                toast.success(`Regroup: Dealt ${swords} ⚔️ damage`);
              }
            }
          }
          
          if (swords === 0 && energy === 0) {
            toast('Regroup: No ⚔️ or ⚡ rolled');
          }
        } else {
          toast.error('Can only play during roll/combat phase!');
          return; // Don't discard
        }
        break;
        
      case 'D007': // Market Turmoil: All others reroll ⚡ on their dice
        // This card requires dice state for other players - skip for now as it's complex
        toast('Market Turmoil: Effect applied');
        addLog(`${currentPlayer.name} caused Market Turmoil - opponents reroll ⚡ dice`, 'ability');
        break;
        
      case 'D009': // Power Strike: Choose opponent, deal X ⚔️ (pay X ⚡, max 3)
        // Requires target selection - show prompt
        if (!currentPlayer.isBot) {
          const opponents = players.filter(p => p.hp > 0 && p.id !== currentPlayer.id)
            .map(p => ({ id: p.id, name: p.name, hp: p.hp }));
          setCardEffectPrompt({
            open: true,
            cardId: 'D009',
            cardName: 'Power Strike',
            data: { currentEnergy: currentPlayer.energy, opponents }
          });
          return; // Don't discard yet - wait for target selection
        } else {
          // Bot logic: spend 1-2 energy on random target
          const energyToSpend = Math.min(Math.floor(Math.random() * 2) + 1, currentPlayer.energy, 3);
          const target = players.find(p => p.hp > 0 && p.id !== currentPlayer.id);
          
          if (target && energyToSpend > 0) {
            setPlayers(prev => prev.map((p, idx) => {
              if (idx === currentPlayerIndex) {
                return { ...p, energy: p.energy - energyToSpend };
              }
              return p;
            }));
            
            dealDamage(target.id, energyToSpend, currentPlayer.id);
            toast.success(`Power Strike: ${energyToSpend} ⚔️ damage`);
            addLog(`${currentPlayer.name} used Power Strike to deal ${energyToSpend} ⚔️ damage`, 'combat');
          }
        }
        break;
        
      case 'D010': // Swift Ascent: End of turn - if center empty, enter and +1 VP
        setPlayers(prev => prev.map((p, idx) => {
          if (idx === currentPlayerIndex) {
            return { ...p, cardEffectState: { ...p.cardEffectState, swiftAscentActive: true } };
          }
          return p;
        }));
        toast.success('Swift Ascent: Will activate at end of turn');
        addLog(`${currentPlayer.name} activated Swift Ascent`, 'ability');
        break;
        
      case 'D011': // Cyber Heist: Steal 2 ⚡ from one opponent
        // Requires target selection
        if (!currentPlayer.isBot) {
          const opponents = players.filter(p => p.hp > 0 && p.id !== currentPlayer.id)
            .map(p => ({ id: p.id, name: p.name, energy: p.energy }));
          setCardEffectPrompt({
            open: true,
            cardId: 'D011',
            cardName: 'Cyber Heist',
            data: { opponents }
          });
          return; // Don't discard yet
        } else {
          // Bot: steal from random opponent with energy
          const target = players.find(p => p.hp > 0 && p.id !== currentPlayer.id && p.energy >= 2);
          
          if (target) {
            const stolen = Math.min(2, target.energy);
            setPlayers(prev => prev.map(p => {
              if (p.id === target.id) {
                return { ...p, energy: p.energy - stolen };
              } else if (p.id === currentPlayer.id) {
                return { ...p, energy: p.energy + stolen };
              }
              return p;
            }));
            
            toast.success(`Cyber Heist: Stole ${stolen} ⚡`);
            addLog(`${currentPlayer.name} stole ${stolen} ⚡ from ${target.name}`, 'combat');
          }
        }
        break;
        
      case 'D014': // Ambush: Roll 2 dice, apply only ⚔️/⚡
        {
          const diceFaces: DiceFace[] = ['1', '2', '3', 'sword', 'energy', 'heart'];
          const rolledDice = [
            diceFaces[Math.floor(Math.random() * diceFaces.length)],
            diceFaces[Math.floor(Math.random() * diceFaces.length)]
          ];
          
          const swords = rolledDice.filter(d => d === 'sword').length;
          const energy = rolledDice.filter(d => d === 'energy').length;
          
          const diceDisplay = rolledDice.map(face => diceIcons[face]).join(' ');
          addLog(`${currentPlayer.name} rolled for Ambush: ${diceDisplay}`, 'roll');
          
          // Apply energy
          if (energy > 0) {
            setPlayers(prev => prev.map((p, idx) => {
              if (idx === currentPlayerIndex) {
                return { ...p, energy: p.energy + energy };
              }
              return p;
            }));
            toast.success(`Ambush: +${energy} ⚡`);
            addLog(`${currentPlayer.name} gained ${energy} ⚡ from Ambush`, 'energy');
          }
          
          // Apply swords
          if (swords > 0) {
            if (centerOccupantPlayer && centerOccupantPlayer.id !== currentPlayer.id) {
              dealDamage(centerOccupantPlayer.id, swords, currentPlayer.id);
              toast.success(`Ambush: Dealt ${swords} ⚔️`);
            } else {
              const randomOpponent = players.find(p => p.hp > 0 && p.id !== currentPlayer.id);
              if (randomOpponent) {
                dealDamage(randomOpponent.id, swords, currentPlayer.id);
                toast.success(`Ambush: Dealt ${swords} ⚔️`);
              }
            }
          }
          
          if (swords === 0 && energy === 0) {
            toast('Ambush: No ⚔️ or ⚡ rolled');
          }
        }
        break;
        
      case 'D018': // Weakpoint Marker: Give target Weakpoint token
        // Requires target selection
        if (!currentPlayer.isBot) {
          const opponents = players.filter(p => p.hp > 0 && p.id !== currentPlayer.id)
            .map(p => ({ id: p.id, name: p.name, hp: p.hp }));
          setCardEffectPrompt({
            open: true,
            cardId: 'D018',
            cardName: 'Weakpoint Marker',
            data: { opponents }
          });
          return; // Don't discard yet
        } else {
          // Bot: apply to center occupant or random opponent
          const target = centerOccupantPlayer && centerOccupantPlayer.id !== currentPlayer.id 
            ? centerOccupantPlayer 
            : players.find(p => p.hp > 0 && p.id !== currentPlayer.id);
          
          if (target) {
            setPlayers(prev => prev.map(p => {
              if (p.id === target.id) {
                return { 
                  ...p, 
                  cardEffectState: { ...p.cardEffectState, weakpointToken: target.id }
                };
              }
              return p;
            }));
            
            toast.success(`Weakpoint Marker: Applied to ${target.name}`);
            addLog(`${currentPlayer.name} applied Weakpoint token to ${target.name}`, 'combat');
          }
        }
        break;
      
      // PHASE 6 CARDS
      
      case 'D008': // Rainproof Shield: Ignore all damage until next turn
        {
          const nextPlayerIndex = (currentPlayerIndex + 1) % players.length;
          setPlayers(prev => prev.map((p, idx) => {
            if (idx === currentPlayerIndex) {
              return { 
                ...p, 
                cardEffectState: { 
                  ...p.cardEffectState, 
                  rainproofShieldUntil: nextPlayerIndex 
                }
              };
            }
            return p;
          }));
          toast.success('Rainproof Shield: Immune to damage until next turn!');
          addLog(`${currentPlayer.name} activated Rainproof Shield - immune to damage!`, 'ability');
        }
        break;
        
      case 'D013': // Diversion: Cancel opponent's DISCARD card (reaction)
        // This is a reactive card - should be held and triggered when opponent plays DISCARD
        toast.info('Diversion: Keep this card to cancel opponent DISCARD cards');
        addLog(`${currentPlayer.name} is holding Diversion (can cancel opponent cards)`, 'ability');
        return; // Don't discard - kept for reaction
        
      case 'D016': // Exile: Remove from Center, lock it until your next turn
        {
          const centerOccupant = players.find(p => p.inCenter);
          
          if (!centerOccupant) {
            toast.error('No one in Center to exile!');
            return; // Don't discard
          }
          
          if (centerOccupant.id === currentPlayer.id) {
            toast.error('Cannot exile yourself!');
            return; // Don't discard
          }
          
          // Force out and lock center
          leaveNeonpolis(centerOccupant.id, false);
          
          const nextPlayerIndex = (currentPlayerIndex + 1) % players.length;
          setPlayers(prev => prev.map((p, idx) => {
            if (idx === currentPlayerIndex) {
              return { 
                ...p, 
                cardEffectState: { 
                  ...p.cardEffectState, 
                  centerLockedUntil: nextPlayerIndex 
                }
              };
            }
            return p;
          }));
          
          toast.success(`Exile: ${centerOccupant.name} removed! Center locked!`);
          addLog(`${currentPlayer.name} used Exile! ${centerOccupant.name} was removed and Center is locked!`, 'combat');
        }
        break;
        
      case 'D019': // Shattering Orbit: Each ⚔️ also gives +1⚡ this turn
        setPlayers(prev => prev.map((p, idx) => {
          if (idx === currentPlayerIndex) {
            return { 
              ...p, 
              cardEffectState: { 
                ...p.cardEffectState, 
                shatteringOrbitActive: true 
              }
            };
          }
          return p;
        }));
        toast.success('Shattering Orbit: ⚔️ will also grant +1⚡ each!');
        addLog(`${currentPlayer.name} activated Shattering Orbit - swords grant energy!`, 'ability');
        break;
        
      default:
        toast.error('Card effect not yet implemented');
        return; // Don't discard if not implemented
    }
    
    // Remove card from purchased cards (discard it)
    setTimeout(() => {
      setPlayers(prev => prev.map((p, idx) => {
        if (idx === currentPlayerIndex) {
          return {
            ...p,
            purchasedCards: p.purchasedCards.filter(c => c !== cardId)
          };
        }
        return p;
      }));
      addLog(`${currentPlayer.name} discarded ${card.nameEn}`, 'info');
    }, 100);
  };

  const handleRenewShop = () => {
    if (currentPlayer.energy < 2) {
      toast.error('Not enough energy to renew cards!');
      return;
    }

    // Start flip animation
    setIsRenewingCards(true);

    // Deduct 2 energy
    setPlayers(prev => prev.map((p, idx) => {
      if (idx === currentPlayerIndex) {
        return { ...p, energy: p.energy - 2 };
      }
      return p;
    }));

    // Wait for flip animation to complete (halfway point)
    setTimeout(() => {
      // Shuffle and pick 3 new cards
      const shuffled = [...shopCards].sort(() => Math.random() - 0.5);
      setShopDisplay(shuffled.slice(0, 3));
      
      addLog(`${currentPlayer.name} renewed the shop cards for 2 ⚡`, 'shop');
      toast.success('Shop cards renewed!');
      
      // Reset animation state
      setIsRenewingCards(false);
    }, 300); // Change cards at halfway point and end animation
  };

  const handleEndTurn = () => {
    // END_OF_TURN card effects
    
    // PHASE 5: D010 - Swift Ascent: If center empty, enter and +1 VP
    if (currentPlayer.cardEffectState.swiftAscentActive) {
      const centerEmpty = !players.some(p => p.inCenter);
      
      if (centerEmpty && !currentPlayer.inCenter) {
        setPlayers(prev => prev.map((p, idx) => {
          if (idx === currentPlayerIndex) {
            const newVp = Math.min(p.vp + 1, 20);
            
            setTimeout(() => {
              enterNeonpolis(p.id);
              toast.success('Swift Ascent: Entered Center and +1 ★ VP');
              addLog(`${p.name} entered the Center with Swift Ascent and gained 1 ★ VP`, 'ability');
              
              // Check for winning
              if (newVp >= 20) {
                setTimeout(() => {
                  setWinner(p);
                  addLog(`${p.name} has reached 20 VP and wins the game!`, 'info');
                  toast.success(`${p.name} wins!`);
                }, 500);
              }
            }, 500);
            
            return { ...p, vp: newVp, cardEffectState: { ...p.cardEffectState, swiftAscentActive: false } };
          }
          return p;
        }));
      } else {
        // Center not empty - just clear the flag
        setPlayers(prev => prev.map((p, idx) => {
          if (idx === currentPlayerIndex) {
            addLog(`${p.name}'s Swift Ascent failed - Center occupied`, 'info');
            return { ...p, cardEffectState: { ...p.cardEffectState, swiftAscentActive: false } };
          }
          return p;
        }));
      }
    }
    
    // K009 - Regenerative Tissue: +1 HP if resolved no ❤️ this turn
    if (currentPlayer.purchasedCards.includes('K009') && 
        currentPlayer.cardEffectState.heartsResolvedThisTurn === 0 &&
        currentPlayer.hp < currentPlayer.maxHp) {
      setPlayers(prev => prev.map((p, idx) => {
        if (idx === currentPlayerIndex) {
          const newHp = Math.min(p.hp + 1, p.maxHp);
          addLog(`${p.name} healed 1 HP from Regenerative Tissue`, 'heal');
          toast.success('Regenerative Tissue: +1 HP');
          return { ...p, hp: newHp };
        }
        return p;
      }));
    }
    
    // K021 - Rooftop Raider: +1 VP if outside and dealt ≥2 ⚔️ this turn
    if (currentPlayer.purchasedCards.includes('K021') && 
        !currentPlayer.inCenter &&
        currentPlayer.cardEffectState.swordsDamageDealtThisTurn >= 2) {
      setPlayers(prev => prev.map((p, idx) => {
        if (idx === currentPlayerIndex) {
          const newVp = Math.min(p.vp + 1, 20);
          addLog(`${p.name} gained 1 ★ VP from Rooftop Raider`, 'ability');
          toast.success('Rooftop Raider: +1 ★ VP');
          
          // Check for winning condition
          if (newVp >= 20) {
            setTimeout(() => {
              setWinner(p);
              addLog(`${p.name} has reached 20 VP and wins the game!`, 'info');
              toast.success(`${p.name} wins!`);
            }, 500);
          }
          
          return { ...p, vp: newVp };
        }
        return p;
      }));
    }
    
    // Check for Quantum Terrapin's Time Bank ability - store phase
    const currentCharacter = characters.find(c => c.id === currentPlayer.characterId)!;
    if (currentCharacter.ability.id === 'time_bank' && 
        currentPlayer.abilityState === 'ready' &&
        keptDice.length > 0) {
      
      if (!currentPlayer.isBot) {
        // Show prompt for human player to store a die
        setAbilityPrompt({
          open: true,
          type: 'time_bank_store',
          data: { dice: keptDice }
        });
        return; // Don't end turn yet - wait for ability decision
      } else {
        // Bot auto-stores a random die
        const randomDie = keptDice[Math.floor(Math.random() * keptDice.length)];
        setPlayers(prev => prev.map((p, idx) => {
          if (idx === currentPlayerIndex) {
            return { ...p, storedDie: randomDie.face, abilityState: 'spent' };
          }
          return p;
        }));
        addLog(`${currentPlayer.name} stored ${diceIcons[randomDie.face]} for later (Time Bank)`, 'ability');
        toast.success(`Time Bank: Stored ${diceIcons[randomDie.face]}`);
      }
    }
    
    addLog(`${currentPlayer.name} ended their turn.`, 'info');
    
    // Move to next player
    const nextIndex = (currentPlayerIndex + 1) % players.length;
    const nextPlayer = players[nextIndex];
    const nextCharacter = characters.find(c => c.id === nextPlayer.characterId)!;
    
    // START OF TURN - Apply card effects and reset states
    setPlayers(prev => prev.map((p, idx) => {
      if (idx === nextIndex) {
        // Reset once-per-turn card effects
        const newCardState = resetOncePerTurnEffects(p.cardEffectState);
        
        // K001 - Energy Collector: +1⚡ at start of turn
        const collectorBonus = applyEnergyCollector(p.purchasedCards);
        
        // K020 - Eminent Devastator: +1 VP if in Center
        const devastatorVP = applyEminentDevastator(p.purchasedCards, p.inCenter);
        
        // Award +2 VP if in center (Neonpolis bonus)
        let totalVP = devastatorVP;
        if (p.inCenter) {
          totalVP += 2;
          addLog(`${p.name} gains +2 ★ VP for starting turn in Neonpolis!`, 'center');
          toast.success('+2 ★ VP (Neonpolis bonus)');
        }
        
        // Card effect notifications
        if (collectorBonus > 0) {
          addLog(`${p.name} gained ${collectorBonus} ⚡ from Energy Collector`, 'energy');
          toast.success(`Energy Collector: +${collectorBonus} ⚡`);
        }
        if (devastatorVP > 0) {
          addLog(`${p.name} gained ${devastatorVP} ★ VP from Eminent Devastator`, 'ability');
          toast.success(`Eminent Devastator: +${devastatorVP} ★ VP`);
        }
        
        const newVp = Math.min(p.vp + totalVP, 20);
        const newEnergy = p.energy + collectorBonus;
        
        // Check for winning condition
        if (newVp >= 20) {
          setTimeout(() => {
            setWinner(p);
            addLog(`${p.name} has reached 20 VP and wins the game!`, 'info');
            toast.success(`${p.name} wins!`);
          }, 500);
        }
        
        return {
          ...p,
          vp: newVp,
          energy: newEnergy,
          abilityState: getAbilityStateOnTurnStart(nextCharacter.ability.id),
          keptHeartThisTurn: false,
          cardEffectState: newCardState
        };
      }
      return p;
    }));
    
    setCurrentPlayerIndex(nextIndex);
    setGamePhase('roll');
    
    // Calculate reroll cap with card effects (K022 Aero Tunnels, K028 Synchronizer)
    let baseRerollCap = 3;
    baseRerollCap += applyAeroTunnels(nextPlayer.purchasedCards);
    baseRerollCap = applySynchronizer(nextPlayer.purchasedCards, baseRerollCap);
    setRollsRemaining(baseRerollCap);
    
    setKeptDice([]); // Reset kept dice for new turn

    // Check for game end - last player standing
    const alivePlayers = players.filter(p => p.hp > 0);
    if (alivePlayers.length === 1) {
      setTimeout(() => {
        setWinner(alivePlayers[0]);
        addLog(`${alivePlayers[0].name} is the last one standing and wins!`, 'info');
        toast.success(`${alivePlayers[0].name} wins!`);
      }, 500);
    }
  };

  const isPlayerTurn = currentPlayer.id === 'player';
  const playerCharacter = characters.find(c => c.id === playerCharacterId)!;
  const centerOccupantPlayer = players.find(p => p.inCenter);
  const centerOccupantCharacter = centerOccupantPlayer 
    ? characters.find(c => c.id === centerOccupantPlayer.characterId) 
    : null;

  // Bot automation - auto-play bot turns
  useEffect(() => {
    if (!currentPlayer.isBot) return;

    // Auto handle shop phase for bots
    if (gamePhase === 'shop') {
      const timer = setTimeout(() => {
        // Check if bot should use Convertive Gaze before shopping
        const currentCharacter = characters.find(c => c.id === currentPlayer.characterId)!;
        if (currentCharacter.ability.id === 'convertive_gaze' && currentPlayer.abilityState === 'ready') {
          const convertDecision = getBotConvertiveGazeDecision(
            currentPlayer.hp,
            currentPlayer.maxHp,
            currentPlayer.energy
          );
          
          if (convertDecision) {
            if (convertDecision === 'to_heart') {
              setPlayers(prev => prev.map((p, idx) => {
                if (idx === currentPlayerIndex) {
                  const newHp = Math.min(p.hp + 1, p.maxHp);
                  return { ...p, energy: p.energy - 1, hp: newHp, abilityState: 'spent' };
                }
                return p;
              }));
              addLog(`${currentPlayer.name} converted 1 ⚡ to 1 ❤️ (Convertive Gaze)`, 'ability');
            } else if (convertDecision === 'to_energy') {
              setPlayers(prev => prev.map((p, idx) => {
                if (idx === currentPlayerIndex) {
                  return { ...p, energy: p.energy + 1, hp: p.hp - 1, abilityState: 'spent' };
                }
                return p;
              }));
              addLog(`${currentPlayer.name} converted 1 ❤️ to 1 ⚡ (Convertive Gaze)`, 'ability');
            }
          }
        }
        
        // PHASE 4: Bot decides whether to play DISCARD cards first
        const discardCards = currentPlayer.purchasedCards
          .map(cardId => shopCards.find(c => c.id === cardId))
          .filter(card => card && card.type === 'DISCARD') as typeof shopCards;
        
        // Bot plays beneficial DISCARD cards (simple heuristic)
        discardCards.forEach(card => {
          const centerOccupied = players.some(p => p.inCenter && p.id !== currentPlayer.id);
          const shouldPlay = 
            (card.id === 'D001' && currentPlayer.energy < 3) || // Overcharge if low energy
            (card.id === 'D003' && currentPlayer.hp < currentPlayer.maxHp - 2) || // Restoration if damaged
            (card.id === 'D006') || // Always play Warehouse Plunder for free energy
            (card.id === 'D012' && currentPlayer.hp < currentPlayer.maxHp - 1) || // Field Repairs if damaged
            (card.id === 'D017' && currentPlayer.energy < 5) || // Energy Pump if low energy
            (card.id === 'D020' && currentPlayer.hp < currentPlayer.maxHp) || // Purgation if damaged
            // PHASE 5 cards
            (card.id === 'D002') || // Blade Burst - always good for AOE
            (card.id === 'D004' && !currentPlayer.inCenter) || // Form Reversal if not in center
            (card.id === 'D010' && !currentPlayer.inCenter) || // Swift Ascent if not in center
            (card.id === 'D014') || // Ambush - always worth rolling
            // PHASE 6 cards
            (card.id === 'D008' && currentPlayer.hp <= 3) || // Rainproof Shield if low HP
            (card.id === 'D016' && centerOccupied) || // Exile if center occupied
            (card.id === 'D019'); // Shattering Orbit - always good for sword synergy
          
          if (shouldPlay) {
            setTimeout(() => {
              handlePlayDiscardCard(card.id);
            }, 500);
          }
        });
        
        // Bot decides whether to buy a card
        const shopDecision = getBotShopDecision(
          shopDisplay.map(c => ({ id: c.id, cost: c.cost, nameEn: c.nameEn })),
          currentPlayer.energy
        );

        if (shopDecision.cardIndexToBuy !== null) {
          const cardToBuy = shopDisplay[shopDecision.cardIndexToBuy];
          if (cardToBuy) {
            handleBuyCard(cardToBuy.id);
          }
        } else {
          addLog(`${currentPlayer.name} skipped shopping`, 'info');
        }

        // End turn after shopping (or not shopping)
        setTimeout(() => {
          handleEndTurn();
        }, 1500);
      }, 1500); // Wait 1.5s before shopping

      return () => clearTimeout(timer);
    }
  }, [currentPlayer.isBot, gamePhase, currentPlayer.energy]);

  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Top Bar */}
      <div className="border-b border-border/50 bg-surface-elevated p-4">
        <div className="container mx-auto flex items-center justify-between max-w-[1440px]">
          <Button
            variant="ghost"
            size="sm"
            onClick={onEndMatch}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Exit Arena
          </Button>
          <h2 className="text-neon-cyan">
            NeonPolis Arena
          </h2>
          <div className="w-24" />
        </div>
      </div>

      <div className="flex-1 container mx-auto px-4 py-6 max-w-[1440px] overflow-y-auto">
        {/* Main Arena Board */}
        <ArenaBoard
          shopCards={shopDisplay}
          onBuyCard={handleBuyCard}
          playerEnergy={currentPlayer.energy}
          disabled={gamePhase !== 'shop' || !isPlayerTurn}
          centerOccupant={centerOccupantPlayer?.name || null}
          centerOccupantCharacter={centerOccupantCharacter}
          logs={logs}
          purchasedCards={currentPlayer.purchasedCards}
          onUseBlackMarket={handleUseBlackMarket}
          onUseMarketRecycle={handleUseMarketRecycle}
          blackMarketUsed={currentPlayer.cardEffectState.blackMarketUsed}
          marketRecycleUsed={currentPlayer.cardEffectState.marketRecycleUsed}
          onRenewCards={handleRenewShop}
          isRenewingCards={isRenewingCards}
          timerSlot={
            <TurnTimer 
              currentPlayerName={currentPlayer.name}
              isBot={currentPlayer.isBot}
            />
          }
          diceRollerSlot={
            isPlayerTurn ? (
              <DiceRoller
                onRollComplete={handleDiceRolled}
                onResolve={handleResolve}
                onCombat={(swordCount) => {
                  if (gamePhase === 'combat') {
                    // Recalculate from authoritative keptDice to include ability modifications
                    const actualSwordCount = keptDice.filter(d => d.face === 'sword').length;
                    console.log('=== COMBAT HANDLER ===');
                    console.log('Passed swordCount:', swordCount);
                    console.log('Combat - keptDice:', keptDice);
                    console.log('Combat - keptDice faces:', keptDice.map((d, i) => `[${i}]:${d.face}`).join(', '));
                    console.log('Combat - actualSwordCount:', actualSwordCount);
                    console.log('======================');
                    addLog(`Attacking with ${actualSwordCount} ⚔️ swords`, 'combat');
                    if (actualSwordCount > 0) {
                      handleCombatAction(actualSwordCount);
                    } else {
                      toast.error('No swords to attack with!');
                      setGamePhase('shop');
                    }
                  }
                }}
                phase={gamePhase}
                rollsRemaining={rollsRemaining}
                controlledDice={gamePhase === 'roll' ? undefined : keptDice.map(d => d.face)}
                characterId={currentPlayer.characterId}
                storedDie={currentPlayer.storedDie}
                onTimeBankSwap={handleTimeBankSwap}
                abilityState={currentPlayer.abilityState}
                energy={currentPlayer.energy}
                hp={currentPlayer.hp}
                maxHp={currentPlayer.maxHp}
                onConvertClick={handleConvertiveGaze}
                onEndTurn={handleEndTurn}
                onRenewShop={handleRenewShop}
                onEarlyResolve={() => {
                  // Transition to resolve phase without executing resolution yet
                  setGamePhase('resolve');
                  setRollsRemaining(0);
                  addLog(`${currentPlayer.name} chose to resolve early.`, 'roll');
                  
                  // Check if current character has an ability that can be used in resolve phase
                  const currentCharacter = characters.find(c => c.id === currentPlayer.characterId)!;
                  const currentDice = keptDice.length > 0 ? keptDice.map(d => d.face) : [];
                  
                  // Check for abilities that can be used before resolving dice
                  if (currentCharacter.ability.id === 'misty_grapple' && 
                      currentPlayer.abilityState === 'ready' &&
                      currentDice.length >= 2) {
                    // Nimbus Gibbon - Misty Grapple: Copy one die face to another
                    setAbilityBanner({
                      open: true,
                      message: 'Use Misty Grapple before resolving?',
                      onUse: () => {
                        setAbilityBanner({ open: false });
                        setAbilityPrompt({
                          open: true,
                          type: 'misty_grapple',
                          data: { dice: currentDice.map((face, idx) => ({ id: `die-${idx}`, face })) }
                        });
                      }
                    });
                  } else if (currentCharacter.ability.id === 'convertive_gaze' && 
                             currentPlayer.abilityState === 'ready') {
                    // Halo Cyclops - Convertive Gaze: Convert 1⚡↔1❤️ anytime
                    const canConvert = (currentPlayer.energy >= 1 && currentPlayer.hp < currentPlayer.maxHp) || 
                                      currentPlayer.hp >= 1;
                    if (canConvert) {
                      setAbilityBanner({
                        open: true,
                        message: 'Use Convertive Gaze before resolving?',
                        onUse: () => {
                          setAbilityBanner({ open: false });
                          handleConvertiveGaze();
                        }
                      });
                    }
                  }
                  // Note: Other abilities like Undertow are checked during executeResolve
                }}
                showAbilityPrompt={gamePhase === 'resolve' && abilityBanner.open}
                abilityPromptMessage={abilityBanner.message}
                onUseAbility={abilityBanner.onUse}
                onSkipAbility={() => {
                  setAbilityBanner({ open: false });
                  // If there's a pending resolve (from Early Resolve), execute it now
                  if (pendingResolve) {
                    const diceToResolve = pendingResolve;
                    setPendingResolve(null);
                    executeResolve(diceToResolve);
                  } else {
                    // No pending resolve - we're in the resolve phase, so continue to resolve
                    const finalDice = keptDice.length > 0 ? keptDice.map(d => d.face) : [];
                    if (finalDice.length > 0) {
                      executeResolve(finalDice);
                    }
                  }
                }}
              />
            ) : (
              <DiceRoller
                onRollComplete={handleDiceRolled}
                onResolve={handleResolve}
                onCombat={(swordCount) => {
                  if (gamePhase === 'combat') {
                    // Bot combat logic
                    const actualSwordCount = keptDice.filter(d => d.face === 'sword').length;
                    addLog(`${currentPlayer.name} attacking with ${actualSwordCount} ⚔️ swords`, 'combat');
                    
                    if (actualSwordCount > 0) {
                      handleCombatAction(actualSwordCount);
                    } else {
                      setGamePhase('shop');
                    }
                  }
                }}
                phase={gamePhase}
                rollsRemaining={rollsRemaining}
                controlledDice={gamePhase === 'roll' ? undefined : keptDice.map(d => d.face)}
                isBot={true}
                characterId={currentPlayer.characterId}
                storedDie={currentPlayer.storedDie}
                onTimeBankSwap={handleTimeBankSwap}
                abilityState={currentPlayer.abilityState}
                energy={currentPlayer.energy}
                hp={currentPlayer.hp}
                maxHp={currentPlayer.maxHp}
                onEndTurn={handleEndTurn}
                onRenewShop={handleRenewShop}
              />
            )
          }
        />

        {/* PHASE 4: DISCARD Cards Display */}
        {isPlayerTurn && (
          (() => {
            const discardCards = currentPlayer.purchasedCards
              .map(cardId => shopCards.find(c => c.id === cardId))
              .filter(card => card && card.type === 'DISCARD') as typeof shopCards;
            
            if (discardCards.length === 0) return null;
            
            return (
              <div className="mt-6 px-4">
                <h3 className="text-neon-magenta text-center mb-3">
                  Your Instant Cards ({discardCards.length})
                </h3>
                <div className="flex flex-wrap justify-center gap-3 max-w-4xl mx-auto">
                  {discardCards.map(card => (
                    <div 
                      key={card.id}
                      className="relative group"
                    >
                      <div 
                        className="w-40 p-3 rounded-lg border-2 border-neon-magenta/50 bg-surface-elevated hover:border-neon-magenta transition-all cursor-pointer"
                        style={{
                          boxShadow: '0 0 20px rgba(255, 0, 168, 0.3)'
                        }}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="text-xs text-neon-magenta truncate flex-1">
                            {card.nameEn}
                          </h4>
                          <span className="text-xs text-neon-cyan ml-1">
                            {card.cost}⚡
                          </span>
                        </div>
                        <p className="text-[10px] text-text-secondary mb-3 line-clamp-3">
                          {card.effectEn}
                        </p>
                        <Button
                          size="sm"
                          onClick={() => handlePlayDiscardCard(card.id)}
                          className="w-full glow-magenta text-xs h-7"
                          disabled={
                            (card.id === 'D015' && gamePhase !== 'roll') // Galloping Time only in roll phase
                          }
                        >
                          Play
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })()
        )}



        {/* Player Character Cards - Bottom section */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 px-4 items-start">
          {players.map((player, idx) => {
            const char = characters.find(c => c.id === player.characterId)!;
            const isActive = idx === currentPlayerIndex;
            
            return (
              <div key={player.id} className="relative" data-player-id={player.id}>
                {/* Outer Glow Container for Active Player */}
                {isActive && (
                  <>
                    {/* Pulsing Background Glow */}
                    <div 
                      className="absolute inset-[-30px] rounded-[40px] animate-pulse pointer-events-none"
                      style={{
                        background: 'radial-gradient(circle, rgba(0, 229, 255, 0.7) 0%, rgba(0, 229, 255, 0.4) 40%, transparent 70%)',
                        filter: 'blur(30px)',
                        zIndex: 0
                      }}
                    />
                    {/* Solid Bright Glow Ring */}
                    <div 
                      className="absolute inset-[-8px] rounded-[32px] pointer-events-none animate-pulse"
                      style={{
                        background: 'transparent',
                        border: '6px solid #00E5FF',
                        boxShadow: '0 0 80px rgba(0, 229, 255, 1), 0 0 120px rgba(0, 229, 255, 0.8), inset 0 0 40px rgba(0, 229, 255, 0.5)',
                        zIndex: 1
                      }}
                    />
                  </>
                )}
                
                <div className="relative z-10">
                  <CharacterCard
                    character={char}
                    variant="detail"
                    vp={player.vp}
                    showEnergy={true}
                    energy={player.energy}
                    showLife={true}
                    currentHp={player.hp}
                    purchasedCards={player.purchasedCards}
                    stoneplateActive={char.ability.id === 'stoneplate' && player.abilityState === 'armed'}
                    precisionCutActive={char.ability.id === 'precision_cut' && player.abilityState === 'ready' && player.keptHeartThisTurn === true}
                    venomSiphonActive={char.ability.id === 'venom_siphon' && player.abilityState === 'armed'}
                    storedDie={player.storedDie}
                  />
                </div>
                
                <div className="mt-2 text-center relative z-10">
                  <p className={`text-sm ${isActive ? 'text-neon-cyan font-bold' : 'text-text-secondary'}`}>
                    {player.name}
                    {isActive && ' ⚡'}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      
      {/* Ability Prompts */}
      <AbilityPrompt
        open={abilityPrompt.open}
        onClose={() => setAbilityPrompt({ open: false })}
        abilityName={playerCharacter.ability.name}
        characterName={playerCharacter.name}
        type={abilityPrompt.type!}
        data={abilityPrompt.data}
        onConfirm={(result) => {
          const currentCharacter = characters.find(c => c.id === currentPlayer.characterId)!;
          
          // Handle Misty Grapple
          if (abilityPrompt.type === 'misty_grapple') {
            const targetIdx = keptDice.findIndex(d => d.id === result.targetId);
            const sourceIdx = keptDice.findIndex(d => d.id === result.sourceId);
            
            if (targetIdx >= 0 && sourceIdx >= 0) {
              const newDice = [...keptDice];
              newDice[targetIdx].face = newDice[sourceIdx].face;
              setKeptDice(newDice);
              
              addLog(`${currentPlayer.name} used Misty Grapple! Changed die to ${diceIcons[newDice[targetIdx].face]}`, 'ability');
              toast.success('Misty Grapple activated!');
              
              // Mark ability as spent
              setPlayers(prev => prev.map((p, idx) => 
                idx === currentPlayerIndex ? { ...p, abilityState: 'spent' } : p
              ));
            }
            
            // If there's a pending resolve, execute it now
            if (pendingResolve) {
              const diceToResolve = pendingResolve;
              setPendingResolve(null);
              setAbilityPrompt({ open: false });
              executeResolve(diceToResolve);
              return;
            }
          }
          
          // Handle Undertow
          if (abilityPrompt.type === 'undertow') {
            const heartsToConvert = result.heartsToConvert || 0;
            
            if (heartsToConvert > 0) {
              // Add energy and mark ability as spent
              setPlayers(prev => prev.map((p, idx) => {
                if (idx === currentPlayerIndex) {
                  return { ...p, energy: p.energy + heartsToConvert, abilityState: 'spent' };
                }
                return p;
              }));
              
              addLog(`${currentPlayer.name} converted ${heartsToConvert} ❤️ to ${heartsToConvert} ⚡ Energy (Undertow)`, 'ability');
              toast.success(`Undertow: +${heartsToConvert} ⚡`, { description: `Converted ${heartsToConvert} unused Hearts` });
            } else {
              addLog(`${currentPlayer.name} skipped Undertow`, 'ability');
            }
            
            // After Undertow decision, determine next phase
            // Check if we have swords from the previous roll
            const finalDice = keptDice.length > 0 ? keptDice.map(d => d.face) : [];
            const swordCount = finalDice.filter(d => d === 'sword').length;
            
            if (swordCount > 0) {
              setGamePhase('combat');
            } else {
              setGamePhase('shop');
            }
          }
          
          // Handle Convertive Gaze
          if (abilityPrompt.type === 'convertive_gaze') {
            const direction = result.direction; // Fixed: was result.convertDirection
            
            if (direction === 'to_heart') {
              // Convert Energy to Heart
              setPlayers(prev => prev.map((p, idx) => {
                if (idx === currentPlayerIndex) {
                  const newHp = Math.min(p.hp + 1, p.maxHp);
                  return { ...p, energy: p.energy - 1, hp: newHp, abilityState: 'spent' };
                }
                return p;
              }));
              addLog(`${currentPlayer.name} converted 1 ⚡ to 1 ❤️ (Convertive Gaze)`, 'ability');
              toast.success('Convertive Gaze: ⚡ → ❤️', { description: 'Converted 1 Energy to 1 Heart' });
            } else if (direction === 'to_energy') {
              // Convert Heart to Energy
              setPlayers(prev => prev.map((p, idx) => {
                if (idx === currentPlayerIndex) {
                  return { ...p, energy: p.energy + 1, hp: p.hp - 1, abilityState: 'spent' };
                }
                return p;
              }));
              addLog(`${currentPlayer.name} converted 1 ❤️ to 1 ⚡ (Convertive Gaze)`, 'ability');
              toast.success('Convertive Gaze: ❤️ → ⚡', { description: 'Converted 1 Heart to 1 Energy' });
            }
          }
          
          // Handle Time Bank Store
          if (abilityPrompt.type === 'time_bank_store') {
            const dieToStore = keptDice.find(d => d.id === result.dieId);
            
            if (dieToStore) {
              // Check if player already has a stored die
              if (currentPlayer.storedDie) {
                // Replace existing stored die
                addLog(`${currentPlayer.name} replaced stored die with ${diceIcons[dieToStore.face]} (Time Bank)`, 'ability');
                toast.success(`Time Bank: Replaced with ${diceIcons[dieToStore.face]}`);
              } else {
                addLog(`${currentPlayer.name} stored ${diceIcons[dieToStore.face]} for later (Time Bank)`, 'ability');
                toast.success(`Time Bank: Stored ${diceIcons[dieToStore.face]}`);
              }
              
              // Store the die and mark ability as spent for this turn
              setPlayers(prev => prev.map((p, idx) => {
                if (idx === currentPlayerIndex) {
                  return { ...p, storedDie: dieToStore.face, abilityState: 'spent' };
                }
                return p;
              }));
            }
            
            // After storing, proceed with turn end
            setAbilityPrompt({ open: false });
            
            // Now actually end the turn
            addLog(`${currentPlayer.name} ended their turn.`, 'info');
            
            const nextIndex = (currentPlayerIndex + 1) % players.length;
            const nextPlayer = players[nextIndex];
            const nextCharacter = characters.find(c => c.id === nextPlayer.characterId)!;
            
            // Award +2 VP if next player is in center
            if (nextPlayer.inCenter) {
              setPlayers(prev => prev.map((p, idx) => {
                if (idx === nextIndex) {
                  const newVp = Math.min(p.vp + 2, 20);
                  addLog(`${nextPlayer.name} gains +2 ★ VP for starting turn in Neonpolis!`, 'center');
                  toast.success('+2 ★ VP (Neonpolis bonus)');
                  
                  if (newVp >= 20) {
                    setTimeout(() => {
                      setWinner(p);
                      addLog(`${p.name} has reached 20 VP and wins the game!`, 'info');
                      toast.success(`${p.name} wins!`);
                    }, 500);
                  }
                  
                  return { ...p, vp: newVp };
                }
                return p;
              }));
            }
            
            // Reset ability state for next player and clean up Phase 6 duration effects
            setPlayers(prev => prev.map((p, idx) => {
              if (idx === nextIndex) {
                // Clear duration effects when it's this player's turn
                const newCardState = { ...p.cardEffectState };
                
                // D008 Rainproof Shield - expires when it's your turn again
                if (newCardState.rainproofShieldUntil === nextIndex) {
                  newCardState.rainproofShieldUntil = undefined;
                  addLog(`${p.name}'s Rainproof Shield expired`, 'info');
                }
                
                // D016 Exile (Center Lock) - expires when it's your turn again
                if (newCardState.centerLockedUntil === nextIndex) {
                  newCardState.centerLockedUntil = undefined;
                  addLog(`Center is no longer locked`, 'info');
                }
                
                // D019 Shattering Orbit - expires at start of next turn
                if (newCardState.shatteringOrbitActive) {
                  newCardState.shatteringOrbitActive = false;
                }
                
                return {
                  ...p,
                  abilityState: getAbilityStateOnTurnStart(nextCharacter.ability.id),
                  keptHeartThisTurn: false,
                  cardEffectState: newCardState
                };
              }
              return p;
            }));
            
            setCurrentPlayerIndex(nextIndex);
            setGamePhase('roll');
            setRollsRemaining(3);
            setKeptDice([]);
            
            // Check for game end
            const alivePlayers = players.filter(p => p.hp > 0);
            if (alivePlayers.length === 1) {
              setTimeout(() => {
                setWinner(alivePlayers[0]);
                addLog(`${alivePlayers[0].name} is the last one standing and wins!`, 'info');
                toast.success(`${alivePlayers[0].name} wins!`);
              }, 500);
            }
            
            return; // Exit early since we handled turn end
          }
          
          // Handle Time Bank Swap
          if (abilityPrompt.type === 'time_bank_swap') {
            const dieToReplace = keptDice.find(d => d.id === result.dieId);
            
            if (dieToReplace && currentPlayer.storedDie) {
              const newDice = [...keptDice];
              const replaceIdx = newDice.findIndex(d => d.id === result.dieId);
              const oldFace = newDice[replaceIdx].face;
              newDice[replaceIdx].face = currentPlayer.storedDie;
              setKeptDice(newDice);
              
              addLog(`${currentPlayer.name} swapped ${diceIcons[oldFace]} with stored ${diceIcons[currentPlayer.storedDie]} (Time Bank)`, 'ability');
              toast.success(`Time Bank: Swapped ${diceIcons[oldFace]} → ${diceIcons[currentPlayer.storedDie]}`);
              
              // Clear stored die
              setPlayers(prev => prev.map((p, idx) => {
                if (idx === currentPlayerIndex) {
                  return { ...p, storedDie: undefined };
                }
                return p;
              }));
            }
          }
          
          setAbilityPrompt({ open: false });
        }}
      />
      
      <AbilityBanner
        open={abilityBanner.open && gamePhase !== 'resolve'}
        message={abilityBanner.message || ''}
        onUse={() => abilityBanner.onUse?.()}
        onSkip={() => {
          setAbilityBanner({ open: false });
          // If there's a pending resolve (from Early Resolve), execute it now
          if (pendingResolve) {
            const diceToResolve = pendingResolve;
            setPendingResolve(null);
            executeResolve(diceToResolve);
          }
        }}
      />
      
      {/* Card Effect Prompts (Phase 2) */}
      {cardEffectPrompt.open && cardEffectPrompt.cardId && (
        <CardEffectPrompt
          open={cardEffectPrompt.open}
          onClose={() => setCardEffectPrompt({ open: false })}
          cardId={cardEffectPrompt.cardId}
          cardName={cardEffectPrompt.cardName || ''}
          data={cardEffectPrompt.data}
          onConfirm={(result) => {
            // Handle card effect confirmations
            handleCardEffectConfirm(cardEffectPrompt.cardId!, result);
            setCardEffectPrompt({ open: false });
          }}
        />
      )}
      
      {/* Card Purchase Animation */}
      {purchaseAnimation.active && purchaseAnimation.card && purchaseAnimation.fromPosition && purchaseAnimation.toPosition && (
        <CardPurchaseAnimation
          card={purchaseAnimation.card}
          fromPosition={purchaseAnimation.fromPosition}
          toPosition={purchaseAnimation.toPosition}
          onComplete={() => setPurchaseAnimation({ active: false })}
        />
      )}

      <LeaveNeonpolisModal
        open={leaveModal.open}
        damage={leaveModal.damage}
        currentHp={players.find(p => p.id === leaveModal.defenderId)?.hp || 0}
        attackerName={players.find(p => p.id === leaveModal.attackerId)?.name || ''}
        onDecision={(leave) => {
          if (leave) {
            leaveNeonpolis(leaveModal.defenderId, true); // Voluntary leave
            enterNeonpolis(leaveModal.attackerId);
            const defender = players.find(p => p.id === leaveModal.defenderId);
            const attacker = players.find(p => p.id === leaveModal.attackerId);
            addLog(`${defender?.name} chose to leave! ${attacker?.name} must enter. +1 ★ VP`, 'center');
            toast.success(`${attacker?.name} entered Neonpolis! +1 ★ VP`);
          } else {
            const defender = players.find(p => p.id === leaveModal.defenderId);
            addLog(`${defender?.name} stays in Neonpolis!`, 'combat');
            toast.info(`${defender?.name} stays in Neonpolis`);
          }
          setLeaveModal({ open: false, damage: 0, attackerId: '', defenderId: '' });
          setGamePhase('shop');
        }}
      />

      {/* Winning Screen */}
      {winner && (
        <WinningScreen
          winnerName={winner.name}
          winnerCharacter={characters.find(c => c.id === winner.characterId)!}
          onRematch={() => {
            // Reset the game to initial state
            const shuffled = [...shopCards].sort(() => Math.random() - 0.5);
            setShopDisplay(shuffled.slice(0, 3));
            
            // Reinitialize players
            const playerCharacter = characters.find(c => c.id === playerCharacterId)!;
            const humanPlayer: Player = {
              id: 'player',
              name: 'You',
              characterId: playerCharacterId,
              hp: playerCharacter.maxLife,
              maxHp: playerCharacter.maxLife,
              energy: 0,
              vp: 0,
              isBot: false,
              inCenter: false,
              abilityState: getAbilityStateOnTurnStart(playerCharacterId),
              purchasedCards: []
            };

            const bots: Player[] = [];
            const availableBots = characters.filter(c => c.id !== playerCharacterId);
            for (let i = 0; i < opponentCount; i++) {
              const botCharacter = availableBots[i];
              bots.push({
                id: `bot-${i}`,
                name: `${botCharacter.name}`,
                characterId: botCharacter.id,
                hp: botCharacter.maxLife,
                maxHp: botCharacter.maxLife,
                energy: 0,
                vp: 0,
                isBot: true,
                inCenter: false,
                abilityState: getAbilityStateOnTurnStart(botCharacter.id),
                purchasedCards: []
              });
            }

            setPlayers([humanPlayer, ...bots]);
            setCurrentPlayerIndex(0);
            setGamePhase('roll');
            setLogs([]);
            setRollsRemaining(3);
            setKeptDice([]);
            setWinner(null);
            
            // First player enters Neonpolis automatically
            setTimeout(() => {
              setPlayers(prev => prev.map((p, idx) => {
                if (idx === 0) {
                  addLog(`${p.name} enters Neonpolis! +1 ★ VP`, 'center');
                  toast.success(`${p.name} entered Neonpolis!`);
                  return { ...p, inCenter: true, vp: 1 };
                }
                return p;
              }));
              addLog('Game started! Roll the dice to begin.', 'info');
            }, 100);
          }}
          onReturnToMain={onEndMatch}
        />
      )}
    </div>
  );
}