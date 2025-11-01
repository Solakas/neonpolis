import { motion } from 'motion/react';
import { useEffect, useState } from 'react';

interface CardPurchaseAnimationProps {
  card: {
    id: string;
    nameEn: string;
    cost: number;
    effectEn: string;
  };
  fromPosition: { x: number; y: number }; // Shop card position
  toPosition: { x: number; y: number }; // Character card position
  onComplete: () => void;
}

export function CardPurchaseAnimation({ card, fromPosition, toPosition, onComplete }: CardPurchaseAnimationProps) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Auto-complete after animation
    const timer = setTimeout(() => {
      setIsVisible(false);
      onComplete();
    }, 600); // Animation duration + small buffer

    return () => clearTimeout(timer);
  }, [onComplete]);

  if (!isVisible) return null;

  return (
    <motion.div
      className="fixed z-[100] pointer-events-none"
      initial={{
        x: fromPosition.x,
        y: fromPosition.y,
        opacity: 1,
        scale: 1,
      }}
      animate={{
        x: toPosition.x,
        y: toPosition.y,
        opacity: 0.8,
        scale: 0.4,
      }}
      transition={{
        duration: 0.5,
        ease: [0.4, 0.0, 0.2, 1], // Fast ease-out
      }}
    >
      {/* Glow trail effect */}
      <motion.div
        className="absolute inset-0 rounded-[16px]"
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 1, 0] }}
        transition={{ duration: 0.5, times: [0, 0.3, 1] }}
        style={{
          boxShadow: '0 0 40px 20px rgba(0, 229, 255, 0.8)',
          filter: 'blur(10px)'
        }}
      />
      
      <div className="h-[140px] w-[179px] relative rounded-[16px]">
        <div aria-hidden="true" className="absolute border-2 border-[#00e5ff] border-solid inset-0 pointer-events-none rounded-[16px] shadow-lg shadow-[#00e5ff]/50" />
        <div className="flex flex-col items-start justify-start size-full px-[16px] py-[12px] bg-[rgba(0,0,0,0.9)]">
          <p className="font-['Fira_Sans',sans-serif] text-[#00e5ff] text-[14px] truncate w-full">
            {card.nameEn}
          </p>
          <p className="font-['Roboto',sans-serif] text-[#00b3c8] text-[11px] mt-1">
            Cost: {card.cost} ⚡
          </p>
          <p className="font-['Roboto',sans-serif] text-white/80 text-[10px] mt-2 leading-tight line-clamp-3">
            {card.effectEn}
          </p>
        </div>
      </div>
    </motion.div>
  );
}
