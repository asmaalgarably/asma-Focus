import React, { useState, useEffect } from 'react';
import { 
  Download, 
  Copy, 
  Check, 
  ArrowLeft, 
  Layers, 
  Cpu, 
  Workflow, 
  Calendar, 
  Briefcase, 
  TrendingUp, 
  ShieldCheck, 
  Database, 
  Terminal, 
  GitBranch, 
  Sparkles,
  ExternalLink,
  BookOpen
} from 'lucide-react';

interface Props {
  onBack: () => void;
}

export function ProductionRoadmapViewer({ onBack }: Props) {
  const [activeTab, setActiveTab] = useState<'overview' | 'pillars' | 'agents' | 'curriculum' | 'courses' | 'projects' | 'career'>('courses');
  const [copied, setCopied] = useState(false);
  
  // Track completed curriculum weeks in localStorage
  const [completedWeeks, setCompletedWeeks] = useState<number[]>(() => {
    try {
      const saved = localStorage.getItem('asmaa_rag_roadmap_progress');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('asmaa_rag_roadmap_progress', JSON.stringify(completedWeeks));
    } catch {
      // ignore
    }
  }, [completedWeeks]);

  const toggleWeek = (weekNum: number) => {
    setCompletedWeeks(prev => 
      prev.includes(weekNum) ? prev.filter(w => w !== weekNum) : [...prev, weekNum]
    );
  };

  const handleDownloadFile = () => {
    // Fetch or generate markdown blob
    const element = document.createElement('a');
    const file = new Blob([MARKDOWN_CONTENT], { type: 'text/markdown;charset=utf-8' });
    element.href = URL.createObjectURL(file);
    element.download = 'PRODUCTION_RAG_AUTOMATION_ROADMAP.md';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(MARKDOWN_CONTENT);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="min-h-screen bg-[#0d1117] text-[#e6edf3] font-sans selection:bg-rose-500/30 selection:text-rose-200">
      {/* Top sticky navigation bar */}
      <header className="sticky top-0 z-40 bg-[#161b22]/95 backdrop-blur-md border-b border-[#30363d] px-4 lg:px-8 py-3.5">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={onBack}
              className="p-2 rounded-lg bg-[#21262d] hover:bg-[#30363d] text-[#c9d1d9] hover:text-white transition-colors flex items-center gap-1.5 text-sm font-medium"
              title="الرجوع إلى الملاذ"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>العودة للملاذ</span>
            </button>
            <div className="h-5 w-px bg-[#30363d] hidden sm:block" />
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30">
                  خريجة علم حاسوب (94%)
                </span>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 hidden md:inline-block">
                  مسار Production-Grade
                </span>
              </div>
              <h1 className="text-base sm:text-lg font-bold text-white tracking-tight mt-0.5">
                دليل وخارطة هندسة RAG والأتمتة الذكية للإنتاج
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#21262d] hover:bg-[#30363d] text-xs font-medium text-[#c9d1d9] border border-[#30363d] transition-colors"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'تم نسخ الملف كامل!' : 'نسخ الخطة (Markdown)'}</span>
            </button>

            <button
              onClick={handleDownloadFile}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-500 hover:to-rose-600 text-white text-xs font-semibold shadow-sm transition-all"
            >
              <Download className="w-3.5 h-3.5" />
              <span>تحميل كملف .md</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 lg:px-8 py-8">
        {/* Navigation Tabs */}
        <nav aria-label="أقسام الخطة" className="flex items-center gap-2 overflow-x-auto pb-4 border-b border-[#30363d] mb-8 text-sm scrollbar-none">
          <button
            onClick={() => setActiveTab('overview')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-colors ${
              activeTab === 'overview'
                ? 'bg-rose-500/15 text-rose-300 border border-rose-500/30'
                : 'text-[#8b949e] hover:text-[#c9d1d9] hover:bg-[#21262d]'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>المعمارية ومقارنة الإنتاج</span>
          </button>

          <button
            onClick={() => setActiveTab('pillars')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-colors ${
              activeTab === 'pillars'
                ? 'bg-rose-500/15 text-rose-300 border border-rose-500/30'
                : 'text-[#8b949e] hover:text-[#c9d1d9] hover:bg-[#21262d]'
            }`}
          >
            <Cpu className="w-4 h-4" />
            <span>ركائز RAG المتقدمة (الكود والتقنيات)</span>
          </button>

          <button
            onClick={() => setActiveTab('agents')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-colors ${
              activeTab === 'agents'
                ? 'bg-rose-500/15 text-rose-300 border border-rose-500/30'
                : 'text-[#8b949e] hover:text-[#c9d1d9] hover:bg-[#21262d]'
            }`}
          >
            <Workflow className="w-4 h-4" />
            <span>الوكلاء والأتمتة (LangGraph & n8n)</span>
          </button>

          <button
            onClick={() => setActiveTab('curriculum')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-colors ${
              activeTab === 'curriculum'
                ? 'bg-rose-500/15 text-rose-300 border border-rose-500/30'
                : 'text-[#8b949e] hover:text-[#c9d1d9] hover:bg-[#21262d]'
            }`}
          >
            <Calendar className="w-4 h-4" />
            <span>الخطة التنفيذية 8 أسابيع ({completedWeeks.length}/8)</span>
          </button>

          <button
            onClick={() => setActiveTab('courses')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-colors ${
              activeTab === 'courses'
                ? 'bg-rose-500/15 text-rose-300 border border-rose-500/30 ring-1 ring-rose-500/50'
                : 'text-[#8b949e] hover:text-[#c9d1d9] hover:bg-[#21262d]'
            }`}
          >
            <BookOpen className="w-4 h-4 text-amber-400" />
            <span>الكورسات والمصادر المعتمدة للإنتاج</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">جديد</span>
          </button>

          <button
            onClick={() => setActiveTab('projects')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-colors ${
              activeTab === 'projects'
                ? 'bg-rose-500/15 text-rose-300 border border-rose-500/30'
                : 'text-[#8b949e] hover:text-[#c9d1d9] hover:bg-[#21262d]'
            }`}
          >
            <Briefcase className="w-4 h-4" />
            <span>مشاريع البورتفوليو الثلاثة</span>
          </button>

          <button
            onClick={() => setActiveTab('career')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-colors ${
              activeTab === 'career'
                ? 'bg-rose-500/15 text-rose-300 border border-rose-500/30'
                : 'text-[#8b949e] hover:text-[#c9d1d9] hover:bg-[#21262d]'
            }`}
          >
            <TrendingUp className="w-4 h-4" />
            <span>اقتناص الوظائف والعمل الحر</span>
          </button>
        </nav>

        {/* Tab 1: Overview & Toy vs Production */}
        {activeTab === 'overview' && (
          <div className="space-y-8 animate-fadeIn">
            <div className="p-6 rounded-2xl bg-gradient-to-br from-[#161b22] to-[#0d1117] border border-[#30363d] relative overflow-hidden">
              <div className="absolute top-0 right-0 w-96 h-96 bg-rose-500/5 rounded-full blur-3xl pointer-events-none" />
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-bold text-white mb-2">
                    التموضع الاستراتيجي: من خريجة متميزة إلى مهندسة AI في بيئة الإنتاج
                  </h2>
                  <p className="text-[#8b949e] max-w-3xl leading-relaxed text-sm sm:text-base">
                    بفضل دراستكِ لـ ML و DL ومعدلكِ (94%)، لستِ كأي شخص يشاهد شروحات يوتيوب ويستخدم Wrapper بسيط. 
                    أنتِ تفهمين جبر المصفوفات (Linear Algebra)، كيفية عمل أوزان التضمين (Embeddings)، مقاييس الخطأ، وضبط الدقة. 
                    هدف هذه الخطة هو نقل هذه القوة النظرية لتصبح أنظمة برمجية جاهزة للاستخدام الحقيقي في الشركات والمؤسسات.
                  </p>
                </div>
                <div className="p-4 rounded-xl bg-[#21262d] border border-[#30363d] text-center min-w-[160px]">
                  <div className="text-3xl font-extrabold text-rose-400">94%</div>
                  <div className="text-xs text-[#8b949e] mt-1 font-medium">أساس أكاديمي راسخ</div>
                  <div className="text-[11px] text-emerald-400 mt-2 font-mono">Ready for Enterprise</div>
                </div>
              </div>
            </div>

            {/* Comparison Table */}
            <div>
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-rose-400" />
                <span>المقارنة الفاصلة: الفرق الجوهري بين RAG المبتدئين و RAG الإنتاجي</span>
              </h3>
              <div className="overflow-x-auto rounded-xl border border-[#30363d]">
                <table className="w-full text-right text-sm">
                  <thead className="bg-[#161b22] text-[#8b949e] text-xs font-semibold uppercase">
                    <tr>
                      <th className="py-3 px-4">المعيار التقني</th>
                      <th className="py-3 px-4 text-amber-300">RAG التعليمي (Toy / Tutorial RAG)</th>
                      <th className="py-3 px-4 text-emerald-300">RAG الإنتاجي (Production Enterprise)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#30363d] bg-[#0d1117]">
                    <tr className="hover:bg-[#161b22]/50 transition-colors">
                      <td className="py-3.5 px-4 font-semibold text-white">معالجة الوثائق (Parsing)</td>
                      <td className="py-3.5 px-4 text-[#8b949e]">تقسيم نصي عشوائي (Character Splitter 500) ويدمر الجداول</td>
                      <td className="py-3.5 px-4 text-emerald-400 font-medium">Layout-aware extraction عبر Docling / LlamaParse وتحويل الجداول لـ Markdown</td>
                    </tr>
                    <tr className="hover:bg-[#161b22]/50 transition-colors">
                      <td className="py-3.5 px-4 font-semibold text-white">طريقة البحث</td>
                      <td className="py-3.5 px-4 text-[#8b949e]">Dense Vector Search فقط مع استرجاع Top 3 بدون فلترة</td>
                      <td className="py-3.5 px-4 text-emerald-400 font-medium">Hybrid Search (Dense + BM25/Sparse) مدمج عبر RRF ومتبوع بـ Cross-Encoder Rerank</td>
                    </tr>
                    <tr className="hover:bg-[#161b22]/50 transition-colors">
                      <td className="py-3.5 px-4 font-semibold text-white">التقييم والقياس</td>
                      <td className="py-3.5 px-4 text-[#8b949e]">تجربة يدوية لسؤالين وشعور شخصي بأن الإجابة جيدة</td>
                      <td className="py-3.5 px-4 text-emerald-400 font-medium">قياس حسابي عبر Ragas: Faithfulness &gt; 95%، و Relevance، و Context Precision</td>
                    </tr>
                    <tr className="hover:bg-[#161b22]/50 transition-colors">
                      <td className="py-3.5 px-4 font-semibold text-white">الأمان والحماية</td>
                      <td className="py-3.5 px-4 text-[#8b949e]">لا توجد فلاتر؛ أي Prompt Injection قد يسرب النظام</td>
                      <td className="py-3.5 px-4 text-emerald-400 font-medium">Pydantic validation إلزامي، فلاتر Guardrails، وإسناد دقيق للمراجع (Citations)</td>
                    </tr>
                    <tr className="hover:bg-[#161b22]/50 transition-colors">
                      <td className="py-3.5 px-4 font-semibold text-white">الأداء والتكلفة</td>
                      <td className="py-3.5 px-4 text-[#8b949e]">كل سؤال يطلب الـ LLM مباشرة، زمن استجابة بطيء وتكلفة عالية</td>
                      <td className="py-3.5 px-4 text-emerald-400 font-medium">Semantic Caching عبر Redis يختصر 50% من التكلفة وزمن الاستجابة إلى 15ms</td>
                    </tr>
                    <tr className="hover:bg-[#161b22]/50 transition-colors">
                      <td className="py-3.5 px-4 font-semibold text-white">المراقبة والـ Tracing</td>
                      <td className="py-3.5 px-4 text-[#8b949e]">طباعة print() في الطرفية</td>
                      <td className="py-3.5 px-4 text-emerald-400 font-medium">نظام Tracing متكامل عبر Langfuse أو Phoenix لتتبع زمن الاستجابة والتكلفة لكل Token</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Architecture Diagram Card */}
            <div className="p-6 rounded-2xl bg-[#161b22] border border-[#30363d]">
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <GitBranch className="w-5 h-5 text-rose-400" />
                <span>مخطط المعمارية الكاملة لنظام RAG الإنتاجي</span>
              </h3>
              <div className="bg-[#0d1117] p-4 rounded-xl font-mono text-xs text-emerald-300 leading-relaxed overflow-x-auto border border-[#30363d]">
                <pre>{`[User Query] ──► [FastAPI Gateway / Rate Limiter]
                      │
                      ├──► [Semantic Cache Check (Redis)] ──(Cache Hit: <20ms)──► [Instant Return]
                      │
                      └──► (Cache Miss) ──► [Query Rewriter / HyDE Generator]
                                                   │
                         ┌─────────────────────────┴─────────────────────────┐
                         ▼                                                   ▼
                [Dense Vector Search]                               [Sparse BM25 Search]
                (Qdrant Cosine / HNSW)                             (Payload / Keyword Match)
                         │ (Top 25)                                          │ (Top 25)
                         └─────────────────────────┬─────────────────────────┘
                                                   ▼
                                    [Reciprocal Rank Fusion (RRF)]
                                                   │ (Top 30 Merged)
                                                   ▼
                                   [Cross-Encoder Reranker]
                                  (Cohere Rerank / BGE-Reranker)
                                                   │ (Top 5 High Precision Docs)
                                                   ▼
                                      [Context Assembler & Guardrails]
                                                   │
                                                   ▼
                                    [LLM Generation with Citations]
                                     (SSE Streaming via FastAPI)
                                                   │
                                                   ▼
                                    [Langfuse Tracing + Cost Log]`}</pre>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Core Pillars & Code */}
        {activeTab === 'pillars' && (
          <div className="space-y-8 animate-fadeIn">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Pillar 1 */}
              <div className="p-6 rounded-2xl bg-[#161b22] border border-[#30363d]">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400 font-bold">1</div>
                  <div>
                    <h3 className="text-base font-bold text-white">معالجة الوثائق المعقدة (Layout-Aware)</h3>
                    <p className="text-xs text-[#8b949e]">Docling, Unstructured, LlamaParse</p>
                  </div>
                </div>
                <p className="text-sm text-[#c9d1d9] leading-relaxed mb-4">
                  في الشركات، معظم البيانات تكون في ملفات PDF مالية، عقود، وتقارير سنوية تحتوي على جداول وأعمدة متداخلة. 
                  استخدام استخراج النصوص الكلاسيكي يخلط الأرقام ويجعل الـ LLM يهلوس. الحل هو استخراج الجداول بهيئة Markdown موثقة مع رقم الصفحة.
                </p>
                <div className="bg-[#0d1117] p-3 rounded-lg border border-[#30363d] font-mono text-xs text-blue-300">
                  <pre>{`from docling.document_converter import DocumentConverter

converter = DocumentConverter()
result = converter.convert("annual_financial_report.pdf")
markdown_content = result.document.export_to_markdown()
# يحافظ تماماً على الجداول والهيدرز`}</pre>
                </div>
              </div>

              {/* Pillar 2 */}
              <div className="p-6 rounded-2xl bg-[#161b22] border border-[#30363d]">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400 font-bold">2</div>
                  <div>
                    <h3 className="text-base font-bold text-white">استراتيجيات التقسيم الذكي (Chunking)</h3>
                    <p className="text-xs text-[#8b949e]">Hierarchical & Parent-Child Retrieval</p>
                  </div>
                </div>
                <p className="text-sm text-[#c9d1d9] leading-relaxed mb-4">
                  بدل تجزيء النص عشوائياً، نستخدم <strong>Parent-Document Retrieval</strong>:
                  نقسم الوثيقة إلى أجزاء صغيرة جداً (200 Token) لأجل دقة البحث المتجه، لكن عند إرسال الإجابة للنموذج نمرر الفقرة الأم الكبيرة (1000 Token) لضمان السياق الكامل.
                </p>
                <div className="bg-[#0d1117] p-3 rounded-lg border border-[#30363d] font-mono text-xs text-purple-300">
                  <pre>{`# Parent-Document Pattern:
# Small Chunk -> Vector Index (High recall)
# Parent Document -> Context Buffer (Full context)`}</pre>
                </div>
              </div>

              {/* Pillar 3 */}
              <div className="p-6 rounded-2xl bg-[#161b22] border border-[#30363d]">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-bold">3</div>
                  <div>
                    <h3 className="text-base font-bold text-white">البحث الهجين (Hybrid Search: Dense + BM25)</h3>
                    <p className="text-xs text-[#8b949e]">Qdrant + Reciprocal Rank Fusion</p>
                  </div>
                </div>
                <p className="text-sm text-[#c9d1d9] leading-relaxed mb-4">
                  البحث الدلالي (Dense) يفهم المعنى العام لكنه يعجز عن مطابقة أرقام المعاملات (IDs) أو كود الأخطاء البرمجية. 
                  لذلك ندمج البحث الشعاعي مع BM25 بنظام RRF لضمان أفضلية الترتيب لكلا المعيارين.
                </p>
                <div className="bg-[#0d1117] p-3 rounded-lg border border-[#30363d] font-mono text-xs text-emerald-300">
                  <pre>{`# دمج النتائج بصيغة RRF:
score = 1.0 / (60 + dense_rank) + 1.0 / (60 + sparse_rank)`}</pre>
                </div>
              </div>

              {/* Pillar 4 */}
              <div className="p-6 rounded-2xl bg-[#161b22] border border-[#30363d]">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 font-bold">4</div>
                  <div>
                    <h3 className="text-base font-bold text-white">إعادة الترتيب بالـ Cross-Encoder (Reranking)</h3>
                    <p className="text-xs text-[#8b949e]">Cohere Rerank / BGE-Reranker-Large</p>
                  </div>
                </div>
                <p className="text-sm text-[#c9d1d9] leading-relaxed mb-4">
                  نماذج الـ Bi-encoder العادية تحسب التشابه الرياضي السريع. 
                  أما الـ Cross-Encoder فيأخذ السؤال والمستند معاً داخل طبقات الانتباه المشتركة (Cross-Attention)، مما يرفع دقة الترتيب بنسبة 30%.
                </p>
                <div className="bg-[#0d1117] p-3 rounded-lg border border-[#30363d] font-mono text-xs text-amber-300">
                  <pre>{`from sentence_transformers import CrossEncoder

reranker = CrossEncoder('BAAI/bge-reranker-large')
scores = reranker.predict([(query, doc) for doc in top_20_docs])
sorted_docs = [doc for _, doc in sorted(zip(scores, top_20_docs), reverse=True)[:5]]`}</pre>
                </div>
              </div>

              {/* Pillar 5 */}
              <div className="p-6 rounded-2xl bg-[#161b22] border border-[#30363d]">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400 font-bold">5</div>
                  <div>
                    <h3 className="text-base font-bold text-white">التقييم الحسابي الآلي (Ragas Framework)</h3>
                    <p className="text-xs text-[#8b949e]">Faithfulness, Answer Relevance, Context Precision</p>
                  </div>
                </div>
                <p className="text-sm text-[#c9d1d9] leading-relaxed mb-4">
                  الشركات لا تدفع مقابل وعود، بل مقابل أرقام ومقاييس. 
                  نستخدم Ragas لقياس نسبة الأمانة (Faithfulness) ضد الهلوسة ونسبة ارتباط الإجابة بالسياق على عينة من 100 سؤال قبل أي نشر للإنتاج.
                </p>
                <div className="bg-[#0d1117] p-3 rounded-lg border border-[#30363d] font-mono text-xs text-rose-300">
                  <pre>{`from ragas import evaluate
from ragas.metrics import faithfulness, answer_relevancy

result = evaluate(test_dataset, metrics=[faithfulness, answer_relevancy])
print(f"Faithfulness Score: {result['faithfulness']:.2%}")`}</pre>
                </div>
              </div>

              {/* Pillar 6 */}
              <div className="p-6 rounded-2xl bg-[#161b22] border border-[#30363d]">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 font-bold">6</div>
                  <div>
                    <h3 className="text-base font-bold text-white">التخزين المؤقت الدلالي (Semantic Caching)</h3>
                    <p className="text-xs text-[#8b949e]">Redis Vector Cache / GPTCache</p>
                  </div>
                </div>
                <p className="text-sm text-[#c9d1d9] leading-relaxed mb-4">
                  إذا تشابه سؤال مستخدم جديد مع سؤال سابق بنسبة دلالية 95% أو أكثر، يتم جلب الإجابة المخزنة فوراً من ذاكرة Redis بزمن استجابة 15ms وبتكلفة 0.00$ وبدون استدعاء الـ LLM.
                </p>
                <div className="bg-[#0d1117] p-3 rounded-lg border border-[#30363d] font-mono text-xs text-cyan-300">
                  <pre>{`# Redis Semantic Cache Hit
# Cosine Similarity >= 0.95 -> Return cached response (15ms latency, $0 cost)`}</pre>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Agents & Automation */}
        {activeTab === 'agents' && (
          <div className="space-y-8 animate-fadeIn">
            <div className="p-6 rounded-2xl bg-[#161b22] border border-[#30363d]">
              <h2 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
                <Workflow className="w-5 h-5 text-rose-400" />
                <span>معمارية الوكلاء الذاتية التصحيح (Self-Corrective Agents via LangGraph)</span>
              </h2>
              <p className="text-sm text-[#8b949e] leading-relaxed mb-6">
                في بيئات الإنتاج، لا نعتمد على حلقة واحدة (Single-shot RAG). إذا استرجع النظام وثائق غير كافية أو كانت الإجابة ناقصة، يقوم الوكيل بإعادة صياغة السؤال والبحث في مسار بديل، أو استدعاء أدوات خارجية (APIs).
              </p>

              <div className="bg-[#0d1117] p-4 rounded-xl border border-[#30363d] font-mono text-xs text-emerald-300 leading-relaxed overflow-x-auto">
                <pre>{`from typing import TypedDict, List
from langgraph.graph import StateGraph, END

class AgentState(TypedDict):
    question: str
    documents: List[str]
    generation: str
    retry_count: int

def retrieve_node(state: AgentState):
    # بحث هجين في قاعدة البيانات المتجهة
    docs = hybrid_retriever.invoke(state["question"])
    return {"documents": docs, "retry_count": state.get("retry_count", 0) + 1}

def grade_documents_node(state: AgentState):
    # التحقق من أن المستندات تجيب بالفعل على السؤال
    is_relevant = grader_model.verify(state["question"], state["documents"])
    return "generate" if is_relevant or state["retry_count"] >= 3 else "rewrite_query"

def rewrite_query_node(state: AgentState):
    # إعادة صياغة الاستعلام بحثياً
    new_q = query_rewriter.invoke(state["question"])
    return {"question": new_q}

# بناء الرسم البياني
workflow = StateGraph(AgentState)
workflow.add_node("retrieve", retrieve_node)
workflow.add_node("rewrite_query", rewrite_query_node)
workflow.add_node("generate", generate_node)

workflow.set_entry_point("retrieve")
workflow.add_conditional_edges("retrieve", grade_documents_node)
workflow.add_edge("rewrite_query", "retrieve")
workflow.add_edge("generate", END)

app = workflow.compile()`}</pre>
              </div>
            </div>

            {/* n8n section */}
            <div className="p-6 rounded-2xl bg-[#161b22] border border-[#30363d]">
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-4">
                <div>
                  <h3 className="text-lg font-bold text-white">أتمتة الأعمال المؤسسية عبر n8n (Enterprise Workflow Automation)</h3>
                  <p className="text-xs text-[#8b949e] mt-1">الدمج الذكي بين Python Microservice وأدوات العمل اليومية</p>
                </div>
                <span className="px-3 py-1 rounded-full bg-amber-500/15 text-amber-300 border border-amber-500/30 text-xs font-semibold">
                  مطلوب جداً في العمل الحر والشركات
                </span>
              </div>
              <p className="text-sm text-[#c9d1d9] leading-relaxed mb-4">
                الشركات لا تريد فقط كوداً برمجياً في الـ Terminal، بل تريد نظاماً يستمع تلقائياً لرسائل البريد الإلكتروني، يمرر المستندات المرفقة لنظام RAG، يحللها، يولد ملخصاً، ويرسله تلقائياً إلى Slack و Notion وسجل الـ CRM.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                <div className="p-4 rounded-xl bg-[#0d1117] border border-[#30363d]">
                  <div className="font-bold text-rose-300 mb-1">1. Webhook Triggers</div>
                  <p className="text-[#8b949e]">استقبال الرسائل، الإيميلات، أو تغييرات في قاعدة البيانات تلقائياً على مدار الساعة.</p>
                </div>
                <div className="p-4 rounded-xl bg-[#0d1117] border border-[#30363d]">
                  <div className="font-bold text-blue-300 mb-1">2. Custom HTTP Node</div>
                  <p className="text-[#8b949e]">إرسال Payload إلى الـ FastAPI RAG Microservice لتنفيذ العمليات الرياضية الحساسة.</p>
                </div>
                <div className="p-4 rounded-xl bg-[#0d1117] border border-[#30363d]">
                  <div className="font-bold text-emerald-300 mb-1">3. Automated Actions</div>
                  <p className="text-[#8b949e]">حفظ النتيجة في Google Sheets، تحديث تذاكر Jira، أو إرسال تقرير PDF منسق للعميل.</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 4: 8-Week Curriculum with Checkboxes */}
        {activeTab === 'curriculum' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="p-6 rounded-2xl bg-[#161b22] border border-[#30363d] flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold text-white">جدول الإنجاز التنفيذي (8 أسابيع خطوة بخطوة للإنتاج)</h2>
                <p className="text-xs text-[#8b949e] mt-1">
                  يمكنكِ النقر على أي أسبوع لتحديده كمكتمل وتتبع تقدمكِ تلقائياً. تم تخزين تقدمكِ محلياً.
                </p>
              </div>
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <div className="text-sm font-bold text-white">{completedWeeks.length} من أصل 8 أسابيع</div>
                  <div className="text-xs text-[#8b949e]">نسبة الإنجاز: {Math.round((completedWeeks.length / 8) * 100)}%</div>
                </div>
                <div className="w-12 h-12 rounded-full border-2 border-[#30363d] flex items-center justify-center font-bold text-rose-400 bg-[#0d1117]">
                  {Math.round((completedWeeks.length / 8) * 100)}%
                </div>
              </div>
            </div>

            <div className="space-y-4">
              {WEEKS_DATA.map((week) => {
                const isCompleted = completedWeeks.includes(week.weekNumber);
                return (
                  <div 
                    key={week.weekNumber}
                    onClick={() => toggleWeek(week.weekNumber)}
                    className={`p-5 rounded-xl border transition-all cursor-pointer ${
                      isCompleted 
                        ? 'bg-emerald-950/20 border-emerald-500/40' 
                        : 'bg-[#161b22] border-[#30363d] hover:border-[#8b949e]/50'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-start gap-3">
                        <div className={`mt-0.5 w-6 h-6 rounded-lg border flex items-center justify-center transition-colors ${
                          isCompleted ? 'bg-emerald-500 border-emerald-500 text-black' : 'border-[#484f58] bg-[#0d1117]'
                        }`}>
                          {isCompleted && <Check className="w-4 h-4 stroke-[3]" />}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-mono font-bold text-rose-400">Week {week.weekNumber}</span>
                            <span className="text-xs px-2 py-0.5 rounded bg-[#21262d] text-[#8b949e] font-medium">{week.duration}</span>
                          </div>
                          <h3 className={`text-base font-bold mt-1 ${isCompleted ? 'text-emerald-300 line-through' : 'text-white'}`}>
                            {week.title}
                          </h3>
                          <p className="text-xs sm:text-sm text-[#8b949e] mt-1 leading-relaxed">
                            {week.description}
                          </p>
                          <div className="mt-3 flex flex-wrap gap-2">
                            {week.deliverables.map((del, i) => (
                              <span key={i} className="text-[11px] px-2 py-0.5 rounded bg-[#21262d] text-[#c9d1d9] border border-[#30363d]">
                                • {del}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                      <div className="hidden sm:block text-right">
                        <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                          isCompleted ? 'bg-emerald-500/20 text-emerald-300' : 'bg-[#21262d] text-[#8b949e]'
                        }`}>
                          {isCompleted ? 'مكتمل' : 'قيد الإنجاز'}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Tab: Courses & Authoritative Resources */}
        {activeTab === 'courses' && (
          <div className="space-y-8 animate-fadeIn">
            {/* Header intro */}
            <div className="p-6 rounded-2xl bg-gradient-to-br from-[#161b22] to-[#0d1117] border border-[#30363d] relative overflow-hidden">
              <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs font-bold px-2.5 py-1 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                      قائمة موثقة لمهندسي الإنتاج (Zero Fluff)
                    </span>
                    <span className="text-xs font-bold px-2.5 py-1 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                      كلها مجانية أو رسمية
                    </span>
                  </div>
                  <h2 className="text-2xl font-bold text-white mb-2">
                    الكورسات المعتمدة هندسياً للوصول للإنتاج (Production-Grade)
                  </h2>
                  <p className="text-[#8b949e] max-w-3xl leading-relaxed text-sm">
                    بصفتكِ خريجة علم حاسوب ولستِ مستخدمة عادية، ابتعدي تماماً عن دورات اليوتيوب السطحية ("اصنع شات بوت في 10 دقائق"). 
                    هذه الدورات يقدمها مؤسسو الأدوات بأنفسهم (DeepLearning.AI مع LlamaIndex و LangChain، وأكاديميات Qdrant و n8n)، 
                    وتركز على الكود الحقيقي، المعمارية، التقييم الرياضي، والمراقبة.
                  </p>
                </div>
                <div className="p-4 rounded-xl bg-[#21262d] border border-[#30363d] text-center min-w-[170px]">
                  <div className="text-2xl font-black text-amber-400">4 مسارات</div>
                  <div className="text-xs text-[#8b949e] mt-1">تغطي كل ركن في الخطة</div>
                  <div className="text-[11px] text-emerald-400 mt-2 font-mono">100% Practical</div>
                </div>
              </div>
            </div>

            {/* Courses Grid Category by Category */}
            <div className="space-y-8">
              {/* Category 1: Advanced & Production RAG */}
              <div>
                <div className="flex items-center gap-2.5 mb-4">
                  <div className="w-8 h-8 rounded-lg bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400">
                    <Cpu className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white">المسار الأول: نظم RAG المتقدمة والإنتاجية (Advanced RAG)</h3>
                    <p className="text-xs text-[#8b949e]">الاستخراج المعقد، البحث الهجين، الفهرسة المتجهة، والتقييم الرياضي</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Course 1 */}
                  <div className="p-5 rounded-xl bg-[#161b22] border border-[#30363d] flex flex-col justify-between hover:border-[#8b949e]/40 transition-colors">
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <span className="text-xs font-mono font-bold text-rose-400">DeepLearning.AI + LlamaIndex</span>
                        <span className="text-[11px] px-2 py-0.5 rounded bg-[#21262d] text-emerald-400 font-medium">مجاني • ~ساعتان مكثفة</span>
                      </div>
                      <h4 className="text-base font-bold text-white mb-1.5">
                        Building Towards Production Quality RAG
                      </h4>
                      <p className="text-xs text-[#8b949e] leading-relaxed mb-3">
                        يقدمه Jerry Liu (مؤسس LlamaIndex بنفسه). يشرح كيفية الانتقال من RAG الساذج إلى الإنتاجي عبر تقنيات Sentence-Window Retrieval والتقسيم التلقائي الـ Auto-merging.
                      </p>
                      <div className="space-y-1 text-xs text-[#c9d1d9] mb-4">
                        <div className="flex items-center gap-1.5 text-[11px] text-[#8b949e]">
                          <span className="text-rose-400">✓</span> استخراج الجداول وبناء الـ Sentence Window
                        </div>
                        <div className="flex items-center gap-1.5 text-[11px] text-[#8b949e]">
                          <span className="text-rose-400">✓</span> التقييم الكمي ضد الهلوسة باستخدام TruLens
                        </div>
                      </div>
                    </div>
                    <div className="pt-3 border-t border-[#30363d] flex items-center justify-between">
                      <span className="text-[11px] text-amber-300/80 font-mono">deeplearning.ai/short-courses</span>
                      <span className="text-xs text-rose-400 font-medium flex items-center gap-1">كورس أساسي للأسبوع 1 و 3</span>
                    </div>
                  </div>

                  {/* Course 2 */}
                  <div className="p-5 rounded-xl bg-[#161b22] border border-[#30363d] flex flex-col justify-between hover:border-[#8b949e]/40 transition-colors">
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <span className="text-xs font-mono font-bold text-blue-400">Qdrant Official Academy</span>
                        <span className="text-[11px] px-2 py-0.5 rounded bg-[#21262d] text-emerald-400 font-medium">مجاني رسمي بالكامل</span>
                      </div>
                      <h4 className="text-base font-bold text-white mb-1.5">
                        Building Production-Ready RAG with Vector Search
                      </h4>
                      <p className="text-xs text-[#8b949e] leading-relaxed mb-3">
                        الدورة الرسمية من شركة Qdrant. تشرح الفهرسة المتجهة، كيفية عمل خوارزمية HNSW، تطبيق البحث الهجين (Dense + BM25)، واستخدام فلاتر الـ Payload في بيئات الإنتاج.
                      </p>
                      <div className="space-y-1 text-xs text-[#c9d1d9] mb-4">
                        <div className="flex items-center gap-1.5 text-[11px] text-[#8b949e]">
                          <span className="text-blue-400">✓</span> تطبيق عملي كامل لـ Qdrant عبر Docker
                        </div>
                        <div className="flex items-center gap-1.5 text-[11px] text-[#8b949e]">
                          <span className="text-blue-400">✓</span> التعامل مع ملايين المتجهات بأقل زمن استجابة
                        </div>
                      </div>
                    </div>
                    <div className="pt-3 border-t border-[#30363d] flex items-center justify-between">
                      <span className="text-[11px] text-blue-300/80 font-mono">qdrant.tech/documentation</span>
                      <span className="text-xs text-blue-400 font-medium flex items-center gap-1">كورس أساسي للأسبوع 2</span>
                    </div>
                  </div>

                  {/* Course 3 */}
                  <div className="p-5 rounded-xl bg-[#161b22] border border-[#30363d] flex flex-col justify-between hover:border-[#8b949e]/40 transition-colors">
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <span className="text-xs font-mono font-bold text-purple-400">DeepLearning.AI + TruLens</span>
                        <span className="text-[11px] px-2 py-0.5 rounded bg-[#21262d] text-emerald-400 font-medium">مجاني • ساعة ونصف</span>
                      </div>
                      <h4 className="text-base font-bold text-white mb-1.5">
                        Evaluating and Debugging Generative AI & RAG
                      </h4>
                      <p className="text-xs text-[#8b949e] leading-relaxed mb-3">
                        يركز حصرياً على ما تطلبه الشركات: كيف نثبت أن نظام RAG يعمل بدقة؟ قياس الـ RAG Triad (الأمانة Faithfulness، صلة الإجابة Relevancy، وصلة السياق Context Relevance).
                      </p>
                      <div className="space-y-1 text-xs text-[#c9d1d9] mb-4">
                        <div className="flex items-center gap-1.5 text-[11px] text-[#8b949e]">
                          <span className="text-purple-400">✓</span> القياس الكمي ضد الهلوسة ونقص المعلومات
                        </div>
                        <div className="flex items-center gap-1.5 text-[11px] text-[#8b949e]">
                          <span className="text-purple-400">✓</span> تطبيق عملي لمكتبات التقييم مثل Ragas
                        </div>
                      </div>
                    </div>
                    <div className="pt-3 border-t border-[#30363d] flex items-center justify-between">
                      <span className="text-[11px] text-purple-300/80 font-mono">deeplearning.ai/courses</span>
                      <span className="text-xs text-purple-400 font-medium flex items-center gap-1">كورس أساسي للأسبوع 4</span>
                    </div>
                  </div>

                  {/* Course 4 */}
                  <div className="p-5 rounded-xl bg-[#161b22] border border-[#30363d] flex flex-col justify-between hover:border-[#8b949e]/40 transition-colors">
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <span className="text-xs font-mono font-bold text-emerald-400">DeepLearning.AI + Cohere</span>
                        <span className="text-[11px] px-2 py-0.5 rounded bg-[#21262d] text-emerald-400 font-medium">مجاني • ساعة مكثفة</span>
                      </div>
                      <h4 className="text-base font-bold text-white mb-1.5">
                        Large Language Models with Semantic Search & Rerank
                      </h4>
                      <p className="text-xs text-[#8b949e] leading-relaxed mb-3">
                        يقدمه Jay Alammar ومؤسسو Cohere. يشرح كيفية عمل نماذج الـ Cross-Encoders، وكيف يؤدي Reranking إلى مضاعفة دقة النتائج المسترجعة بدقة فائقة.
                      </p>
                      <div className="space-y-1 text-xs text-[#c9d1d9] mb-4">
                        <div className="flex items-center gap-1.5 text-[11px] text-[#8b949e]">
                          <span className="text-emerald-400">✓</span> فهم دقيق للفرق الرياضي بين Bi-Encoder و Cross-Encoder
                        </div>
                        <div className="flex items-center gap-1.5 text-[11px] text-[#8b949e]">
                          <span className="text-emerald-400">✓</span> دمج Cohere Rerank في الـ Pipeline
                        </div>
                      </div>
                    </div>
                    <div className="pt-3 border-t border-[#30363d] flex items-center justify-between">
                      <span className="text-[11px] text-emerald-300/80 font-mono">cohere.com/llmu</span>
                      <span className="text-xs text-emerald-400 font-medium flex items-center gap-1">كورس أساسي للأسبوع 3</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Category 2: AI Agents & LangGraph */}
              <div>
                <div className="flex items-center gap-2.5 mb-4">
                  <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400">
                    <Workflow className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white">المسار الثاني: الوكلاء وهندسة القرارات (AI Agents & LangGraph)</h3>
                    <p className="text-xs text-[#8b949e]">الرسوم البيانية ذات الحالة، التصحيح الذاتي، واستدعاء الأدوات</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Course 5 */}
                  <div className="p-5 rounded-xl bg-[#161b22] border border-[#30363d] flex flex-col justify-between hover:border-[#8b949e]/40 transition-colors">
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <span className="text-xs font-mono font-bold text-blue-400">DeepLearning.AI + LangChain</span>
                        <span className="text-[11px] px-2 py-0.5 rounded bg-[#21262d] text-emerald-400 font-medium">مجاني • الأقوى عالمياً</span>
                      </div>
                      <h4 className="text-base font-bold text-white mb-1.5">
                        AI Agents in LangGraph
                      </h4>
                      <p className="text-xs text-[#8b949e] leading-relaxed mb-3">
                        يقدمه Harrison Chase (الرئيس التنفيذي ومؤسس LangChain). هو المرجع الأول عالمياً لبناء الوكلاء الإنتاجيين باستخدام StateGraph، العقد الشرطية (Conditional Edges)، وحفظ الذاكرة (Checkpointers).
                      </p>
                      <div className="space-y-1 text-xs text-[#c9d1d9] mb-4">
                        <div className="flex items-center gap-1.5 text-[11px] text-[#8b949e]">
                          <span className="text-blue-400">✓</span> بناء Self-Corrective Coding & Search Agents
                        </div>
                        <div className="flex items-center gap-1.5 text-[11px] text-[#8b949e]">
                          <span className="text-blue-400">✓</span> ميزة التوقف البشري للموافقة (Human-in-the-loop)
                        </div>
                      </div>
                    </div>
                    <div className="pt-3 border-t border-[#30363d] flex items-center justify-between">
                      <span className="text-[11px] text-blue-300/80 font-mono">langchain-ai.github.io/langgraph</span>
                      <span className="text-xs text-blue-400 font-medium flex items-center gap-1">كورس إلزامي للأسبوع 5</span>
                    </div>
                  </div>

                  {/* Course 6 */}
                  <div className="p-5 rounded-xl bg-[#161b22] border border-[#30363d] flex flex-col justify-between hover:border-[#8b949e]/40 transition-colors">
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <span className="text-xs font-mono font-bold text-cyan-400">DeepLearning.AI + CrewAI</span>
                        <span className="text-[11px] px-2 py-0.5 rounded bg-[#21262d] text-emerald-400 font-medium">مجاني • ساعتان</span>
                      </div>
                      <h4 className="text-base font-bold text-white mb-1.5">
                        Multi AI Agent Systems with crewAI
                      </h4>
                      <p className="text-xs text-[#8b949e] leading-relaxed mb-3">
                        يقدمه João Moura (مؤسس CrewAI). يوضح كيفية تشغيل فريق من الوكلاء يتعاونون فيما بينهم: وكيل مالي يستخرج الأرقام، ووكيل قانوني يدقق اللوائح، ووكيل تنفيذي يكتب التقرير النهائي.
                      </p>
                      <div className="space-y-1 text-xs text-[#c9d1d9] mb-4">
                        <div className="flex items-center gap-1.5 text-[11px] text-[#8b949e]">
                          <span className="text-cyan-400">✓</span> تفويض المهام وتوزيع الأدوار (Role-Playing Agents)
                        </div>
                        <div className="flex items-center gap-1.5 text-[11px] text-[#8b949e]">
                          <span className="text-cyan-400">✓</span> استدعاء أدوات خارجية مخصصة بلغة بايثون
                        </div>
                      </div>
                    </div>
                    <div className="pt-3 border-t border-[#30363d] flex items-center justify-between">
                      <span className="text-[11px] text-cyan-300/80 font-mono">docs.crewai.com</span>
                      <span className="text-xs text-cyan-400 font-medium flex items-center gap-1">تطبيق مساند للأسبوع 5</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Category 3: Workflow Automation with n8n */}
              <div>
                <div className="flex items-center gap-2.5 mb-4">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                    <Database className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white">المسار الثالث: أتمتة الأعمال المؤسسية (n8n & Workflow Automation)</h3>
                    <p className="text-xs text-[#8b949e]">ربط الذكاء الاصطناعي بأنظمة العمل: الـ Webhooks، الإيميل، السيرفرات، وقواعد البيانات</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Course 7 */}
                  <div className="p-5 rounded-xl bg-[#161b22] border border-[#30363d] flex flex-col justify-between hover:border-[#8b949e]/40 transition-colors">
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <span className="text-xs font-mono font-bold text-emerald-400">Official n8n Academy</span>
                        <span className="text-[11px] px-2 py-0.5 rounded bg-[#21262d] text-emerald-400 font-medium">شهادة رسمية مجانية</span>
                      </div>
                      <h4 className="text-base font-bold text-white mb-1.5">
                        n8n Beginner to Advanced Courses (Level 1 & 2)
                      </h4>
                      <p className="text-xs text-[#8b949e] leading-relaxed mb-3">
                        الدورة الرسمية الشاملة من منصة n8n. تتعلمين فيها كيفية بناء سير العمل المتقدم، التعامل مع JSON وتحويل البيانات، إدارة الـ Webhooks، ومعالجة الأخطاء وإعادة المحاولة التلقائية (Error Workflows).
                      </p>
                      <div className="space-y-1 text-xs text-[#c9d1d9] mb-4">
                        <div className="flex items-center gap-1.5 text-[11px] text-[#8b949e]">
                          <span className="text-emerald-400">✓</span> تشغيل n8n محلياً وسحابياً عبر Docker
                        </div>
                        <div className="flex items-center gap-1.5 text-[11px] text-[#8b949e]">
                          <span className="text-emerald-400">✓</span> دمج AI Agent Nodes وتمرير السياق للنماذج
                        </div>
                      </div>
                    </div>
                    <div className="pt-3 border-t border-[#30363d] flex items-center justify-between">
                      <span className="text-[11px] text-emerald-300/80 font-mono">academy.n8n.io</span>
                      <span className="text-xs text-emerald-400 font-medium flex items-center gap-1">كورس إلزامي للأسبوع 6</span>
                    </div>
                  </div>

                  {/* Course 8 */}
                  <div className="p-5 rounded-xl bg-[#161b22] border border-[#30363d] flex flex-col justify-between hover:border-[#8b949e]/40 transition-colors">
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <span className="text-xs font-mono font-bold text-amber-400">Postman & APIs Training</span>
                        <span className="text-[11px] px-2 py-0.5 rounded bg-[#21262d] text-emerald-400 font-medium">مجاني بالكامل</span>
                      </div>
                      <h4 className="text-base font-bold text-white mb-1.5">
                        Automating with APIs, Webhooks & Auth Headers
                      </h4>
                      <p className="text-xs text-[#8b949e] leading-relaxed mb-3">
                        كل أتمتة ناجحة تعتمد على فهم كيفية تواصل الأنظمة عبر بروتوكول HTTP. هذه الدورة توضح كيفية التعامل مع ترويسات المصادقة (Bearer Tokens)، معالجة الـ Rate Limits، وتأمين المفاتيح في الـ Production.
                      </p>
                      <div className="space-y-1 text-xs text-[#c9d1d9] mb-4">
                        <div className="flex items-center gap-1.5 text-[11px] text-[#8b949e]">
                          <span className="text-amber-400">✓</span> استدعاء وتأمين الـ REST APIs والـ SSE
                        </div>
                        <div className="flex items-center gap-1.5 text-[11px] text-[#8b949e]">
                          <span className="text-amber-400">✓</span> كتابة كود تفاعلي لاختبار الاستجابات السريعة
                        </div>
                      </div>
                    </div>
                    <div className="pt-3 border-t border-[#30363d] flex items-center justify-between">
                      <span className="text-[11px] text-amber-300/80 font-mono">academy.postman.com</span>
                      <span className="text-xs text-amber-400 font-medium flex items-center gap-1">أساس هندسي للأسبوع 6 و 7</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Category 4: Backend & Tracing */}
              <div>
                <div className="flex items-center gap-2.5 mb-4">
                  <div className="w-8 h-8 rounded-lg bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400">
                    <Terminal className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white">المسار الرابع: بناء الـ Microservices والمراقبة (FastAPI & Langfuse)</h3>
                    <p className="text-xs text-[#8b949e]">تحويل الكود إلى واجهة برمجية سريعة مع تتبع كامل للتكاليف وزمن الاستجابة</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Course 9 */}
                  <div className="p-5 rounded-xl bg-[#161b22] border border-[#30363d] flex flex-col justify-between hover:border-[#8b949e]/40 transition-colors">
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <span className="text-xs font-mono font-bold text-emerald-400">FastAPI Official Tutorial</span>
                        <span className="text-[11px] px-2 py-0.5 rounded bg-[#21262d] text-emerald-400 font-medium">المرجع الأول للصناعة</span>
                      </div>
                      <h4 className="text-base font-bold text-white mb-1.5">
                        High-Performance Async FastAPI with Streaming
                      </h4>
                      <p className="text-xs text-[#8b949e] leading-relaxed mb-3">
                        التوثيق الرسمي المفتوح لـ FastAPI للمطورين المتقدمين. يشرح الـ Async Endpoints، التحقق الصارم من المدخلات عبر Pydantic، وبث الردود الحية (Server-Sent Events) لتطبيق RAG.
                      </p>
                      <div className="space-y-1 text-xs text-[#c9d1d9] mb-4">
                        <div className="flex items-center gap-1.5 text-[11px] text-[#8b949e]">
                          <span className="text-emerald-400">✓</span> بناء SSE Streaming حقيقي للـ LLM
                        </div>
                        <div className="flex items-center gap-1.5 text-[11px] text-[#8b949e]">
                          <span className="text-emerald-400">✓</span> ربط الـ Cache مع Redis بزمن استجابة أقل من 20ms
                        </div>
                      </div>
                    </div>
                    <div className="pt-3 border-t border-[#30363d] flex items-center justify-between">
                      <span className="text-[11px] text-emerald-300/80 font-mono">fastapi.tiangolo.com</span>
                      <span className="text-xs text-emerald-400 font-medium flex items-center gap-1">كورس إلزامي للأسبوع 7</span>
                    </div>
                  </div>

                  {/* Course 10 */}
                  <div className="p-5 rounded-xl bg-[#161b22] border border-[#30363d] flex flex-col justify-between hover:border-[#8b949e]/40 transition-colors">
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <span className="text-xs font-mono font-bold text-rose-400">Langfuse Documentation & Cookbook</span>
                        <span className="text-[11px] px-2 py-0.5 rounded bg-[#21262d] text-emerald-400 font-medium">مفتوح المصدر بالكامل</span>
                      </div>
                      <h4 className="text-base font-bold text-white mb-1.5">
                        Production LLM Observability, Cost & Latency Tracing
                      </h4>
                      <p className="text-xs text-[#8b949e] leading-relaxed mb-3">
                        في بيئات الإنتاج لا يوجد شيء اسمه print(). Langfuse يتيح تتبع كل طلب يمر بالنظام (User Input -&gt; Retrieval -&gt; LLM) بدقة جزء من الألف من الثانية مع حساب تكلفة كل رمز (Token).
                      </p>
                      <div className="space-y-1 text-xs text-[#c9d1d9] mb-4">
                        <div className="flex items-center gap-1.5 text-[11px] text-[#8b949e]">
                          <span className="text-rose-400">✓</span> تتبع أداء النماذج ومعدل الخطأ
                        </div>
                        <div className="flex items-center gap-1.5 text-[11px] text-[#8b949e]">
                          <span className="text-rose-400">✓</span> تسجيل التقييمات التلقائية والتغذية الراجعة من المستخدمين
                        </div>
                      </div>
                    </div>
                    <div className="pt-3 border-t border-[#30363d] flex items-center justify-between">
                      <span className="text-[11px] text-rose-300/80 font-mono">langfuse.com/docs</span>
                      <span className="text-xs text-rose-400 font-medium flex items-center gap-1">مرافقة دائمة لكل المشاريع</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Practical Advice Banner */}
            <div className="p-5 rounded-xl bg-gradient-to-r from-amber-500/10 via-rose-500/10 to-transparent border border-amber-500/30">
              <div className="flex items-start gap-3">
                <Sparkles className="w-5 h-5 text-amber-400 mt-0.5 shrink-0" />
                <div>
                  <h4 className="text-sm font-bold text-white">نصيحة ذهبية تنهي التشتت تماماً:</h4>
                  <p className="text-xs text-[#c9d1d9] mt-1 leading-relaxed">
                    لا تشاهدي كل هذه الكورسات دفعة واحدة! 
                    الاستراتيجية الصحيحة هي <strong>"التعلم الموجه بالإنتاج (Just-In-Time Learning)"</strong>: 
                    في بداية كل أسبوع من الخطة التنفيذية (من الأسبوع 1 إلى 8)، شاهدي الكورس المرتبط بذلك الأسبوع فقط لمدة يوم أو يومين، ثم اقضي باقي الأسبوع في كتابة الكود وبناء المشروع العملي.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 5: Portfolio Projects */}
        {activeTab === 'projects' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="p-6 rounded-2xl bg-[#161b22] border border-[#30363d]">
              <h2 className="text-xl font-bold text-white mb-2">مشاريع البورتفوليو الثلاثة الكفيلة باقتناص الوظائف والعملاء</h2>
              <p className="text-xs sm:text-sm text-[#8b949e]">
                لا تصنعي مشاريع عادية مثل "تطبيق يلخص ملف PDF". الشركات تريد مشاريع تحل مشكلات مالية أو أمنية أو تشغيلية حقيقية وتثبت بالأرقام قدرتها على الأداء.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-6">
              {/* Project 1 */}
              <div className="p-6 rounded-2xl bg-[#161b22] border border-[#30363d] relative overflow-hidden">
                <div className="flex items-center justify-between gap-4 mb-3">
                  <span className="text-xs font-bold px-2.5 py-1 rounded bg-rose-500/20 text-rose-300 border border-rose-500/30">
                    Project 1 • Enterprise Level
                  </span>
                  <span className="text-xs text-[#8b949e] font-mono">Qdrant • Docling • Ragas • FastAPI</span>
                </div>
                <h3 className="text-lg font-bold text-white mb-2">
                  Enterprise Regulatory & Financial Auditor RAG (مدقق التقارير المالية واللوائح)
                </h3>
                <p className="text-sm text-[#c9d1d9] leading-relaxed mb-4">
                  نظام RAG متخصص في استيعاب ومراجعة التقارير المالية والوثائق القانونية الضخمة (100+ صفحة) دون فقدان الجداول أو الأرقام الدقيقة.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div className="p-3.5 rounded-xl bg-[#0d1117] border border-[#30363d]">
                    <div className="font-bold text-rose-300 mb-1.5">المعمارية التقنية:</div>
                    <ul className="space-y-1 text-[#8b949e] list-disc list-inside">
                      <li>استخراج عبر Docling للجداول وحفظها كـ Markdown.</li>
                      <li>Hybrid Search يدمج Qdrant و BM25 عبر RRF.</li>
                      <li>إعادة ترتيب بـ Cohere Rerank v3.</li>
                      <li>إخراج هيكلي بـ Pydantic مع إسناد رقم الصفحة بدقة.</li>
                    </ul>
                  </div>
                  <div className="p-3.5 rounded-xl bg-[#0d1117] border border-[#30363d]">
                    <div className="font-bold text-emerald-300 mb-1.5">أدلة النجاح في الـ README:</div>
                    <ul className="space-y-1 text-[#8b949e] list-disc list-inside">
                      <li>Faithfulness &gt; 97.4% عبر تقييم Ragas على 100 سؤال.</li>
                      <li>توفير 45% من تكاليف الـ API بواسطة Redis Semantic Caching.</li>
                      <li>فيديو Loom توضيحي لمدة 90 ثانية يشرح المشكلة والحل.</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Project 2 */}
              <div className="p-6 rounded-2xl bg-[#161b22] border border-[#30363d] relative overflow-hidden">
                <div className="flex items-center justify-between gap-4 mb-3">
                  <span className="text-xs font-bold px-2.5 py-1 rounded bg-blue-500/20 text-blue-300 border border-blue-500/30">
                    Project 2 • Agentic AI
                  </span>
                  <span className="text-xs text-[#8b949e] font-mono">LangGraph • Checkpoints • Slack Bot</span>
                </div>
                <h3 className="text-lg font-bold text-white mb-2">
                  Self-Corrective Autonomous IT Support & DevOps Agent
                </h3>
                <p className="text-sm text-[#c9d1d9] leading-relaxed mb-4">
                  وكيل ذكي مدرب على تشخيص أعطال البنية التحتية البرمجية وسجلات الـ Logs، يقوم بالبحث في توثيق الشركة الداخلي (RAG) واقتراح الحلول وإشراك المهندس البشري للموافقة (Human-in-the-loop).
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div className="p-3.5 rounded-xl bg-[#0d1117] border border-[#30363d]">
                    <div className="font-bold text-blue-300 mb-1.5">المعمارية التقنية:</div>
                    <ul className="space-y-1 text-[#8b949e] list-disc list-inside">
                      <li>مبني عبر LangGraph StateGraph مع Checkpointer للذاكرة.</li>
                      <li>حلقة تصحيح ذاتي: في حال عدم مطابقة الحل يتم إعادة صياغة البحث.</li>
                      <li>محطة توقف إلزامية (Human Interrupt) للموافقة قبل أي أمر حساس.</li>
                    </ul>
                  </div>
                  <div className="p-3.5 rounded-xl bg-[#0d1117] border border-[#30363d]">
                    <div className="font-bold text-emerald-300 mb-1.5">أدلة النجاح في الـ README:</div>
                    <ul className="space-y-1 text-[#8b949e] list-disc list-inside">
                      <li>تكامل تفاعلي عبر Slack Webhook و REST API.</li>
                      <li>مخطط State Diagram مصمم بـ Excalidraw يوضح كل Node و Edge.</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Project 3 */}
              <div className="p-6 rounded-2xl bg-[#161b22] border border-[#30363d] relative overflow-hidden">
                <div className="flex items-center justify-between gap-4 mb-3">
                  <span className="text-xs font-bold px-2.5 py-1 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    Project 3 • Automation & Workflows
                  </span>
                  <span className="text-xs text-[#8b949e] font-mono">n8n • Webhooks • CRM • Lead Scoring</span>
                </div>
                <h3 className="text-lg font-bold text-white mb-2">
                  Intelligent Lead Scoring & Client Automation Pipeline
                </h3>
                <p className="text-sm text-[#c9d1d9] leading-relaxed mb-4">
                  نظام أتمتة كامل يربط استفسارات العملاء الواردة بالموقع، يقوم بتصنيفها وتقييم ملاءمتها (Lead Scoring) بناءً على قاعدة بيانات الشركة، وتوليد مسودة عرض أسعار مخصصة في غضون دقيقة واحدة.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div className="p-3.5 rounded-xl bg-[#0d1117] border border-[#30363d]">
                    <div className="font-bold text-emerald-300 mb-1.5">المعمارية التقنية:</div>
                    <ul className="space-y-1 text-[#8b949e] list-disc list-inside">
                      <li>سير عمل كامل في n8n Self-hosted عبر Docker Compose.</li>
                      <li>تكامل مع Google Forms, HubSpot, Gmail, و Slack.</li>
                      <li>آلية أمان للتعامل مع انقطاع الاتصال (Error Trigger & Retries).</li>
                    </ul>
                  </div>
                  <div className="p-3.5 rounded-xl bg-[#0d1117] border border-[#30363d]">
                    <div className="font-bold text-emerald-300 mb-1.5">أدلة النجاح في الـ README:</div>
                    <ul className="space-y-1 text-[#8b949e] list-disc list-inside">
                      <li>ملف JSON لسير العمل (Workflow Export) يمكن لأي عميل استيراده بنقرة واحدة.</li>
                      <li>دراسة حالة لحساب توفير الوقت البشري (ROI Calculation).</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 6: Career & Freelance */}
        {activeTab === 'career' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="p-6 rounded-2xl bg-[#161b22] border border-[#30363d]">
              <h2 className="text-xl font-bold text-white mb-2">استراتيجية التسويق الذاتي واقتناص الوظائف والعملاء الدوليين</h2>
              <p className="text-xs sm:text-sm text-[#8b949e]">
                معظم الخريجين يرسلون سيرتهم الذاتية في صمت وينتظرون. أنتِ ستعتمدين استراتيجية المهندسة التي تثبت كفاءتها علناً وتجبر أصحاب الشركات على التحدث معها.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* LinkedIn Strategy */}
              <div className="p-6 rounded-2xl bg-[#161b22] border border-[#30363d]">
                <h3 className="text-base font-bold text-white mb-3 flex items-center gap-2">
                  <ExternalLink className="w-4 h-4 text-rose-400" />
                  <span>1. استراتيجية LinkedIn (صناعة الأثر)</span>
                </h3>
                <p className="text-xs sm:text-sm text-[#8b949e] leading-relaxed mb-4">
                  لا تنشري صور شهادات دورات عادية؛ بل انشري تحليلات معمارية وتحديات حقيقية قمتِ بحلها:
                </p>
                <div className="space-y-3 text-xs">
                  <div className="p-3 rounded-lg bg-[#0d1117] border border-[#30363d]">
                    <span className="font-bold text-rose-300">نموذج منشور 1:</span>
                    <p className="text-[#c9d1d9] mt-1">
                      "لماذا تفشل أنظمة RAG الكلاسيكية مع الجداول المالية؟ في هذا الأسبوع قمت ببناء Benchmark لمقارنة PyPDF مقابل Docling مع Cross-Encoders، وحصلت على قفزة في الدقة من 64% إلى 94%... [مرفق رسم بياني]."
                    </p>
                  </div>
                  <div className="p-3 rounded-lg bg-[#0d1117] border border-[#30363d]">
                    <span className="font-bold text-emerald-300">نموذج منشور 2:</span>
                    <p className="text-[#c9d1d9] mt-1">
                      "كيف خفضت تكلفة نظام RAG بنسبة 45% وسرعت الاستجابة إلى 18ms باستخدام Semantic Caching على Redis؟"
                    </p>
                  </div>
                </div>
              </div>

              {/* Freelance & Upwork Strategy */}
              <div className="p-6 rounded-2xl bg-[#161b22] border border-[#30363d]">
                <h3 className="text-base font-bold text-white mb-3 flex items-center gap-2">
                  <Briefcase className="w-4 h-4 text-emerald-400" />
                  <span>2. استراتيجية العمل الحر (Upwork / Contracts)</span>
                </h3>
                <p className="text-xs sm:text-sm text-[#8b949e] leading-relaxed mb-4">
                  عند تقديم العروض للعملاء الباحثين عن حلول الذكاء الاصطناعي:
                </p>
                <div className="space-y-3 text-xs">
                  <div className="p-3 rounded-lg bg-[#0d1117] border border-[#30363d]">
                    <span className="font-bold text-amber-300">قاعدة الـ Loom Video:</span>
                    <p className="text-[#c9d1d9] mt-1">
                      سجلي فيديو مدته 60 ثانية تشرحين فيه شاشة مشروعكِ المشابه للمشكلة التي طرحها العميل في وصف المشروع. نسبة الرد على هذا العرض تتجاوز 40%!
                    </p>
                  </div>
                  <div className="p-3 rounded-lg bg-[#0d1117] border border-[#30363d]">
                    <span className="font-bold text-cyan-300">الكلمات المفتاحية الأكثر ربحية:</span>
                    <p className="text-[#c9d1d9] mt-1">
                      "Production RAG", "Custom LangGraph Agent", "n8n AI automation", "Vector DB Migration (Pinecone to Qdrant)".
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

const WEEKS_DATA = [
  {
    weekNumber: 1,
    duration: '7 أيام',
    title: 'Advanced Ingestion, Document Layout Parsing & Chunking',
    description: 'تنصيب بيئة العمل الحديثة، استخراج الوثائق المعقدة (PDFs مع جداول وهوامش) باستخدام Docling و LlamaParse، وتجربة استراتيجيات التقسيم الهرمي والدلالي.',
    deliverables: ['سكريبت Ingestion احترافي يستخرج الجداول بهيئة Markdown', 'مقارنة دقة الاحتفاظ بالمعلومات بين التقسيم العادي والهرمي']
  },
  {
    weekNumber: 2,
    duration: '7 أيام',
    title: 'Vector Embeddings & Vector Databases (Qdrant & pgvector)',
    description: 'فهم عميق لنماذج التضمين على مقياس MTEB، تشغيل Qdrant محلياً عبر Docker، وبناء استعلامات البحث الدلالي مع فلاتر الـ Payload Metadata.',
    deliverables: ['حاوية Docker لـ Qdrant تعمل بكفاءة مع بيانات حقيقية', 'دوال تضمين مخصصة تدعم التعدد اللغوي (عربي/إنجليزي)']
  },
  {
    weekNumber: 3,
    duration: '7 أيام',
    title: 'Hybrid Search (Dense + BM25) & Cross-Encoder Reranking',
    description: 'تطبيق البحث الهجين الفعلي عبر خوارزمية Reciprocal Rank Fusion، ودمج نموذج Cross-Encoder (مثل Cohere أو BGE-Reranker-large) لإعادة ترتيب النتائج قبل إرسالها للـ LLM.',
    deliverables: ['Pipeline كامل يدمج الكلمات المفتاحية مع المعاني الدلالية', 'تحسين دقة استرجاع المقاطع الأكثر صلة بنسبة تفوق 30%']
  },
  {
    weekNumber: 4,
    duration: '7 أيام',
    title: 'Quantitative Evaluation (Ragas), Guardrails & Tracing',
    description: 'إنشاء مجموعة بيانات اختبارية Synthetic Evaluation Dataset، وتطبيق مكتبة Ragas لقياس Faithfulness و Answer Relevance، وربط نظام Langfuse لتتبع كل استدعاء وتكلفته.',
    deliverables: ['لوحة قياس تقييمية بنسب مئوية تثبت عدم وجود هلوسة', 'تتبع كامل عبر Langfuse لكل Token وزمن استجابة']
  },
  {
    weekNumber: 5,
    duration: '7 أيام',
    title: 'Stateful AI Agents via LangGraph & Tool Calling',
    description: 'الانتقال من RAG الثابت إلى وكيل ذكي ذي حالة (StateGraph). بناء وكيل RAG ذاتي التصحيح يعيد صياغة سؤاله عند نقص المعلومات، وإضافة نقطة توقف بشرية (Human-in-the-loop).',
    deliverables: ['وكيل ذكي متكامل بـ LangGraph يصحح أخطاءه ذاتياً', 'دعم حفظ الحالة (State Checkpointing) والذاكرة المستمرة']
  },
  {
    weekNumber: 6,
    duration: '7 أيام',
    title: 'Enterprise Workflow Automation with n8n & Webhooks',
    description: 'تنصيب n8n Self-hosted عبر Docker Compose، وبناء سير عمل مؤتمت يستقبل رسائل البريد الإلكتروني أو سلاك، يمررها لخدمة الـ AI، ويرسل التقارير لقواعد البيانات الخارجية.',
    deliverables: ['سير عمل n8n كامل مربوط بـ Webhooks', 'تكامل آمن مع Google Sheets, Slack, و CRM']
  },
  {
    weekNumber: 7,
    duration: '7 أيام',
    title: 'Production FastAPI Microservice & Semantic Caching',
    description: 'كتابة واجهة برمجية عالية الأداء بـ FastAPI تدعم الـ Async Streaming عبر SSE، إضافة طبقة Semantic Cache بـ Redis، وتغليف النظام بالكامل داخل Docker.',
    deliverables: ['Microservice سريع بزمن استجابة أقل من ثانية وبث مباشر للكلمات', 'توفير التكلفة بنسبة 45% عبر Redis Cache']
  },
  {
    weekNumber: 8,
    duration: '7 أيام',
    title: 'Portfolio Documentation, Loom Videos & Market Launch',
    description: 'توثيق المشاريع الثلاثة على GitHub بملفات README احترافية ومخططات معمارية، تسجيل فيديوهات Loom توضيحية، وإطلاق حملة التواصل على LinkedIn و Upwork.',
    deliverables: ['3 مستودعات GitHub مجهزة بمعايير هندسية عالمية', 'ملف سيرة ذاتية وحساب LinkedIn موجه لوظائف Applied AI Engineer']
  }
];

const MARKDOWN_CONTENT = `# خارطة طريق هندسة نظم RAG والأتمتة الذكية للوصول إلى مرحلة الإنتاج (Production-Grade)
> إعداد مخصص لمهندسة الذكاء الاصطناعي (خريجة علم حاسوب - امتياز 94% - خلفية ML/DL)

## 1. التموضع الاستراتيجي
بصفتكِ خريجة علم حاسوب بمعدل 94% ولديكِ خلفية قوية في تعلم الآلة (ML) والتعلم العميق (DL):
- نقطة قوتكِ العظمى: لستِ مستخدمة سطحية لأطر العمل، بل تفهمين رياضيات المتجهات (Cosine Similarity، Dot Product)، ومعمارية الـ Transformer (Self-Attention، Tokenization)، ومقاييس الدقة والاستدعاء (Precision, Recall, F1).
- الهدف المستهدف: التموضع كـ Applied AI / Production RAG Engineer قادر على بناء أنظمة بدقة تتجاوز 95% وبزمن استجابة فوري وتكلفة محسوبة.

## 2. الفرق بين RAG التعليمي والإنتاجي
- RAG التعليمي: Character Splitter 500، استرجاع Top-3 متجهي فقط، يدمر الجداول، تقييم عشوائي بالعين، وتكلفة عالية.
- RAG الإنتاجي: استخراج Layout-Aware (Docling)، بحث هجين (Dense + BM25 via RRF)، إعادة ترتيب بـ Cross-Encoder، تقييم كمي عبر Ragas (Faithfulness > 95%)، و Semantic Caching عبر Redis.

## 3. مشاريع البورتفوليو الثلاثة
1. Enterprise Regulatory & Financial Auditor RAG (Docling + Qdrant + BM25 + Cohere Rerank + Ragas)
2. Self-Corrective Autonomous IT Support & DevOps Agent (LangGraph + Human-in-the-loop + Slack)
3. Intelligent Lead Scoring & Client Automation Pipeline (n8n + FastAPI + CRM)
`;
