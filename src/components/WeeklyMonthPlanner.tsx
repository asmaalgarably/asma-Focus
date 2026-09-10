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
} from 'lucide-react';
import { MonthPlan, WeekPlan, WeeklyTask } from '../types.ts';

interface WeeklyMonthPlannerProps {
  monthPlan: MonthPlan;
  onUpdateMonthPlan: (updated: MonthPlan) => void;
  onResetMonthPlan?: () => void;
}

export const WeeklyMonthPlanner: React.FC<WeeklyMonthPlannerProps> = ({
  monthPlan,
  onUpdateMonthPlan,
  onResetMonthPlan,
}) => {
  const [selectedWeekNum, setSelectedWeekNum] = useState<1 | 2 | 3 | 4>(1);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskCategory, setNewTaskCategory] = useState<WeeklyTask['category']>('دراسة');
  const [filterMode, setFilterMode] = useState<'all' | 'pending' | 'completed'>('all');
  const [isEditingNotes, setIsEditingNotes] = useState(false);
  const [tempNotes, setTempNotes] = useState('');

  // Selected week object
  const currentWeek =
    monthPlan.weeks.find((w) => w.weekNumber === selectedWeekNum) || monthPlan.weeks[0];

  // Month-wide statistics
  const totalMonthTasks = monthPlan.weeks.reduce((acc, w) => acc + w.tasks.length, 0);
  const completedMonthTasks = monthPlan.weeks.reduce(
    (acc, w) => acc + w.tasks.filter((t) => t.completed).length,
    0
  );
  const monthPercentage =
    totalMonthTasks > 0 ? Math.round((completedMonthTasks / totalMonthTasks) * 100) : 0;

  // Week-specific statistics
  const totalWeekTasks = currentWeek.tasks.length;
  const completedWeekTasks = currentWeek.tasks.filter((t) => t.completed).length;
  const weekPercentage =
    totalWeekTasks > 0 ? Math.round((completedWeekTasks / totalWeekTasks) * 100) : 0;

  // Filtered tasks
  const filteredTasks = currentWeek.tasks.filter((t) => {
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
      id: `w-task-${Date.now()}`,
      title: newTaskTitle.trim(),
      completed: false,
      category: newTaskCategory,
      createdAt: new Date().toLocaleDateString('ar-EG', { weekday: 'short' }),
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
    <section id="weekly-month-planner" className="w-full space-y-6">
      {/* Header Container */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 sm:p-7 rounded-3xl bg-white/85 border border-[#feb2bb]/50 paper-card-shadow backdrop-blur-sm relative overflow-hidden">
        <div className="space-y-1.5 z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#fef1f0] border border-[#d4c2c4]/40 text-[#693943] text-xs font-semibold tracking-wide">
            <Calendar className="w-3.5 h-3.5 text-[#884d55]" />
            <span>مخطط الشهر والأسابيع الأربعة لأسماء 🗓️</span>
          </div>
          <h2 className="font-editorial text-2xl sm:text-3xl text-[#633c44] font-medium tracking-tight">
            جدول المهام والإنجازات الأسبوعية
          </h2>
          <p className="text-xs text-[#504445] font-humanist">
            قسّمي الشهر إلى أربعة أسابيع، وتابعي ما تم إنجازه (شو سويتِ فيهم) خطوة بخطوة بكل وضوح وسكينة 🌸
          </p>
        </div>

        {/* Overall Month Progress Bento */}
        <div className="flex items-center gap-4 bg-[#fff8f8] p-3.5 sm:p-4 rounded-2xl border border-[#d4c2c4]/40 shrink-0 z-10">
          <div className="text-right">
            <span className="text-[11px] font-semibold text-[#827375] block">إنجاز الشهر الإجمالي</span>
            <div className="flex items-baseline gap-1.5">
              <span className="font-editorial text-2xl font-bold text-[#633c44]">{completedMonthTasks}</span>
              <span className="text-xs text-[#827375]">من {totalMonthTasks} مهمة</span>
            </div>
            <div className="w-28 sm:w-36 h-2 bg-[#ece0df] rounded-full overflow-hidden mt-1.5">
              <div
                className="h-full bg-gradient-to-l from-[#633c44] to-[#c7828d] transition-all duration-500 rounded-full"
                style={{ width: `${monthPercentage}%` }}
              />
            </div>
          </div>
          <div className="w-12 h-12 rounded-full bg-[#fef1f0] border border-[#feb2bb]/60 flex items-center justify-center text-[#633c44] font-bold text-sm font-editorial">
            {monthPercentage}٪
          </div>
        </div>
      </div>

      {/* 4-Week Selection Tabs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {monthPlan.weeks.map((week) => {
          const isSelected = week.weekNumber === selectedWeekNum;
          const weekTotal = week.tasks.length;
          const weekDone = week.tasks.filter((t) => t.completed).length;
          const weekPct = weekTotal > 0 ? Math.round((weekDone / weekTotal) * 100) : 0;

          return (
            <button
              key={week.weekNumber}
              onClick={() => {
                setSelectedWeekNum(week.weekNumber);
                setIsEditingNotes(false);
              }}
              className={`text-right p-4 sm:p-5 rounded-2xl border transition-all duration-200 relative overflow-hidden flex flex-col justify-between ${
                isSelected
                  ? 'bg-white border-[#eeb9c2] paper-card-float ring-2 ring-[#feb2bb]/50'
                  : 'bg-white/70 border-[#d4c2c4]/40 hover:bg-white hover:border-[#feb2bb]/60'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span
                    className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
                      isSelected
                        ? 'bg-[#633c44] text-white'
                        : 'bg-[#fef1f0] text-[#884d55]'
                    }`}
                  >
                    {week.title}
                  </span>
                  <span className="text-xs font-semibold text-[#827375]">
                    {weekDone}/{weekTotal}
                  </span>
                </div>
                <h4 className="text-xs sm:text-sm font-semibold text-[#633c44] line-clamp-1 mb-1">
                  {week.subtitle}
                </h4>
              </div>

              {/* Progress mini-bar */}
              <div className="mt-3 w-full">
                <div className="flex items-center justify-between text-[10px] text-[#827375] mb-1 font-humanist">
                  <span>نسبة الإنجاز</span>
                  <span className="font-semibold text-[#633c44]">{weekPct}٪</span>
                </div>
                <div className="w-full h-1.5 bg-[#ece0df] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-l from-[#633c44] to-[#f472b6] rounded-full transition-all duration-300"
                    style={{ width: `${weekPct}%` }}
                  />
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Main Content Area: Selected Week To-Do List + "شو سويت فيهم" Accomplishments */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: The Weekly To-Do List Tasks */}
        <div className="lg:col-span-2 p-6 sm:p-7 rounded-3xl bg-white/85 border border-[#d4c2c4]/50 paper-card-shadow space-y-5">
          {/* Week Info Banner */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#d4c2c4]/30">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-editorial text-2xl text-[#633c44] font-semibold">
                  مهام {currentWeek.title} 🌸
                </h3>
                <span className="text-xs font-humanist text-[#884d55] bg-[#fef1f0] px-2.5 py-0.5 rounded-full border border-[#d4c2c4]/30">
                  {currentWeek.subtitle}
                </span>
              </div>
              <p className="text-xs text-[#504445] mt-1 font-humanist">
                أضيفي مهامكِ الخاصة بهذا الأسبوع وقومي بتحديدها عند الإنجاز ليبقى ذهنكِ منظماً.
              </p>
            </div>

            {/* Filter Buttons */}
            <div className="flex items-center gap-1.5 p-1 rounded-xl bg-[#fef1f0]/70 border border-[#d4c2c4]/30 self-start sm:self-auto">
              <button
                onClick={() => setFilterMode('all')}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                  filterMode === 'all'
                    ? 'bg-white text-[#633c44] shadow-xs'
                    : 'text-[#827375] hover:text-[#633c44]'
                }`}
              >
                الكل ({currentWeek.tasks.length})
              </button>
              <button
                onClick={() => setFilterMode('pending')}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                  filterMode === 'pending'
                    ? 'bg-white text-[#633c44] shadow-xs'
                    : 'text-[#827375] hover:text-[#633c44]'
                }`}
              >
                المتبقية ({totalWeekTasks - completedWeekTasks})
              </button>
              <button
                onClick={() => setFilterMode('completed')}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                  filterMode === 'completed'
                    ? 'bg-white text-[#633c44] shadow-xs'
                    : 'text-[#827375] hover:text-[#633c44]'
                }`}
              >
                المكتملة ({completedWeekTasks})
              </button>
            </div>
          </div>

          {/* New Task Form */}
          <form onSubmit={handleAddTask} className="p-3.5 rounded-2xl bg-[#fff8f8] border border-[#feb2bb]/40 space-y-3">
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={newTaskTitle}
                onChange={(e) => setNewTaskTitle(e.target.value)}
                placeholder="أضيفي مهمة جديدة لهذا الأسبوع (مثال: تلخيص الفصل الثالث، حل واجب الإحصاء...)"
                className="flex-1 px-4 py-2.5 rounded-xl border border-[#d4c2c4]/60 bg-white text-xs text-[#201a1a] placeholder:text-[#827375] focus:outline-none focus:ring-1 focus:ring-[#633c44]"
              />
              <button
                type="submit"
                className="px-4 py-2.5 rounded-xl bg-[#633c44] text-white text-xs font-semibold hover:bg-[#7d535b] transition-all shadow-xs flex items-center gap-1.5 shrink-0"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>إضافة مهمة</span>
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
                    ? 'لم يتم إتمام مهام بعد في هذا التصنيف.. خطوة واحدة تكفي للبدء 🌸'
                    : 'لا توجد مهام متبقية حالياً.. أضيفي مهمة جديدة للبدء بكل سكينة!'}
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

        {/* Right 1 Col: "شو سويت فيهم" (What I did this week) Accomplishments & Reflection */}
        <div className="space-y-6">
          {/* Accomplishments Card */}
          <div className="p-6 rounded-3xl bg-white/85 border border-[#feb2bb]/50 paper-card-shadow space-y-4">
            <div className="flex items-center gap-2">
              <Award className="w-4 h-4 text-[#884d55]" />
              <h4 className="font-editorial text-xl text-[#633c44] font-semibold">
                شو سويت في هذا الأسبوع؟ ✨
              </h4>
            </div>
            <p className="text-xs text-[#504445] font-humanist">
              سجل فوري لما أنجزته يا أسماء خلال {currentWeek.title}.
            </p>

            {/* List of completed items */}
            <div className="space-y-2 max-h-56 overflow-y-auto pl-1">
              {currentWeek.tasks.filter((t) => t.completed).length === 0 ? (
                <div className="p-4 rounded-xl bg-[#fff8f8] text-center border border-dashed border-[#d4c2c4]/50">
                  <p className="text-xs text-[#827375] italic">
                    لم تحددي مهاماً مكتملة بعد.. كل خطوة صغيرة تسجل هنا لتري أثر جهدكِ 🌸
                  </p>
                </div>
              ) : (
                currentWeek.tasks
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

          {/* Weekly Reflection & Notes Card */}
          <div className="p-6 rounded-3xl bg-white/85 border border-[#d4c2c4]/50 paper-card-shadow space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Edit3 className="w-4 h-4 text-[#884d55]" />
                <h4 className="font-editorial text-lg text-[#633c44] font-semibold">
                  ملاحظاتي وتلخيص الأسبوع 📝
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
                placeholder="اكتبي ملخصاً عما قمتِ به، ماذا تعلمتِ، وشعوركِ في نهاية هذا الأسبوع..."
                rows={4}
                className="w-full p-3 rounded-xl border border-[#d4c2c4]/60 text-xs text-[#201a1a] focus:outline-none focus:ring-1 focus:ring-[#633c44] resize-none"
              />
            ) : (
              <div className="p-3 rounded-xl bg-[#fff8f8] border border-[#d4c2c4]/30 text-xs text-[#504445] leading-relaxed font-humanist min-h-[75px]">
                {currentWeek.notes ? (
                  <p>{currentWeek.notes}</p>
                ) : (
                  <p className="text-[#827375] italic">
                    لا توجد ملاحظات مسجلة بعد لهذا الأسبوع. انقري على "تعديل" لكتابة ملخص إنجازاتكِ.
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
