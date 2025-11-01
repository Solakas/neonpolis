import { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';

interface TurnTimerProps {
  currentPlayerName: string;
  isBot: boolean;
}

const TURN_TIME_LIMIT = 180; // 3 minutes in seconds

export function TurnTimer({ currentPlayerName, isBot }: TurnTimerProps) {
  const [timeRemaining, setTimeRemaining] = useState(TURN_TIME_LIMIT);
  const prevPlayerRef = useRef<string>(currentPlayerName);

  // Reset timer when player changes
  useEffect(() => {
    if (prevPlayerRef.current !== currentPlayerName) {
      setTimeRemaining(TURN_TIME_LIMIT);
      prevPlayerRef.current = currentPlayerName;
    }
  }, [currentPlayerName]);

  // Countdown timer
  useEffect(() => {
    if (isBot) return; // Don't run timer for bots
    
    const interval = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 0) return 0;
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isBot]);

  // Don't render for bots
  if (isBot) return null;

  // Timer display logic
  const minutes = Math.floor(timeRemaining / 60);
  const seconds = timeRemaining % 60;
  const timeString = `${minutes}:${seconds.toString().padStart(2, '0')}`;
  
  // Color and animation logic based on time remaining
  const getTimerColor = () => {
    if (timeRemaining > 120) return '#00E5FF'; // Cyan
    if (timeRemaining > 60) return '#FF00A8'; // Magenta
    if (timeRemaining > 30) return '#FF6B00'; // Orange
    return '#FF0000'; // Red
  };

  const isLowTime = timeRemaining <= 30;
  const isCriticalTime = timeRemaining <= 10;

  return (
    <div className="flex justify-center mb-4">
      <motion.div
        className="relative inline-flex items-center gap-3 px-6 py-3 rounded-lg bg-black/60 backdrop-blur-sm border-2"
        style={{
          borderColor: getTimerColor(),
          boxShadow: `0 0 20px ${getTimerColor()}40`
        }}
        animate={isLowTime ? {
          scale: [1, 1.05, 1],
          boxShadow: [
            `0 0 20px ${getTimerColor()}40`,
            `0 0 30px ${getTimerColor()}80`,
            `0 0 20px ${getTimerColor()}40`
          ]
        } : {}}
        transition={{
          duration: isCriticalTime ? 0.5 : 1,
          repeat: isLowTime ? Infinity : 0,
          ease: "easeInOut"
        }}
      >
        {/* Glow effect */}
        <div 
          className="absolute inset-0 rounded-lg blur-xl opacity-50"
          style={{
            background: getTimerColor()
          }}
        />
        
        {/* Timer content */}
        <div className="relative flex items-center gap-3">
          <motion.div
            className="text-2xl"
            animate={isCriticalTime ? {
              rotate: [0, -10, 10, -10, 10, 0]
            } : {}}
            transition={{
              duration: 0.5,
              repeat: isCriticalTime ? Infinity : 0,
              repeatDelay: 0.5
            }}
          >
            ⏱️
          </motion.div>
          
          <div>
            <p className="font-['Fira_Sans',sans-serif] text-xs uppercase tracking-wider opacity-60">
              Time Remaining
            </p>
            <motion.p 
              className="font-['Fira_Sans',sans-serif] text-2xl tabular-nums"
              style={{ color: getTimerColor() }}
              animate={isCriticalTime ? {
                scale: [1, 1.1, 1]
              } : {}}
              transition={{
                duration: 0.5,
                repeat: isCriticalTime ? Infinity : 0
              }}
            >
              {timeString}
            </motion.p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
