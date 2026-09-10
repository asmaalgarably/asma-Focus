import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Sparkles } from 'lucide-react';
import { soundscape } from '../utils/audioEngine.ts';

interface BreathingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type BreathPhase = 'inhale' | 'hold-in' | 'exhale' | 'hold-out';

const PHASES: { phase: BreathPhase; label: string; sub: string; duration: number }[] = [
  { phase: 'inhale', label: 'شهيق ناعم وعميق...', sub: 'استنشقي السكينة والصفاء الذهني', duration: 4 },
  { phase: 'hold-in', label: 'احبسي أنفاسكِ بسكينة...', sub: 'استشعري الهدوء الداخلي والتوازن', duration: 4 },
  { phase: 'exhale', label: 'زفير هادئ وبطيء...', sub: 'دعي كل توتر أو قلق يتبدد بلطف', duration: 4 },
  { phase: 'hold-out', label: 'سكون تام وطمأنينة...', sub: 'استريحي في هذه اللحظة الرقيقة', duration: 4 },
];

export const BreathingModal: React.FC<BreathingModalProps> = ({ isOpen, onClose }) => {
  const [phaseIndex, setPhaseIndex] = useState(0);
  const [secondsLeftInPhase, setSecondsLeftInPhase] = useState(4);
  const [totalSecondsElapsed, setTotalSecondsElapsed] = useState(0);

  const current = PHASES[phaseIndex];

  useEffect(() => {
    if (!isOpen) {
      setPhaseIndex(0);
      setSecondsLeftInPhase(4);
      setTotalSecondsElapsed(0);
      return;
    }

    soundscape.playGentleBell();

    const interval = setInterval(() => {
      setSecondsLeftInPhase((prev) => {
        if (prev <= 1) {
          setPhaseIndex((pIdx) => (pIdx + 1) % PHASES.length);
          return PHASES[(phaseIndex + 1) % PHASES.length].duration;
        }
        return prev - 1;
      });
      setTotalSecondsElapsed((t) => t + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [isOpen, phaseIndex]);

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const s = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#201a1a]/40 backdrop-blur-md"
        >
          <motion.div
            dir="rtl"
            initial={{ scale: 0.94, opacity: 0, y: 12 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.94, opacity: 0, y: 12 }}
            transition={{ type: 'spring', damping: 24, stiffness: 260 }}
            className="relative w-full max-w-lg overflow-hidden rounded-3xl bg-[#fff8f7] border border-[#d4c2c4]/50 p-8 shadow-2xl text-center"
          >
            {/* Ambient blossom glow */}
            <div className="pointer-events-none absolute -top-16 -left-16 w-52 h-52 rounded-full bg-[#feb2bb]/30 blur-3xl mix-blend-multiply" />
            <div className="pointer-events-none absolute -bottom-16 -right-16 w-52 h-52 rounded-full bg-[#ffd9df]/40 blur-3xl mix-blend-multiply" />

            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-5 left-5 p-2 rounded-full text-[#827375] hover:text-[#633c44] hover:bg-[#f8ebeb] transition-colors"
              title="إغلاق نافذة التنفس"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Title */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#f8ebeb] border border-[#d4c2c4]/40 text-[#633c44] text-xs font-semibold tracking-wide mb-3">
              <Sparkles className="w-3.5 h-3.5 text-[#884d55]" />
              <span>ملاذ التنفس الواعي 🌿</span>
            </div>

            <h2 className="font-editorial text-2xl sm:text-3xl text-[#633c44] font-medium tracking-tight mb-1">
              استعيدي السكينة والهدوء يا أسماء
            </h2>
            <p className="font-humanist text-sm text-[#504445] mb-6">
              تنفس هادئ وبطيء لتهدئة الذهن وتجديد الحيوية بالصفاء والراحة.
            </p>

            {/* Breathing Animation Canvas */}
            <div className="relative w-64 h-64 mx-auto my-4 flex items-center justify-center">
              {/* Outer pulsing rings */}
              <motion.div
                animate={{
                  scale: current.phase === 'inhale' ? 1.25 : current.phase === 'hold-in' ? 1.25 : current.phase === 'exhale' ? 0.9 : 0.9,
                  opacity: current.phase === 'inhale' || current.phase === 'hold-in' ? 0.7 : 0.35,
                }}
                transition={{ duration: 4, ease: 'easeInOut' }}
                className="absolute inset-0 rounded-full border-2 border-[#feb2bb] bg-[#feb2bb]/15"
              />

              <motion.div
                animate={{
                  scale: current.phase === 'inhale' ? 1.15 : current.phase === 'hold-in' ? 1.15 : current.phase === 'exhale' ? 0.82 : 0.82,
                  rotate: current.phase === 'inhale' ? 45 : 0,
                }}
                transition={{ duration: 4, ease: 'easeInOut' }}
                className="absolute inset-4 rounded-full border border-[#7d535b]/30 bg-[#f8ebeb]/70 backdrop-blur-sm shadow-inner"
              />

              {/* Center counter & phase */}
              <div className="relative z-10 flex flex-col items-center justify-center">
                <span className="font-editorial text-4xl text-[#633c44] font-semibold tracking-normal">
                  {secondsLeftInPhase}
                </span>
                <span className="font-editorial text-base text-[#7d535b] font-medium mt-1">
                  {current.label}
                </span>
                <span className="font-humanist text-xs text-[#827375] mt-1 max-w-[190px]">
                  {current.sub}
                </span>
              </div>
            </div>

            {/* Elapsed Session Time */}
            <div className="mt-5 text-xs text-[#827375] font-humanist">
              مدة الاستراحة والتنفس:{' '}
              <span className="font-semibold text-[#633c44]">{formatTime(totalSecondsElapsed)}</span>
            </div>

            {/* Action Buttons */}
            <div className="mt-6 flex items-center justify-center gap-3">
              <button
                onClick={() => soundscape.playGentleBell()}
                className="px-4 py-2 text-xs font-semibold rounded-full border border-[#d4c2c4]/70 text-[#633c44] hover:bg-[#f8ebeb] transition-colors"
              >
                🔔 رنين ناعم
              </button>
              <button
                onClick={onClose}
                className="px-6 py-2.5 text-sm font-semibold rounded-full bg-[#633c44] text-white hover:bg-[#7d535b] shadow-md transition-all active:scale-98"
              >
                العودة إلى التركيز 🌸
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
