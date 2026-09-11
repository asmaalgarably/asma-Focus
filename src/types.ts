export interface SubTask {
  id: string;
  title: string;
  completed: boolean;
  isCurrent?: boolean;
}

export interface FleetingThought {
  id: string;
  text: string;
  createdAt: string;
  completed?: boolean;
}

export interface Intention {
  id: string;
  title: string;
  category: string;
  xpReward: number;
  plannedMinutes: number;
  completedMinutes: number;
  subTasks: SubTask[];
  status: 'active' | 'completed' | 'draft';
}

export interface SoundscapeTrack {
  id: string;
  name: string;
  icon: string;
  description: string;
  type: 'rain' | 'hearth' | 'meadow' | 'canopy' | 'waves';
}

export interface SessionHistoryItem {
  id: string;
  intentionTitle: string;
  durationMinutes: number;
  timestamp: string;
  xpEarned: number;
}

export interface WeeklyTask {
  id: string;
  title: string;
  completed: boolean;
  category: 'دراسة' | 'قراءة' | 'مراجعة' | 'واجبات' | 'شخصي' | 'عام';
  createdAt: string;
  completedAt?: string;
  targetDay?: 'السبت' | 'الأحد' | 'الاثنين' | 'الثلاثاء' | 'الأربعاء' | 'الخميس' | 'الجمعة';
}

export type DayOfWeek = 'السبت' | 'الأحد' | 'الاثنين' | 'الثلاثاء' | 'الأربعاء' | 'الخميس' | 'الجمعة';

export interface DayPlan {
  dayName: DayOfWeek;
  dateStr?: string;
  tasks: WeeklyTask[];
  dailyReflection?: string;
}

export interface WeekPlan {
  weekNumber: 1 | 2 | 3 | 4;
  title: string;
  subtitle: string;
  notes: string;
  tasks: WeeklyTask[];
  dailyPlans?: Record<DayOfWeek, WeeklyTask[]>;
}

export interface MonthPlan {
  id: string;
  monthName: string;
  weeks: WeekPlan[];
}

