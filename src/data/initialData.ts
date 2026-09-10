import { Intention, FleetingThought, SoundscapeTrack, MonthPlan } from '../types.ts';

export const INITIAL_INTENTION: Intention = {
  id: 'asmaa-primary-focus',
  title: 'جلسة تركيز ومذاكرة هادئة لأسماء 🌸',
  category: 'دراسة وتعلّم عميق',
  xpReward: 25,
  plannedMinutes: 25,
  completedMinutes: 0,
  status: 'active',
  subTasks: [],
};

export const INITIAL_FLEETING_THOUGHTS: FleetingThought[] = [];

export const SOUNDSCAPE_TRACKS: SoundscapeTrack[] = [
  {
    id: 'rain',
    name: 'مطر ناعم على الورق',
    icon: '🌧️',
    description: 'قطرات رقيقة على ورق مخملي',
    type: 'rain',
  },
  {
    id: 'hearth',
    name: 'دفء المدفأة الهادئة',
    icon: '🪵',
    description: 'جمرات هادئة تبث السكينة والاطمئنان',
    type: 'hearth',
  },
  {
    id: 'meadow',
    name: 'نسيم المروج العليل',
    icon: '🌾',
    description: 'هواء ربيعي خفيف وحفيف أزهار ناعم',
    type: 'meadow',
  },
  {
    id: 'canopy',
    name: 'ظلال الأشجار الوارفة',
    icon: '🍃',
    description: 'حفيف أوراق شجر وسكينة طبيعية',
    type: 'canopy',
  },
  {
    id: 'waves',
    name: 'أمواج بحر هادئة',
    icon: '🌊',
    description: 'مد وجزر إيقاعي يبعث على استرخاء الذهن',
    type: 'waves',
  },
];

export interface ArabicLifeReminder {
  id: number;
  quote: string;
  theme: string;
  practicalTip: string;
}

export const DAILY_ARABIC_LIFE_REMINDERS: ArabicLifeReminder[] = [
  {
    id: 1,
    quote: 'الحياة ليست سباقاً لمن يصل أولاً، بل رحلة لمن يعيش لحظاتها بسلام ورضا. خذي نفساً هادئاً يا أسماء، فأنتِ تسيرين بالخطوة الصحيحة.',
    theme: 'سكينة وطمأنينة',
    practicalTip: 'ركّزي على ما بين يديكِ في هذه اللحظة، وتجاهلي ضجيج ما مضى وما سيأتي.',
  },
  {
    id: 2,
    quote: 'تذكري دائماً أن هدوءكِ الداخلي هو أعظم قوة تملكينها في وجه زحام العالم. كل جهد صادق تبذلينه اليوم يزهر غداً بحول الله.',
    theme: 'قوة الهدوء',
    practicalTip: 'لا تقلقي من بطء التقدم؛ فالأشجار الراسخة تنمو بهدوء دون ضجة.',
  },
  {
    id: 3,
    quote: 'النجاح الحقيقي لا يقاس بعدد ما تنجزينه في يوم واحد، بل بنقاء نيتكِ واستمراركِ الهادئ وصنعكِ لأثر طيب في نفسكِ وحولكِ.',
    theme: 'بركة الاستمرار',
    practicalTip: 'إنجاز خطوة واحدة متقنة خيرٌ من عشرات الخطوات المتعجلة.',
  },
  {
    id: 4,
    quote: 'أحياناً تكون أعظم خطوة شجاعة وحكمة تقومين بها هي أن ترتاحي، وتثقي بأن السعي مبارك وأن كل شيء يأتي في أوانه الجميل.',
    theme: 'راحة البال',
    practicalTip: 'امنحي عقلكِ استراحة 5 دقائق لتنفس عميق عند الشعور بأي تعب.',
  },
  {
    id: 5,
    quote: 'لا تقلقي بشأن المستقبل؛ فكما رعاكِ الله في كل ما مضى، سيفتح لكِ أبواب التوفيق في كل ما هو آتٍ. ثقي برحلة عطائكِ.',
    theme: 'حسن الظن والتفاؤل',
    practicalTip: 'ابدئي جلستكِ بابتسامة وامتنان لأصغر النعم التي تحيط بكِ الآن.',
  },
  {
    id: 6,
    quote: 'الحياة أثمن من أن تمضي في التوتر؛ كل لحظة حضور تصنع فارقاً حقيقياً في وعيكِ ونضجكِ. أنتِ تبنين مستقبلكِ بحكمة.',
    theme: 'الحضور والوعي',
    practicalTip: 'اجعلي هاتفكِ بعيداً في هذه الجلسة، وعيشي متعة الاندماج الكامل.',
  },
  {
    id: 7,
    quote: 'كوني لطيفة ورفيقة بنفسكِ دائماً، وتذكري أن قيمتكِ الحقيقية تكمن في نقاء روحكِ ونبل مسعاكِ قبل كل أرقام الإنتاجية.',
    theme: 'الرفق بالذات',
    practicalTip: 'كافئي نفسكِ بكلمة طيبة أو فنجان شاي دافئ بعد إتمام هذه الجلسة.',
  },
  {
    id: 8,
    quote: 'الأيام تكتسب معناها من اللحظات الصادقة التي نعيشها بشغف وحب. دعي هذا اليوم شاهداً على صفائكِ واجتهادكِ المخلص.',
    theme: 'معنى الحياة',
    practicalTip: 'تذكري دائماً لماذا بدأتِ، ودعي الشغف يقود خطواتكِ اليومية.',
  },
];

export function getTodayArabicReminder(): ArabicLifeReminder {
  const now = new Date();
  const startOfYear = new Date(now.getFullYear(), 0, 0);
  const diff = now.getTime() - startOfYear.getTime();
  const dayOfYear = Math.floor(diff / (1000 * 60 * 60 * 24));
  const index = dayOfYear % DAILY_ARABIC_LIFE_REMINDERS.length;
  return DAILY_ARABIC_LIFE_REMINDERS[index];
}

export function getTimeGreeting(name = 'أسماء'): string {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 12) {
    return `صباح الخير والسكينة يا ${name} 🌸`;
  } else if (hour >= 12 && hour < 17) {
    return `طاب يومكِ الهادئ يا ${name} 🌸`;
  } else {
    return `مساء الخير والراحة يا ${name} 🌸`;
  }
}

export const INITIAL_MONTH_PLAN: MonthPlan = {
  id: 'month-current',
  monthName: 'مخطط الشهر الدراسي والأسابيع الأربعة 🗓️',
  weeks: [
    {
      weekNumber: 1,
      title: 'الأسبوع الأول',
      subtitle: 'البدايات والتأسيس والانطلاق 🌸',
      notes: '',
      tasks: [],
    },
    {
      weekNumber: 2,
      title: 'الأسبوع الثاني',
      subtitle: 'التعمق والتطبيق المستمر 🌿',
      notes: '',
      tasks: [],
    },
    {
      weekNumber: 3,
      title: 'الأسبوع الثالث',
      subtitle: 'إنجاز المهام الكبرى والبحوث ✨',
      notes: '',
      tasks: [],
    },
    {
      weekNumber: 4,
      title: 'الأسبوع الرابع',
      subtitle: 'الحصاد والمراجعة والاحتفاء 🌺',
      notes: '',
      tasks: [],
    },
  ],
};
