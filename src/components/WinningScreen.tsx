import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import type { Character } from '../lib/gameData';

interface WinningScreenProps {
  winnerName: string;
  winnerCharacter: Character;
  onRematch: () => void;
  onReturnToMain: () => void;
}

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  duration: number;
  delay: number;
  color: string;
}

export function WinningScreen({ winnerName, winnerCharacter, onRematch, onReturnToMain }: WinningScreenProps) {
  const [particles, setParticles] = useState<Particle[]>([]);

  // Generate fire sparkle particles
  useEffect(() => {
    const colors = ['#FF6B00', '#FFD700', '#FF4500', '#FFA500', '#FFFF00'];
    const newParticles: Particle[] = [];
    
    for (let i = 0; i < 60; i++) {
      newParticles.push({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 8 + 4,
        duration: Math.random() * 3 + 2,
        delay: Math.random() * 2,
        color: colors[Math.floor(Math.random() * colors.length)]
      });
    }
    
    setParticles(newParticles);
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Dark Overlay Background */}
      <div aria-hidden="true" className="absolute inset-0 bg-[rgba(13,3,65,0.95)] pointer-events-none" />

      {/* Fire Sparkle Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {particles.map((particle) => (
          <motion.div
            key={particle.id}
            className="absolute rounded-full"
            style={{
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              width: particle.size,
              height: particle.size,
              backgroundColor: particle.color,
              boxShadow: `0 0 ${particle.size * 2}px ${particle.color}`,
            }}
            initial={{ opacity: 0, scale: 0 }}
            animate={{
              opacity: [0, 1, 1, 0],
              scale: [0, 1, 1.5, 0],
              y: [0, -150],
            }}
            transition={{
              duration: particle.duration,
              delay: particle.delay,
              repeat: Infinity,
              ease: 'easeOut'
            }}
          />
        ))}
      </div>

      {/* Content */}
      <div className="relative content-stretch flex flex-col gap-[52px] items-center z-10">
        {/* Copy */}
        <div className="content-stretch flex flex-col font-['Fira_Sans',sans-serif] gap-[16px] items-start not-italic relative shrink-0 w-full">
          <motion.p 
            className="leading-[normal] relative shrink-0 text-[#00e5ff] text-[64px] text-center w-full"
            style={{
              fontWeight: 900,
              textShadow: '0 0 30px rgba(0, 229, 255, 0.8), 0 4px 20px rgba(0, 0, 0, 1)'
            }}
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.8 }}
          >
            Victory
          </motion.p>
          <motion.p 
            className="leading-[44px] relative shrink-0 text-[36px] text-white w-full text-center"
            style={{
              fontWeight: 900,
              textShadow: '0 4px 20px rgba(0, 0, 0, 1), 0 8px 40px rgba(0, 0, 0, 0.9)'
            }}
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.8 }}
          >
            You are the champion of NeonPolis
          </motion.p>
        </div>

        {/* Buttons */}
        <motion.div 
          className="content-stretch flex gap-[16px] items-center relative shrink-0"
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.8 }}
        >
          {/* Rematch Button */}
          <button
            onClick={onRematch}
            className="bg-[#00e5ff] box-border content-stretch flex gap-[8px] items-center justify-center px-[24px] py-[16px] relative rounded-[8px] shrink-0 hover:bg-[#00d4ee] transition-colors duration-200"
          >
            <p 
              className="font-['Fira_Sans',sans-serif] leading-[24px] relative shrink-0 text-[#0a0f14] text-[18px] text-nowrap whitespace-pre"
              style={{ fontWeight: 700 }}
            >
              Rematch
            </p>
          </button>

          {/* Main View Button */}
          <button
            onClick={onReturnToMain}
            className="box-border content-stretch flex gap-[8px] items-center justify-center px-[24px] py-[16px] relative rounded-[8px] shrink-0 hover:bg-[rgba(0,229,255,0.1)] transition-colors duration-200"
          >
            <div aria-hidden="true" className="absolute border border-[#00b3c8] border-solid inset-0 pointer-events-none rounded-[8px]" />
            <p 
              className="font-['Fira_Sans',sans-serif] leading-[24px] relative shrink-0 text-[18px] text-nowrap text-white whitespace-pre"
              style={{ 
                fontWeight: 700,
                textShadow: '0 2px 8px rgba(0, 0, 0, 0.8)'
              }}
            >
              Main View
            </p>
          </button>
        </motion.div>
      </div>
    </div>
  );
}
