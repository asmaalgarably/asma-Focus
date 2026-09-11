import React, { useState } from 'react';
import {
  CheckCircle2,
  Circle,
  Plus,
  Trash2,
  Calendar,
  Sparkles,
  Award,
  BookOpen,
  Edit3,
  Flame,
  Check,
  RotateCcw,
  Sun,
  ListTodo,
  CalendarDays,
  Clock,
} from 'lucide-react';
import { MonthPlan, WeekPlan, WeeklyTask, DayOfWeek } from '../types.ts';

interface DailyTaskPlannerProps {
  monthPlan: MonthPlan;
  onUpdateMonthPlan: (updated: MonthPlan) => void;
  onResetMonthPlan?: () => void;
}

const DAYS_OF_WEEK: { key: DayOfWeek; label: string; icon: string }[] = [
  { key: 'السبت', label: 'السبت', icon: '🌸' },
  { key: 'الأحد', label: 'الأحد', icon: '🌿' },
  { key: 'الاثنين', label: 'الاثنين', icon: '✨' },
  { key: 'الثلاثاء', label: 'الثلاثاء', icon: '🌷' },
  { key: 'الأربعاء', label: 'الأربعاء', icon: '🍃' },
  { key: 'الخميس', label: 'الخميس', icon: '🌺' },
  { key: 'الجمعة', label: 'الجمعة', icon: '☕' },
];

export const DailyTaskPlanner: React.FC<DailyTaskPlannerProps> = ({
  monthPlan,
  onUpdateMonthPlan,
  onResetMonthPlan,
}) => {
  // Determine current day in Arabic
  const getTodayArabic = (): DayOfWeek => {
    const dayIndex = new Date().getDay(); // 0 is Sunday, 6 is Saturday
    const map: Record<number, DayOfWeek> = {
      6: 'السبت',
      0: 'الأحد',
      1: 'الاثنين',
      2: 'الثلاثاء',
      3: 'الأربعاء',
      4: 'الخميس',
      5: 'الجمعة',
    };
    return map[dayIndex] || 'السبت';
  };

  const [selectedWeekNum, setSelectedWeekNum] = useState<1 | 2 | 3 | 4>(1);
  const [selectedDay, setSelectedDay] = useState<DayOfWeek>(getTodayArabic());
  const [viewScope, setViewScope] = useState<'day' | 'week_all'>('day');
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskCategory, setNewTaskCategory] = useState<WeeklyTask['category']>('دراسة');
  const [filterMode, setFilterMode] = useState<'all' | 'pending' | 'completed'>('all');
  const [isEditingNotes, setIsEditingNotes] = useState(false);
  const [tempNotes, setTempNotes] = useState('');

  // Selected week object
  const currentWeek =
    monthPlan.weeks.find((w) => w.weekNumber === selectedWeekNum) || monthPlan.weeks[0];

  // Helper to get effective day for a task (defaults to current selected day if not set)
  const getTaskDay = (task: WeeklyTask): DayOfWeek => {
    return task.targetDay || 'السبت';
  };

  // Month-wide statistics
  const totalMonthTasks = monthPlan.weeks.reduce((acc, w) => acc + w.tasks.length, 0);
  const completedMonthTasks = monthPlan.weeks.reduce(
    (acc, w) => acc + w.tasks.filter((t) => t.completed).length,
    0
  );
  const monthPercentage =
    totalMonthTasks > 0 ? Math.round((completedMonthTasks / totalMonthTasks) * 100) : 0;

  // Selected Day specific statistics
  const dayTasks = currentWeek.tasks.filter((t) => getTaskDay(t) === selectedDay);
  const completedDayTasks = dayTasks.filter((t) => t.completed).length;
  const dayPercentage =
    dayTasks.length > 0 ? Math.round((completedDayTasks / dayTasks.length) * 100) : 0;

  // Week-specific statistics
  const totalWeekTasks = currentWeek.tasks.length;
  const completedWeekTasks = currentWeek.tasks.filter((t) => t.completed).length;
  const weekPercentage =
    totalWeekTasks > 0 ? Math.round((completedWeekTasks / totalWeekTasks) * 100) : 0;

  // Filtered tasks depending on day or all-week view
  const activeTaskPool = viewScope === 'day' ? dayTasks : currentWeek.tasks;
  const filteredTasks = activeTaskPool.filter((t) => {
    if (filterMode === 'pending') return !t.completed;
    if (filterMode === 'completed') return t.completed;
    return true;
  });

  // Handlers
  const handleToggleTask = (taskId: string) => {
    const updatedWeeks = monthPlan.weeks.map((week) => {
      if (week.weekNumber !== selectedWeekNum) return week;
      const updatedTasks = week.tasks.map((task) => {
        if (task.id !== taskId) return task;
        const nowCompleted = !task.completed;
        return {
          ...task,
          completed: nowCompleted,
          completedAt: nowCompleted
            ? new Date().toLocaleDateString('ar-EG', { weekday: 'short', month: 'short', day: 'numeric' })
            : undefined,
        };
      });
      return { ...week, tasks: updatedTasks };
    });
    onUpdateMonthPlan({ ...monthPlan, weeks: updatedWeeks });
  };

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;

    const newTask: WeeklyTask = {
      id: `task-${Date.now()}`,
      title: newTaskTitle.trim(),
      completed: false,
      category: newTaskCategory,
      createdAt: new Date().toLocaleDateString('ar-EG', { weekday: 'short' }),
      targetDay: selectedDay,
    };

    const updatedWeeks = monthPlan.weeks.map((week) => {
      if (week.weekNumber !== selectedWeekNum) return week;
      return { ...week, tasks: [...week.tasks, newTask] };
    });

    onUpdateMonthPlan({ ...monthPlan, weeks: updatedWeeks });
    setNewTaskTitle('');
  };

  const handleDeleteTask = (taskId: string) => {
    const updatedWeeks = monthPlan.weeks.map((week) => {
      if (week.weekNumber !== selectedWeekNum) return week;
      return { ...week, tasks: week.tasks.filter((t) => t.id !== taskId) };
    });
    onUpdateMonthPlan({ ...monthPlan, weeks: updatedWeeks });
  };

  const handleSaveNotes = () => {
    const updatedWeeks = monthPlan.weeks.map((week) => {
      if (week.weekNumber !== selectedWeekNum) return week;
      return { ...week, notes: tempNotes.trim() };
    });
    onUpdateMonthPlan({ ...monthPlan, weeks: updatedWeeks });
    setIsEditingNotes(false);
  };

  const categoryColors: Record<WeeklyTask['category'], string> = {
    دراسة: 'bg-[#fef1f0] text-[#884d55] border-[#fbcfe8]',
    قراءة: 'bg-[#f0fdf4] text-[#166534] border-[#bbf7d0]',
    مراجعة: 'bg-[#eff6ff] text-[#1e40af] border-[#bfdbfe]',
    واجبات: 'bg-[#fdf4ff] text-[#86198f] border-[#f5d0fe]',
    شخصي: 'bg-[#fffbeb] text-[#92400e] border-[#fde68a]',
    عام: 'bg-[#f3f4f6] text-[#374151] border-[#e5e7eb]',
  };

  return (
    <section id="daily-task-planner" className="w-full space-y-6">
      {/* Header Container */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 sm:p-7 rounded-3xl bg-white/85 border border-[#feb2bb]/50 paper-card-shadow backdrop-blur-sm relative overflow-hidden">
        <div className="space-y-1.5 z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#fef1f0] border border-[#d4c2c4]/40 text-[#693943] text-xs font-semibold tracking-wide">
            <Sun className="w-3.5 h-3.5 text-[#884d55]" />
            <span>مخطط المهام اليومي لأسماء 🌸</span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#633c44] text-white">ترتيب يومي</span>
          </div>
          <h2 className="font-editorial text-2xl sm:text-3xl text-[#633c44] font-medium tracking-tight">
            جدول مهام اليوم ({selectedDay}) 🌿
          </h2>
          <p className="text-xs text-[#504445] font-humanist">
            اكتبي مهامكِ ورتبيها حسب أيام الأسبوع (السبت إلى الجمعة) ليكون يومكِ واضحاً ومرتباً خطوة بخطوة.
          </p>
        </div>

        {/* Progress Bento for Today & Selected Week */}
        <div className="flex items-center gap-4 bg-[#fff8f8] p-3.5 sm:p-4 rounded-2xl border border-[#d4c2c4]/40 shrink-0 z-10">
          <div className="text-right">
            <span className="text-[11px] font-semibold text-[#827375] block">
              إنجاز يوم {selectedDay}
            </span>
            <div className="flex items-baseline gap-1.5">
              <span className="font-editorial text-2xl font-bold text-[#633c44]">{completedDayTasks}</span>
              <span className="text-xs text-[#827375]">من {dayTasks.length} مهام</span>
            </div>
            <div className="w-28 sm:w-36 h-2 bg-[#ece0df] rounded-full overflow-hidden mt-1.5">
              <div
                className="h-full bg-gradient-to-l from-[#633c44] to-[#c7828d] transition-all duration-500 rounded-full"
                style={{ width: `${dayPercentage}%` }}
              />
            </div>
          </div>
          <div className="w-12 h-12 rounded-full bg-[#fef1f0] border border-[#feb2bb]/60 flex items-center justify-center text-[#633c44] font-bold text-sm font-editorial">
            {dayPercentage}٪
          </div>
        </div>
      </div>

      {/* 7-DAYS OF THE WEEK SELECTOR (السبت، الأحد، الاثنين، الثلاثاء، الأربعاء، الخميس، الجمعة) */}
      <div className="p-4 sm:p-5 rounded-3xl bg-white/90 border border-[#feb2bb]/40 paper-card-shadow">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-3 pb-2 border-b border-[#d4c2c4]/30">
          <div className="flex items-center gap-2">
            <CalendarDays className="w-4 h-4 text-[#884d55]" />
            <h3 className="text-xs sm:text-sm font-bold text-[#633c44]">
              اختاري اليوم لعرض وكتابة مهامه:
            </h3>
          </div>

          <div className="flex items-center gap-2">
            {/* View Scope Toggle: Today vs All Week */}
            <div className="inline-flex p-1 rounded-xl bg-[#fef1f0] border border-[#d4c2c4]/40 text-xs">
              <button
                onClick={() => setViewScope('day')}
                className={`px-3 py-1 rounded-lg font-semibold transition-all ${
                  viewScope === 'day'
                    ? 'bg-[#633c44] text-white shadow-xs'
                    : 'text-[#633c44] hover:bg-white/60'
                }`}
              >
                مهام اليوم المختار
              </button>
              <button
                onClick={() => setViewScope('week_all')}
                className={`px-3 py-1 rounded-lg font-semibold transition-all ${
                  viewScope === 'week_all'
                    ? 'bg-[#633c44] text-white shadow-xs'
                    : 'text-[#633c44] hover:bg-white/60'
                }`}
              >
                كل مهام الأسبوع ({totalWeekTasks})
              </button>
            </div>

            {/* Week Selector Dropdown / Pill */}
            <div className="flex items-center gap-1 text-xs">
              <span className="text-[11px] text-[#827375] font-semibold">الأسبوع:</span>
              {([1, 2, 3, 4] as const).map((wNum) => (
                <button
                  key={wNum}
                  onClick={() => setSelectedWeekNum(wNum)}
                  className={`w-6 h-6 rounded-lg text-xs font-bold transition-colors ${
                    selectedWeekNum === wNum
                      ? 'bg-[#633c44] text-white'
                      : 'bg-[#fef1f0] text-[#884d55] hover:bg-[#ffd9dc]'
                  }`}
                  title={`الأسبوع ${wNum}`}
                >
                  {wNum}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* The 7 Day Buttons */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2.5">
          {DAYS_OF_WEEK.map(({ key, label, icon }) => {
            const isSelected = selectedDay === key && viewScope === 'day';
            const thisDayTasks = currentWeek.tasks.filter((t) => getTaskDay(t) === key);
            const thisDayDone = thisDayTasks.filter((t) => t.completed).length;
            const isToday = key === getTodayArabic();

            return (
              <button
                key={key}
                onClick={() => {
                  setSelectedDay(key);
                  setViewScope('day');
                }}
                className={`text-right p-3 rounded-2xl border transition-all duration-200 flex flex-col justify-between ${
                  isSelected
                    ? 'bg-[#633c44] text-white border-[#633c44] shadow-md ring-2 ring-[#feb2bb]/60 scale-[1.02]'
                    : 'bg-[#fef1f0]/60 border-[#d4c2c4]/40 hover:bg-white text-[#633c44] hover:border-[#feb2bb]'
                }`}
              >
                <div className="flex items-center justify-between w-full mb-1">
                  <span className="text-sm">{icon}</span>
                  {isToday && (
                    <span
                      className={`text-[9px] font-bold px-1.5 py-0.2 rounded-full ${
                        isSelected ? 'bg-white/20 text-white' : 'bg-[#633c44] text-white'
                      }`}
                    >
                      اليوم
                    </span>
                  )}
                </div>

                <div className="text-right">
                  <span className={`text-xs font-bold block ${isSelected ? 'text-white' : 'text-[#633c44]'}`}>
                    {label}
                  </span>
                  <span
                    className={`text-[10px] block mt-0.5 ${
                      isSelected ? 'text-white/80' : 'text-[#827375]'
                    }`}
                  >
                    {thisDayDone}/{thisDayTasks.length} مكتمل
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Content Area: Selected Day To-Do List + Accomplishments */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: The Daily To-Do List Tasks */}
        <div className="lg:col-span-2 p-6 sm:p-7 rounded-3xl bg-white/85 border border-[#d4c2c4]/50 paper-card-shadow space-y-5">
          {/* Day Info Banner */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#d4c2c4]/30">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-editorial text-2xl text-[#633c44] font-semibold">
                  {viewScope === 'day' ? `مهام يوم ${selectedDay} 🌸` : `جميع مهام الأسبوع ${selectedWeekNum} 🌸`}
                </h3>
                <span className="text-xs font-humanist text-[#884d55] bg-[#fef1f0] px-2.5 py-0.5 rounded-full border border-[#d4c2c4]/30">
                  {viewScope === 'day' ? `الأسبوع ${selectedWeekNum} • ${currentWeek.title}` : 'عرض شامل'}
                </span>
              </div>
              <p className="text-xs text-[#504445] mt-1 font-humanist">
                {viewScope === 'day'
                  ? `أضيفي مهامكِ المحددة ليوم ${selectedDay} وأنجزيها برفق وتركيز.`
                  : 'عرض كل المهام الموزعة على أيام هذا الأسبوع.'}
              </p>
            </div>

            {/* Filter Buttons */}
            <div className="flex items-center gap-1.5 p-1 rounded-xl bg-[#fef1f0]/70 border border-[#d4c2c4]/30 self-start sm:self-auto">
              <button
                onClick={() => setFilterMode('all')}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                  filterMode === 'all'
                    ? 'bg-[#633c44] text-white shadow-xs'
                    : 'text-[#633c44] hover:bg-white/80'
                }`}
              >
                الكل ({activeTaskPool.length})
              </button>
              <button
                onClick={() => setFilterMode('pending')}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                  filterMode === 'pending'
                    ? 'bg-[#633c44] text-white shadow-xs'
                    : 'text-[#633c44] hover:bg-white/80'
                }`}
              >
                المتبقية ({activeTaskPool.filter((t) => !t.completed).length})
              </button>
              <button
                onClick={() => setFilterMode('completed')}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                  filterMode === 'completed'
                    ? 'bg-[#633c44] text-white shadow-xs'
                    : 'text-[#633c44] hover:bg-white/80'
                }`}
              >
                المكتملة ({activeTaskPool.filter((t) => t.completed).length})
              </button>
            </div>
          </div>

          {/* Add New Task Form specifically for the selected day */}
          <form onSubmit={handleAddTask} className="p-4 rounded-2xl bg-[#fff8f8] border border-[#feb2bb]/40 space-y-3">
            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="text"
                value={newTaskTitle}
                onChange={(e) => setNewTaskTitle(e.target.value)}
                placeholder={`أضيفي مهمة جديدة ليوم ${selectedDay} (مثال: قراءة درس أو مراجعة ملخص)...`}
                className="flex-1 px-4 py-2.5 rounded-xl border border-[#d4c2c4]/60 bg-white text-xs text-[#201a1a] placeholder:text-[#827375] focus:outline-none focus:ring-1 focus:ring-[#633c44]"
              />
              <button
                type="submit"
                className="inline-flex items-center justify-center gap-1.5 px-5 py-2.5 rounded-xl bg-[#633c44] text-white text-xs font-semibold hover:bg-[#7d535b] transition-all shadow-xs active:scale-98 shrink-0"
              >
                <Plus className="w-4 h-4" />
                <span>إضافة ليوم {selectedDay}</span>
              </button>
            </div>

            {/* Category selection */}
            <div className="flex items-center gap-2 flex-wrap text-xs">
              <span className="text-[#827375] text-[11px] font-semibold">تصنيف المهمة:</span>
              {(['دراسة', 'قراءة', 'مراجعة', 'واجبات', 'شخصي', 'عام'] as const).map((cat) => (
                <button
                  type="button"
                  key={cat}
                  onClick={() => setNewTaskCategory(cat)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-colors border ${
                    newTaskCategory === cat
                      ? 'bg-[#633c44] text-white border-[#633c44]'
                      : 'bg-white text-[#633c44] border-[#d4c2c4]/50 hover:bg-[#fef1f0]'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </form>

          {/* Tasks List */}
          <div className="space-y-2.5">
            {filteredTasks.length === 0 ? (
              <div className="p-8 text-center rounded-2xl bg-[#fff8f8]/60 border border-dashed border-[#d4c2c4]/60">
                <Sparkles className="w-8 h-8 mx-auto text-[#eeb9c2] mb-2" />
                <p className="text-xs text-[#827375] font-humanist">
                  {filterMode === 'completed'
                    ? `لم يتم إتمام مهام بعد في يوم ${selectedDay}.. خطوة واحدة تكفي للبدء 🌸`
                    : `لا توجد مهام مسجلة ليوم ${selectedDay} حالياً.. أضيفي مهمة يومية للبدء بكل سكينة!`}
                </p>
              </div>
            ) : (
              filteredTasks.map((task) => (
                <div
                  key={task.id}
                  className={`group flex items-center justify-between p-3.5 rounded-2xl border transition-all duration-200 ${
                    task.completed
                      ? 'bg-[#fbf7f7] border-[#d4c2c4]/30 text-[#827375]'
                      : 'bg-white border-[#d4c2c4]/50 hover:border-[#feb2bb] shadow-xs'
                  }`}
                >
                  <div className="flex items-center gap-3 flex-1">
                    <button
                      onClick={() => handleToggleTask(task.id)}
                      className="text-[#633c44] hover:text-[#884d55] transition-colors p-0.5"
                    >
                      {task.completed ? (
                        <CheckCircle2 className="w-5 h-5 text-[#633c44] fill-[#ffd9dc]" />
                      ) : (
                        <Circle className="w-5 h-5 text-[#d4c2c4] hover:text-[#884d55]" />
                      )}
                    </button>
                    <div className="flex flex-col">
                      <span
                        className={`text-xs sm:text-sm font-medium transition-all ${
                          task.completed
                            ? 'line-through text-[#827375]/80'
                            : 'text-[#201a1a]'
                        }`}
                      >
                        {task.title}
                      </span>
                      <div className="flex items-center gap-2 mt-1">
                        <span
                          className={`text-[10px] px-2 py-0.5 rounded-md border font-semibold ${
                            categoryColors[task.category]
                          }`}
                        >
                          {task.category}
                        </span>
                        {viewScope === 'week_all' && (
                          <span className="text-[10px] font-bold text-[#633c44] bg-[#fef1f0] px-2 py-0.5 rounded-md border border-[#feb2bb]/30">
                            يوم {getTaskDay(task)}
                          </span>
                        )}
                        {task.completedAt && (
                          <span className="text-[10px] text-[#166534] bg-[#f0fdf4] px-2 py-0.5 rounded-md border border-[#bbf7d0]">
                            ✓ {task.completedAt}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => handleDeleteTask(task.id)}
                    className="opacity-0 group-hover:opacity-100 text-[#827375] hover:text-[#ba1a1a] p-1.5 rounded-lg hover:bg-[#f8ebeb] transition-all"
                    title="حذف المهمة"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right 1 Col: "شو سويت باليوم" (Accomplishments) & Daily Notes */}
        <div className="space-y-6">
          {/* Accomplishments Card */}
          <div className="p-6 rounded-3xl bg-white/85 border border-[#feb2bb]/50 paper-card-shadow space-y-4">
            <div className="flex items-center gap-2">
              <Award className="w-4 h-4 text-[#884d55]" />
              <h4 className="font-editorial text-xl text-[#633c44] font-semibold">
                شو سويت في يوم {selectedDay}؟ ✨
              </h4>
            </div>
            <p className="text-xs text-[#504445] font-humanist">
              سجل فوري لما أنجزته يا أسماء خلال يوم {selectedDay}.
            </p>

            {/* List of completed items for the selected day */}
            <div className="space-y-2 max-h-56 overflow-y-auto pl-1">
              {dayTasks.filter((t) => t.completed).length === 0 ? (
                <div className="p-4 rounded-xl bg-[#fff8f8] text-center border border-dashed border-[#d4c2c4]/50">
                  <p className="text-xs text-[#827375] italic">
                    لم تحددي مهاماً مكتملة بعد ليوم {selectedDay}.. كل خطوة صغيرة تسجل هنا لتري أثر جهدكِ 🌸
                  </p>
                </div>
              ) : (
                dayTasks
                  .filter((t) => t.completed)
                  .map((task) => (
                    <div
                      key={task.id}
                      className="flex items-start gap-2 p-2.5 rounded-xl bg-[#fef1f0]/60 border border-[#feb2bb]/30 text-xs text-[#633c44]"
                    >
                      <Check className="w-3.5 h-3.5 text-[#633c44] mt-0.5 shrink-0" />
                      <div className="flex-1">
                        <span className="font-medium block leading-snug">{task.title}</span>
                        <span className="text-[10px] text-[#827375]">{task.category} • تم بنجاح</span>
                      </div>
                    </div>
                  ))
              )}
            </div>
          </div>

          {/* Daily / Weekly Reflection & Notes Card */}
          <div className="p-6 rounded-3xl bg-white/85 border border-[#d4c2c4]/50 paper-card-shadow space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Edit3 className="w-4 h-4 text-[#884d55]" />
                <h4 className="font-editorial text-lg text-[#633c44] font-semibold">
                  ملاحظاتي وتلخيص يوم {selectedDay} 📝
                </h4>
              </div>
              {!isEditingNotes ? (
                <button
                  onClick={() => {
                    setTempNotes(currentWeek.notes || '');
                    setIsEditingNotes(true);
                  }}
                  className="text-xs text-[#884d55] hover:text-[#633c44] font-semibold underline"
                >
                  تعديل
                </button>
              ) : (
                <button
                  onClick={handleSaveNotes}
                  className="text-xs px-2.5 py-1 rounded-md bg-[#633c44] text-white font-semibold hover:bg-[#7d535b]"
                >
                  حفظ
                </button>
              )}
            </div>

            {isEditingNotes ? (
              <textarea
                value={tempNotes}
                onChange={(e) => setTempNotes(e.target.value)}
                placeholder={`اكتبي ملخصاً عما قمتِ به في يوم ${selectedDay}، ماذا تعلمتِ، وشعوركِ بعد الإنجاز...`}
                rows={4}
                className="w-full p-3 rounded-xl border border-[#d4c2c4]/60 text-xs text-[#201a1a] focus:outline-none focus:ring-1 focus:ring-[#633c44] resize-none"
              />
            ) : (
              <div className="p-3 rounded-xl bg-[#fff8f8] border border-[#d4c2c4]/30 text-xs text-[#504445] leading-relaxed font-humanist min-h-[75px]">
                {currentWeek.notes ? (
                  <p>{currentWeek.notes}</p>
                ) : (
                  <p className="text-[#827375] italic">
                    لا توجد ملاحظات مسجلة بعد. انقري على "تعديل" لتدوين أي فكرة أو شعور عن إنجازكِ اليومي.
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
