import { useState, useEffect } from 'react';
import { MainView } from './components/MainView';
import { CharacterSelection } from './components/CharacterSelection';
import { Arena } from './components/Arena';
import { Toaster } from './components/ui/sonner';

type GameState = 'home' | 'character-select' | 'arena' | 'end';

export interface GameConfig {
  mode: 'practice' | 'live';
  opponentCount: number;
}

export default function App() {
  const [gameState, setGameState] = useState<GameState>('home');
  const [gameConfig, setGameConfig] = useState<GameConfig>({
    mode: 'practice',
    opponentCount: 1
  });
  const [selectedCharacter, setSelectedCharacter] = useState<string | null>(null);

  const handleStartPlay = (config: GameConfig) => {
    setGameConfig(config);
    setGameState('character-select');
  };

  const handleCharacterSelected = (characterId: string) => {
    setSelectedCharacter(characterId);
    setGameState('arena');
  };

  const handleBackToHome = () => {
    setGameState('home');
    setSelectedCharacter(null);
  };

  // Prevent page scrolling only during arena
  useEffect(() => {
    if (gameState === 'arena') {
      // Prevent scrolling by adding class
      document.documentElement.classList.add('no-scroll');
      // Also prevent scroll restoration
      if ('scrollRestoration' in window.history) {
        window.history.scrollRestoration = 'manual';
      }
    } else {
      // Re-enable scrolling
      document.documentElement.classList.remove('no-scroll');
      if ('scrollRestoration' in window.history) {
        window.history.scrollRestoration = 'auto';
      }
    }

    // Cleanup on unmount
    return () => {
      document.documentElement.classList.remove('no-scroll');
    };
  }, [gameState]);

  return (
    <div className="min-h-screen bg-background">
      {gameState === 'home' && (
        <MainView onStartPlay={handleStartPlay} />
      )}
      
      {gameState === 'character-select' && (
        <CharacterSelection 
          onCharacterSelected={handleCharacterSelected}
          opponentCount={gameConfig.opponentCount}
          onBack={handleBackToHome}
        />
      )}
      
      {gameState === 'arena' && selectedCharacter && (
        <Arena 
          playerCharacterId={selectedCharacter}
          opponentCount={gameConfig.opponentCount}
          onEndMatch={handleBackToHome}
        />
      )}
      
      <Toaster />
    </div>
  );
}
