import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';
import { Trophy, RefreshCw } from 'lucide-react';
import type { AbilityState } from '../lib/abilitySystem';
import svgPaths from '../imports/svg-7bt78jcxm7';
import { imgTexture } from '../imports/svg-u1yst';
import type { Character } from '../lib/gameData';

const textureOverlay = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="32" height="32"%3E%3Crect width="32" height="32" fill="%23000" opacity="0.1"%3E%3C/rect%3E%3C/svg%3E';

interface PlayerHUDProps {
  name: string;
  character: Character;
  hp: number;
  maxHp: number;
  energy: number;
  vp: number;
  isActive: boolean;
  inCenter: boolean;
  abilityState?: AbilityState;
  onConvertClick?: () => void;
}

function SmallEnergyTile({ value }: { value: number }) {
  return (
    <div className="relative shrink-0 size-[28px]">
      <div className="absolute inset-0">
        <div className="absolute inset-[1.667%]">
          <div className="absolute inset-[-1.724%]">
            <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 32 32">
              <path d="M16 0L32 16L16 32L0 16L16 0Z" fill="#00B3C8" />
            </svg>
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
      <div className="absolute box-border content-stretch flex inset-[31.25%_21.67%] items-center justify-center">
        <div className="flex flex-col font-['Roboto',sans-serif] justify-center leading-[0] relative shrink-0 text-[10px] text-center text-nowrap text-white">
          <p className="leading-[14px]">{value}</p>
        </div>
        <div className="relative shrink-0 size-[8px]">
          <svg className="block size-full" fill="none" viewBox="0 0 6 11">
            <path d={svgPaths.p196f6d00} fill="white" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function SmallLifeTile({ value }: { value: number }) {
  return (
    <div className="relative shrink-0 size-[28px]">
      <div className="absolute inset-0">
        <div className="absolute inset-[1.667%]">
          <div className="absolute inset-[-1.724%]">
            <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 32 32">
              <path d="M16 0L32 16L16 32L0 16L16 0Z" fill="#D94A1E" />
            </svg>
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
      <div className="absolute box-border content-stretch flex inset-[31.25%_21.67%] items-center justify-center">
        <div className="flex flex-col font-['Roboto',sans-serif] justify-center leading-[0] relative shrink-0 text-[10px] text-center text-nowrap text-white">
          <p className="leading-[14px]">{value}</p>
        </div>
        <div className="relative shrink-0 size-[8px]">
          <svg className="block size-full" fill="none" viewBox="0 0 7 7">
            <path d={svgPaths.p37257ff0} fill="white" />
          </svg>
        </div>
      </div>
    </div>
  );
}

export function PlayerHUD({ name, character, hp, maxHp, energy, vp, isActive, inCenter, abilityState, onConvertClick }: PlayerHUDProps) {
  // Check if Convertive Gaze is available
  const isConvertiveGaze = character.ability.id === 'convertive_gaze';
  const canConvertToHeart = energy >= 1 && hp < maxHp;
  const canConvertToEnergy = hp >= 1;
  const canConvert = isConvertiveGaze && abilityState === 'ready' && (canConvertToHeart || canConvertToEnergy);
  return (
    <div className="relative">
      {/* Extreme Glow Effect Container */}
      {isActive && (
        <div 
          className="absolute inset-[-20px] rounded-[36px] animate-pulse"
          style={{
            background: 'radial-gradient(circle, rgba(0, 229, 255, 0.6) 0%, rgba(0, 229, 255, 0.3) 50%, transparent 70%)',
            filter: 'blur(20px)',
            zIndex: -1
          }}
        />
      )}
      
      <div 
        className={`relative rounded-[16px] transition-all`}
        style={{
          background: isActive 
            ? 'linear-gradient(135deg, rgba(0, 229, 255, 0.4) 0%, rgba(0, 181, 204, 0.3) 100%)' 
            : 'rgba(20, 24, 32, 0.8)',
          backdropFilter: 'blur(10px)',
          border: isActive 
            ? '5px solid #00E5FF' 
            : '1px solid rgba(255, 255, 255, 0.08)',
          boxShadow: isActive 
            ? '0 0 100px rgba(0, 229, 255, 1), 0 0 150px rgba(0, 229, 255, 0.8), inset 0 0 80px rgba(0, 229, 255, 0.4)' 
            : '0 2px 8px rgba(0,0,0,0.35)',
          transform: isActive ? 'scale(1.05)' : 'scale(1)'
        }}
      >
        {/* Active Turn Banner */}
        {isActive && (
          <div 
            className="absolute -top-3 left-1/2 -translate-x-1/2 px-6 py-1 rounded-full z-10 animate-pulse"
            style={{
              background: 'linear-gradient(90deg, #00E5FF 0%, #00B3CC 100%)',
              boxShadow: '0 0 30px rgba(0, 229, 255, 1), 0 0 60px rgba(0, 229, 255, 0.6)',
              border: '2px solid #ffffff'
            }}
          >
            <span className="text-black font-bold text-sm tracking-wider">YOUR TURN</span>
          </div>
        )}

        <div className="p-4 space-y-3">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex-1 min-w-0">
              <p className={`truncate ${isActive ? 'text-neon-cyan' : 'text-text-secondary'}`}>
                {name}
              </p>
              <p className="text-xs text-text-muted truncate">{character.name}</p>
            </div>
            {isActive && (
              <Badge className="bg-neon-cyan text-black shrink-0 ml-2 animate-pulse">Active</Badge>
            )}
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-3 gap-2">
            {/* HP Tile */}
            <div className="flex flex-col items-center gap-1">
              <SmallLifeTile value={hp} />
              <span className="text-xs text-text-muted">HP</span>
            </div>

            {/* Energy Tile */}
            <div className="flex flex-col items-center gap-1">
              <SmallEnergyTile value={energy} />
              <span className="text-xs text-text-muted">Energy</span>
            </div>

            {/* VP */}
            <div className="flex flex-col items-center gap-1">
              <div 
                className="relative size-[28px] rounded-full flex items-center justify-center"
                style={{
                  background: 'linear-gradient(135deg, #F8D24B 0%, #D9A500 100%)',
                  boxShadow: '0 2px 6px rgba(0,0,0,0.3)'
                }}
              >
                <Trophy className="h-3 w-3 text-black" />
              </div>
              <span className="text-xs text-text-muted">VP: {vp}</span>
            </div>
          </div>

          {/* Center Status */}
          {inCenter && (
            <Badge 
              variant="outline" 
              className="w-full justify-center border-neon-cyan text-neon-cyan"
            >
              In Center
            </Badge>
          )}

          {/* Convertive Gaze Button */}
          {isConvertiveGaze && isActive && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div>
                    <Button
                      onClick={onConvertClick}
                      disabled={!canConvert || abilityState === 'spent'}
                      size="sm"
                      variant="outline"
                      className={`w-full ${canConvert ? 'border-purple-500 hover:bg-purple-500/20 text-purple-300' : ''}`}
                    >
                      <RefreshCw className="h-3 w-3 mr-1" />
                      Convert {abilityState === 'spent' ? '(Used)' : ''}
                    </Button>
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  {!canConvert && abilityState !== 'spent' ? 'Not enough resources' : 'Convert Energy ↔ Heart'}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </div>
      </div>
    </div>
  );
}