import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';
import { Badge } from './ui/badge';
import type { AbilityState } from '../lib/abilitySystem';
import { ABILITY_STATE_ICONS, ABILITY_STATE_LABELS } from '../lib/abilitySystem';
import type { Character } from '../lib/gameData';

interface AbilityIndicatorProps {
  character: Character;
  state: AbilityState;
  storedDie?: string;
}

export function AbilityIndicator({ character, state, storedDie }: AbilityIndicatorProps) {
  const icon = ABILITY_STATE_ICONS[state];
  const label = ABILITY_STATE_LABELS[state];

  const getBgColor = () => {
    switch (state) {
      case 'ready':
        return 'bg-gray-600/50';
      case 'armed':
        return 'bg-neon-cyan/20 border-neon-cyan';
      case 'spent':
        return 'bg-gray-800/50';
      case 'stored':
        return 'bg-neon-magenta/20 border-neon-magenta';
      default:
        return 'bg-gray-600/50';
    }
  };

  const getTextColor = () => {
    switch (state) {
      case 'armed':
        return 'text-neon-cyan';
      case 'stored':
        return 'text-neon-magenta';
      default:
        return 'text-white/70';
    }
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger>
          <Badge
            variant="outline"
            className={`${getBgColor()} ${getTextColor()} border text-xs px-2 py-1 cursor-help`}
          >
            <span className="mr-1">{icon}</span>
            {label}
            {storedDie && <span className="ml-1">{storedDie}</span>}
          </Badge>
        </TooltipTrigger>
        <TooltipContent side="top" className="max-w-xs">
          <p className="font-semibold text-neon-cyan mb-1">{character.ability.name}</p>
          <p className="text-xs text-text-secondary">{character.ability.description}</p>
          <p className="text-xs text-text-muted mt-1">Status: {label}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}