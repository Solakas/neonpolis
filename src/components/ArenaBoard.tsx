import svgPaths from '../imports/svg-lktk6dhuj2';
import imgBg from 'figma:asset/aae46d0917e4675be89f926861a71b369bd26f95.png';
import { GameLog } from './GameLog';
import type { ReactNode } from 'react';
import type { Character } from '../lib/gameData';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';
import { motion } from 'motion/react';

// Import character images
import nimbusGibbonImg from 'figma:asset/da96cdeac20dd4e007079a284d88a667962046af.png';
import ionWyrmImg from 'figma:asset/2bfb7716a3966e69e6003e3eb1851b2a3a78f7fb.png';
import basaltColossusImg from 'figma:asset/58eca402af7d4ee9ae623c8f927619224e57277f.png';
import abyssLeviathanImg from 'figma:asset/b7c0dd0d26a4dc11e0f79374bb927b5178926a93.png';
import starbladeMantisImg from 'figma:asset/3505c9b81fe2f83d119c00363aad5e87f3eb59d0.png';
import quantumTerrapinImg from 'figma:asset/6cc78840cd1d5df4116cceda13a538986d91fcf8.png';
import prismfangCobraImg from 'figma:asset/dedff51e8b02afee7c1330eeb42ab61cfd14e7d7.png';
import haloCyclopsImg from 'figma:asset/26d306a2b55de3e1f835dc319ac3d24fecce49f9.png';

const characterImages: Record<string, string> = {
  'nimbus_gibbon': nimbusGibbonImg,
  'ion_wyrm': ionWyrmImg,
  'basalt_colossus': basaltColossusImg,
  'abyss_leviathan': abyssLeviathanImg,
  'starblade_mantis': starbladeMantisImg,
  'quantum_terrapin': quantumTerrapinImg,
  'prismfang_cobra': prismfangCobraImg,
  'halo_cyclops': haloCyclopsImg
};

interface ArenaBoardProps {
  shopCards: Array<{ id: string; nameEn: string; cost: number; effectEn: string; type: 'KEEP' | 'DISCARD' }>;
  onBuyCard?: (cardId: string, element?: HTMLElement) => void;
  playerEnergy: number;
  disabled: boolean;
  centerOccupant: string | null;
  centerOccupantCharacter: Character | null;
  logs: Array<{
    id: string;
    timestamp: Date;
    message: string;
    type: 'roll' | 'damage' | 'heal' | 'energy' | 'shop' | 'center' | 'ability' | 'info' | 'combat';
  }>;
  diceRollerSlot?: ReactNode;
  timerSlot?: ReactNode;
  // Phase 2 card abilities
  purchasedCards?: string[];
  onUseBlackMarket?: () => void;
  onUseMarketRecycle?: () => void;
  blackMarketUsed?: boolean;
  marketRecycleUsed?: boolean;
  onRenewCards?: () => void;
  isRenewingCards?: boolean;
}

function ShopCardSlot({ card, onBuy, playerEnergy, disabled, isRenewing }: { 
  card: { id: string; nameEn: string; cost: number; effectEn: string; type: 'KEEP' | 'DISCARD' }; 
  onBuy?: (id: string, element?: HTMLElement) => void;
  playerEnergy: number;
  disabled: boolean;
  isRenewing?: boolean;
}) {
  const canAfford = playerEnergy >= card.cost;
  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!disabled && canAfford && onBuy) {
      onBuy(card.id, e.currentTarget);
    }
  };

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <motion.div 
          className={`h-[140px] relative rounded-[16px] shrink-0 w-full ${
            !disabled && canAfford ? 'cursor-pointer hover:scale-105 transition-transform' : 'opacity-60'
          }`}
          onClick={handleClick}
          animate={isRenewing ? {
            rotateY: 180,
            opacity: [1, 0, 1]
          } : {
            rotateY: 0,
            opacity: 1
          }}
          transition={{
            duration: 0.6,
            ease: [0.4, 0.0, 0.2, 1]
          }}
        >
          <div aria-hidden="true" className="absolute border border-[#00e5ff] border-solid inset-0 pointer-events-none rounded-[16px]" />
          <div className="flex flex-col items-start justify-start size-full px-[16px] py-[12px] bg-[rgba(0,0,0,0.73)] relative">
            <div className="flex items-center justify-between w-full mb-1">
              <p className="font-['Fira_Sans',sans-serif] text-[#00e5ff] text-[14px] truncate flex-1">
                {card.nameEn}
              </p>
              <span 
                className={`px-2 py-0.5 rounded text-[9px] font-['Fira_Sans',sans-serif] ml-2 shrink-0 ${
                  card.type === 'KEEP' 
                    ? 'bg-[#00e5ff]/20 text-[#00e5ff] border border-[#00e5ff]/50' 
                    : 'bg-[#ff00a8]/20 text-[#ff00a8] border border-[#ff00a8]/50'
                }`}
              >
                {card.type}
              </span>
            </div>
            <p className="font-['Roboto',sans-serif] text-[#00b3c8] text-[11px] mt-1">
              Cost: {card.cost} ⚡
            </p>
            <p className="font-['Roboto',sans-serif] text-white/80 text-[10px] mt-2 leading-tight line-clamp-3">
              {card.effectEn}
            </p>
          </div>
        </motion.div>
      </TooltipTrigger>
      <TooltipContent side="right" className="max-w-sm border-[#00e5ff]/50 bg-[rgba(0,0,0,0.95)] p-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between gap-3">
            <h4 className="font-['Fira_Sans',sans-serif] text-[#00e5ff]">{card.nameEn}</h4>
            <span className="font-['Roboto',sans-serif] text-[#00b3c8] text-sm">
              ⚡ {card.cost}
            </span>
          </div>
          <p className="font-['Roboto',sans-serif] text-white/90 text-sm leading-relaxed">
            {card.effectEn}
          </p>
        </div>
      </TooltipContent>
    </Tooltip>
  );
}

function ShopCardsContainer({ cards, onBuyCard, playerEnergy, disabled, purchasedCards = [], onUseBlackMarket, onUseMarketRecycle, blackMarketUsed, marketRecycleUsed, onRenewCards, isRenewing }: {
  cards: Array<{ id: string; nameEn: string; cost: number; effectEn: string; type: 'KEEP' | 'DISCARD' }>;
  onBuyCard?: (id: string, element?: HTMLElement) => void;
  playerEnergy: number;
  disabled: boolean;
  purchasedCards?: string[];
  onUseBlackMarket?: () => void;
  onUseMarketRecycle?: () => void;
  blackMarketUsed?: boolean;
  marketRecycleUsed?: boolean;
  onRenewCards?: () => void;
  isRenewing?: boolean;
}) {
  const hasBlackMarket = purchasedCards.includes('K003');
  const hasMarketRecycle = purchasedCards.includes('K024');

  return (
    <TooltipProvider>
      <div className="absolute content-stretch flex flex-col gap-[12px] items-start left-[69px] top-[78px] w-[179px]">
        {/* Shop Action Buttons */}
        {!disabled && (hasBlackMarket || hasMarketRecycle || onRenewCards) && (
          <div className="w-full flex flex-col gap-[8px] mb-[4px]">
            {onRenewCards && (
              <button
                onClick={onRenewCards}
                disabled={playerEnergy < 2}
                className="w-full px-3 py-2 rounded-lg bg-[#FF00A8]/10 border-2 border-[#FF00A8] text-[#FF00A8] text-xs font-['Fira_Sans',sans-serif] hover:bg-[#FF00A8]/20 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
              >
                ♻️ Renew Cards (2⚡)
              </button>
            )}
            {hasBlackMarket && !blackMarketUsed && (
              <button
                onClick={onUseBlackMarket}
                disabled={playerEnergy < 1}
                className="w-full px-3 py-2 rounded-lg bg-[#FF00A8]/10 border-2 border-[#FF00A8] text-[#FF00A8] text-xs font-['Fira_Sans',sans-serif] hover:bg-[#FF00A8]/20 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
              >
                🎴 Black Market
              </button>
            )}
            {hasMarketRecycle && !marketRecycleUsed && (
              <button
                onClick={onUseMarketRecycle}
                disabled={playerEnergy < 1}
                className="w-full px-3 py-2 rounded-lg bg-[#00E5FF]/10 border-2 border-[#00E5FF] text-[#00E5FF] text-xs font-['Fira_Sans',sans-serif] hover:bg-[#00E5FF]/20 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
              >
                🔄 Market Recycle
              </button>
            )}
          </div>
        )}
        
        {cards.slice(0, 3).map((card) => (
          <ShopCardSlot 
            key={card.id} 
            card={card} 
            onBuy={onBuyCard}
            playerEnergy={playerEnergy}
            disabled={disabled}
            isRenewing={isRenewing}
          />
        ))}
      </div>
    </TooltipProvider>
  );
}

function ArenaPositions({ centerOccupant, centerOccupantCharacter }: { centerOccupant: string | null; centerOccupantCharacter: Character | null }) {
  return (
    <div className="absolute h-[328px] left-[380px] top-[112px] w-[594px]">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 594 328">
        <g id="Players Positions">
          <circle cx="134" cy="134" fill="rgba(217, 217, 217, 0.2)" fillOpacity="0.2" r="133" stroke="#D94A1E" strokeWidth="2" />
        </g>
      </svg>
      {centerOccupantCharacter && (
        <div className="absolute left-[134px] top-[134px] transform -translate-x-1/2 -translate-y-1/2">
          <div className="relative h-[100px] w-[100px] rounded-full overflow-hidden border-4 border-[#D94A1E] shadow-lg shadow-[#D94A1E]/50">
            <img 
              alt={centerOccupantCharacter.name} 
              className="h-full w-full object-cover" 
              src={characterImages[centerOccupantCharacter.id]} 
            />
          </div>
        </div>
      )}
    </div>
  );
}

function GameLogContainer({ logs }: { logs: ArenaBoardProps['logs'] }) {
  return (
    <div className="absolute right-[40px] top-[40px] w-[280px] h-[561px]">
      <GameLog logs={logs} />
    </div>
  );
}

export function ArenaBoard({ shopCards, onBuyCard, playerEnergy, disabled, centerOccupant, centerOccupantCharacter, logs, diceRollerSlot, timerSlot, purchasedCards, onUseBlackMarket, onUseMarketRecycle, blackMarketUsed, marketRecycleUsed, onRenewCards, isRenewingCards }: ArenaBoardProps) {
  return (
    <div className="relative w-full h-[641px]">
      {/* Background */}
      <div className="absolute h-[561px] left-[44px] rounded-[16px] top-[40px] w-[1352px]">
        <div aria-hidden="true" className="absolute inset-0 pointer-events-none rounded-[16px]">
          <img alt="" className="absolute max-w-none object-50%-50% object-cover rounded-[16px] size-full" src={imgBg} />
          <div className="absolute bg-[rgba(0,0,0,0.2)] inset-0 rounded-[16px]" />
        </div>
      </div>

      {/* Shop Cards on the left */}
      <ShopCardsContainer 
        cards={shopCards} 
        onBuyCard={onBuyCard}
        playerEnergy={playerEnergy}
        disabled={disabled}
        purchasedCards={purchasedCards}
        onUseBlackMarket={onUseBlackMarket}
        onUseMarketRecycle={onUseMarketRecycle}
        blackMarketUsed={blackMarketUsed}
        marketRecycleUsed={marketRecycleUsed}
        onRenewCards={onRenewCards}
        isRenewing={isRenewingCards}
      />

      {/* Arena Positions in the middle */}
      <ArenaPositions centerOccupant={centerOccupant} centerOccupantCharacter={centerOccupantCharacter} />

      {/* Timer - Top right, left of Game Log */}
      {timerSlot && (
        <div className="absolute right-[350px] top-[60px]">
          {timerSlot}
        </div>
      )}

      {/* Game Log on the right */}
      <GameLogContainer logs={logs} />

      {/* Dice Roller Slot - Centered on board */}
      {diceRollerSlot && (
        <div className="absolute left-[340px] bottom-[48px] w-[600px] bg-black/40 backdrop-blur-sm rounded-lg border border-neon-cyan/30 p-4">
          {diceRollerSlot}
        </div>
      )}
    </div>
  );
}