import { useState, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from './ui/accordion';
import { Badge } from './ui/badge';
import { Tabs, TabsList, TabsTrigger } from './ui/tabs';
import type { GameConfig } from '../App';
import heroImage from 'figma:asset/b846c94630162592b46129a3d823bb962ef9519a.png';

interface MainViewProps {
  onStartPlay: (config: GameConfig) => void;
}

export function MainView({ onStartPlay }: MainViewProps) {
  const [selectedMode, setSelectedMode] = useState<'practice' | 'live'>('practice');
  const [opponentCount, setOpponentCount] = useState<number>(1);

  // Parallax scroll effect
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 1000], [0, 300]);
  const opacity = useTransform(scrollY, [0, 400], [0.6, 0.2]);

  const handleStartClick = () => {
    onStartPlay({
      mode: selectedMode,
      opponentCount
    });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section with Parallax */}
      <div className="relative overflow-hidden">
        {/* Hero Background Image with Parallax */}
        <motion.div 
          className="fixed inset-0 z-0 w-full h-screen"
          style={{ y }}
        >
          <motion.img 
            src={heroImage} 
            alt="NeonPolis Arena" 
            className="w-full h-full object-cover"
            style={{ opacity }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/50 to-background" />
        </motion.div>

        {/* Hero Content */}
        <div className="relative z-10 container mx-auto px-4 pt-16 pb-20 max-w-6xl">
          {/* Title Section */}
          <div className="text-center mb-16 mt-8">
            <h1 className="text-8xl md:text-9xl mb-8 text-neon-cyan drop-shadow-[0_0_40px_rgba(0,229,255,0.8)] tracking-tight" style={{ fontSize: 'clamp(4rem, 12vw, 10rem)', fontFamily: 'Fira Sans, sans-serif' }}>
              NeonPolis
            </h1>
            <p className="text-2xl md:text-3xl text-text-primary max-w-3xl mx-auto mb-6 drop-shadow-lg">
              Where Titans Clash in the Neon Arena
            </p>
            <p className="text-lg text-text-secondary max-w-2xl mx-auto drop-shadow-md">
              Eight mighty creatures descend upon the burning city. Roll the dice, harness Energy, 
              and prove your dominance in this cyberpunk dice-battler where strategy meets chaos.
            </p>
          </div>

          {/* Mode Selection Card */}
          <Card className="border-border/50 shadow-neon bg-surface-panel/95 backdrop-blur-sm">
            <CardHeader>
              <CardTitle>Game Mode</CardTitle>
              <CardDescription>Choose how you want to play</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Practice Mode */}
                <button
                  onClick={() => setSelectedMode('practice')}
                  className={`p-6 rounded-lg border-2 transition-all text-left ${
                    selectedMode === 'practice'
                      ? 'border-primary bg-primary/10 glow-cyan'
                      : 'border-border hover:border-primary/50'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-neon-cyan">Practice</h3>
                    <Badge variant="default">Available</Badge>
                  </div>
                  <p className="text-text-secondary">
                    Play against AI bots to learn the game and test strategies.
                  </p>
                </button>

                {/* Live Match */}
                <button
                  disabled
                  className="p-6 rounded-lg border-2 border-border/30 bg-muted/20 text-left opacity-50 cursor-not-allowed"
                >
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-text-muted">Live Match</h3>
                    <Badge variant="secondary">Coming Soon</Badge>
                  </div>
                  <p className="text-text-muted">
                    Challenge players in real-time multiplayer matches.
                  </p>
                </button>
              </div>

              {/* Opponent Count Slider */}
              {selectedMode === 'practice' && (
                <div className="space-y-3">
                  <label className="block">
                    Number of Opponents
                  </label>
                  <Tabs value={opponentCount.toString()} onValueChange={(value) => setOpponentCount(parseInt(value))}>
                    <TabsList className="grid w-full grid-cols-3">
                      <TabsTrigger value="1">1 Opponent</TabsTrigger>
                      <TabsTrigger value="2">2 Opponents</TabsTrigger>
                      <TabsTrigger value="3">3 Opponents</TabsTrigger>
                    </TabsList>
                  </Tabs>
                  <p className="text-text-muted">
                    Total players: {opponentCount + 1} (2-4 players)
                  </p>
                </div>
              )}

              <Button
                onClick={handleStartClick}
                disabled={selectedMode === 'live'}
                size="lg"
                className="w-full glow-cyan"
              >
                Start Play
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Rules Section */}
      <div className="relative z-10 container mx-auto px-4 pb-16 pt-8 max-w-6xl">
        <Card className="border-border/50">
          <CardHeader>
            <CardTitle>Game Rules</CardTitle>
            <CardDescription>Learn the mechanics of NeonPolis</CardDescription>
          </CardHeader>
          <CardContent>
            <Accordion type="multiple" className="w-full">
              <AccordionItem value="dice">
                <AccordionTrigger>1) Dice & Rolls</AccordionTrigger>
                <AccordionContent className="text-text-secondary space-y-2">
                  <p>Each player rolls six d6. Faces: <strong>1, 2, 3, ⚔️, ⚡, ❤️</strong></p>
                  <p>Press-your-luck: keep any dice; re-roll the rest. Up to <strong>3 total rolls</strong> (initial + 2 re-rolls).</p>
                  <ul className="list-disc list-inside space-y-1 ml-4">
                    <li><strong>⚔️ Sword:</strong> Deal 1 damage per die</li>
                    <li><strong>⚡ Energy:</strong> Currency for the Shop</li>
                    <li><strong>❤️ Heart:</strong> Heal 1 per die (no healing in Center unless a card/effect allows)</li>
                    <li><strong>Numbers (1, 2, 3):</strong> Form sets for bonus effects</li>
                  </ul>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="health">
                <AccordionTrigger>2) Health & Energy</AccordionTrigger>
                <AccordionContent className="text-text-secondary space-y-2">
                  <p><strong>Max Life:</strong> 10 (can exceed only if a card/effect says so).</p>
                  <p><strong>Damage:</strong> ⚔️ deals 1 damage per die to chosen opponent.</p>
                  <p><strong>Healing:</strong> ❤️ heals 1 per die; healing in Center is disabled unless a card/effect allows it.</p>
                  <p><strong>Energy:</strong> ⚡ is the currency used to buy Market cards during the Shop Phase.</p>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="center">
                <AccordionTrigger>3) Center (Arena Core)</AccordionTrigger>
                <AccordionContent className="text-text-secondary space-y-2">
                  <p>The Center holds <strong>at most one occupant</strong> at a time.</p>
                  <p>Being in the Center often provides strategic advantages but also makes you a target.</p>
                  <p><strong>Default:</strong> You cannot heal in Center unless an effect allows it.</p>
                  <p>Many cards reference being "in Center" or "outside" for their effects.</p>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="cards">
                <AccordionTrigger>4) Cards & Market</AccordionTrigger>
                <AccordionContent className="text-text-secondary space-y-2">
                  <p>The board shows <strong>3 open Shop cards</strong>, plus Discarded and Deck piles.</p>
                  <p>Buy cards during your <strong>Shop Phase</strong> using ⚡ Energy.</p>
                  <p><strong>KEEP cards:</strong> Permanent upgrades and abilities that stay with you.</p>
                  <p><strong>DISCARD cards:</strong> One-time instant effects that go to the discard pile after use.</p>
                  <p>Empty Shop slots are refilled from the Deck as per game flow.</p>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="characters">
                <AccordionTrigger>5) Characters & Abilities</AccordionTrigger>
                <AccordionContent className="text-text-secondary space-y-2">
                  <p>Each character has a unique ability with different states:</p>
                  <ul className="list-disc list-inside space-y-1 ml-4">
                    <li><strong>Ready (◯):</strong> Can be activated</li>
                    <li><strong>Armed (●):</strong> Waiting to trigger</li>
                    <li><strong>Spent (✓):</strong> Used this turn</li>
                    <li><strong>Stored (⧉):</strong> Saved for later</li>
                  </ul>
                  <p><strong>Passive:</strong> Always on when conditions are met</p>
                  <p><strong>Instant:</strong> Confirm and resolve immediately</p>
                  <p><strong>Upgrade:</strong> Permanent attachment to your character</p>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="evolutions">
                <AccordionTrigger>6) Evolutions</AccordionTrigger>
                <AccordionContent className="text-text-secondary space-y-2">
                  <p>If your final roll has <strong>≥3 ❤️</strong>, unlock one Evolution for your character.</p>
                  <p><strong>Evolution Types:</strong></p>
                  <ul className="list-disc list-inside space-y-1 ml-4">
                    <li><strong>Instant:</strong> Resolve immediately</li>
                    <li><strong>Passive:</strong> Ongoing effect</li>
                    <li><strong>Upgrade:</strong> Permanently attached</li>
                  </ul>
                  <p>Evolutions provide powerful enhancements unique to each character.</p>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="turn">
                <AccordionTrigger>7) Turn Structure</AccordionTrigger>
                <AccordionContent className="text-text-secondary space-y-2">
                  <ol className="list-decimal list-inside space-y-1 ml-4">
                    <li><strong>Roll Phase:</strong> Roll dice, keep/reroll up to 3 times</li>
                    <li><strong>Resolve Phase:</strong> Apply numbers/sets, ⚔️ damage, ⚡ gain, ❤️ heal, check for evolutions</li>
                    <li><strong>Shop Phase:</strong> Buy from Shop cards 1-3, refill empty slots</li>
                    <li><strong>Progress/VP:</strong> Gain Victory Points based on actions</li>
                    <li><strong>End Phase:</strong> Trigger end-of-turn effects</li>
                  </ol>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="timing">
                <AccordionTrigger>8) Timing Windows</AccordionTrigger>
                <AccordionContent className="text-text-secondary space-y-2">
                  <p>Key ability timing windows:</p>
                  <ul className="list-disc list-inside space-y-1 ml-4">
                    <li><strong>START_OF_TURN:</strong> When your turn begins</li>
                    <li><strong>AFTER_FIRST_ROLL:</strong> After your initial roll</li>
                    <li><strong>AFTER_FINAL_ROLL:</strong> After your last roll</li>
                    <li><strong>ON_ENTER_CENTER:</strong> When you enter the Center</li>
                    <li><strong>ON_LEAVE_CENTER:</strong> When you leave the Center</li>
                    <li><strong>END_OF_TURN:</strong> When your turn ends</li>
                    <li><strong>INSTANT:</strong> Play at any time</li>
                    <li><strong>REACTION:</strong> In response to another action</li>
                  </ul>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="tokens">
                <AccordionTrigger>9) Tokens & Icons</AccordionTrigger>
                <AccordionContent className="text-text-secondary space-y-2">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="mb-1"><strong>Dice Faces:</strong></p>
                      <ul className="space-y-1">
                        <li>⚔️ Sword (damage 1)</li>
                        <li>⚡ Energy (currency)</li>
                        <li>❤️ Heart (heal 1)</li>
                        <li>1, 2, 3 (numbers)</li>
                      </ul>
                    </div>
                    <div>
                      <p className="mb-1"><strong>Ability States:</strong></p>
                      <ul className="space-y-1">
                        <li>◯ Ready</li>
                        <li>● Armed</li>
                        <li>✓ Spent</li>
                        <li>⧉ Stored</li>
                      </ul>
                    </div>
                  </div>
                  <p className="mt-2"><strong>☠️ Skull:</strong> Special token appearing via cards/effects only (not a base die face)</p>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}