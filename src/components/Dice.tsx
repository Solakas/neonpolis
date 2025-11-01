import { motion, useAnimation } from 'motion/react';
import { useEffect, useState } from 'react';
import { type DiceFace, diceIcons } from '../lib/gameData';
import { Lock } from 'lucide-react';

type DiceState = 'idle' | 'pressed' | 'rolling_1' | 'rolling_2' | 'rolling_3' | 'rolling_4' | 'result';

interface DiceProps {
  face: DiceFace;
  locked: boolean;
  accent?: boolean;
  onToggleLock: () => void;
  onRoll?: () => void;
  disabled?: boolean;
  isRolling?: boolean;
}

// Map dice faces to cube rotations
// CRITICAL: To show a face, rotate the cube OPPOSITE to the face's position
// E.g., if right face is at rotateY(90deg), rotate cube to rotateY(-90) to bring it front
const faceRotations: Record<DiceFace, { rotateX: number; rotateY: number; rotateZ: number }> = {
  '1': { rotateX: 0, rotateY: 0, rotateZ: 0 },       // Front face - no rotation needed
  '2': { rotateX: 0, rotateY: -90, rotateZ: 0 },     // Right face at +90, rotate cube to -90
  '3': { rotateX: 0, rotateY: 180, rotateZ: 0 },     // Back face at 180, rotate cube to 180 (or -180)
  'sword': { rotateX: 0, rotateY: 90, rotateZ: 0 },  // Left face at -90, rotate cube to +90
  'energy': { rotateX: -90, rotateY: 0, rotateZ: 0 }, // Top face at +90, rotate cube to -90
  'heart': { rotateX: 90, rotateY: 0, rotateZ: 0 },  // Bottom face at -90, rotate cube to +90
};

// All 6 faces of the cube
const allFaces: DiceFace[] = ['1', '2', '3', 'sword', 'energy', 'heart'];

export function Dice({ face, locked, accent = false, onToggleLock, disabled = false, isRolling = false }: DiceProps) {
  const [state, setState] = useState<DiceState>('idle');
  const cubeControls = useAnimation();
  const containerControls = useAnimation();
  const blurControls = useAnimation();
  const shadowControls = useAnimation();
  const badgeControls = useAnimation();

  // Handle press animation
  const handlePress = async () => {
    if (disabled) return;
    
    setState('pressed');
    await containerControls.start({
      scale: 0.96,
      y: 2,
      transition: { duration: 0.1, ease: 'easeIn' },
    });
  };

  // Roll animation sequence with 3D cube rotation
  const triggerRoll = async () => {
    if (locked) return;

    // Throw (lift & start) with initial 3D tumble
    setState('rolling_1');
    await Promise.all([
      containerControls.start({
        y: -24,
        scale: 0.96,
        transition: { duration: 0.15, ease: 'easeOut' },
      }),
      cubeControls.start({
        rotateX: 180,
        rotateY: 90,
        rotateZ: 45,
        transition: { duration: 0.15, ease: 'easeOut' },
      }),
      blurControls.start({
        opacity: 0.3,
        transition: { duration: 0.15 },
      }),
      shadowControls.start({
        scale: 0.9,
        opacity: 0.35,
        transition: { duration: 0.15 },
      }),
    ]);

    // Rolling step 1 -> 2 - chaotic tumbling
    setState('rolling_2');
    await Promise.all([
      containerControls.start({
        scale: 0.92,
        y: -14,
        transition: { duration: 0.12, ease: 'linear' },
      }),
      cubeControls.start({
        rotateX: 360,
        rotateY: 270,
        rotateZ: 180,
        transition: { duration: 0.12, ease: 'linear' },
      }),
      blurControls.start({
        opacity: 0.35,
        transition: { duration: 0.12 },
      }),
      shadowControls.start({
        scale: 0.95,
        opacity: 0.35,
        transition: { duration: 0.12 },
      }),
    ]);

    // Rolling step 2 -> 3 - more tumbling
    setState('rolling_3');
    await Promise.all([
      containerControls.start({
        scale: 1.04,
        y: -8,
        transition: { duration: 0.12, ease: 'linear' },
      }),
      cubeControls.start({
        rotateX: 540,
        rotateY: 450,
        rotateZ: 315,
        transition: { duration: 0.12, ease: 'linear' },
      }),
      blurControls.start({
        opacity: 0.4,
        transition: { duration: 0.12 },
      }),
      shadowControls.start({
        scale: 0.98,
        opacity: 0.4,
        transition: { duration: 0.12 },
      }),
    ]);

    // Rolling step 3 -> 4 - final tumble before landing
    setState('rolling_4');
    await Promise.all([
      containerControls.start({
        scale: 0.98,
        y: -3,
        transition: { duration: 0.12, ease: 'linear' },
      }),
      cubeControls.start({
        rotateX: 720,
        rotateY: 630,
        rotateZ: 450,
        transition: { duration: 0.12, ease: 'linear' },
      }),
      blurControls.start({
        opacity: 0.35,
        transition: { duration: 0.12 },
      }),
      shadowControls.start({
        scale: 1.0,
        opacity: 0.45,
        transition: { duration: 0.12 },
      }),
    ]);

    // Settle / Result - land on correct face
    const targetRotation = faceRotations[face];
    setState('result');
    await Promise.all([
      containerControls.start({
        y: [0, 4, 0],
        scale: [1, 0.96, 1],
        transition: {
          duration: 0.33,
          ease: [0.2, 0.9, 0.2, 1],
        },
      }),
      cubeControls.start({
        rotateX: targetRotation.rotateX,
        rotateY: targetRotation.rotateY,
        rotateZ: targetRotation.rotateZ,
        transition: {
          duration: 0.33,
          ease: [0.2, 0.9, 0.2, 1],
        },
      }),
      blurControls.start({
        opacity: 0,
        transition: { duration: 0.2 },
      }),
      shadowControls.start({
        scale: 0.7,
        opacity: 0.2,
        transition: { duration: 0.33 },
      }),
    ]);

    // Result highlight pulse
    await containerControls.start({
      scale: [1, 1.06, 1],
      transition: { duration: 0.15, ease: 'easeOut' },
    });

    setState('idle');
  };

  // Trigger roll when parent sets isRolling to true
  useEffect(() => {
    if (isRolling && !locked) {
      triggerRoll();
    }
  }, [isRolling, locked]);

  const handleClick = () => {
    if (disabled) return;
    
    // Allow toggling lock at any time when not disabled
    onToggleLock();
    // Toggle pulse animation
    badgeControls.start({
      scale: [1, 1.1, 1],
      opacity: [1, 0.8, 1],
      transition: { duration: 0.1 },
    });
  };

  const strokeColor = accent ? '#FF5CF0' : '#00E5FF';
  const glowColor = locked ? '#FFD700' : (accent ? '#FF5CF0' : '#00E5FF');
  const bgColor = locked ? '#2A2000' : '#0A0A0E';
  const iconColor = locked ? '#FFD700' : '#00E5FF';

  return (
    <div className="relative w-16 h-16">
      {/* Shadow ellipse */}
      <motion.div
        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-12 h-3 rounded-full blur-sm"
        style={{
          background: 'radial-gradient(ellipse, rgba(0,0,0,0.5) 0%, transparent 70%)',
        }}
        initial={{ scale: 0.7, opacity: 0.2 }}
        animate={shadowControls}
      />

      {/* MASSIVE Outer Glow for Kept Dice - SUPER VISIBLE */}
      {locked && (
        <>
          {/* Layer 1: Huge outer glow - GOLD */}
          <div 
            className="absolute -inset-8 rounded-[10px] pointer-events-none"
            style={{
              background: 'radial-gradient(circle, rgba(255, 215, 0, 0.4) 0%, rgba(255, 215, 0, 0.2) 50%, transparent 70%)',
              filter: 'blur(16px)',
            }}
          />
          {/* Layer 2: Medium glow - GOLD */}
          <div 
            className="absolute -inset-4 rounded-[10px] pointer-events-none"
            style={{
              background: 'radial-gradient(circle, rgba(255, 215, 0, 0.6) 0%, rgba(255, 215, 0, 0.3) 60%, transparent 80%)',
              filter: 'blur(8px)',
            }}
          />
          {/* Layer 3: Tight bright glow with pulse - GOLD */}
          <div 
            className="absolute -inset-2 rounded-[10px] pointer-events-none"
            style={{
              boxShadow: '0 0 30px rgba(255, 215, 0, 0.9), 0 0 60px rgba(255, 215, 0, 0.6), 0 0 90px rgba(255, 215, 0, 0.4)',
              animation: 'pulse 2s ease-in-out infinite',
            }}
          />
        </>
      )}

      {/* Main dice wrapper */}
      <motion.button
        onClick={handleClick}
        onMouseDown={handlePress}
        disabled={disabled}
        className="relative w-16 h-16 cursor-pointer disabled:cursor-not-allowed disabled:opacity-50"
        initial={{ scale: 1, y: 0 }}
        animate={containerControls}
        style={{ perspective: '600px' }}
      >
        {/* 3D Cube Container */}
        <motion.div
          className="absolute inset-0"
          style={{ 
            transformStyle: 'preserve-3d',
            transform: 'translateZ(-32px)',
          }}
          initial={{ rotateX: 0, rotateY: 0, rotateZ: 0 }}
          animate={cubeControls}
        >
          {/* Front Face - 1 */}
          <div
            className="absolute inset-0 rounded-[10px] flex items-center justify-center text-3xl select-none"
            style={{
              backgroundColor: bgColor,
              border: `${locked ? '3' : '2'}px solid ${glowColor}`,
              boxShadow: locked 
                ? `0px 4px 12px rgba(0,0,0,0.30), inset 0px 1px 4px rgba(0,0,0,0.10), 0 0 25px rgba(255, 215, 0, 0.8), inset 0 0 20px rgba(255, 215, 0, 0.3)`
                : `0px 4px 12px rgba(0,0,0,0.30), inset 0px 1px 4px rgba(0,0,0,0.10)`,
              transform: 'rotateY(0deg) translateZ(32px)',
              backfaceVisibility: 'hidden',
              color: iconColor,
            }}
          >
            {diceIcons['1']}
          </div>

          {/* Right Face - 2 */}
          <div
            className="absolute inset-0 rounded-[10px] flex items-center justify-center text-3xl select-none"
            style={{
              backgroundColor: bgColor,
              border: `${locked ? '3' : '2'}px solid ${glowColor}`,
              boxShadow: locked 
                ? `0px 4px 12px rgba(0,0,0,0.30), inset 0px 1px 4px rgba(0,0,0,0.10), 0 0 25px rgba(255, 215, 0, 0.8), inset 0 0 20px rgba(255, 215, 0, 0.3)`
                : `0px 4px 12px rgba(0,0,0,0.30), inset 0px 1px 4px rgba(0,0,0,0.10)`,
              transform: 'rotateY(90deg) translateZ(32px)',
              backfaceVisibility: 'hidden',
              color: iconColor,
            }}
          >
            {diceIcons['2']}
          </div>

          {/* Back Face - 3 */}
          <div
            className="absolute inset-0 rounded-[10px] flex items-center justify-center text-3xl select-none"
            style={{
              backgroundColor: bgColor,
              border: `${locked ? '3' : '2'}px solid ${glowColor}`,
              boxShadow: locked 
                ? `0px 4px 12px rgba(0,0,0,0.30), inset 0px 1px 4px rgba(0,0,0,0.10), 0 0 25px rgba(255, 215, 0, 0.8), inset 0 0 20px rgba(255, 215, 0, 0.3)`
                : `0px 4px 12px rgba(0,0,0,0.30), inset 0px 1px 4px rgba(0,0,0,0.10)`,
              transform: 'rotateY(180deg) translateZ(32px)',
              backfaceVisibility: 'hidden',
              color: iconColor,
            }}
          >
            {diceIcons['3']}
          </div>

          {/* Left Face - sword */}
          <div
            className="absolute inset-0 rounded-[10px] flex items-center justify-center text-3xl select-none"
            style={{
              backgroundColor: bgColor,
              border: `${locked ? '3' : '2'}px solid ${glowColor}`,
              boxShadow: locked 
                ? `0px 4px 12px rgba(0,0,0,0.30), inset 0px 1px 4px rgba(0,0,0,0.10), 0 0 25px rgba(255, 215, 0, 0.8), inset 0 0 20px rgba(255, 215, 0, 0.3)`
                : `0px 4px 12px rgba(0,0,0,0.30), inset 0px 1px 4px rgba(0,0,0,0.10)`,
              transform: 'rotateY(-90deg) translateZ(32px)',
              backfaceVisibility: 'hidden',
              color: iconColor,
            }}
          >
            {diceIcons['sword']}
          </div>

          {/* Top Face - energy */}
          <div
            className="absolute inset-0 rounded-[10px] flex items-center justify-center text-3xl select-none"
            style={{
              backgroundColor: bgColor,
              border: `${locked ? '3' : '2'}px solid ${glowColor}`,
              boxShadow: locked 
                ? `0px 4px 12px rgba(0,0,0,0.30), inset 0px 1px 4px rgba(0,0,0,0.10), 0 0 25px rgba(255, 215, 0, 0.8), inset 0 0 20px rgba(255, 215, 0, 0.3)`
                : `0px 4px 12px rgba(0,0,0,0.30), inset 0px 1px 4px rgba(0,0,0,0.10)`,
              transform: 'rotateX(90deg) translateZ(32px)',
              backfaceVisibility: 'hidden',
              color: iconColor,
            }}
          >
            {diceIcons['energy']}
          </div>

          {/* Bottom Face - heart */}
          <div
            className="absolute inset-0 rounded-[10px] flex items-center justify-center text-3xl select-none"
            style={{
              backgroundColor: bgColor,
              border: `${locked ? '3' : '2'}px solid ${glowColor}`,
              boxShadow: locked 
                ? `0px 4px 12px rgba(0,0,0,0.30), inset 0px 1px 4px rgba(0,0,0,0.10), 0 0 25px rgba(255, 215, 0, 0.8), inset 0 0 20px rgba(255, 215, 0, 0.3)`
                : `0px 4px 12px rgba(0,0,0,0.30), inset 0px 1px 4px rgba(0,0,0,0.10)`,
              transform: 'rotateX(-90deg) translateZ(32px)',
              backfaceVisibility: 'hidden',
              color: iconColor,
            }}
          >
            {diceIcons['heart']}
          </div>

          {/* Motion Blur overlay - moves with cube */}
          <motion.div
            className="absolute inset-0 rounded-[10px] pointer-events-none"
            style={{
              background: `
                linear-gradient(135deg, 
                  transparent 0%, 
                  rgba(0,229,255,0.3) 30%, 
                  rgba(0,229,255,0.1) 50%,
                  transparent 70%
                )
              `,
              transform: 'translateZ(33px)',
            }}
            initial={{ opacity: 0 }}
            animate={blurControls}
          />
        </motion.div>

        {/* Locked Badge - stays in front */}
        {locked && (
          <motion.div
            className="absolute -top-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center z-10"
            style={{
              backgroundColor: '#FFD700',
              boxShadow: '0 1px 4px rgba(255,215,0,0.5), 0 0 10px rgba(255, 215, 0, 0.6)',
            }}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{
              opacity: 1,
              scale: 1,
              transition: { duration: 0.15, ease: 'easeOut' },
            }}
            exit={{ opacity: 0, scale: 0.8 }}
          >
            <Lock className="w-3 h-3 text-black" />
          </motion.div>
        )}
      </motion.button>
    </div>
  );
}

// Export function to trigger roll from parent
export function useDiceRoll() {
  const [shouldRoll, setShouldRoll] = useState(false);

  const triggerRoll = () => {
    setShouldRoll(true);
    setTimeout(() => setShouldRoll(false), 10);
  };

  return { shouldRoll, triggerRoll };
}