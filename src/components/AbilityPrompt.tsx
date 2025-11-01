import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import type { DiceFace } from '../lib/gameData';
import { diceIcons } from '../lib/gameData';
import { Slider } from './ui/slider';
import { useState, useEffect } from 'react';

interface AbilityPromptProps {
  open: boolean;
  onClose: () => void;
  abilityName: string;
  characterName: string;
  type: 'misty_grapple' | 'undertow' | 'convertive_gaze' | 'time_bank_store' | 'time_bank_swap';
  data?: {
    dice?: Array<{ id: string; face: DiceFace }>;
    unusedHearts?: number;
    energy?: number;
    hp?: number;
    maxHp?: number;
    storedDie?: DiceFace;
  };
  onConfirm: (result: any) => void;
}

export function AbilityPrompt({ open, onClose, abilityName, characterName, type, data, onConfirm }: AbilityPromptProps) {
  const [selectedTarget, setSelectedTarget] = useState<string | null>(null);
  const [selectedSource, setSelectedSource] = useState<string | null>(null);
  const [convertAmount, setConvertAmount] = useState(0);
  const [convertDirection, setConvertDirection] = useState<'to_heart' | 'to_energy' | null>(null);

  // Set default convert amount for Undertow (convert all unused hearts by default)
  useEffect(() => {
    if (open && type === 'undertow' && data?.unusedHearts) {
      setConvertAmount(data.unusedHearts);
    }
  }, [open, type, data?.unusedHearts]);

  const handleConfirm = () => {
    switch (type) {
      case 'misty_grapple':
        if (selectedTarget && selectedSource) {
          onConfirm({ targetId: selectedTarget, sourceId: selectedSource });
        }
        break;
      case 'undertow':
        onConfirm({ heartsToConvert: convertAmount });
        break;
      case 'convertive_gaze':
        onConfirm({ direction: convertDirection });
        break;
      case 'time_bank_store':
        if (selectedTarget) {
          onConfirm({ dieId: selectedTarget });
        }
        break;
      case 'time_bank_swap':
        if (selectedTarget) {
          onConfirm({ dieId: selectedTarget });
        }
        break;
    }
    handleClose();
  };

  const handleClose = () => {
    setSelectedTarget(null);
    setSelectedSource(null);
    setConvertAmount(0);
    setConvertDirection(null);
    onClose();
  };

  const canConfirm = () => {
    switch (type) {
      case 'misty_grapple':
        return selectedTarget && selectedSource && selectedTarget !== selectedSource;
      case 'undertow':
        return convertAmount > 0;
      case 'convertive_gaze':
        return convertDirection !== null;
      case 'time_bank_store':
      case 'time_bank_swap':
        return selectedTarget !== null;
      default:
        return false;
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px] bg-black border-2 border-neon-cyan/50 shadow-[0_0_30px_rgba(0,229,255,0.3)]">
        <DialogHeader>
          <DialogTitle className="text-neon-cyan">{abilityName}</DialogTitle>
          <DialogDescription className="text-text-secondary">
            {characterName}'s ability
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          {type === 'misty_grapple' && (
            <div className="space-y-4">
              <div>
                <p className="text-sm text-text-secondary mb-3">
                  Step {selectedTarget ? '2' : '1'}: Select the die to {selectedTarget ? 'copy from' : 'change'}
                </p>
                <div className="grid grid-cols-3 gap-3">
                  {data?.dice?.map((die) => (
                    <button
                      key={die.id}
                      onClick={() => {
                        // If clicking the target die, deselect it (and source if exists)
                        if (die.id === selectedTarget) {
                          setSelectedTarget(null);
                          setSelectedSource(null);
                        }
                        // If clicking the source die, deselect just the source
                        else if (die.id === selectedSource) {
                          setSelectedSource(null);
                        }
                        // If no target selected yet, select this as target
                        else if (!selectedTarget) {
                          setSelectedTarget(die.id);
                        }
                        // If target exists but no source, select this as source
                        else if (selectedTarget && !selectedSource) {
                          setSelectedSource(die.id);
                        }
                      }}
                      className={`p-4 rounded-lg border-3 transition-all ${
                        die.id === selectedTarget
                          ? 'border-neon-magenta bg-neon-magenta/10 shadow-[0_0_25px_rgba(255,0,168,0.7)]'
                          : die.id === selectedSource
                          ? 'border-neon-cyan bg-neon-cyan/10 shadow-[0_0_25px_rgba(0,229,255,0.7)]'
                          : 'border-border hover:border-neon-cyan/50'
                      }`}
                    >
                      <div className="text-3xl">{diceIcons[die.face]}</div>
                      {die.id === selectedTarget && (
                        <Badge className="mt-2 bg-neon-magenta text-white text-xs">Target</Badge>
                      )}
                      {die.id === selectedSource && (
                        <Badge className="mt-2 bg-neon-cyan text-black text-xs">Copy</Badge>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {type === 'undertow' && (
            <div className="space-y-4">
              <p className="text-sm text-text-secondary">
                Convert unused Hearts to Energy (1 ❤️ → 1 ⚡)
              </p>
              <div className="p-3 rounded-lg bg-neon-cyan/10 border border-neon-cyan/30 mb-3">
                <p className="text-sm text-center">
                  Unused Hearts: <span className="text-neon-cyan text-lg ml-2">{data?.unusedHearts || 0} ❤️</span>
                </p>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Hearts to convert: {convertAmount} ❤️</span>
                  <span className="text-neon-cyan">+{convertAmount} ⚡</span>
                </div>
                <Slider
                  value={[convertAmount]}
                  onValueChange={([value]) => setConvertAmount(value)}
                  max={data?.unusedHearts || 0}
                  min={0}
                  step={1}
                  className="w-full"
                />
              </div>
            </div>
          )}

          {type === 'convertive_gaze' && (
            <div className="space-y-4">
              <p className="text-sm text-text-secondary mb-3">
                Convert 1 Energy ↔ 1 HP
              </p>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => setConvertDirection('to_heart')}
                  disabled={(data?.energy || 0) < 1 || (data?.hp || 0) >= (data?.maxHp || 10)}
                  className={`
                    relative p-4 rounded-lg border-2 transition-all
                    ${convertDirection === 'to_heart' 
                      ? 'border-neon-magenta bg-neon-magenta/20 shadow-[0_0_20px_rgba(255,0,168,0.5)]' 
                      : 'border-border hover:border-neon-magenta/50 bg-black/40'
                    }
                    ${((data?.energy || 0) < 1 || (data?.hp || 0) >= (data?.maxHp || 10)) 
                      ? 'opacity-50 cursor-not-allowed' 
                      : 'cursor-pointer'
                    }
                  `}
                >
                  <div className="text-center">
                    <div className="text-2xl mb-2">⚡ → ❤️</div>
                    <div className="text-xs text-text-muted">Energy to Heart</div>
                  </div>
                </button>
                <button
                  onClick={() => setConvertDirection('to_energy')}
                  disabled={(data?.hp || 0) < 1}
                  className={`
                    relative p-4 rounded-lg border-2 transition-all
                    ${convertDirection === 'to_energy' 
                      ? 'border-neon-cyan bg-neon-cyan/20 shadow-[0_0_20px_rgba(0,229,255,0.5)]' 
                      : 'border-border hover:border-neon-cyan/50 bg-black/40'
                    }
                    ${(data?.hp || 0) < 1 
                      ? 'opacity-50 cursor-not-allowed' 
                      : 'cursor-pointer'
                    }
                  `}
                >
                  <div className="text-center">
                    <div className="text-2xl mb-2">❤️ → ⚡</div>
                    <div className="text-xs text-text-muted">Heart to Energy</div>
                  </div>
                </button>
              </div>
              <div className="p-3 rounded-lg bg-black/60 border border-neon-cyan/20">
                <p className="text-xs text-center text-text-secondary">
                  Current: <span className="text-neon-cyan">{data?.energy || 0} ⚡</span> | <span className="text-neon-magenta">{data?.hp || 0}/{data?.maxHp || 10} ❤️</span>
                </p>
              </div>
            </div>
          )}

          {type === 'time_bank_store' && (
            <div className="space-y-4">
              <p className="text-sm text-text-secondary mb-3">
                Store one die for a future turn
              </p>
              <div className="grid grid-cols-3 gap-3">
                {data?.dice?.map((die) => (
                  <button
                    key={die.id}
                    onClick={() => setSelectedTarget(selectedTarget === die.id ? null : die.id)}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      die.id === selectedTarget
                        ? 'border-neon-cyan bg-neon-cyan/10 shadow-[0_0_15px_rgba(0,229,255,0.4)]'
                        : 'border-border hover:border-neon-cyan/50'
                    }`}
                  >
                    <div className="text-3xl">{diceIcons[die.face]}</div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {type === 'time_bank_swap' && (
            <div className="space-y-4">
              <div className="p-3 rounded-lg bg-neon-cyan/10 border border-neon-cyan/30 mb-3">
                <p className="text-sm text-center">
                  Stored die: <span className="text-2xl ml-2">{data?.storedDie && diceIcons[data.storedDie]}</span>
                </p>
              </div>
              <p className="text-sm text-text-secondary mb-3">
                Select a die to replace with your stored die
              </p>
              <div className="grid grid-cols-3 gap-3">
                {data?.dice?.map((die) => (
                  <button
                    key={die.id}
                    onClick={() => setSelectedTarget(selectedTarget === die.id ? null : die.id)}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      die.id === selectedTarget
                        ? 'border-neon-cyan bg-neon-cyan/10 shadow-[0_0_15px_rgba(0,229,255,0.4)]'
                        : 'border-border hover:border-neon-cyan/50'
                    }`}
                  >
                    <div className="text-3xl">{diceIcons[die.face]}</div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        <DialogFooter className="gap-3">
          <Button 
            variant="outline" 
            onClick={handleClose}
            className="flex-1 border-border hover:border-text-muted"
          >
            Skip
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={!canConfirm()}
            className="flex-1 glow-cyan disabled:opacity-50"
          >
            Confirm
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// Simple banner prompt for quick yes/no decisions
interface AbilityBannerProps {
  open: boolean;
  message: string;
  onUse: () => void;
  onSkip: () => void;
}

export function AbilityBanner({ open, message, onUse, onSkip }: AbilityBannerProps) {
  if (!open) return null;

  return (
    <div className="fixed top-24 left-1/2 -translate-x-1/2 z-50 animate-in fade-in slide-in-from-top-2">
    </div>
  );
}