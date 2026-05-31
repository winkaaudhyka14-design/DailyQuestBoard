import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';

interface FloatingElement {
  id: number;
  char: string;
  isEmoji: boolean;
  color?: string;
  size: number;
  left: string;
  driftX: number[];
  driftY: number[];
  rotate: number;
  duration: number;
  delay: number;
}

const SHAPES_AND_EMOJIS = [
  { char: '✨', isEmoji: true },
  { char: '⭐', isEmoji: true },
  { char: '🌟', isEmoji: true },
  { char: '💤', isEmoji: true }, // soft sleeping zzz's for night feel
  { char: '🍄', isEmoji: true }, // retro pixel style elements
  { char: '🌸', isEmoji: true },
  { char: '🍀', isEmoji: true },
  { char: 'bubble', isEmoji: false, color: 'bg-amber-300/30' },
  { char: 'bubble', isEmoji: false, color: 'bg-rose-350/25' },
  { char: 'bubble', isEmoji: false, color: 'bg-cyan-300/25' },
  { char: 'bubble', isEmoji: false, color: 'bg-violet-300/20' }
];

export default function AmbientBackgroundAnimation() {
  const [elements, setElements] = useState<FloatingElement[]>([]);

  useEffect(() => {
    // Generate an assortment of subtle decorative elements
    const generated: FloatingElement[] = Array.from({ length: 32 }).map((_, i) => {
      const template = SHAPES_AND_EMOJIS[Math.floor(Math.random() * SHAPES_AND_EMOJIS.length)];
      
      // Setup random floating path variations
      const startLeft = Math.random() * 100;
      const driftOffset1 = (Math.random() - 0.5) * 80;
      const driftOffset2 = (Math.random() - 0.5) * 140;
      
      return {
        id: i,
        char: template.char,
        isEmoji: template.isEmoji,
        color: template.color,
        size: template.isEmoji ? 12 + Math.random() * 14 : 6 + Math.random() * 10,
        left: `${startLeft}%`,
        driftX: [0, driftOffset1, driftOffset2, driftOffset1 * 0.5, 0],
        driftY: [0, -250, -500, -750, -1050], // drifting upwards
        rotate: Math.random() * 360,
        duration: 22 + Math.random() * 25, // slow, non-distracting drift
        delay: Math.random() * -30 // negative delay so elements are spread out immediately on load
      };
    });
    setElements(generated);
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none select-none z-0" id="ambient-visual-background">
      {/* Decorative Warm Ambient Light Spots */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-yellow-100/35 blur-[120px] mix-blend-multiply animate-pulse" style={{ animationDuration: '8s' }} />
      <div className="absolute top-2/3 right-1/4 w-[450px] h-[450px] rounded-full bg-rose-100/30 blur-[130px] mix-blend-screen animate-pulse" style={{ animationDuration: '11s' }} />
      <div className="absolute bottom-12 left-10 w-80 h-80 rounded-full bg-cyan-100/20 blur-[100px] mix-blend-multiply animate-pulse" style={{ animationDuration: '9s' }} />

      {/* Retro Floating Star/Sparkle Particles */}
      {elements.map((el) => {
        if (el.isEmoji) {
          return (
            <motion.div
              key={el.id}
              initial={{ 
                left: el.left, 
                bottom: '-5%', 
                x: 0, 
                y: 0, 
                rotate: 0,
                opacity: 0 
              }}
              animate={{
                x: el.driftX,
                y: el.driftY,
                rotate: [0, el.rotate, el.rotate * 2, el.rotate * 3, el.rotate * 4],
                opacity: [0, 0.45, 0.65, 0.45, 0] // soft fade in, sustain, soft fade out
              }}
              transition={{
                duration: el.duration,
                repeat: Infinity,
                delay: el.delay,
                ease: "linear"
              }}
              style={{ 
                fontSize: `${el.size}px`,
                position: 'absolute'
              }}
              className="drop-shadow-[0_1px_3px_rgba(217,119,6,0.15)] flex items-center justify-center font-mono opacity-0"
            >
              {el.char}
            </motion.div>
          );
        } else {
          // Pastel floating bokeh circles
          return (
            <motion.div
              key={el.id}
              initial={{ 
                left: el.left, 
                bottom: '-5%', 
                x: 0, 
                y: 0, 
                opacity: 0 
              }}
              animate={{
                x: el.driftX,
                y: el.driftY,
                opacity: [0, 0.35, 0.55, 0.35, 0]
              }}
              transition={{
                duration: el.duration,
                repeat: Infinity,
                delay: el.delay,
                ease: "linear"
              }}
              style={{ 
                width: `${el.size}px`, 
                height: `${el.size}px`,
                position: 'absolute'
              }}
              className={`rounded-full ${el.color} filter blur-[0.5px]`}
            />
          );
        }
      })}
    </div>
  );
}
