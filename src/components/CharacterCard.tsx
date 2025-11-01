import { Check } from 'lucide-react';
import { useState, useEffect } from 'react';
import { motion, useSpring, useTransform } from 'motion/react';
import svgPaths from '../imports/svg-7bt78jcxm7';
import { imgTexture } from '../imports/svg-u1yst';
import type { Character } from '../lib/gameData';
import { shopCards, diceIcons } from '../lib/gameData';
import { Badge } from './ui/badge';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from './ui/tooltip';

// Import character images
import nimbusGibbonImg from 'figma:asset/da96cdeac20dd4e007079a284d88a667962046af.png';
import ionWyrmImg from 'figma:asset/2bfb7716a3966e69e6003e3eb1851b2a3a78f7fb.png';
import basaltColossusImg from 'figma:asset/58eca402af7d4ee9ae623c8f927619224e57277f.png';
import abyssLeviathanImg from 'figma:asset/b7c0dd0d26a4dc11e0f79374bb927b5178926a93.png';
import starbladeMantisImg from 'figma:asset/3505c9b81fe2f83d119c00363aad5e87f3eb59d0.png';
import quantumTerrapinImg from 'figma:asset/6cc78840cd1d5df4116cceda13a538986d91fcf8.png';
import prismfangCobraImg from 'figma:asset/dedff51e8b02afee7c1330eeb42ab61cfd14e7d7.png';
import haloCyclopsImg from 'figma:asset/26d306a2b55de3e1f835dc319ac3d24fecce49f9.png';

interface CharacterCardProps {
  character: Character;
  isSelected?: boolean;
  onClick?: () => void;
  variant?: 'selection' | 'detail';
  vp?: number;
  showEnergy?: boolean;
  energy?: number;
  showLife?: boolean;
  currentHp?: number;
  purchasedCards?: string[]; // IDs of purchased shop cards
  stoneplateActive?: boolean; // Show Stoneplate protection badge
  precisionCutActive?: boolean; // Show Precision Cut damage boost badge
  venomSiphonActive?: boolean; // Show Venom Siphon energy drain badge
  storedDie?: string; // Stored die face for Time Bank ability
}

// Map character IDs to their images
const characterImages: Record<string, string> = {
  'nimbus_gibbon': nimbusGibbonImg,
  'ion_wyrm': ionWyrmImg,
  'basalt_colossus': basaltColossusImg,
  'abyss_leviathan': abyssLeviathanImg,
  'starblade_mantis': starbladeMantisImg,
  'quantum_terrapin': quantumTerrapinImg,
  'prismfang_cobra': prismfangCobraImg,
  'halo_cyclops': haloCyclopsImg,
};

// Placeholder background for glass panel backdrop
const placeholderBg = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 642 422"%3E%3Cdefs%3E%3ClinearGradient id="g" x1="0%25" y1="0%25" x2="100%25" y2="100%25"%3E%3Cstop offset="0%25" style="stop-color:%231A2238"%3E%3C/stop%3E%3Cstop offset="60%25" style="stop-color:%232C0F2E"%3E%3C/stop%3E%3Cstop offset="100%25" style="stop-color:%236A1222"%3E%3C/stop%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width="642" height="422" fill="url(%23g)"%3E%3C/rect%3E%3C/svg%3E';
const textureOverlay = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="32" height="32"%3E%3Crect width="32" height="32" fill="%23000" opacity="0.1"%3E%3C/rect%3E%3C/svg%3E';

function EnergyTile({ value }: { value: number }) {
  const [prevValue, setPrevValue] = useState(value);
  const [displayValue, setDisplayValue] = useState(value);
  const [direction, setDirection] = useState<'up' | 'down'>('up');
  
  useEffect(() => {
    if (value !== prevValue) {
      setDirection(value > prevValue ? 'up' : 'down');
      setPrevValue(value);
      setDisplayValue(value);
    }
  }, [value, prevValue]);
  
  return (
    <div className="relative shrink-0 size-[36px]" data-name="Energy Tile">
      <div className="absolute inset-0">
        <div className="absolute inset-[1.667%] shadow-[4px_4px_4px_0px_rgba(0,0,0,0.5)]">
          <div className="absolute inset-[-1.724%]">
            <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 32 32">
              <path d="M16 0L32 16L16 32L0 16L16 0Z" fill="#00B3C8" />
            </svg>
          </div>
        </div>
        <div className="absolute contents inset-[1.667%]">
          <div 
            className="absolute inset-0 mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[0px] mask-size-[32px_32px] mix-blend-hard-light"
            style={{ maskImage: `url('${imgTexture}')` }}
          >
            <div className="absolute inset-0 mix-blend-overlay">
              <img alt="" className="absolute inset-0 max-w-none object-50%-50% object-cover pointer-events-none size-full" src={textureOverlay} />
            </div>
          </div>
        </div>
        <div className="absolute inset-[1.667%]">
          <div className="absolute bottom-0 left-[6.7%] right-[6.7%] top-0">
            <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 27 31">
              <path clipRule="evenodd" d={svgPaths.p18026100} fill="#00B3C8" fillRule="evenodd" />
            </svg>
          </div>
        </div>
      </div>
      <div className="absolute box-border content-stretch flex inset-[31.25%_21.67%] items-center justify-center pl-[2.667px] pr-0 py-0">
        <div className="flex flex-col font-['Roboto',sans-serif] justify-center leading-[0] relative shrink-0 text-[11px] text-center text-nowrap text-white overflow-hidden">
          <motion.p 
            key={displayValue}
            initial={{ y: direction === 'up' ? 20 : -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
            className="leading-[16px]"
          >
            {displayValue}
          </motion.p>
        </div>
        <div className="relative shrink-0 size-[10px]">
          <svg className="block size-full" fill="none" viewBox="0 0 6 11">
            <path d={svgPaths.p196f6d00} fill="white" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function LifeTile({ value }: { value: number }) {
  const [prevValue, setPrevValue] = useState(value);
  const [displayValue, setDisplayValue] = useState(value);
  const [direction, setDirection] = useState<'up' | 'down'>('up');
  
  useEffect(() => {
    if (value !== prevValue) {
      setDirection(value > prevValue ? 'up' : 'down');
      setPrevValue(value);
      setDisplayValue(value);
    }
  }, [value, prevValue]);
  
  return (
    <div className="relative shrink-0 size-[36px]" data-name="Life Tile">
      <div className="absolute inset-0">
        <div className="absolute inset-[1.667%] shadow-[4px_4px_4px_0px_rgba(0,0,0,0.5)]">
          <div className="absolute inset-[-1.724%]">
            <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 32 32">
              <path d="M16 0L32 16L16 32L0 16L16 0Z" fill="#D94A1E" />
            </svg>
          </div>
        </div>
        <div className="absolute contents inset-[1.667%]">
          <div 
            className="absolute inset-0 mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[0px] mask-size-[32px_32px] mix-blend-hard-light"
            style={{ maskImage: `url('${imgTexture}')` }}
          >
            <div className="absolute inset-0 mix-blend-overlay">
              <img alt="" className="absolute inset-0 max-w-none object-50%-50% object-cover pointer-events-none size-full" src={textureOverlay} />
            </div>
          </div>
        </div>
        <div className="absolute inset-[1.667%]">
          <div className="absolute bottom-0 left-[6.7%] right-[6.7%] top-0">
            <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 27 31">
              <path clipRule="evenodd" d={svgPaths.p18026100} fill="#D94A1E" fillRule="evenodd" />
            </svg>
          </div>
        </div>
      </div>
      <div className="absolute box-border content-stretch flex inset-[31.25%_21.67%] items-center justify-center pl-[2.667px] pr-0 py-0 z-10">
        <div className="flex flex-col font-['Roboto',sans-serif] justify-center leading-[0] relative shrink-0 text-[11px] text-center text-nowrap text-white font-bold overflow-hidden">
          <motion.p 
            key={displayValue}
            initial={{ y: direction === 'up' ? 20 : -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
            className="leading-[16px] drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]"
          >
            {displayValue}
          </motion.p>
        </div>
        <div className="relative shrink-0 size-[10px]">
          <svg className="block size-full" fill="none" viewBox="0 0 7 7">
            <path d={svgPaths.p37257ff0} fill="white" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function VPBadge({ value }: { value: number }) {
  const [prevValue, setPrevValue] = useState(value);
  const [displayValue, setDisplayValue] = useState(value);
  const [direction, setDirection] = useState<'up' | 'down'>('up');
  
  useEffect(() => {
    if (value !== prevValue) {
      setDirection(value > prevValue ? 'up' : 'down');
      setPrevValue(value);
      setDisplayValue(value);
    }
  }, [value, prevValue]);
  
  return (
    <div className="absolute right-[16px] size-[48px] top-[16px] z-10">
      <div className="absolute inset-0">
        <div className="absolute inset-[1.667%] shadow-[4px_4px_4px_0px_rgba(0,0,0,0.5)]">
          <div className="absolute bg-[#f5dc3f] inset-[3.448%] rounded-[166.5px]" />
        </div>
        <div className="absolute inset-0 mix-blend-overlay">
          <img alt="" className="absolute inset-0 max-w-none object-50%-50% object-cover pointer-events-none size-full" src={textureOverlay} />
        </div>
        <div className="absolute inset-[1.667%]">
          <div className="absolute inset-[3.448%]">
            <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 36 36">
              <path clipRule="evenodd" d={svgPaths.p37fae900} fill="#F5DC3F" fillRule="evenodd" />
            </svg>
          </div>
        </div>
      </div>
      <div className="absolute box-border content-stretch flex inset-[31.25%_21.67%] items-center justify-center z-10">
        <div className="flex flex-col font-['Cinzel',sans-serif] justify-center leading-[0] relative shrink-0 text-center text-nowrap tracking-tight overflow-hidden" style={{ fontSize: '20px', fontWeight: 700, color: '#000000' }}>
          <motion.p 
            key={displayValue}
            initial={{ y: direction === 'up' ? 25 : -25, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
            className="leading-[normal]"
          >
            {displayValue}
          </motion.p>
        </div>
      </div>
    </div>
  );
}

export function CharacterCard({ character, isSelected = false, onClick, variant = 'selection', vp = 0, showEnergy = false, energy = 9, showLife = false, currentHp = 9, purchasedCards = [], stoneplateActive = false, precisionCutActive = false, venomSiphonActive = false, storedDie }: CharacterCardProps) {
  const isDetail = variant === 'detail';

  return (
    <div 
      className={`relative overflow-hidden rounded-[24px] transition-all duration-300 ${
        onClick ? 'cursor-pointer' : ''
      } ${
        isSelected ? 'ring-2 ring-primary glow-cyan scale-105' : 'hover:scale-[1.02]'
      }`}
      onClick={onClick}
      style={{
        boxShadow: '0 12px 30px rgba(0,0,0,0.5)'
      }}
    >
      {/* Background Image with Overlay */}
      <div className="absolute inset-0">
        <img 
          alt="" 
          className="absolute inset-0 w-full h-full object-cover pointer-events-none rounded-[24px]" 
          src={placeholderBg}
        />
        <div 
          className="absolute inset-0 rounded-[24px] transition-opacity"
          style={{
            background: 'linear-gradient(180deg, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.75) 50%, rgba(0,0,0,0.9) 100%)'
          }}
        />
      </div>

      {/* Content */}
      <div className="relative flex flex-col gap-[12px] p-[20px]">
        {/* VP Badge - only in detail view */}
        {isDetail && <VPBadge value={vp} />}

        {/* Stoneplate Protection Badge - shown above character when active */}
        {isDetail && stoneplateActive && character.ability.id === 'stoneplate' && (
          <div className="absolute left-[16px] top-[16px] z-10">
            <Badge 
              className="bg-amber-700/90 border-amber-500 text-white px-3 py-1.5 shadow-lg animate-pulse"
              style={{ fontSize: '12px', fontWeight: 600 }}
            >
              🛡️ -1 Damage
            </Badge>
          </div>
        )}

        {/* Precision Cut Damage Boost Badge - shown above character when active */}
        {isDetail && precisionCutActive && character.ability.id === 'precision_cut' && (
          <div className="absolute left-[16px] top-[16px] z-10">
            <Badge 
              className="bg-red-700/90 border-red-500 text-white px-3 py-1.5 shadow-lg animate-pulse"
              style={{ fontSize: '12px', fontWeight: 600 }}
            >
              ⚔️ Precision Cut +1
            </Badge>
          </div>
        )}

        {/* Venom Siphon Energy Drain Badge - shown above character when active */}
        {isDetail && venomSiphonActive && character.ability.id === 'venom_siphon' && (
          <div className="absolute left-[16px] top-[16px] z-10">
            <Badge 
              className="bg-purple-700/90 border-purple-500 text-white px-3 py-1.5 shadow-lg animate-pulse"
              style={{ fontSize: '12px', fontWeight: 600 }}
            >
              ⚡ Venom Siphon
            </Badge>
          </div>
        )}

        {/* Selection Check - only in selection view when selected */}
        {!isDetail && isSelected && (
          <div className="absolute top-[16px] right-[16px] bg-primary text-primary-foreground rounded-full p-2 z-10">
            <Check className="h-5 w-5" />
          </div>
        )}

        {/* Hero Image Panel */}
        <div className="relative w-full rounded-[16px] overflow-hidden" style={{ aspectRatio: '642/422', boxShadow: '0 6px 18px rgba(0,0,0,0.35)' }}>
          <img 
            alt={`${character.name} hero image`}
            className="absolute inset-0 w-full h-full object-cover object-center"
            src={characterImages[character.id] || placeholderBg}
          />
          {/* Decorative overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-neon-cyan/20 to-neon-magenta/20 mix-blend-screen" />
        </div>

        {/* Identity Bar - Glass Panel */}
        <div 
          className="relative rounded-[12px] w-full"
          style={{
            background: 'rgba(20, 24, 32, 0.6)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.08)'
          }}
        >
          <div className="flex items-center justify-between gap-[12px] px-[16px] py-[10px]">
            {/* Left: Name & Tagline */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-[2px]">
                <h3 
                  className="font-['Fira_Sans',sans-serif] text-[#00E5FF] truncate"
                  style={{ 
                    fontSize: isDetail ? '22px' : '18px',
                    lineHeight: isDetail ? '28px' : '24px',
                    fontWeight: 600
                  }}
                >
                  {character.name}
                </h3>
                {/* Time Bank Stored Die Chip */}
                {isDetail && storedDie && character.ability.id === 'time_bank' && (
                  <Badge 
                    className="bg-purple-700/90 border-purple-500 text-white px-2 py-0.5 text-xs shrink-0"
                  >
                    {diceIcons[storedDie as keyof typeof diceIcons]}
                  </Badge>
                )}
              </div>
              <p 
                className="text-white/75 truncate"
                style={{ 
                  fontSize: isDetail ? '14px' : '12px',
                  lineHeight: isDetail ? '20px' : '16px'
                }}
              >
                {character.tagline}
              </p>
            </div>

            {/* Right: Stat Tiles */}
            <div className="flex gap-[4px] shrink-0">
              {showEnergy && <EnergyTile value={energy} />}
              {showLife && <LifeTile value={currentHp} />}
            </div>
          </div>
          <div 
            aria-hidden="true" 
            className="absolute border border-[#00e5ff]/30 border-solid inset-[-1px] pointer-events-none rounded-[13px]" 
          />
        </div>

        {/* Abilities Section - shown in both variants, styled differently */}
        <div 
          className="relative rounded-[16px] w-full"
          style={{
            background: 'linear-gradient(90deg, rgba(255, 255, 255, 0.8) 0%, rgba(255, 255, 255, 0.8) 100%), linear-gradient(90deg, rgba(255, 255, 255, 0.35) 0%, rgba(255, 255, 255, 0.35) 100%), linear-gradient(90deg, rgba(255, 255, 255, 0.15) 0%, rgba(255, 255, 255, 0.15) 100%)'
          }}
        >
          <div className={isDetail ? "px-[12px] py-[16px]" : "px-[10px] py-[12px]"}>
            <h4 
              className="font-['Fira_Sans',sans-serif] text-[#1a1b25] mb-[6px]"
              style={{ 
                fontSize: isDetail ? '14px' : '12px',
                fontWeight: 600
              }}
            >
              {character.ability.name}
            </h4>
            <p 
              className={`font-['Roboto',sans-serif] text-[#1a1b25] ${!isDetail ? 'line-clamp-2' : ''}`}
              style={{ 
                fontSize: isDetail ? '12px' : '11px',
                lineHeight: isDetail ? '16px' : '14px'
              }}
            >
              {character.ability.description}
            </p>
          </div>
        </div>

        {/* Shop Cards Section - shown in detail view when player has cards */}
        {isDetail && purchasedCards && purchasedCards.length > 0 && (
          <div 
            className="relative rounded-[16px] w-full"
            style={{ 
              background: 'linear-gradient(90deg, rgba(255, 0, 168, 0.15) 0%, rgba(255, 0, 168, 0.1) 100%), linear-gradient(90deg, rgba(255, 255, 255, 0.25) 0%, rgba(255, 255, 255, 0.15) 100%)'
            }}
          >
            <div className="px-[12px] py-[12px]">
              <h4 
                className="font-['Fira_Sans',sans-serif] text-white mb-[8px]"
                style={{ 
                  fontSize: '12px',
                  fontWeight: 600
                }}
              >
                Shop Cards ({purchasedCards.length})
              </h4>
              <TooltipProvider delayDuration={200}>
                <div className="space-y-[6px]">
                  {purchasedCards.map(cardId => {
                    const card = shopCards.find(c => c.id === cardId);
                    if (!card) return null;
                    return (
                      <Tooltip key={cardId}>
                        <TooltipTrigger asChild>
                          <div
                            className="p-[8px] rounded-lg bg-black/20 border border-neon-magenta/30 cursor-help transition-colors hover:border-neon-magenta/50"
                          >
                            <div className="flex items-center justify-between gap-2 mb-[4px]">
                              <p className="text-neon-magenta text-xs">
                                {card.nameEn}
                              </p>
                              <Badge
                                variant={card.type === 'KEEP' ? 'default' : 'secondary'}
                                className="text-[10px] h-4"
                              >
                                {card.type}
                              </Badge>
                            </div>
                            <p className="text-white/60 text-[10px] leading-tight line-clamp-2">
                              {card.effectEn}
                            </p>
                          </div>
                        </TooltipTrigger>
                        <TooltipContent 
                          side="right" 
                          className="max-w-[280px] bg-black/95 border-neon-magenta/50"
                        >
                          <div className="space-y-1">
                            <p className="text-neon-magenta font-['Fira_Sans',sans-serif]">
                              {card.nameEn}
                            </p>
                            <p className="text-xs text-white/90 leading-relaxed">
                              {card.effectEn}
                            </p>
                            <p className="text-[10px] text-white/60 italic">
                              Type: {card.type}
                            </p>
                          </div>
                        </TooltipContent>
                      </Tooltip>
                    );
                  })}
                </div>
              </TooltipProvider>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}