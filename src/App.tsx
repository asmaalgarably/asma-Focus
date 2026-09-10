/**
 * Bloom — Asmaa's Mindful Focus Sanctuary
 * Velvet & Petal Editorial Focus Companion
 */

import React, { useState, useEffect } from 'react';
import { Intention, FleetingThought, MonthPlan } from './types.ts';
import { INITIAL_INTENTION, INITIAL_FLEETING_THOUGHTS, INITIAL_MONTH_PLAN } from './data/initialData.ts';
import { FocusScreen } from './components/FocusScreen.tsx';
import { SanctuaryDashboard } from './components/SanctuaryDashboard.tsx';
import { BreathingModal } from './components/BreathingModal.tsx';
import { CompletionModal } from './components/CompletionModal.tsx';

export default function App() {
  // Screen routing: 'focus' (default) or 'sanctuary'
  const [viewMode, setViewMode] = useState<'focus' | 'sanctuary'>('focus');

  // One-time initialization check to clear previous template/mock data
  const isInitializedForAsmaa = (() => {
    try {
      return localStorage.getItem('bloom_version_asmaa_v2') === 'true';
    } catch {
      return false;
    }
  })();

  // Intentions state with localStorage persistence
  const [intentions, setIntentions] = useState<Intention[]>(() => {
    if (!isInitializedForAsmaa) return [INITIAL_INTENTION];
    try {
      const saved = localStorage.getItem('bloom_intentions');
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return [INITIAL_INTENTION];
  });

  const [activeIntentionId, setActiveIntentionId] = useState<string>(() => {
    return intentions[0]?.id || INITIAL_INTENTION.id;
  });

  // Fleeting thoughts scratchpad
  const [fleetingThoughts, setFleetingThoughts] = useState<FleetingThought[]>(() => {
    if (!isInitializedForAsmaa) return INITIAL_FLEETING_THOUGHTS;
    try {
      const saved = localStorage.getItem('bloom_scratchpad');
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return INITIAL_FLEETING_THOUGHTS;
  });

  // Sanctuary XP (Starts at 0 - completely zeroed out)
  const [totalXp, setTotalXp] = useState<number>(() => {
    if (!isInitializedForAsmaa) return 0;
    try {
      const saved = localStorage.getItem('bloom_xp');
      if (saved) return Number(saved);
    } catch {
      // fallback
    }
    return 0;
  });

  const [flowStreakDays] = useState<number>(1);

  // 4-Week Month Plan State
  const [monthPlan, setMonthPlan] = useState<MonthPlan>(() => {
    if (!isInitializedForAsmaa) return INITIAL_MONTH_PLAN;
    try {
      const saved = localStorage.getItem('bloom_month_plan_asmaa');
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return INITIAL_MONTH_PLAN;
  });

  // Active intention helper
  const activeIntention =
    intentions.find((i) => i.id === activeIntentionId) || intentions[0] || INITIAL_INTENTION;

  // Timer State (starts at planned minutes of intention e.g. 25:00, paused)
  const [totalPlannedSeconds, setTotalPlannedSeconds] = useState<number>(
    activeIntention.plannedMinutes * 60
  );
  const [secondsRemaining, setSecondsRemaining] = useState<number>(
    activeIntention.plannedMinutes * 60
  );
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(false);

  // Modals
  const [isBreathingOpen, setIsBreathingOpen] = useState(false);
  const [isCompletionModalOpen, setIsCompletionModalOpen] = useState(false);

  // Initialize version marker on mount
  useEffect(() => {
    try {
      if (!isInitializedForAsmaa) {
        localStorage.setItem('bloom_version_asmaa_v2', 'true');
        localStorage.setItem('bloom_xp', '0');
        localStorage.setItem('bloom_intentions', JSON.stringify([INITIAL_INTENTION]));
        localStorage.setItem('bloom_scratchpad', JSON.stringify([]));
      }
    } catch {
      // ignore
    }
  }, [isInitializedForAsmaa]);

  // Sync localStorage
  useEffect(() => {
    try {
      localStorage.setItem('bloom_intentions', JSON.stringify(intentions));
    } catch {
      // ignore
    }
  }, [intentions]);

  useEffect(() => {
    try {
      localStorage.setItem('bloom_scratchpad', JSON.stringify(fleetingThoughts));
    } catch {
      // ignore
    }
  }, [fleetingThoughts]);

  useEffect(() => {
    try {
      localStorage.setItem('bloom_xp', totalXp.toString());
    } catch {
      // ignore
    }
  }, [totalXp]);

  useEffect(() => {
    try {
      localStorage.setItem('bloom_month_plan_asmaa', JSON.stringify(monthPlan));
    } catch {
      // ignore
    }
  }, [monthPlan]);

  // Adjust timer total whenever active intention changes
  useEffect(() => {
    const plannedSecs = activeIntention.plannedMinutes * 60;
    setTotalPlannedSeconds(plannedSecs);
    setSecondsRemaining(plannedSecs);
  }, [activeIntention.id, activeIntention.plannedMinutes]);

  // Timer tick effect
  useEffect(() => {
    if (!isTimerRunning) return;

    const timer = setInterval(() => {
      setSecondsRemaining((prev) => {
        if (prev <= 1) {
          setIsTimerRunning(false);
          setIsCompletionModalOpen(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isTimerRunning]);

  // Reset Everything to 0 ("صفر كل شيء")
  const handleResetAll = () => {
    try {
      localStorage.removeItem('bloom_intentions');
      localStorage.removeItem('bloom_scratchpad');
      localStorage.setItem('bloom_xp', '0');
      localStorage.setItem('bloom_month_plan_asmaa', JSON.stringify(INITIAL_MONTH_PLAN));
      localStorage.setItem('bloom_version_asmaa_v2', 'true');
    } catch {
      // ignore
    }
    setIntentions([INITIAL_INTENTION]);
    setActiveIntentionId(INITIAL_INTENTION.id);
    setFleetingThoughts([]);
    setTotalXp(0);
    setMonthPlan(INITIAL_MONTH_PLAN);
    const initialSecs = INITIAL_INTENTION.plannedMinutes * 60;
    setTotalPlannedSeconds(initialSecs);
    setSecondsRemaining(initialSecs);
    setIsTimerRunning(false);
  };

  // Handlers
  const handleToggleTimer = () => {
    setIsTimerRunning((prev) => !prev);
  };

  const handleUpdateIntention = (updated: Intention) => {
    setIntentions((prev) => prev.map((item) => (item.id === updated.id ? updated : item)));
  };

  const handleAddNewIntention = (newIntent: Intention) => {
    setIntentions((prev) => [newIntent, ...prev]);
    setActiveIntentionId(newIntent.id);
    const plannedSecs = newIntent.plannedMinutes * 60;
    setTotalPlannedSeconds(plannedSecs);
    setSecondsRemaining(plannedSecs);
    setIsTimerRunning(false);
  };

  const handleDeleteIntention = (id: string) => {
    if (intentions.length <= 1) return;
    setIntentions((prev) => prev.filter((i) => i.id !== id));
    if (activeIntentionId === id) {
      const remaining = intentions.filter((i) => i.id !== id);
      setActiveIntentionId(remaining[0].id);
    }
  };

  const handleAddThought = (text: string) => {
    const newThought: FleetingThought = {
      id: `thought-${Date.now()}`,
      text,
      createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      completed: false,
    };
    setFleetingThoughts((prev) => [newThought, ...prev]);
  };

  const handleToggleThought = (id: string) => {
    setFleetingThoughts((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
    );
  };

  const handleDeleteThought = (id: string) => {
    setFleetingThoughts((prev) => prev.filter((t) => t.id !== id));
  };

  const handleCompleteIntention = () => {
    setIsTimerRunning(false);
    setIsCompletionModalOpen(true);
    setTotalXp((prev) => prev + activeIntention.xpReward);
  };

  return (
    <div className="w-full min-h-screen">
      {viewMode === 'focus' ? (
        <FocusScreen
          intention={activeIntention}
          onUpdateIntention={handleUpdateIntention}
          fleetingThoughts={fleetingThoughts}
          onAddThought={handleAddThought}
          onToggleThought={handleToggleThought}
          onDeleteThought={handleDeleteThought}
          onExitToSanctuary={() => setViewMode('sanctuary')}
          onCompleteIntention={handleCompleteIntention}
          onOpenBreathing={() => setIsBreathingOpen(true)}
          onResetAll={handleResetAll}
          isTimerRunning={isTimerRunning}
          onToggleTimer={handleToggleTimer}
          secondsRemaining={secondsRemaining}
          totalPlannedSeconds={totalPlannedSeconds}
        />
      ) : (
        <SanctuaryDashboard
          intentions={intentions}
          activeIntentionId={activeIntentionId}
          onSelectActiveIntention={(id) => {
            setActiveIntentionId(id);
            const selected = intentions.find((i) => i.id === id);
            if (selected) {
              const plannedSecs = selected.plannedMinutes * 60;
              setTotalPlannedSeconds(plannedSecs);
              setSecondsRemaining(plannedSecs);
              setIsTimerRunning(false);
            }
          }}
          onAddNewIntention={handleAddNewIntention}
          onDeleteIntention={handleDeleteIntention}
          fleetingThoughts={fleetingThoughts}
          onAddThought={handleAddThought}
          onToggleThought={handleToggleThought}
          onDeleteThought={handleDeleteThought}
          onEnterFocusMode={() => setViewMode('focus')}
          onOpenBreathing={() => setIsBreathingOpen(true)}
          onResetAll={handleResetAll}
          totalXp={totalXp}
          flowStreakDays={flowStreakDays}
          monthPlan={monthPlan}
          onUpdateMonthPlan={setMonthPlan}
        />
      )}

      {/* Mindful Breathing Modal */}
      <BreathingModal
        isOpen={isBreathingOpen}
        onClose={() => setIsBreathingOpen(false)}
      />

      {/* Completion Modal */}
      <CompletionModal
        isOpen={isCompletionModalOpen}
        intentionTitle={activeIntention.title}
        completedMinutes={Math.floor(
          Math.max(0, totalPlannedSeconds - secondsRemaining) / 60
        ) || activeIntention.plannedMinutes}
        xpEarned={activeIntention.xpReward}
        onClose={() => setIsCompletionModalOpen(false)}
        onContinue={() => {
          setIsTimerRunning(true);
          setSecondsRemaining(activeIntention.plannedMinutes * 60);
        }}
        onExitToSanctuary={() => {
          setIsCompletionModalOpen(false);
          setViewMode('sanctuary');
        }}
      />
    </div>
  );
}
