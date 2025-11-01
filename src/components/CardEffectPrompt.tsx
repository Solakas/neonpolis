import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import type { DiceFace } from '../lib/gameData';
import { diceIcons } from '../lib/gameData';

interface CardEffectPromptProps {
  open: boolean;
  onClose: () => void;
  cardId: string;
  cardName: string;
  data?: any;
  onConfirm: (result: any) => void;
}

export function CardEffectPrompt({ 
  open, 
  onClose, 
  cardId, 
  cardName, 
  data, 
  onConfirm 
}: CardEffectPromptProps) {
  const [selectedValue, setSelectedValue] = useState<any>(null);

  const handleConfirm = () => {
    onConfirm(selectedValue);
    onClose();
  };

  const handleSkip = () => {
    onConfirm(null);
    onClose();
  };

  // K003 - Black Market: Choose from 3 cards
  if (cardId === 'K003') {
    return (
      <Dialog open={open} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-[600px] bg-[#0A0A0E] border-2 border-[#00E5FF]">
          <DialogHeader>
            <DialogTitle className="text-[#00E5FF]">{cardName}</DialogTitle>
            <DialogDescription className="text-white">
              Select a card to purchase with -1⚡ discount (minimum 0⚡)
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid grid-cols-3 gap-3 py-4">
            {data?.cards?.map((card: any, idx: number) => (
              <button
                key={idx}
                onClick={() => setSelectedValue(idx)}
                className={`p-3 rounded-lg border-2 transition-all ${
                  selectedValue === idx
                    ? 'border-[#FF00A8] bg-[#FF00A8]/10'
                    : 'border-[#00E5FF]/30 hover:border-[#00E5FF]'
                }`}
              >
                <div className="text-sm font-medium text-[#00E5FF] mb-1">
                  {card.nameEn}
                </div>
                <div className="text-xs text-white/70 mb-2">
                  {card.effectEn}
                </div>
                <Badge variant="outline" className="text-xs">
                  {Math.max(0, card.cost - 1)}⚡
                </Badge>
              </button>
            ))}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={handleSkip}>
              Cancel
            </Button>
            <Button 
              onClick={handleConfirm}
              disabled={selectedValue === null}
              className="bg-[#00E5FF] text-black hover:bg-[#00E5FF]/90"
            >
              Purchase
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }

  // K012 - Telekinetic Grip: Set 1 die to ⚡ or ⚔️
  if (cardId === 'K012') {
    const [selectedDie, setSelectedDie] = useState<number | null>(null);
    const [selectedFace, setSelectedFace] = useState<DiceFace | null>(null);

    return (
      <Dialog open={open} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-[500px] bg-[#0A0A0E] border-2 border-[#00E5FF]">
          <DialogHeader>
            <DialogTitle className="text-[#00E5FF]">{cardName}</DialogTitle>
            <DialogDescription className="text-white">
              Select a die, then choose ⚡ or ⚔️
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            {/* Select die */}
            <div>
              <div className="text-sm text-white/70 mb-2">Select die:</div>
              <div className="flex gap-2 flex-wrap">
                {data?.dice?.map((die: { id: string; face: DiceFace }, idx: number) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedDie(idx)}
                    className={`w-14 h-14 rounded-lg border-2 flex items-center justify-center text-2xl transition-all ${
                      selectedDie === idx
                        ? 'border-[#FF00A8] bg-[#FF00A8]/10'
                        : 'border-[#00E5FF]/30 hover:border-[#00E5FF]'
                    }`}
                  >
                    {diceIcons[die.face]}
                  </button>
                ))}
              </div>
            </div>

            {/* Select face */}
            {selectedDie !== null && (
              <div>
                <div className="text-sm text-white/70 mb-2">Change to:</div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setSelectedFace('energy')}
                    className={`flex-1 h-14 rounded-lg border-2 flex items-center justify-center text-2xl transition-all ${
                      selectedFace === 'energy'
                        ? 'border-[#FF00A8] bg-[#FF00A8]/10'
                        : 'border-[#00E5FF]/30 hover:border-[#00E5FF]'
                    }`}
                  >
                    ⚡
                  </button>
                  <button
                    onClick={() => setSelectedFace('sword')}
                    className={`flex-1 h-14 rounded-lg border-2 flex items-center justify-center text-2xl transition-all ${
                      selectedFace === 'sword'
                        ? 'border-[#FF00A8] bg-[#FF00A8]/10'
                        : 'border-[#00E5FF]/30 hover:border-[#00E5FF]'
                    }`}
                  >
                    ⚔️
                  </button>
                </div>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={handleSkip}>
              Skip
            </Button>
            <Button 
              onClick={() => {
                onConfirm({ dieIndex: selectedDie, newFace: selectedFace });
                onClose();
              }}
              disabled={selectedDie === null || selectedFace === null}
              className="bg-[#00E5FF] text-black hover:bg-[#00E5FF]/90"
            >
              Apply
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }

  // K011 - Antibodies: Heal +1 extra HP
  if (cardId === 'K011') {
    return (
      <Dialog open={open} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-[400px] bg-[#0A0A0E] border-2 border-[#00E5FF]">
          <DialogHeader>
            <DialogTitle className="text-[#00E5FF]">{cardName}</DialogTitle>
            <DialogDescription className="text-white">
              Heal +1 extra HP from your ❤️ this turn?
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4 text-center">
            <div className="text-4xl mb-2">❤️</div>
            <div className="text-white/70">
              You rolled {data?.heartCount} ❤️
            </div>
            <div className="text-[#00E5FF] mt-2">
              Will heal {data?.heartCount} + 1 = {(data?.heartCount ?? 0) + 1} HP
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={handleSkip}>
              Skip
            </Button>
            <Button 
              onClick={() => {
                onConfirm(true);
                onClose();
              }}
              className="bg-[#00E5FF] text-black hover:bg-[#00E5FF]/90"
            >
              Use Antibodies
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }

  // K017 - Mine Hunter: Reroll 1 die
  if (cardId === 'K017') {
    return (
      <Dialog open={open} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-[500px] bg-[#0A0A0E] border-2 border-[#00E5FF]">
          <DialogHeader>
            <DialogTitle className="text-[#00E5FF]">{cardName}</DialogTitle>
            <DialogDescription className="text-white">
              Select a die to reroll
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4">
            <div className="flex gap-2 flex-wrap justify-center">
              {data?.dice?.map((die: { id: string; face: DiceFace }, idx: number) => (
                <button
                  key={idx}
                  onClick={() => setSelectedValue(idx)}
                  className={`w-16 h-16 rounded-lg border-2 flex items-center justify-center text-3xl transition-all ${
                    selectedValue === idx
                      ? 'border-[#FF00A8] bg-[#FF00A8]/10'
                      : 'border-[#00E5FF]/30 hover:border-[#00E5FF]'
                  }`}
                >
                  {diceIcons[die.face]}
                </button>
              ))}
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={handleSkip}>
              Skip
            </Button>
            <Button 
              onClick={handleConfirm}
              disabled={selectedValue === null}
              className="bg-[#00E5FF] text-black hover:bg-[#00E5FF]/90"
            >
              Reroll
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }

  // K019 - Turn of Fate: Choose opponent to lose 1 HP
  if (cardId === 'K019') {
    return (
      <Dialog open={open} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-[400px] bg-[#0A0A0E] border-2 border-[#00E5FF]">
          <DialogHeader>
            <DialogTitle className="text-[#00E5FF]">{cardName}</DialogTitle>
            <DialogDescription className="text-white">
              Prevent 1 damage and choose an opponent to lose 1 HP
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4">
            <div className="space-y-2">
              {data?.opponents?.map((opp: any, idx: number) => (
                <button
                  key={idx}
                  onClick={() => setSelectedValue(opp.id)}
                  className={`w-full p-3 rounded-lg border-2 transition-all ${
                    selectedValue === opp.id
                      ? 'border-[#FF00A8] bg-[#FF00A8]/10'
                      : 'border-[#00E5FF]/30 hover:border-[#00E5FF]'
                  }`}
                >
                  <div className="text-left">
                    <div className="text-sm font-medium text-[#00E5FF]">{opp.name}</div>
                    <div className="text-xs text-white/70">{opp.hp} HP</div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={handleSkip}>
              Skip
            </Button>
            <Button 
              onClick={handleConfirm}
              disabled={selectedValue === null}
              className="bg-[#00E5FF] text-black hover:bg-[#00E5FF]/90"
            >
              Confirm
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }

  // K024 - Market Recycle: Replace 1 shop card
  if (cardId === 'K024') {
    return (
      <Dialog open={open} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-[600px] bg-[#0A0A0E] border-2 border-[#00E5FF]">
          <DialogHeader>
            <DialogTitle className="text-[#00E5FF]">{cardName}</DialogTitle>
            <DialogDescription className="text-white">
              Pay 1⚡ to replace a shop card
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid grid-cols-3 gap-3 py-4">
            {data?.shopCards?.map((card: any, idx: number) => (
              <button
                key={idx}
                onClick={() => setSelectedValue(idx)}
                className={`p-3 rounded-lg border-2 transition-all ${
                  selectedValue === idx
                    ? 'border-[#FF00A8] bg-[#FF00A8]/10'
                    : 'border-[#00E5FF]/30 hover:border-[#00E5FF]'
                }`}
              >
                <div className="text-sm font-medium text-[#00E5FF] mb-1">
                  {card.nameEn}
                </div>
                <div className="text-xs text-white/70 mb-2">
                  {card.effectEn}
                </div>
                <Badge variant="outline" className="text-xs">
                  {card.cost}⚡
                </Badge>
              </button>
            ))}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={handleSkip}>
              Cancel
            </Button>
            <Button 
              onClick={handleConfirm}
              disabled={selectedValue === null || (data?.energy ?? 0) < 1}
              className="bg-[#00E5FF] text-black hover:bg-[#00E5FF]/90"
            >
              Replace (1⚡)
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }

  // PHASE 5: D009 - Power Strike: Choose opponent and ⚡ to spend
  if (cardId === 'D009') {
    const [selectedOpponent, setSelectedOpponent] = useState<string | null>(null);
    const [energyToSpend, setEnergyToSpend] = useState(0);
    const maxEnergy = Math.min(data?.currentEnergy ?? 0, 3);

    return (
      <Dialog open={open} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-[500px] bg-[#0A0A0E] border-2 border-[#FF00A8]">
          <DialogHeader>
            <DialogTitle className="text-[#FF00A8]">{cardName}</DialogTitle>
            <DialogDescription className="text-white">
              Choose an opponent and how much ⚡ to spend (0-3)
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div>
              <h4 className="text-sm text-white mb-2">Select Target:</h4>
              <div className="grid grid-cols-1 gap-2">
                {data?.opponents?.map((opponent: any) => (
                  <button
                    key={opponent.id}
                    onClick={() => setSelectedOpponent(opponent.id)}
                    className={`p-3 rounded-lg border-2 transition-all text-left ${
                      selectedOpponent === opponent.id
                        ? 'border-[#FF00A8] bg-[#FF00A8]/10'
                        : 'border-[#00E5FF]/30 hover:border-[#00E5FF]'
                    }`}
                  >
                    <div className="text-sm text-[#00E5FF]">{opponent.name}</div>
                    <div className="text-xs text-white/70">{opponent.hp} HP</div>
                  </button>
                ))}
              </div>
            </div>
            
            <div>
              <h4 className="text-sm text-white mb-2">⚡ to Spend (0-{maxEnergy}):</h4>
              <div className="flex gap-2">
                {[0, 1, 2, 3].map(amount => (
                  <button
                    key={amount}
                    onClick={() => setEnergyToSpend(amount)}
                    disabled={amount > maxEnergy}
                    className={`px-4 py-2 rounded-lg border-2 transition-all ${
                      energyToSpend === amount
                        ? 'border-[#FF00A8] bg-[#FF00A8]/20 text-[#FF00A8]'
                        : amount > maxEnergy
                        ? 'border-gray-600 text-gray-600 cursor-not-allowed'
                        : 'border-[#00E5FF]/30 text-white hover:border-[#00E5FF]'
                    }`}
                  >
                    {amount}⚡
                  </button>
                ))}
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={handleSkip}>
              Cancel
            </Button>
            <Button 
              onClick={() => {
                onConfirm({ targetId: selectedOpponent, energyToSpend });
                onClose();
              }}
              disabled={selectedOpponent === null || energyToSpend === 0}
              className="bg-[#FF00A8] text-white hover:bg-[#FF00A8]/90"
            >
              Strike ({energyToSpend} ⚔️)
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }

  // PHASE 5: D011 - Cyber Heist: Choose opponent to steal ⚡ from
  if (cardId === 'D011') {
    return (
      <Dialog open={open} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-[500px] bg-[#0A0A0E] border-2 border-[#FF00A8]">
          <DialogHeader>
            <DialogTitle className="text-[#FF00A8]">{cardName}</DialogTitle>
            <DialogDescription className="text-white">
              Choose an opponent to steal 2⚡ from
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid grid-cols-1 gap-2 py-4">
            {data?.opponents?.map((opponent: any) => (
              <button
                key={opponent.id}
                onClick={() => setSelectedValue(opponent.id)}
                className={`p-3 rounded-lg border-2 transition-all text-left ${
                  selectedValue === opponent.id
                    ? 'border-[#FF00A8] bg-[#FF00A8]/10'
                    : 'border-[#00E5FF]/30 hover:border-[#00E5FF]'
                }`}
              >
                <div className="text-sm text-[#00E5FF]">{opponent.name}</div>
                <div className="text-xs text-white/70">{opponent.energy}⚡ Energy</div>
              </button>
            ))}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={handleSkip}>
              Cancel
            </Button>
            <Button 
              onClick={handleConfirm}
              disabled={selectedValue === null}
              className="bg-[#FF00A8] text-white hover:bg-[#FF00A8]/90"
            >
              Steal 2⚡
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }

  // PHASE 5: D018 - Weakpoint Marker: Choose target
  if (cardId === 'D018') {
    return (
      <Dialog open={open} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-[500px] bg-[#0A0A0E] border-2 border-[#FF00A8]">
          <DialogHeader>
            <DialogTitle className="text-[#FF00A8]">{cardName}</DialogTitle>
            <DialogDescription className="text-white">
              Choose an opponent to mark with Weakpoint token (+1 damage on next hit)
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid grid-cols-1 gap-2 py-4">
            {data?.opponents?.map((opponent: any) => (
              <button
                key={opponent.id}
                onClick={() => setSelectedValue(opponent.id)}
                className={`p-3 rounded-lg border-2 transition-all text-left ${
                  selectedValue === opponent.id
                    ? 'border-[#FF00A8] bg-[#FF00A8]/10'
                    : 'border-[#00E5FF]/30 hover:border-[#00E5FF]'
                }`}
              >
                <div className="text-sm text-[#00E5FF]">{opponent.name}</div>
                <div className="text-xs text-white/70">{opponent.hp} HP</div>
              </button>
            ))}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={handleSkip}>
              Cancel
            </Button>
            <Button 
              onClick={handleConfirm}
              disabled={selectedValue === null}
              className="bg-[#FF00A8] text-white hover:bg-[#FF00A8]/90"
            >
              Apply Weakpoint
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }

  // Default/generic prompt
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[400px] bg-[#0A0A0E] border-2 border-[#00E5FF]">
        <DialogHeader>
          <DialogTitle className="text-[#00E5FF]">{cardName}</DialogTitle>
          <DialogDescription className="text-white">
            Use this card effect?
          </DialogDescription>
        </DialogHeader>
        
        <DialogFooter>
          <Button variant="outline" onClick={handleSkip}>
            Skip
          </Button>
          <Button 
            onClick={handleConfirm}
            className="bg-[#00E5FF] text-black hover:bg-[#00E5FF]/90"
          >
            Use
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
