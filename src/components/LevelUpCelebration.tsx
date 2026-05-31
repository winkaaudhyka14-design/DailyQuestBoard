import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface Particle {
  id: number;
  type: 'confetti' | 'star' | 'emoji';
  emoji?: string;
  color?: string;
  startX: string;
  startY: string;
  x: number;
  y: number;
  rotate: number;
  scale: number;
  delay: number;
  duration: number;
}

interface LevelUpCelebrationProps {
  isOpen: boolean;
}

const CONFETTI_COLORS = [
  'bg-amber-400', 'bg-yellow-300', 'bg-rose-500', 'bg-emerald-500', 
  'bg-sky-400', 'bg-indigo-500', 'bg-purple-500', 'bg-pink-500'
];

const ENERGETIC_EMOJIS = ['⭐', '✨', '🌟', '👑', '💎', '⚔️', '🛡️', '⚡', '🎉'];

export default function LevelUpCelebration({ isOpen }: LevelUpCelebrationProps) {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    if (!isOpen) {
      setParticles([]);
      return;
    }

    const list: Particle[] = [];
    let idCounter = 0;

    // 1. LEFT CORNER CANNON (shoots outward and up to the right)
    for (let i = 0; i < 35; i++) {
      const angle = (15 + Math.random() * 60) * (Math.PI / 180); // 15 to 75 degrees
      const velocity = 300 + Math.random() * 500; // outward speed
      list.push({
        id: idCounter++,
        type: Math.random() > 0.4 ? 'confetti' : 'emoji',
        emoji: ENERGETIC_EMOJIS[Math.floor(Math.random() * ENERGETIC_EMOJIS.length)],
        color: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
        startX: '0%',
        startY: '100%',
        x: Math.cos(angle) * velocity,
        y: -Math.sin(angle) * velocity,
        rotate: Math.random() * 720 - 360,
        scale: 0.6 + Math.random() * 0.9,
        delay: Math.random() * 0.25,
        duration: 1.5 + Math.random() * 1.2,
      });
    }

    // 2. RIGHT CORNER CANNON (shoots outward and up to the left)
    for (let i = 0; i < 35; i++) {
      const angle = (105 + Math.random() * 60) * (Math.PI / 180); // 105 to 165 degrees
      const velocity = 300 + Math.random() * 500;
      list.push({
        id: idCounter++,
        type: Math.random() > 0.4 ? 'confetti' : 'emoji',
        emoji: ENERGETIC_EMOJIS[Math.floor(Math.random() * ENERGETIC_EMOJIS.length)],
        color: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
        startX: '100%',
        startY: '100%',
        x: Math.cos(angle) * velocity,
        y: -Math.sin(angle) * velocity,
        rotate: Math.random() * 720 - 360,
        scale: 0.6 + Math.random() * 0.9,
        delay: Math.random() * 0.25,
        duration: 1.5 + Math.random() * 1.2,
      });
    }

    // 3. CENTER POWER BURST (glowing star circle burst outward from screen-center)
    for (let i = 0; i < 40; i++) {
      const angle = Math.random() * Math.PI * 2; // full circle 360
      const distance = 80 + Math.random() * 250; // radius of spread
      list.push({
        id: idCounter++,
        type: 'star',
        emoji: Math.random() > 0.5 ? '⭐' : '✨',
        startX: '50%',
        startY: '50%',
        x: Math.cos(angle) * distance,
        y: Math.sin(angle) * distance,
        rotate: Math.random() * 360,
        scale: 0.8 + Math.random() * 1.2,
        delay: 0.1 + Math.random() * 0.15,
        duration: 1.0 + Math.random() * 0.8,
      });
    }

    // 4. TOP DRIFT (gentle glowing star showers starting from top and falling down)
    for (let i = 0; i < 30; i++) {
      list.push({
        id: idCounter++,
        type: 'emoji',
        emoji: Math.random() > 0.5 ? '🌟' : '✨',
        startX: `${Math.random() * 100}%`,
        startY: '-5%',
        x: (Math.random() - 0.5) * 150, // slight web drift
        y: 400 + Math.random() * 450, // downward distance
        rotate: Math.random() * 180 - 90,
        scale: 0.5 + Math.random() * 0.6,
        delay: 0.2 + Math.random() * 1.2, // staggered falling
        duration: 2.5 + Math.random() * 2.0,
      });
    }

    setParticles(list);
  }, [isOpen]);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-55" style={{ zIndex: 55 }} id="levelup-celebration-container">
      <AnimatePresence>
        {isOpen && particles.map((p) => {
          if (p.type === 'confetti') {
            return (
              <motion.div
                key={p.id}
                initial={{ 
                  left: p.startX, 
                  top: p.startY, 
                  x: 0, 
                  y: 0, 
                  rotate: 0, 
                  scale: 0.1, 
                  opacity: 1 
                }}
                animate={{
                  x: p.x,
                  y: p.y,
                  rotate: p.rotate,
                  scale: [0.1, p.scale, p.scale, 0],
                  opacity: [1, 1, 0.8, 0],
                }}
                transition={{
                  delay: p.delay,
                  duration: p.duration,
                  ease: [0.1, 0.8, 0.25, 1] // snappy launch, soft drag drop
                }}
                className={`absolute w-3 h-5 rounded-sm ${p.color} shadow-sm border border-black/10`}
              />
            );
          } else {
            // Stars & Emojis
            return (
              <motion.div
                key={p.id}
                initial={{ 
                  left: p.startX, 
                  top: p.startY, 
                  x: 0, 
                  y: 0, 
                  rotate: 0, 
                  scale: 0.1, 
                  opacity: 1 
                }}
                animate={{
                  x: p.x,
                  y: p.y,
                  rotate: p.rotate,
                  scale: [0.1, p.scale, p.scale * 1.1, 0],
                  opacity: [1, 1, 0.8, 0],
                }}
                transition={{
                  delay: p.delay,
                  duration: p.duration,
                  ease: [0.1, 0.8, 0.25, 1]
                }}
                className="absolute text-2xl font-mono select-none selection:bg-transparent pointer-events-none drop-shadow-[0_2px_4px_rgba(0,0,0,0.15)] flex items-center justify-center"
              >
                {p.emoji}
              </motion.div>
            );
          }
        })}
      </AnimatePresence>
    </div>
  );
}
