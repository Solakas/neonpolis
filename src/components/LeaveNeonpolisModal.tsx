import { Button } from './ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';

interface LeaveNeonpolisModalProps {
  open: boolean;
  damage: number;
  currentHp: number;
  attackerName: string;
  onDecision: (leave: boolean) => void;
}

export function LeaveNeonpolisModal({
  open,
  damage,
  currentHp,
  attackerName,
  onDecision,
}: LeaveNeonpolisModalProps) {
  const hpAfterDamage = currentHp - damage;
  
  return (
    <Dialog open={open} onOpenChange={() => {}}>
      <DialogContent className="sm:max-w-md border-neon-cyan/50 bg-surface-elevated">
        <DialogHeader>
          <DialogTitle className="text-neon-cyan">
            ⚔️ Under Attack in Neonpolis!
          </DialogTitle>
          <DialogDescription className="text-text-muted">
            {attackerName} dealt {damage} ⚔️ damage to you! Your HP: {currentHp} → {hpAfterDamage}
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-3 text-text-muted">
          <div className="border-t border-border/50 pt-3">
            <p className="text-white">Do you want to leave Neonpolis?</p>
            <ul className="text-xs mt-2 space-y-1 text-text-secondary">
              <li>✓ <span className="text-neon-cyan">Leave:</span> You exit to safety. {attackerName} must enter Neonpolis (+1 ★ VP)</li>
              <li>✓ <span className="text-neon-magenta">Stay:</span> You remain in Neonpolis. Continue earning +2 ★ VP per turn</li>
            </ul>
          </div>
        </div>
        
        <DialogFooter className="flex gap-2 sm:gap-2">
          <Button
            onClick={() => onDecision(true)}
            variant="destructive"
            className="flex-1 glow-red"
          >
            Leave Neonpolis
          </Button>
          <Button
            onClick={() => onDecision(false)}
            className="flex-1 glow-magenta"
          >
            Stay Inside
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}