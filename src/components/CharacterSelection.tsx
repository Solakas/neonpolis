import { useState } from 'react';
import { characters } from '../lib/gameData';
import { Button } from './ui/button';
import { CharacterCard } from './CharacterCard';
import { ArrowLeft } from 'lucide-react';

interface CharacterSelectionProps {
  onCharacterSelected: (characterId: string) => void;
  opponentCount: number;
  onBack: () => void;
}

export function CharacterSelection({ onCharacterSelected, opponentCount, onBack }: CharacterSelectionProps) {
  const [selectedCharacterId, setSelectedCharacterId] = useState<string | null>(null);

  const handleConfirm = () => {
    if (selectedCharacterId) {
      onCharacterSelected(selectedCharacterId);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Header */}
      <div className="mb-8">
        <Button
          variant="ghost"
          onClick={onBack}
          className="mb-4"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        
        <div className="text-center">
          <h1 className="mb-2 bg-gradient-neon bg-clip-text text-transparent">
            Choose Your Character
          </h1>
          <p className="text-text-secondary">
            Select your champion for the arena • {opponentCount} {opponentCount === 1 ? 'opponent' : 'opponents'}
          </p>
        </div>
      </div>

      {/* Character Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {characters.map((character) => (
          <CharacterCard
            key={character.id}
            character={character}
            isSelected={selectedCharacterId === character.id}
            onClick={() => setSelectedCharacterId(character.id)}
            variant="selection"
          />
        ))}
      </div>

      {/* Confirm Button */}
      <div className="flex justify-center">
        <Button
          onClick={handleConfirm}
          disabled={!selectedCharacterId}
          size="lg"
          className="glow-cyan min-w-64"
        >
          Confirm Selection
        </Button>
      </div>
    </div>
  );
}