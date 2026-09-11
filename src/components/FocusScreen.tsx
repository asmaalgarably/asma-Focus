import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  Heart,
  Volume2,
  VolumeX,
  ChevronDown,
  Maximize2,
  Minimize2,
  Pause,
  Play,
  CheckCircle2,
  Sparkles,
  Wind,
  Check,
  Plus,
  Trash2,
  Quote,
  CheckSquare,
  Edit3,
  Flower2,
  Sprout,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { Intention, FleetingThought, SoundscapeTrack } from '../types.ts';
import {
  SOUNDSCAPE_TRACKS,
  DAILY_ARABIC_LIFE_REMINDERS,
  getTodayArabicReminder,
  getTimeGreeting,
} from '../data/initialData.ts';
import { soundscape } from '../utils/audioEngine.ts';
import { ButterflyBackground } from './ButterflyBackground.tsx';
import butterflyIcon from '../assets/images/butterfly_favicon_1789148378662.jpg';

interface FocusScreenProps {
  intention: Intention;
  onUpdateIntention: (updated: Intention) => void;
  fleetingThoughts: FleetingThought[];
  onAddThought: (text: string) => void;
  onToggleThought: (id: string) => void;
  onDeleteThought: (id: string) => void;
  onExitToSanctuary: () => void;
  onCompleteIntention: () => void;
  onOpenBreathing: () => void;
  onResetAll?: () => void;
  isTimerRunning: boolean;
  onToggleTimer: () => void;
  secondsRemaining: number;
  totalPlannedSeconds: number;
}

export const FocusScreen: React.FC<FocusScreenProps> = ({
  intention,
  onUpdateIntention,
  fleetingThoughts,
  onAddThought,
  onToggleThought,
  onDeleteThought,
  onExitToSanctuary,
  onCompleteIntention,
  onOpenBreathing,
  onResetAll,
  isTimerRunning,
  onToggleTimer,
  secondsRemaining,
  totalPlannedSeconds,
}) => {
  // Soundscape state
  const [selectedTrack, setSelectedTrack] = useState<SoundscapeTrack>(SOUNDSCAPE_TRACKS[0]);
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const [volumePercent, setVolumePercent] = useState(42);
  const [showSoundDropdown, setShowSoundDropdown] = useState(false);

  // Daily Arabic Life Reminder cycle (starts with today's reminder)
  const todayReminder = getTodayArabicReminder();
  const [reminderIndex, setReminderIndex] = useState(() => {
    const found = DAILY_ARABIC_LIFE_REMINDERS.findIndex((r) => r.id === todayReminder.id);
    return found !== -1 ? found : 0;
  });

  // Scratchpad input
  const [newThoughtText, setNewThoughtText] = useState('');

  // Subtask quick add input
  const [showAddSubtask, setShowAddSubtask] = useState(false);
  const [newSubtaskTitle, setNewSubtaskTitle] = useState('');

  // Editing intention title inline
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [editedTitle, setEditedTitle] = useState(intention.title);

  // Fullscreen state
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Sync title when intention changes
  useEffect(() => {
    setEditedTitle(intention.title);
  }, [intention.title]);

  // Fullscreen toggle handler
  const handleToggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
      }
      setIsFullscreen(false);
    }
  };

  useEffect(() => {
    const handleFsChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFsChange);
    return () => document.removeEventListener('fullscreenchange', handleFsChange);
  }, []);

  // Audio track handler
  const handleSelectTrack = (track: SoundscapeTrack) => {
    setSelectedTrack(track);
    if (isAudioPlaying) {
      soundscape.play(track.type);
    }
  };

  const handleToggleAudio = () => {
    if (isAudioPlaying) {
      soundscape.stop();
      setIsAudioPlaying(false);
    } else {
      soundscape.setVolume(volumePercent / 100);
      soundscape.play(selectedTrack.type);
      setIsAudioPlaying(true);
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value, 10);
    setVolumePercent(val);
    soundscape.setVolume(val / 100);
  };

  // Subtask toggle & deletion
  const handleToggleSubtask = (subId: string) => {
    const updatedSubTasks = intention.subTasks.map((t) =>
      t.id === subId ? { ...t, completed: !t.completed } : t
    );
    onUpdateIntention({ ...intention, subTasks: updatedSubTasks });
  };

  const handleDeleteSubtask = (subId: string) => {
    const updatedSubTasks = intention.subTasks.filter((t) => t.id !== subId);
    onUpdateIntention({ ...intention, subTasks: updatedSubTasks });
  };

  const handleSetCurrentSubtask = (subId: string) => {
    const updatedSubTasks = intention.subTasks.map((t) => ({
      ...t,
      isCurrent: t.id === subId,
    }));
    onUpdateIntention({ ...intention, subTasks: updatedSubTasks });
  };

  const handleAddSubtask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSubtaskTitle.trim()) return;
    const newTask = {
      id: `sub-${Date.now()}`,
      title: newSubtaskTitle.trim(),
      completed: false,
      isCurrent: intention.subTasks.length === 0,
    };
    onUpdateIntention({
      ...intention,
      subTasks: [...intention.subTasks, newTask],
    });
    setNewSubtaskTitle('');
    setShowAddSubtask(false);
  };

  const handleSaveTitle = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editedTitle.trim()) return;
    onUpdateIntention({ ...intention, title: editedTitle.trim() });
    setIsEditingTitle(false);
  };

  // Scratchpad submit
  const handleAddFleetingThought = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newThoughtText.trim()) return;
    onAddThought(newThoughtText.trim());
    setNewThoughtText('');
  };

  // Format timer (HH:MM:SS)
  const formatTimeHHMMSS = (totalSecs: number) => {
    const hours = Math.floor(totalSecs / 3600);
    const mins = Math.floor((totalSecs % 3600) / 60);
    const secs = totalSecs % 60;
    return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Progress metrics
  const elapsedSeconds = Math.max(0, totalPlannedSeconds - secondsRemaining);
  const elapsedMinutes = Math.floor(elapsedSeconds / 60);
  const plannedMinutes = Math.floor(totalPlannedSeconds / 60);
  const progressRatio = totalPlannedSeconds > 0 ? Math.min(1, elapsedSeconds / totalPlannedSeconds) : 0;

  // Circumference for r=102: 2 * Math.PI * 102 ≈ 640.88
  const circumference = 640.88;
  const strokeDashoffset = circumference - progressRatio * circumference;

  // Subtask done stats
  const completedSubtasksCount = intention.subTasks.filter((t) => t.completed).length;
  const currentReminder =
    DAILY_ARABIC_LIFE_REMINDERS[reminderIndex] || DAILY_ARABIC_LIFE_REMINDERS[0];

  return (
    <div className="min-h-screen bg-[#fff7f8] text-[#201a1a] font-humanist relative selection:bg-[#feb2bb] selection:text-[#7a4249] sanctuary-glow flex flex-col justify-between overflow-x-hidden">
      {/* Soft Pink Floating Butterflies in the background */}
      <ButterflyBackground />

      {/* Decorative Corner Botanical Watermarks */}
      <div className="pointer-events-none fixed bottom-6 left-8 select-none opacity-20 text-[#633c44] transition-opacity duration-700 hover:opacity-40">
        <Flower2 className="w-24 h-24 stroke-[1]" />
      </div>
      <div className="pointer-events-none fixed top-12 right-12 select-none opacity-15 text-[#693943]">
        <Sprout className="w-20 h-20 stroke-[1]" />
      </div>

      {/* MAIN VIEWPORT CONTAINER */}
      <div className="relative z-10 flex flex-col justify-between min-h-screen max-w-[1280px] w-full mx-auto px-4 sm:px-8 md:px-12 py-5 sm:py-7">
        {/* 1. TOP BAR / GENTLE SPACIOUS CONTROLS */}
        <header className="flex items-center justify-between gap-4 sm:gap-6 w-full py-1">
          {/* Right/Start: Exit to Sanctuary */}
          <button
            onClick={onExitToSanctuary}
            id="exit-to-sanctuary-btn"
            className="inline-flex items-center gap-2 h-11 px-4 sm:px-5 rounded-full border border-[#d4c2c4]/60 bg-white/95 text-[#633c44] text-xs sm:text-sm font-semibold hover:border-[#feb2bb] hover:bg-[#fef1f0] transition-all duration-200 active:scale-95 shadow-xs backdrop-blur-sm whitespace-nowrap shrink-0"
          >
            <ArrowRight className="w-4 h-4" />
            <span>العودة إلى الملاذ 🌿</span>
          </button>

          {/* Center: Personalized Arabic Greeting for Asmaa with butterfly badge */}
          <div className="hidden sm:inline-flex items-center gap-2.5 h-11 px-4 rounded-full bg-[#fef1f0]/90 border border-[#feb2bb]/40 text-[#633c44] text-xs font-semibold tracking-wide backdrop-blur-md shadow-xs whitespace-nowrap">
            <img
              src={butterflyIcon}
              alt="فراشة ملاذ"
              className="w-5 h-5 object-contain rounded-full border border-[#feb2bb]/60"
              referrerPolicy="no-referrer"
            />
            <span>{getTimeGreeting('أسماء')}</span>
            <span className="text-[#d4c2c4]">•</span>
            <span className="text-[#827375] font-normal">حضور وتركيز هادئ</span>
          </div>

          {/* Left/End: Soundscape Pill + Reset to 0 + Fullscreen Toggle (Arranged with clean spacing) */}
          <div className="flex items-center gap-3 sm:gap-3.5 shrink-0">
            {/* Zero Out / Reset Everything Button */}
            {onResetAll && (
              <button
                onClick={() => {
                  if (
                    window.confirm(
                      'هل أنتِ متأكدة من تصفير كل شيء (المؤقت، النقاط، والملاحظات) والبدء من جديد يا أسماء؟'
                    )
                  ) {
                    onResetAll();
                  }
                }}
                id="reset-all-btn"
                title="تصفير كل شيء والبدء من جديد"
                className="inline-flex items-center gap-2 h-11 px-4 rounded-full bg-white/95 border border-[#d4c2c4]/60 hover:border-[#feb2bb] hover:bg-[#fef1f0] text-[#7d535b] text-xs font-semibold transition-all shadow-xs active:scale-95 whitespace-nowrap"
              >
                <RotateCcw className="w-3.5 h-3.5 text-[#884d55]" />
                <span>تصفير (0)</span>
              </button>
            )}

            {/* Ambient Soundscape Control Pill */}
            <div className="relative">
              <button
                onClick={() => setShowSoundDropdown(!showSoundDropdown)}
                id="soundscape-btn"
                className="inline-flex items-center gap-2.5 h-11 px-4 rounded-full bg-white/95 border border-[#d4c2c4]/60 hover:border-[#feb2bb] hover:bg-[#fef1f0] text-[#633c44] transition-all duration-200 shadow-xs active:scale-95 whitespace-nowrap"
              >
                <span className="text-base">{selectedTrack.icon}</span>
                <span className="text-xs font-semibold text-[#633c44]">
                  {selectedTrack.name}
                </span>
                <span className="text-[11px] text-[#827375] font-medium hidden sm:inline">
                  {isAudioPlaying ? `(${volumePercent}٪)` : '(مكتوم)'}
                </span>
                {isAudioPlaying ? (
                  <Volume2 className="w-3.5 h-3.5 text-[#633c44]" />
                ) : (
                  <VolumeX className="w-3.5 h-3.5 text-[#827375]" />
                )}
                <ChevronDown className="w-3 h-3 text-[#827375]" />
              </button>

              {/* Floating Track Selector Dropdown */}
              {showSoundDropdown && (
                <div className="absolute left-0 sm:right-auto sm:left-0 top-full mt-2 w-64 p-3 rounded-2xl bg-white border border-[#d4c2c4]/50 paper-card-shadow z-50 animate-in fade-in zoom-in-95 duration-150">
                  <div className="flex items-center justify-between px-1 mb-2">
                    <span className="text-[11px] font-semibold text-[#827375] uppercase tracking-wider">
                      أصوات الطبيعة المهدئة
                    </span>
                    <button
                      onClick={handleToggleAudio}
                      className="text-xs px-2.5 py-1 rounded-full font-semibold border border-[#d4c2c4]/60 hover:bg-[#f8ebeb] text-[#633c44]"
                    >
                      {isAudioPlaying ? 'كتم الصوت' : 'تشغيل الصوت'}
                    </button>
                  </div>

                  <div className="space-y-1">
                    {SOUNDSCAPE_TRACKS.map((track) => {
                      const isSelected = selectedTrack.id === track.id;
                      return (
                        <button
                          key={track.id}
                          onClick={() => handleSelectTrack(track)}
                          className={`w-full flex items-center justify-between px-2.5 py-2 rounded-xl text-xs transition-colors ${
                            isSelected
                              ? 'bg-[#fef1f0] text-[#633c44] font-semibold'
                              : 'hover:bg-[#f8ebeb]/60 text-[#504445]'
                          }`}
                        >
                          <span className="flex items-center gap-2">
                            <span>{track.icon}</span>
                            <span>{track.name}</span>
                          </span>
                          {isSelected && <Check className="w-3.5 h-3.5 text-[#633c44]" />}
                        </button>
                      );
                    })}
                  </div>

                  <div className="h-px bg-[#d4c2c4]/30 my-2" />

                  {/* Volume Slider */}
                  <div className="px-1 py-1 flex items-center gap-2">
                    <Volume2 className="w-3.5 h-3.5 text-[#827375]" />
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={volumePercent}
                      onChange={handleVolumeChange}
                      className="w-full h-1 bg-[#ece0df] rounded-lg appearance-none accent-[#633c44] cursor-pointer"
                      title="ضبط مستوى الصوت الهادئ"
                    />
                    <span className="text-[11px] text-[#827375] w-8 text-left font-mono">
                      {volumePercent}%
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Fullscreen Button */}
            <button
              onClick={handleToggleFullscreen}
              className="w-11 h-11 rounded-full flex items-center justify-center border border-[#d4c2c4]/60 bg-white/95 text-[#504445] hover:text-[#633c44] hover:border-[#feb2bb] transition-all shadow-xs active:scale-95 shrink-0"
              title={isFullscreen ? 'الخروج من ملء الشاشة' : 'ملء الشاشة للتركيز'}
            >
              {isFullscreen ? (
                <Minimize2 className="w-4 h-4" />
              ) : (
                <Maximize2 className="w-4 h-4" />
              )}
            </button>
          </div>
        </header>

        {/* 2. CENTRAL FOCUS HERO */}
        <main className="flex-1 flex flex-col items-center justify-center text-center my-4 sm:my-6">
          {/* Active Intention Header Tag */}
          <div className="inline-flex items-center gap-2 mb-3">
            <span className="w-2 h-2 rounded-full bg-[#633c44] animate-ping" />
            <span className="text-xs text-[#827375] tracking-widest font-semibold">
              جلسة التركيز الحالية
            </span>
          </div>

          {/* Task Headline in Editorial Serif */}
          {isEditingTitle ? (
            <form onSubmit={handleSaveTitle} className="mb-4 max-w-2xl w-full flex items-center gap-2">
              <input
                type="text"
                value={editedTitle}
                onChange={(e) => setEditedTitle(e.target.value)}
                autoFocus
                className="w-full text-center font-editorial text-2xl sm:text-3xl text-[#633c44] bg-white/90 border border-[#7d535b]/50 rounded-2xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#7d535b]"
              />
              <button
                type="submit"
                className="px-5 py-2 bg-[#633c44] text-white rounded-full text-xs font-semibold"
              >
                حفظ
              </button>
            </form>
          ) : (
            <div className="relative group max-w-3xl mb-4">
              <h1
                onClick={() => setIsEditingTitle(true)}
                title="انقري لتعديل عنوان الجلسة"
                className="font-editorial text-3xl sm:text-4xl md:text-5xl text-[#633c44] font-medium tracking-tight leading-tight cursor-pointer hover:opacity-90 transition-opacity"
              >
                {intention.title}
              </h1>
              <button
                onClick={() => setIsEditingTitle(true)}
                className="opacity-0 group-hover:opacity-100 transition-opacity absolute -left-7 top-1/2 -translate-y-1/2 p-1.5 text-[#827375] hover:text-[#633c44]"
                title="تعديل عنوان الجلسة"
              >
                <Edit3 className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Category & Gamification Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#fef1f0] border border-[#d4c2c4]/40 text-[#504445] text-xs sm:text-sm mb-7 shadow-sm">
            <span className="font-semibold text-[#633c44]">{intention.category}</span>
            <span className="text-[#d4c2c4]">•</span>
            <span className="text-[#693943] flex items-center gap-1 font-semibold">
              <span>+{intention.xpReward} نقطة سكينة عند الإتمام</span>
              <Sparkles className="w-3.5 h-3.5 text-[#884d55]" />
            </span>
          </div>

          {/* Giant Refined Timer Ring & Breathing Display */}
          <div className="relative w-76 h-76 sm:w-84 sm:h-84 md:w-88 md:h-88 flex items-center justify-center mb-7 select-none">
            {/* Ambient Breathing Halo Ring */}
            <div className="absolute inset-3 rounded-full border border-[#ffd9dc]/50 animate-breath bg-white/40 backdrop-blur-sm -z-10" />

            {/* SVG Radial Progress Meter */}
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 240 240">
              {/* Background track */}
              <circle
                className="opacity-60"
                cx="120"
                cy="120"
                fill="transparent"
                r="102"
                stroke="#ECE0DF"
                strokeWidth="3.5"
              />
              {/* Animated Progress Stroke */}
              <circle
                className="transition-all duration-1000 ease-out"
                cx="120"
                cy="120"
                fill="transparent"
                r="102"
                stroke="#7D535B"
                strokeWidth="4.5"
                strokeDasharray="640.88"
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
              />
            </svg>

            {/* Centered Timer Counter & Elapsed Data */}
            <div className="absolute flex flex-col items-center justify-center">
              <span className="font-editorial text-4xl sm:text-5xl text-[#633c44] tabular-nums tracking-normal drop-shadow-sm font-medium">
                {formatTimeHHMMSS(secondsRemaining)}
              </span>
              <span className="text-xs sm:text-sm text-[#504445] mt-2 font-medium tracking-wide">
                مضت {elapsedMinutes} دقيقة من أصل {plannedMinutes} دقيقة مخططة
              </span>
              {/* Flow Interval Dots */}
              <div className="flex items-center gap-1.5 mt-3">
                <span
                  className={`w-1.5 h-1.5 rounded-full ${
                    progressRatio >= 0.2 ? 'bg-[#7d535b]' : 'bg-[#d4c2c4]'
                  }`}
                />
                <span
                  className={`w-1.5 h-1.5 rounded-full ${
                    progressRatio >= 0.4 ? 'bg-[#7d535b]' : 'bg-[#d4c2c4]'
                  }`}
                />
                <span
                  className={`w-1.5 h-1.5 rounded-full ${
                    progressRatio >= 0.6 ? 'bg-[#7d535b]' : 'bg-[#d4c2c4]'
                  }`}
                />
                <span
                  className={`w-1.5 h-1.5 rounded-full ${
                    progressRatio >= 0.8 ? 'bg-[#7d535b]' : 'bg-[#d4c2c4]'
                  }`}
                />
                <span
                  className={`w-1.5 h-1.5 rounded-full ${
                    progressRatio >= 1 ? 'bg-[#7d535b]' : 'bg-[#d4c2c4]'
                  }`}
                />
              </div>
            </div>
          </div>

          {/* Mindful Action Controls */}
          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4">
            {/* Pause / Resume Flow Button */}
            <button
              onClick={onToggleTimer}
              id="toggle-flow-btn"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-[#d4c2c4]/80 bg-white text-[#633c44] text-xs sm:text-sm font-semibold hover:border-[#eeb9c2] hover:bg-[#fef1f0] transition-all duration-200 active:scale-98 shadow-sm"
            >
              {isTimerRunning ? (
                <>
                  <Pause className="w-4 h-4" />
                  <span>إيقاف مؤقت</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4" />
                  <span>مواصلة التركيز</span>
                </>
              )}
            </button>

            {/* Complete Intention */}
            <button
              onClick={onCompleteIntention}
              id="complete-intention-btn"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-[#633c44] text-white text-xs sm:text-sm font-semibold hover:bg-[#7d535b] shadow-md hover:shadow-lg transition-all duration-200 active:scale-98 group"
            >
              <CheckCircle2 className="w-4 h-4 fill-white/20" />
              <span>إتمام الجلسة بنجاح 🌸</span>
            </button>

            {/* +5 Min Pause / Mindful Breath */}
            <button
              onClick={onOpenBreathing}
              id="mindful-breath-btn"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-[#f8ebeb] border border-[#d4c2c4]/50 text-[#7a4249] text-xs sm:text-sm font-semibold hover:bg-[#f2e5e5] transition-all duration-200 active:scale-98"
            >
              <Wind className="w-4 h-4" />
              <span>استراحة ٥ دقائق وتنفس واعي</span>
            </button>
          </div>
        </main>

        {/* 3. BOTTOM MINDFUL SUPPORT DOCK / BENTO CARDS */}
        <footer className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5 mt-4">
          {/* Card 1: Arabic Daily Life Wisdom & Motivation */}
          <div className="p-5 rounded-2xl bg-white/85 border border-[#d4c2c4]/40 paper-card-shadow flex flex-col justify-between relative overflow-hidden backdrop-blur-sm group">
            <div>
              <div className="flex items-center justify-between mb-2.5">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#884d55]" />
                  <span className="text-xs font-semibold text-[#827375] tracking-wider uppercase">
                    تذكرة وتحفيز اليوم عن الحياة
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() =>
                      setReminderIndex(
                        (idx) =>
                          (idx - 1 + DAILY_ARABIC_LIFE_REMINDERS.length) %
                          DAILY_ARABIC_LIFE_REMINDERS.length
                      )
                    }
                    className="text-xs text-[#827375] hover:text-[#633c44] transition-colors p-1 rounded-full hover:bg-[#f8ebeb]"
                    title="الحكمة السابقة"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() =>
                      setReminderIndex((idx) => (idx + 1) % DAILY_ARABIC_LIFE_REMINDERS.length)
                    }
                    className="text-xs text-[#827375] hover:text-[#633c44] transition-colors p-1 rounded-full hover:bg-[#f8ebeb]"
                    title="الحكمة التالية"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Arabic Quote & Practical Life Reminder */}
              <div dir="rtl" className="text-right my-1">
                <p className="font-editorial text-base sm:text-lg text-[#633c44] leading-relaxed font-medium">
                  "{currentReminder.quote}"
                </p>
                <div className="mt-2.5 p-2 rounded-xl bg-[#fef1f0]/70 border border-[#feb2bb]/30 text-xs text-[#7d535b] font-medium flex items-center gap-1.5 justify-start">
                  <span>💡</span>
                  <span>{currentReminder.practicalTip}</span>
                </div>
              </div>
            </div>

            <div
              dir="rtl"
              className="mt-3.5 pt-2.5 border-t border-[#d4c2c4]/30 flex items-center justify-between text-xs text-[#504445]"
            >
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full bg-[#fef1f0] text-[#7d535b] font-semibold text-[11px]">
                  {currentReminder.theme}
                </span>
                <span className="text-[11px] text-[#827375]">
                  حكمة #{currentReminder.id} من {DAILY_ARABIC_LIFE_REMINDERS.length}
                </span>
              </div>
              <button
                onClick={() =>
                  setReminderIndex((idx) => (idx + 1) % DAILY_ARABIC_LIFE_REMINDERS.length)
                }
                className="text-[11px] text-[#7d535b] hover:underline font-semibold"
              >
                تغيير الحكمة ✦
              </button>
            </div>
          </div>

          {/* Card 2: Fleeting Thoughts Scratchpad */}
          <div className="p-5 rounded-2xl bg-white/80 border border-[#d4c2c4]/40 paper-card-shadow flex flex-col justify-between backdrop-blur-sm">
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-2">
                  <Edit3 className="w-4 h-4 text-[#884d55]" />
                  <span className="text-xs font-semibold text-[#827375] tracking-wide">
                    مفكرة الخواطر العابرة
                  </span>
                </div>
                <span className="text-[10px] font-semibold text-[#827375] px-2 py-0.5 rounded-full bg-[#f8ebeb]">
                  لحفظ الصفاء الذهني
                </span>
              </div>
              <p className="text-xs text-[#504445] mb-3">
                دوّني أي فكرة مفاجئة هنا لتحافظي على هدوء وتركيز اللحظة الحالية.
              </p>

              {/* Mini list of captured thoughts if any */}
              {fleetingThoughts.length > 0 && (
                <div className="max-h-24 overflow-y-auto space-y-1.5 mb-2.5 pl-1 text-xs">
                  {fleetingThoughts.slice(0, 3).map((thought) => (
                    <div
                      key={thought.id}
                      className="flex items-center justify-between p-1.5 rounded-lg bg-[#fef1f0]/60 border border-[#d4c2c4]/20 group/t"
                    >
                      <button
                        onClick={() => onToggleThought(thought.id)}
                        className={`text-right flex-1 truncate ${
                          thought.completed ? 'line-through text-[#827375]' : 'text-[#201a1a]'
                        }`}
                        title={thought.text}
                      >
                        • {thought.text}
                      </button>
                      <button
                        onClick={() => onDeleteThought(thought.id)}
                        className="opacity-0 group-hover/t:opacity-100 p-0.5 text-[#827375] hover:text-[#ba1a1a] transition-opacity"
                        title="حذف الخاطرة"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                  {fleetingThoughts.length > 3 && (
                    <div className="text-[10px] text-[#827375] italic">
                      +{fleetingThoughts.length - 3} خواطر أخرى مسجلة في الملاذ
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Input for capturing thought */}
            <form onSubmit={handleAddFleetingThought} className="relative mt-1">
              <input
                type="text"
                value={newThoughtText}
                onChange={(e) => setNewThoughtText(e.target.value)}
                placeholder="سجّلي خاطرة سريعة برفق..."
                className="w-full pr-3.5 pl-9 py-2 bg-[#fef1f0]/70 border border-[#d4c2c4]/40 rounded-xl text-xs text-[#201a1a] placeholder:text-[#827375]/70 focus:outline-none focus:ring-1 focus:ring-[#633c44] focus:border-[#633c44] transition-all"
              />
              <button
                type="submit"
                className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[#827375] hover:text-[#633c44] transition-colors p-1"
                title="إضافة الخاطرة"
              >
                <Plus className="w-4 h-4" />
              </button>
            </form>
          </div>

          {/* Card 3: Sub-tasks in Flow */}
          <div className="p-5 rounded-2xl bg-white/80 border border-[#d4c2c4]/40 paper-card-shadow backdrop-blur-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2.5">
                <div className="flex items-center gap-2">
                  <CheckSquare className="w-4 h-4 text-[#633c44]" />
                  <span className="text-xs font-semibold text-[#827375] tracking-wide">
                    خطوات الجلسة التابعة
                  </span>
                </div>
                <span className="text-xs text-[#633c44] font-semibold">
                  أُنجز {completedSubtasksCount} من {intention.subTasks.length}
                </span>
              </div>

              <div className="space-y-2 max-h-36 overflow-y-auto pl-1">
                {intention.subTasks.length === 0 ? (
                  <div className="text-center py-4 px-2 text-xs text-[#827375] bg-[#fef1f0]/40 rounded-xl border border-dashed border-[#d4c2c4]/60">
                    <span>لا توجد خطوات بعد. أضيفي خطوات جلستكِ بالأسفل 🌸</span>
                  </div>
                ) : (
                  intention.subTasks.map((task) => {
                    if (task.completed) {
                      return (
                        <div
                          key={task.id}
                          className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-[#fef1f0] transition-colors cursor-pointer group/item"
                          onClick={() => handleToggleSubtask(task.id)}
                        >
                          <div className="w-5 h-5 rounded-md bg-[#633c44] text-white flex items-center justify-center flex-shrink-0">
                            <Check className="w-3.5 h-3.5" />
                          </div>
                          <span className="text-xs text-[#827375] line-through truncate flex-1">
                            {task.title}
                          </span>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteSubtask(task.id);
                            }}
                            className="opacity-0 group-hover/item:opacity-100 p-1 text-[#827375] hover:text-[#ba1a1a] transition-opacity"
                            title="حذف هذه الخطوة"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      );
                    }

                    if (task.isCurrent) {
                      return (
                        <div
                          key={task.id}
                          className="flex items-center gap-2 p-1.5 rounded-lg bg-[#fef1f0]/90 border border-[#d4c2c4]/30 group/item"
                        >
                          <button
                            onClick={() => handleToggleSubtask(task.id)}
                            className="w-5 h-5 rounded-md border-2 border-[#633c44] bg-white flex items-center justify-center flex-shrink-0"
                            title="تحديد كمكتملة"
                          >
                            <div className="w-2 h-2 rounded-full bg-[#633c44] animate-pulse" />
                          </button>
                          <div className="flex-1 flex items-center justify-between min-w-0">
                            <span className="text-xs text-[#633c44] font-semibold truncate">
                              {task.title}
                            </span>
                            <span className="text-[10px] tracking-wide font-semibold text-[#693943] bg-[#ffd9dc]/60 px-1.5 py-0.5 rounded mr-1 flex-shrink-0">
                              الحالية
                            </span>
                          </div>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteSubtask(task.id);
                            }}
                            className="opacity-0 group-hover/item:opacity-100 p-1 text-[#827375] hover:text-[#ba1a1a] transition-opacity"
                            title="حذف هذه الخطوة"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      );
                    }

                    return (
                      <div
                        key={task.id}
                        className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-[#fef1f0] transition-colors cursor-pointer group/item"
                        onClick={() => handleToggleSubtask(task.id)}
                      >
                        <div className="w-5 h-5 rounded-md border border-[#d4c2c4] bg-white flex-shrink-0 group-hover/item:border-[#633c44]" />
                        <span className="text-xs text-[#504445] truncate flex-1">
                          {task.title}
                        </span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleSetCurrentSubtask(task.id);
                          }}
                          className="opacity-0 group-hover/item:opacity-100 text-[10px] text-[#7d535b] hover:underline shrink-0"
                          title="تحديد كخطوة نشطة الآن"
                        >
                          تحديد كنشطة
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteSubtask(task.id);
                          }}
                          className="opacity-0 group-hover/item:opacity-100 p-1 text-[#827375] hover:text-[#ba1a1a] transition-opacity shrink-0"
                          title="حذف هذه الخطوة"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            {/* Quick add subtask form */}
            <div className="mt-2 pt-2 border-t border-[#d4c2c4]/30">
              {showAddSubtask ? (
                <form onSubmit={handleAddSubtask} className="flex items-center gap-1.5">
                  <input
                    type="text"
                    value={newSubtaskTitle}
                    onChange={(e) => setNewSubtaskTitle(e.target.value)}
                    placeholder="عنوان الخطوة الجديدة..."
                    autoFocus
                    className="w-full px-2.5 py-1 text-xs bg-[#fef1f0]/70 border border-[#d4c2c4]/40 rounded-lg text-[#201a1a] focus:outline-none focus:ring-1 focus:ring-[#633c44]"
                  />
                  <button
                    type="submit"
                    className="px-2.5 py-1 bg-[#633c44] text-white text-xs rounded-lg font-medium"
                  >
                    إضافة
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowAddSubtask(false)}
                    className="px-1.5 py-1 text-xs text-[#827375]"
                  >
                    ✕
                  </button>
                </form>
              ) : (
                <button
                  onClick={() => setShowAddSubtask(true)}
                  className="w-full flex items-center justify-center gap-1 py-1 text-xs text-[#7d535b] hover:text-[#633c44] hover:bg-[#fef1f0] rounded-lg transition-colors font-medium"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>إضافة خطوة جديدة</span>
                </button>
              )}
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};
