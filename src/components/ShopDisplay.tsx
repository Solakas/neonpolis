import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';
import { ShoppingCart } from 'lucide-react';
import type { ShopCard } from '../lib/gameData';

interface ShopDisplayProps {
  cards: ShopCard[];
  playerEnergy: number;
  onBuyCard: (cardId: string) => void;
  disabled: boolean;
  // Phase 2 card abilities
  purchasedCards?: string[];
  onUseBlackMarket?: () => void;
  onUseMarketRecycle?: () => void;
  blackMarketUsed?: boolean;
  marketRecycleUsed?: boolean;
}

export function ShopDisplay({ 
  cards, 
  playerEnergy, 
  onBuyCard, 
  disabled,
  purchasedCards = [],
  onUseBlackMarket,
  onUseMarketRecycle,
  blackMarketUsed = false,
  marketRecycleUsed = false
}: ShopDisplayProps) {
  const hasBlackMarket = purchasedCards.includes('K003');
  const hasMarketRecycle = purchasedCards.includes('K024');

  return (
    <TooltipProvider>
      <Card className="border-border/50 bg-surface-panel">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2">
            <ShoppingCart className="h-5 w-5 text-neon-magenta" />
            Shop
          </CardTitle>
          <p className="text-xs text-text-muted">
            Your Energy: <span className="text-neon-cyan">⚡ {playerEnergy}</span>
          </p>
        </CardHeader>
        <CardContent className="space-y-3">
          {/* Phase 2 Card Ability Buttons */}
          {!disabled && (hasBlackMarket || hasMarketRecycle) && (
            <div className="space-y-2 pb-3 border-b border-border/50">
              {hasBlackMarket && !blackMarketUsed && (
                <Button
                  onClick={onUseBlackMarket}
                  size="sm"
                  variant="outline"
                  className="w-full border-neon-magenta text-neon-magenta hover:bg-neon-magenta/10"
                  disabled={playerEnergy < 1}
                >
                  🎴 Use Black Market (Pay 1 HP)
                </Button>
              )}
              {hasMarketRecycle && !marketRecycleUsed && (
                <Button
                  onClick={onUseMarketRecycle}
                  size="sm"
                  variant="outline"
                  className="w-full border-neon-cyan text-neon-cyan hover:bg-neon-cyan/10"
                  disabled={playerEnergy < 1}
                >
                  🔄 Use Market Recycle (1⚡)
                </Button>
              )}
            </div>
          )}
          
          {cards.map((card) => {
            const canAfford = playerEnergy >= card.cost;
            
            return (
              <Tooltip key={card.id}>
                <TooltipTrigger asChild>
                  <div
                    className={`p-3 rounded-lg border transition-all cursor-pointer ${\n                      canAfford && !disabled\n                        ? 'border-neon-cyan/50 bg-neon-cyan/5 hover:bg-neon-cyan/10'\n                        : 'border-border/30 bg-background/30'\n                    }`}
                  >
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div className="flex-1 min-w-0">
                        <p className={`text-sm mb-1 ${canAfford ? 'text-neon-cyan' : 'text-text-muted'}`}>
                          {card.nameEn}
                        </p>
                        <Badge
                          variant={card.type === 'KEEP' ? 'default' : 'secondary'}
                          className="text-xs"
                        >
                          {card.type}
                        </Badge>
                      </div>
                      <Badge
                        variant="outline"
                        className={canAfford ? 'border-neon-cyan text-neon-cyan' : 'border-border text-text-muted'}
                      >
                        ⚡ {card.cost}
                      </Badge>
                    </div>
                    
                    <p className="text-xs text-text-secondary mb-3 line-clamp-2">
                      {card.effectEn}
                    </p>
                    
                    <Button
                      onClick={(e) => {
                        e.stopPropagation();
                        onBuyCard(card.id);
                      }}
                      disabled={!canAfford || disabled}
                      size="sm"
                      className="w-full"
                      variant={canAfford && !disabled ? 'default' : 'secondary'}
                    >
                      {canAfford ? 'Buy' : 'Not Enough Energy'}
                    </Button>
                  </div>
                </TooltipTrigger>
                <TooltipContent side="left" className="max-w-sm border-neon-cyan/50 bg-surface-elevated p-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between gap-3">
                      <h4 className="text-neon-cyan text-base font-semibold">{card.nameEn}</h4>
                      <Badge
                        variant="outline"
                        className="border-neon-cyan text-neon-cyan"
                      >
                        ⚡ {card.cost}
                      </Badge>
                    </div>
                    <div className="flex gap-2">
                      <Badge variant={card.type === 'KEEP' ? 'default' : 'secondary'}>
                        {card.type}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {card.timing}
                      </Badge>
                    </div>
                    <p className="text-text-secondary text-sm leading-relaxed">
                      {card.effectEn}
                    </p>
                  </div>
                </TooltipContent>
              </Tooltip>
            );
          })}
          
          {disabled && (
            <p className="text-center text-xs text-text-muted py-2">
              Shop available during Shop Phase
            </p>
          )}
        </CardContent>
      </Card>
    </TooltipProvider>
  );
}