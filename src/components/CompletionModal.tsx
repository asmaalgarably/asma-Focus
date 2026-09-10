import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';
import { Sparkles, CheckCircle2, Award, Heart } from 'lucide-react';
import { soundscape } from '../utils/audioEngine.ts';

interface CompletionModalProps {
  isOpen: boolean;
  intentionTitle: string;
  completedMinutes: number;
  xpEarned: number;
  onClose: () => void;
  onContinue: () => void;
  onExitToSanctuary: () => void;
}

export const CompletionModal: React.FC<CompletionModalProps> = ({
  isOpen,
  intentionTitle,
  completedMinutes,
  xpEarned,
  onClose,
  onContinue,
  onExitToSanctuary,
}) => {
  useEffect(() => {
    if (isOpen) {
      soundscape.playGentleBell();

      // Delicate pastel petal confetti
      confetti({
        particleCount: 65,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#7D535B', '#FEB2BB', '#FFD9DF', '#C8838B', '#ECE0DF'],
        shapes: ['circle'],
        scalar: 1.1,
      });
    }
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#201a1a]/45 backdrop-blur-md"
        >
          <motion.div
            dir="rtl"
            initial={{ scale: 0.92, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.92, opacity: 0, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 280 }}
            className="relative w-full max-w-md overflow-hidden rounded-3xl bg-[#fff8f7] border border-[#d4c2c4]/60 p-7 sm:p-8 shadow-2xl text-center"
          >
            {/* Ambient blossom glow */}
            <div className="pointer-events-none absolute -top-12 -right-12 w-48 h-48 rounded-full bg-[#feb2bb]/30 blur-3xl mix-blend-multiply" />
            <div className="pointer-events-none absolute -bottom-12 -left-12 w-48 h-48 rounded-full bg-[#ffd9dc]/40 blur-3xl mix-blend-multiply" />

            {/* Top icon */}
            <div className="mx-auto w-16 h-16 rounded-full bg-[#f8ebeb] border border-[#feb2bb]/50 flex items-center justify-center text-[#633c44] mb-4 shadow-sm">
              <CheckCircle2 className="w-8 h-8 text-[#7d535b]" />
            </div>

            {/* Badge */}
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#fef1f0] border border-[#d4c2c4]/40 text-[#693943] text-xs font-semibold tracking-wide mb-2">
              <Sparkles className="w-3.5 h-3.5 text-[#884d55]" />
              <span>اكتملت الجلسة بنجاح 🌸</span>
            </div>

            <h2 className="font-editorial text-2xl sm:text-3xl text-[#633c44] font-medium tracking-tight mb-2">
              أحسنتِ صنعاً يا أسماء 🌸
            </h2>

            <p className="font-humanist text-sm text-[#504445] leading-relaxed mb-6">
              أتممتِ بنجاح جلسة التركيز المخططة لـ{' '}
              <span className="font-semibold text-[#633c44]">"{intentionTitle}"</span>. حديقتكِ الداخلية تزدهر الآن بصفاء وسكينة متجددة.
            </p>

            {/* Summary Bento Stats */}
            <div className="grid grid-cols-2 gap-3 mb-6">
              <div className="p-3.5 rounded-2xl bg-[#f8ebeb]/70 border border-[#d4c2c4]/30 text-center">
                <div className="flex items-center justify-center gap-1 text-[#884d55] text-xs font-semibold mb-1">
                  <Award className="w-3.5 h-3.5" />
                  <span>نقاط السكينة المكتسبة</span>
                </div>
                <div className="font-editorial text-2xl text-[#633c44] font-bold">
                  +{xpEarned} نقطة
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-[#f8ebeb]/70 border border-[#d4c2c4]/30 text-center">
                <div className="flex items-center justify-center gap-1 text-[#884d55] text-xs font-semibold mb-1">
                  <Heart className="w-3.5 h-3.5" />
                  <span>مدة التركيز</span>
                </div>
                <div className="font-editorial text-2xl text-[#633c44] font-bold">
                  {completedMinutes} دقيقة
                </div>
              </div>
            </div>

            {/* Gentle Quote */}
            <div className="p-3.5 rounded-xl bg-white/70 border border-[#d4c2c4]/30 mb-6 text-xs font-editorial text-[#7d535b] leading-relaxed">
              "كل لحظة حضور صادقة هي زهرة ناعمة تغرسينها في بستان حياتكِ."
            </div>

            {/* Action buttons */}
            <div className="flex flex-col sm:flex-row gap-2.5">
              <button
                onClick={onExitToSanctuary}
                className="flex-1 px-4 py-2.5 rounded-full border border-[#d4c2c4] text-[#633c44] font-medium text-xs sm:text-sm hover:bg-[#f8ebeb] transition-colors"
              >
                الذهاب للوحة الملاذ 🌿
              </button>
              <button
                onClick={() => {
                  onClose();
                  onContinue();
                }}
                className="flex-1 px-5 py-2.5 rounded-full bg-[#633c44] text-white font-medium text-xs sm:text-sm hover:bg-[#7d535b] shadow-md transition-all active:scale-98"
              >
                مواصلة التركيز ✨
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
