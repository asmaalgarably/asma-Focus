import React, { useState } from 'react';
import {
  Flower2,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Clock,
  CheckCircle2,
  Flame,
  Plus,
  Play,
  Trash2,
  Sprout,
  Edit3,
  Calendar,
  Volume2,
  Wind,
  RotateCcw,
  Info,
  ChevronLeft,
  ChevronRight,
  X,
  BookOpen,
} from 'lucide-react';
import { Intention, FleetingThought, SoundscapeTrack, MonthPlan } from '../types.ts';
import {
  SOUNDSCAPE_TRACKS,
  DAILY_ARABIC_LIFE_REMINDERS,
  getTodayArabicReminder,
  getTimeGreeting,
} from '../data/initialData.ts';
import { ButterflyBackground } from './ButterflyBackground.tsx';
import { WeeklyMonthPlanner } from './WeeklyMonthPlanner.tsx';

interface SanctuaryDashboardProps {
  intentions: Intention[];
  activeIntentionId: string;
  onSelectActiveIntention: (id: string) => void;
  onAddNewIntention: (intention: Intention) => void;
  onDeleteIntention: (id: string) => void;
  fleetingThoughts: FleetingThought[];
  onAddThought: (text: string) => void;
  onToggleThought: (id: string) => void;
  onDeleteThought: (id: string) => void;
  onEnterFocusMode: () => void;
  onOpenBreathing: () => void;
  onResetAll?: () => void;
  totalXp: number;
  flowStreakDays: number;
  monthPlan: MonthPlan;
  onUpdateMonthPlan: (plan: MonthPlan) => void;
}

export const SanctuaryDashboard: React.FC<SanctuaryDashboardProps> = ({
  intentions,
  activeIntentionId,
  onSelectActiveIntention,
  onAddNewIntention,
  onDeleteIntention,
  fleetingThoughts,
  onAddThought,
  onToggleThought,
  onDeleteThought,
  onEnterFocusMode,
  onOpenBreathing,
  onResetAll,
  totalXp,
  flowStreakDays,
  monthPlan,
  onUpdateMonthPlan,
}) => {
  // New intention form modal/state
  const [showNewIntentionModal, setShowNewIntentionModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState('دراسة وتعلّم عميق');
  const [newMinutes, setNewMinutes] = useState(25);
  const [newSubtask1, setNewSubtask1] = useState('');
  const [newSubtask2, setNewSubtask2] = useState('');

  // Scratchpad quick input
  const [scratchpadInput, setScratchpadInput] = useState('');

  // Daily Arabic Life Reminder state
  const todayReminder = getTodayArabicReminder();
  const [reminderIndex, setReminderIndex] = useState(() => {
    const found = DAILY_ARABIC_LIFE_REMINDERS.findIndex((r) => r.id === todayReminder.id);
    return found !== -1 ? found : 0;
  });

  const currentReminder =
    DAILY_ARABIC_LIFE_REMINDERS[reminderIndex] || DAILY_ARABIC_LIFE_REMINDERS[0];

  const handleCreateIntention = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const subTasks = [];
    if (newSubtask1.trim()) {
      subTasks.push({
        id: `sub-${Date.now()}-1`,
        title: newSubtask1.trim(),
        completed: false,
        isCurrent: true,
      });
    }
    if (newSubtask2.trim()) {
      subTasks.push({
        id: `sub-${Date.now()}-2`,
        title: newSubtask2.trim(),
        completed: false,
      });
    }

    const created: Intention = {
      id: `int-${Date.now()}`,
      title: newTitle.trim(),
      category: newCategory,
      xpReward: Math.round(newMinutes * 0.55),
      plannedMinutes: newMinutes,
      completedMinutes: 0,
      status: 'active',
      subTasks,
    };

    onAddNewIntention(created);
    onSelectActiveIntention(created.id);
    setShowNewIntentionModal(false);
    setNewTitle('');
    setNewSubtask1('');
    setNewSubtask2('');
  };

  const handleQuickAddThought = (e: React.FormEvent) => {
    e.preventDefault();
    if (!scratchpadInput.trim()) return;
    onAddThought(scratchpadInput.trim());
    setScratchpadInput('');
  };

  // Botanical level calculation
  const currentLevel = Math.floor(totalXp / 100) + 1;
  const xpInCurrentLevel = totalXp % 100;

  const botanicalStageNames = [
    'بذرة البدايات الرقيقة 🌿',
    'برعم ندى الصباح العاطر 🌱',
    'بتلات الحرير الوردي الناعمة 🌸',
    'زهرة البيوني في أوج ازدهارها 🌺',
    'ملاذ الياسمين الملكي الوارف 🌾',
  ];
  const stageName = botanicalStageNames[Math.min(currentLevel - 1, botanicalStageNames.length - 1)];

  return (
    <div className="min-h-screen bg-[#fff7f8] text-[#201a1a] font-humanist relative selection:bg-[#feb2bb] selection:text-[#7a4249] sanctuary-glow flex flex-col justify-between p-4 sm:p-8 md:p-12">
      {/* Soft Pink Floating Butterflies in the background */}
      <ButterflyBackground />

      <div className="max-w-[1240px] w-full mx-auto relative z-10 space-y-9">
        {/* HEADER SECTION */}
        <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5 pb-6 border-b border-[#d4c2c4]/40">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-[#f8ebeb] border border-[#feb2bb]/50 flex items-center justify-center text-[#633c44] shadow-sm">
              <Flower2 className="w-6 h-6 stroke-[1.5]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-editorial text-2xl sm:text-3xl text-[#633c44] font-medium tracking-tight">
                  {getTimeGreeting('أسماء')}
                </h1>
                <span className="text-sm">🌸</span>
              </div>
              <p className="text-xs text-[#504445] font-humanist">
                ملاذ أسماء للتركيز الهادئ والحضور الواعي • بيئة آمنة وناعمة للإنجاز بسلام 🌿
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto justify-start sm:justify-end">
            {/* Zero All Button */}
            {onResetAll && (
              <button
                onClick={() => {
                  if (
                    window.confirm(
                      'هل تريدين تصفير كل شيء (النقاط، المؤقت، الملاحظات) والبدء من جديد يا أسماء؟'
                    )
                  ) {
                    onResetAll();
                  }
                }}
                id="reset-dashboard-btn"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full border border-[#d4c2c4]/60 bg-white/90 text-[#7d535b] text-xs font-semibold hover:bg-[#fef1f0] hover:border-[#feb2bb] transition-colors shadow-xs active:scale-95 whitespace-nowrap"
                title="تصفير كل شيء والبدء بصفحة جديدة"
              >
                <RotateCcw className="w-3.5 h-3.5 text-[#884d55]" />
                <span>تصفير (0)</span>
              </button>
            )}

            <button
              onClick={onOpenBreathing}
              id="dashboard-mindful-breath-btn"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full border border-[#d4c2c4]/60 bg-white/90 text-[#7a4249] text-xs font-semibold hover:bg-[#fef1f0] transition-colors shadow-xs whitespace-nowrap"
            >
              <Wind className="w-3.5 h-3.5" />
              <span>استراحة وتنفس واعي 🌿</span>
            </button>

            <button
              onClick={onEnterFocusMode}
              id="enter-focus-mode-btn"
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#633c44] text-white text-xs sm:text-sm font-semibold hover:bg-[#7d535b] shadow-md hover:shadow-lg transition-all active:scale-98 whitespace-nowrap"
            >
              <span>دخول ملاذ التركيز 🌸</span>
              <ArrowLeft className="w-4 h-4" />
            </button>
          </div>
        </header>

        {/* DAILY ARABIC LIFE WISDOM & MOTIVATION BANNER */}
        <section
          dir="rtl"
          className="p-6 sm:p-7 rounded-3xl bg-gradient-to-l from-[#fff0f2] via-white to-[#fdf4f4] border border-[#feb2bb]/50 paper-card-shadow relative overflow-hidden"
        >
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <span className="px-3 py-1 rounded-full bg-[#f8ebeb] border border-[#d4c2c4]/40 text-[#633c44] text-xs font-bold tracking-wide flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-[#884d55]" />
                  <span>حكمة وتحفيز اليوم عن الحياة لأسماء</span>
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-[#fef1f0] text-[#7d535b] text-xs font-semibold">
                  {currentReminder.theme}
                </span>
              </div>
              <blockquote className="font-editorial text-lg sm:text-xl text-[#633c44] font-medium leading-relaxed my-2">
                "{currentReminder.quote}"
              </blockquote>
              <div className="flex items-center gap-2 text-xs text-[#7d535b] font-medium mt-2 bg-white/70 px-3 py-1.5 rounded-xl border border-[#d4c2c4]/30 w-fit">
                <span>💡 تذكرة عملية:</span>
                <span>{currentReminder.practicalTip}</span>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0 self-end md:self-center">
              <button
                onClick={() =>
                  setReminderIndex(
                    (idx) =>
                      (idx - 1 + DAILY_ARABIC_LIFE_REMINDERS.length) %
                      DAILY_ARABIC_LIFE_REMINDERS.length
                  )
                }
                className="px-3 py-2 rounded-xl bg-white border border-[#d4c2c4]/60 text-xs text-[#633c44] hover:bg-[#fef1f0] flex items-center gap-1 shadow-xs"
                title="الحكمة السابقة"
              >
                <ChevronRight className="w-3.5 h-3.5" />
                <span>السابقة</span>
              </button>
              <button
                onClick={() =>
                  setReminderIndex((idx) => (idx + 1) % DAILY_ARABIC_LIFE_REMINDERS.length)
                }
                className="px-3 py-2 rounded-xl bg-[#633c44] text-white text-xs font-semibold hover:bg-[#7d535b] flex items-center gap-1 shadow-xs"
                title="الحكمة التالية"
              >
                <span>حكمة أخرى ✦</span>
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </section>

        {/* 4-WEEK MONTH PLANNER: TO-DO LIST & "شو سويت فيهم" ACCOMPLISHMENTS */}
        <WeeklyMonthPlanner
          monthPlan={monthPlan}
          onUpdateMonthPlan={onUpdateMonthPlan}
          onResetMonthPlan={onResetAll}
        />

        {/* HERO BOTANICAL BLOOM & STATS SPREAD */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Card 1: Botanical Blossom XP Sanctuary (2 cols) */}
          <div className="lg:col-span-2 p-6 sm:p-8 rounded-3xl bg-white/80 border border-[#d4c2c4]/50 paper-card-shadow relative overflow-hidden backdrop-blur-sm flex flex-col justify-between">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#fef1f0] border border-[#d4c2c4]/40 text-[#693943] text-xs font-semibold tracking-wide mb-2">
                  <Sprout className="w-3.5 h-3.5 text-[#884d55]" />
                  <span>نمو حديقة السكينة • المستوى {currentLevel}</span>
                </div>
                <h2 className="font-editorial text-2xl sm:text-3xl text-[#633c44] font-medium tracking-tight">
                  {stageName}
                </h2>
                <p className="text-xs text-[#504445] mt-1">
                  كل دقيقة من التركيز الواعي تسقي بذور حديقتكِ الداخلية وتنميها برفق وسكينة.
                </p>
              </div>

              {/* XP Count pill */}
              <div className="text-right sm:text-left">
                <div className="font-editorial text-3xl font-bold text-[#633c44]">
                  {totalXp}{' '}
                  <span className="text-sm font-humanist text-[#884d55] font-semibold">نقطة XP</span>
                </div>
                <span className="text-[11px] text-[#827375]">
                  متبقي {100 - xpInCurrentLevel} نقطة لبلوغ الإزهار القادم
                </span>
              </div>
            </div>

            {/* Botanical Progress Bar */}
            <div className="mb-6">
              <div className="flex items-center justify-between text-xs text-[#7d535b] font-semibold mb-2">
                <span>تطور الإزهار والنمو</span>
                <span>{xpInCurrentLevel}%</span>
              </div>
              <div className="w-full h-3 bg-[#ece0df] rounded-full overflow-hidden p-0.5">
                <div
                  className="h-full bg-gradient-to-r from-[#884d55] to-[#feb2bb] rounded-full transition-all duration-700"
                  style={{ width: `${Math.max(8, xpInCurrentLevel)}%` }}
                />
              </div>
            </div>

            {/* Micro Highlights */}
            <div className="grid grid-cols-3 gap-3 pt-4 border-t border-[#d4c2c4]/30">
              <div className="text-center p-2 rounded-xl bg-[#fef1f0]/60">
                <div className="flex items-center justify-center gap-1 text-[#884d55] text-xs mb-0.5">
                  <Flame className="w-3.5 h-3.5" />
                  <span>أيام الاستمرار</span>
                </div>
                <div className="font-editorial text-lg text-[#633c44] font-bold">
                  {flowStreakDays} أيام
                </div>
              </div>

              <div className="text-center p-2 rounded-xl bg-[#fef1f0]/60">
                <div className="flex items-center justify-center gap-1 text-[#884d55] text-xs mb-0.5">
                  <Clock className="w-3.5 h-3.5" />
                  <span>إجمالي وقت التركيز</span>
                </div>
                <div className="font-editorial text-lg text-[#633c44] font-bold">
                  {Math.round(totalXp * 1.6)} دقيقة
                </div>
              </div>

              <div className="text-center p-2 rounded-xl bg-[#fef1f0]/60">
                <div className="flex items-center justify-center gap-1 text-[#884d55] text-xs mb-0.5">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>الجلسات المخططة</span>
                </div>
                <div className="font-editorial text-lg text-[#633c44] font-bold">
                  {intentions.length} جلسات
                </div>
              </div>
            </div>
          </div>

          {/* Card 2: Fleeting Thoughts Inbox (1 col) */}
          <div className="p-6 rounded-3xl bg-white/80 border border-[#d4c2c4]/50 paper-card-shadow backdrop-blur-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Edit3 className="w-4 h-4 text-[#884d55]" />
                  <h3 className="font-editorial text-xl text-[#633c44] font-semibold">
                    مفكرة الخواطر العابرة
                  </h3>
                </div>
                <span className="text-[10px] font-semibold text-[#827375] px-2 py-0.5 rounded-full bg-[#f8ebeb]">
                  {fleetingThoughts.length} مسجلة
                </span>
              </div>
              <p className="text-xs text-[#504445] mb-4">
                مفكرة الخواطر العابرة لتصفية ذهنكِ وحفظ الأفكار برفق أثناء التركيز.
              </p>

              {/* Thoughts list */}
              <div className="space-y-2 max-h-48 overflow-y-auto pl-1">
                {fleetingThoughts.length === 0 ? (
                  <p className="text-xs italic text-[#827375] py-4 text-center">
                    لا توجد خواطر مسجلة حالياً.. ذهنكِ صافٍ ومستعد للتركيز 🌿
                  </p>
                ) : (
                  fleetingThoughts.map((thought) => (
                    <div
                      key={thought.id}
                      className="flex items-start justify-between gap-2 p-2.5 rounded-xl bg-[#fef1f0]/60 border border-[#d4c2c4]/30 group"
                    >
                      <button
                        onClick={() => onToggleThought(thought.id)}
                        className={`text-right text-xs flex-1 ${
                          thought.completed ? 'line-through text-[#827375]' : 'text-[#201a1a]'
                        }`}
                      >
                        {thought.text}
                      </button>
                      <button
                        onClick={() => onDeleteThought(thought.id)}
                        className="opacity-0 group-hover:opacity-100 text-[#827375] hover:text-[#ba1a1a] p-0.5 transition-opacity"
                        title="حذف الخاطرة"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Quick Add Thought */}
            <form onSubmit={handleQuickAddThought} className="relative mt-4">
              <input
                type="text"
                value={scratchpadInput}
                onChange={(e) => setScratchpadInput(e.target.value)}
                placeholder="سجّلي فكرة عابرة هنا برفق..."
                className="w-full pr-3.5 pl-10 py-2.5 rounded-xl border border-[#d4c2c4]/50 bg-[#fef1f0]/60 text-xs text-[#201a1a] placeholder:text-[#827375] focus:outline-none focus:ring-1 focus:ring-[#633c44]"
              />
              <button
                type="submit"
                className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[#827375] hover:text-[#633c44] p-1"
                title="إضافة الخاطرة"
              >
                <Plus className="w-4 h-4" />
              </button>
            </form>
          </div>
        </section>

        {/* INTENTIONS LIST SPREAD */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-editorial text-2xl text-[#633c44] font-medium tracking-tight">
                نوايا التركيز وجلسات الإنجاز
              </h3>
              <p className="text-xs text-[#504445]">
                اختاري جلسة للبدء في التركيز أو أنشئي نية جديدة لليوم بسكينة.
              </p>
            </div>
            <button
              onClick={() => setShowNewIntentionModal(true)}
              id="create-new-intention-btn"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#633c44] text-white text-xs font-semibold hover:bg-[#7d535b] transition-all shadow-sm active:scale-98"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>نية تركيز جديدة</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {intentions.map((intent) => {
              const isActive = intent.id === activeIntentionId;

              return (
                <div
                  key={intent.id}
                  className={`p-5 rounded-2xl border transition-all duration-200 paper-card-shadow flex flex-col justify-between group ${
                    isActive
                      ? 'bg-white border-[#884d55] ring-2 ring-[#feb2bb]/40 shadow-md'
                      : 'bg-white/80 border-[#d4c2c4]/50 hover:border-[#feb2bb] hover:bg-[#fff9f9]'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[11px] font-semibold tracking-wide text-[#884d55] px-2.5 py-0.5 rounded-full bg-[#fef1f0]">
                        {intent.category}
                      </span>
                      <div className="flex items-center gap-1">
                        {isActive && (
                          <span className="text-[10px] font-bold text-[#633c44] px-2 py-0.5 rounded-full bg-[#ffd9dc]/60">
                            النشطة حالياً
                          </span>
                        )}
                        {intentions.length > 1 && (
                          <button
                            onClick={() => onDeleteIntention(intent.id)}
                            className="text-[#827375] hover:text-[#ba1a1a] p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                            title="حذف النية"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>

                    <h4 className="font-editorial text-lg text-[#633c44] font-medium leading-snug mb-2">
                      {intent.title}
                    </h4>

                    {intent.subTasks.length > 0 && (
                      <div className="space-y-1 mb-3 text-xs text-[#504445]">
                        {intent.subTasks.slice(0, 2).map((st) => (
                          <div key={st.id} className="flex items-center gap-1.5 truncate">
                            <span
                              className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                                st.completed ? 'bg-[#7d535b]' : 'bg-[#d4c2c4]'
                              }`}
                            />
                            <span className={st.completed ? 'line-through text-[#827375]' : ''}>
                              {st.title}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="pt-3 border-t border-[#d4c2c4]/30 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2 text-[#827375]">
                      <span>{intent.plannedMinutes} دقيقة</span>
                      <span>•</span>
                      <span>+{intent.xpReward} نقطة</span>
                    </div>

                    {isActive ? (
                      <button
                        onClick={onEnterFocusMode}
                        className="px-3.5 py-1 rounded-full bg-[#633c44] text-white text-xs font-semibold hover:bg-[#7d535b] flex items-center gap-1"
                      >
                        <Play className="w-3 h-3 fill-white" />
                        <span>متابعة الجلسة</span>
                      </button>
                    ) : (
                      <button
                        onClick={() => {
                          onSelectActiveIntention(intent.id);
                          onEnterFocusMode();
                        }}
                        className="px-3.5 py-1 rounded-full border border-[#d4c2c4] text-[#633c44] text-xs font-semibold hover:bg-[#fef1f0] hover:border-[#feb2bb]"
                      >
                        بدء التركيز الآن
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* MODAL: CREATE NEW INTENTION */}
        {showNewIntentionModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
            <div className="w-full max-w-md p-6 rounded-3xl bg-white border border-[#d4c2c4] paper-card-shadow animate-in fade-in zoom-in-95 duration-200">
              <div className="flex items-center justify-between pb-4 mb-4 border-b border-[#d4c2c4]/40">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#884d55]" />
                  <h3 className="font-editorial text-xl text-[#633c44] font-semibold">
                    إضافة نية تركيز جديدة 🌸
                  </h3>
                </div>
                <button
                  onClick={() => setShowNewIntentionModal(false)}
                  className="text-[#827375] hover:text-[#201a1a] p-1"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleCreateIntention} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-[#633c44] mb-1.5">
                    عنوان الجلسة أو المذاكرة
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="مثال: قراءة ومذاكرة فصل دراسي بتركيز عميق"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#d4c2c4]/50 bg-white text-xs text-[#201a1a] focus:outline-none focus:ring-1 focus:ring-[#633c44]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-[#633c44] mb-1.5">
                      مجال الجلسة
                    </label>
                    <select
                      value={newCategory}
                      onChange={(e) => setNewCategory(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-[#d4c2c4]/50 bg-white text-xs text-[#201a1a] focus:outline-none focus:ring-1 focus:ring-[#633c44]"
                    >
                      <option value="دراسة وتعلّم عميق">دراسة وتعلّم عميق</option>
                      <option value="قراءة واعية وتأمل">قراءة واعية وتأمل</option>
                      <option value="كتابة وصياغة إبداعية">كتابة وصياغة إبداعية</option>
                      <option value="إنجاز مهام عملية">إنجاز مهام عملية</option>
                      <option value="تطوير الذات والبحث">تطوير الذات والبحث</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#633c44] mb-1.5">
                      المدة المستهدفة
                    </label>
                    <select
                      value={newMinutes}
                      onChange={(e) => setNewMinutes(Number(e.target.value))}
                      className="w-full px-3 py-2 rounded-xl border border-[#d4c2c4]/50 bg-white text-xs text-[#201a1a] focus:outline-none focus:ring-1 focus:ring-[#633c44]"
                    >
                      <option value={25}>25 دقيقة (هادئة وخفيفة)</option>
                      <option value={45}>45 دقيقة (متوازنة وعميقة)</option>
                      <option value={60}>60 دقيقة (تركيز مستفيض)</option>
                      <option value={90}>90 دقيقة (جلسة ملاذ متقدمة)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#633c44] mb-1.5">
                    الخطوات التابعة للجلسة (اختياري)
                  </label>
                  <div className="space-y-2">
                    <input
                      type="text"
                      placeholder="الخطوة الأولى (مثال: قراءة أول 15 صفحة)"
                      value={newSubtask1}
                      onChange={(e) => setNewSubtask1(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-[#d4c2c4]/50 bg-white text-xs text-[#201a1a] focus:outline-none focus:ring-1 focus:ring-[#633c44]"
                    />
                    <input
                      type="text"
                      placeholder="الخطوة الثانية (مثال: تلخيص النقاط الأساسية)"
                      value={newSubtask2}
                      onChange={(e) => setNewSubtask2(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-[#d4c2c4]/50 bg-white text-xs text-[#201a1a] focus:outline-none focus:ring-1 focus:ring-[#633c44]"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#d4c2c4]/30">
                  <button
                    type="button"
                    onClick={() => setShowNewIntentionModal(false)}
                    className="px-4 py-2 rounded-full border border-[#d4c2c4] text-[#827375] text-xs font-semibold hover:bg-[#f8ebeb]"
                  >
                    إلغاء
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 rounded-full bg-[#633c44] text-white text-xs font-semibold hover:bg-[#7d535b] shadow-sm"
                  >
                    حفظ وبدء الجلسة 🌸
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
