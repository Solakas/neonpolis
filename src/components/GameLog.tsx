import { useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { ScrollArea } from './ui/scroll-area';
import { Badge } from './ui/badge';

interface GameLogEntry {
  id: string;
  timestamp: Date;
  message: string;
  type: 'roll' | 'damage' | 'heal' | 'energy' | 'shop' | 'center' | 'ability' | 'info';
}

interface GameLogProps {
  logs: GameLogEntry[];
}

const typeColors: Record<GameLogEntry['type'], string> = {
  roll: 'text-text-primary',
  damage: 'text-status-danger',
  heal: 'text-status-success',
  energy: 'text-neon-cyan',
  shop: 'text-neon-magenta',
  center: 'text-status-info',
  ability: 'text-neon-purple',
  info: 'text-text-muted'
};

const typeLabels: Record<GameLogEntry['type'], string> = {
  roll: 'ROLL',
  damage: 'DMG',
  heal: 'HEAL',
  energy: 'NRG',
  shop: 'SHOP',
  center: 'CNTR',
  ability: 'ABIL',
  info: 'INFO'
};

export function GameLog({ logs }: GameLogProps) {
  const endOfLogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (endOfLogRef.current) {
      endOfLogRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'nearest' });
    }
  }, [logs]);

  return (
    <Card className="border-border/50 bg-surface-panel h-full flex flex-col">
      <CardHeader className="pb-3 shrink-0">
        <CardTitle>Game Log</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 overflow-hidden">
        <ScrollArea className="h-full max-h-[500px]">
          <div className="space-y-2 pr-4">
            {logs.map((log) => (
              <div
                key={log.id}
                className="p-2 rounded border border-border/30 bg-background/50 text-sm"
              >
                <div className="flex items-start gap-2">
                  <Badge
                    variant="outline"
                    className={`text-xs shrink-0 ${typeColors[log.type]}`}
                  >
                    {typeLabels[log.type]}
                  </Badge>
                  <div className="flex-1 min-w-0">
                    <p className={`${typeColors[log.type]} break-words`}>
                      {log.message}
                    </p>
                    <p className="text-xs text-text-muted mt-1">
                      {log.timestamp.toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              </div>
            ))}
            
            {logs.length === 0 && (
              <p className="text-center text-text-muted py-8">
                No events yet...
              </p>
            )}
            
            {/* Invisible element to scroll to */}
            <div ref={endOfLogRef} />
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}