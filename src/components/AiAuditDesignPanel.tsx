import React, { useState } from 'react';
import { useTransit } from '../context/TransitContext';
import {
  COMMUTER_EMPATHY_MAP,
  DISPATCHER_EMPATHY_MAP,
  DESIGN_THINKING_PROGRESSION,
  DISCARDED_DESIGN_IDEAS,
  AI_PROMPT_AUDIT_LOGS
} from '../data/aiAuditDesignData';
import {
  Brain,
  Layers,
  HeartHandshake,
  Lightbulb,
  XCircle,
  CheckCircle2,
  Code2,
  ShieldCheck,
  Zap,
  Terminal,
  FileCode,
  ArrowRight,
  BookOpen
} from 'lucide-react';

export const AiAuditDesignPanel: React.FC = () => {
  const { theme } = useTransit();
  const [activeSubTab, setActiveSubTab] = useState<'empathy' | 'design_thinking' | 'discarded' | 'prompts'>('empathy');
  const [selectedPersona, setSelectedPersona] = useState<'commuter' | 'dispatcher'>('commuter');
  const [selectedPromptId, setSelectedPromptId] = useState<string>(AI_PROMPT_AUDIT_LOGS[0].id);

  const activeEmpathy = selectedPersona === 'commuter' ? COMMUTER_EMPATHY_MAP : DISPATCHER_EMPATHY_MAP;
  const activePrompt = AI_PROMPT_AUDIT_LOGS.find((p) => p.id === selectedPromptId) || AI_PROMPT_AUDIT_LOGS[0];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8 animate-in fade-in-50 duration-300">
      
      {/* Header Banner */}
      <div className={`p-6 rounded-2xl border transition-all ${
        theme === 'dark'
          ? 'bg-gradient-to-r from-slate-900 via-slate-900/90 to-indigo-950/40 border-slate-800'
          : 'bg-gradient-to-r from-white via-indigo-50/40 to-blue-50/30 border-slate-200 shadow-sm'
      }`}>
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
              Academic & Design Audit
            </span>
            <span className="flex items-center gap-1 text-xs font-semibold text-cyan-400">
              <Brain className="w-3.5 h-3.5" />
              Design Thinking & AI Prompt Transparency
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            AI Interaction Audit & Design Progression
          </h1>
          <p className="text-sm text-slate-400 max-w-3xl leading-relaxed">
            Documenting the human-centered design thinking lifecycle: commuter empathy maps, discarded architectural 
            alternatives with empirical justifications, and audited AI system prompts with hallucination guardrails.
          </p>
        </div>

        {/* Sub-Navigation Buttons */}
        <div className="flex flex-wrap items-center gap-2 mt-6 pt-4 border-t border-slate-800/80">
          <button
            onClick={() => setActiveSubTab('empathy')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
              activeSubTab === 'empathy'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                : 'bg-slate-800/60 hover:bg-slate-700/60 text-slate-300'
            }`}
          >
            <HeartHandshake className="w-4 h-4" />
            <span>User Empathy Maps</span>
          </button>

          <button
            onClick={() => setActiveSubTab('design_thinking')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
              activeSubTab === 'design_thinking'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                : 'bg-slate-800/60 hover:bg-slate-700/60 text-slate-300'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>5-Stage Design Progression</span>
          </button>

          <button
            onClick={() => setActiveSubTab('discarded')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
              activeSubTab === 'discarded'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                : 'bg-slate-800/60 hover:bg-slate-700/60 text-slate-300'
            }`}
          >
            <XCircle className="w-4 h-4 text-rose-400" />
            <span>Discarded Design Ideas ({DISCARDED_DESIGN_IDEAS.length})</span>
          </button>

          <button
            onClick={() => setActiveSubTab('prompts')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
              activeSubTab === 'prompts'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                : 'bg-slate-800/60 hover:bg-slate-700/60 text-slate-300'
            }`}
          >
            <Terminal className="w-4 h-4 text-cyan-400" />
            <span>AI Prompts & Guardrails Audit</span>
          </button>
        </div>
      </div>

      {/* VIEW 1: User Empathy Maps */}
      {activeSubTab === 'empathy' && (
        <div className="space-y-6">
          {/* Persona Switcher */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setSelectedPersona('commuter')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  selectedPersona === 'commuter'
                    ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                    : 'bg-slate-900 border border-slate-800 text-slate-400'
                }`}
              >
                Daily Commuter Profile (Priya Narayanan)
              </button>
              <button
                onClick={() => setSelectedPersona('dispatcher')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  selectedPersona === 'dispatcher'
                    ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                    : 'bg-slate-900 border border-slate-800 text-slate-400'
                }`}
              >
                Fleet Controller Profile (S. Balasubramaniam)
              </button>
            </div>
          </div>

          {/* Persona Summary Card */}
          <div className={`p-5 rounded-2xl border ${
            theme === 'dark' ? 'bg-slate-900/80 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
          }`}>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-cyan-400">
                  {activeEmpathy.archetype} Empathy Profile
                </span>
                <h2 className="text-xl font-black mt-0.5">{activeEmpathy.persona}</h2>
                <p className="text-xs text-slate-400 mt-1">{activeEmpathy.tagline}</p>
                <p className="text-[11px] text-slate-500 mt-0.5">Demographics: {activeEmpathy.demographics}</p>
              </div>

              <div className="flex gap-4">
                <div className="p-3 rounded-xl bg-slate-950/40 border border-slate-800 text-xs">
                  <span className="font-bold text-emerald-400 block mb-1">Key Goals:</span>
                  <ul className="space-y-0.5 text-[11px] text-slate-300 list-disc list-inside">
                    {activeEmpathy.goals.slice(0, 2).map((g, idx) => (
                      <li key={idx} className="truncate max-w-xs">{g}</li>
                    ))}
                  </ul>
                </div>
                <div className="p-3 rounded-xl bg-slate-950/40 border border-slate-800 text-xs">
                  <span className="font-bold text-rose-400 block mb-1">Key Frustrations:</span>
                  <ul className="space-y-0.5 text-[11px] text-slate-300 list-disc list-inside">
                    {activeEmpathy.frustrations.slice(0, 2).map((f, idx) => (
                      <li key={idx} className="truncate max-w-xs">{f}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Empathy Map 4-Quadrant Matrix */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Quadrant: SAYS */}
            <div className={`p-5 rounded-2xl border ${
              theme === 'dark' ? 'bg-slate-900/90 border-cyan-500/30' : 'bg-white border-cyan-200 shadow-sm'
            }`}>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-2.5 h-2.5 rounded-full bg-cyan-400" />
                <h3 className="text-sm font-extrabold uppercase tracking-wider text-cyan-400">
                  1. SAYS (Direct User Quotes & Expressions)
                </h3>
              </div>
              <p className="text-xs text-slate-400 mb-3">What the stakeholder explicitly verbalizes in interviews:</p>
              <div className="space-y-2">
                {activeEmpathy.quadrant.says.map((quote, idx) => (
                  <div key={idx} className="p-3 rounded-xl bg-slate-950/50 border border-slate-800/80 text-xs italic text-slate-200">
                    {quote}
                  </div>
                ))}
              </div>
            </div>

            {/* Quadrant: THINKS */}
            <div className={`p-5 rounded-2xl border ${
              theme === 'dark' ? 'bg-slate-900/90 border-indigo-500/30' : 'bg-white border-indigo-200 shadow-sm'
            }`}>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-2.5 h-2.5 rounded-full bg-indigo-400" />
                <h3 className="text-sm font-extrabold uppercase tracking-wider text-indigo-400">
                  2. THINKS (Internal Beliefs, Doubts & Hopes)
                </h3>
              </div>
              <p className="text-xs text-slate-400 mb-3">What is unspoken in their thoughts and expectations:</p>
              <div className="space-y-2">
                {activeEmpathy.quadrant.thinks.map((thought, idx) => (
                  <div key={idx} className="p-3 rounded-xl bg-slate-950/50 border border-slate-800/80 text-xs text-slate-200">
                    💡 {thought}
                  </div>
                ))}
              </div>
            </div>

            {/* Quadrant: DOES */}
            <div className={`p-5 rounded-2xl border ${
              theme === 'dark' ? 'bg-slate-900/90 border-amber-500/30' : 'bg-white border-amber-200 shadow-sm'
            }`}>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                <h3 className="text-sm font-extrabold uppercase tracking-wider text-amber-400">
                  3. DOES (Observable Actions & Habits)
                </h3>
              </div>
              <p className="text-xs text-slate-400 mb-3">Real-world coping mechanisms and physical behaviors:</p>
              <div className="space-y-2">
                {activeEmpathy.quadrant.does.map((action, idx) => (
                  <div key={idx} className="p-3 rounded-xl bg-slate-950/50 border border-slate-800/80 text-xs text-slate-200 flex items-start gap-2">
                    <ArrowRight className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                    <span>{action}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Quadrant: FEELS */}
            <div className={`p-5 rounded-2xl border ${
              theme === 'dark' ? 'bg-slate-900/90 border-rose-500/30' : 'bg-white border-rose-200 shadow-sm'
            }`}>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-2.5 h-2.5 rounded-full bg-rose-400" />
                <h3 className="text-sm font-extrabold uppercase tracking-wider text-rose-400">
                  4. FEELS (Emotional States & Anxieties)
                </h3>
              </div>
              <p className="text-xs text-slate-400 mb-3">Emotional journey from uncertainty to empowerment:</p>
              <div className="space-y-2">
                {activeEmpathy.quadrant.feels.map((emotion, idx) => (
                  <div key={idx} className="p-3 rounded-xl bg-slate-950/50 border border-slate-800/80 text-xs text-slate-200">
                    ❤️ {emotion}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* VIEW 2: 5-Stage Design Progression */}
      {activeSubTab === 'design_thinking' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 gap-6">
            {DESIGN_THINKING_PROGRESSION.map((stage, idx) => (
              <div
                key={idx}
                className={`p-6 rounded-2xl border transition-all ${
                  theme === 'dark'
                    ? 'bg-slate-900/80 border-slate-800'
                    : 'bg-white border-slate-200 shadow-sm'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4 pb-3 border-b border-slate-800">
                  <div className="flex items-center gap-3">
                    <span className="flex items-center justify-center w-7 h-7 rounded-xl bg-indigo-500/20 text-indigo-400 font-black text-xs">
                      0{idx + 1}
                    </span>
                    <h3 className="text-lg font-black">{stage.phase}</h3>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-500/15 text-indigo-300 border border-indigo-500/30">
                      {stage.badge}
                    </span>
                  </div>
                  <span className="text-xs text-slate-400 font-semibold">{stage.duration}</span>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 text-xs">
                  <div>
                    <h4 className="font-bold text-slate-300 uppercase tracking-wider mb-1.5">Core Objective</h4>
                    <p className="text-slate-400 leading-relaxed">{stage.objective}</p>
                  </div>

                  <div>
                    <h4 className="font-bold text-slate-300 uppercase tracking-wider mb-1.5">Activities & Methods</h4>
                    <ul className="space-y-1 text-slate-300 list-disc list-inside">
                      {stage.activities.map((act, i) => (
                        <li key={i} className="leading-relaxed">{act}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="p-3.5 rounded-xl bg-indigo-950/30 border border-indigo-800/40">
                    <h4 className="font-bold text-indigo-300 uppercase tracking-wider mb-1">Key Insight Derived</h4>
                    <p className="text-indigo-200 italic leading-relaxed">"{stage.keyInsight}"</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* VIEW 3: Discarded Design Ideas */}
      {activeSubTab === 'discarded' && (
        <div className="space-y-6">
          <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-xs text-rose-300">
            <strong>Rigorous Design Audit:</strong> To meet academic and industrial rigor, we systematically tested 
            and discarded these 4 design concepts based on quantitative empirical failure metrics.
          </div>

          <div className="grid grid-cols-1 gap-6">
            {DISCARDED_DESIGN_IDEAS.map((idea) => (
              <div
                key={idea.id}
                className={`p-6 rounded-2xl border transition-all ${
                  theme === 'dark'
                    ? 'bg-slate-900/90 border-slate-800'
                    : 'bg-white border-slate-200 shadow-sm'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                  <div className="flex items-center gap-2">
                    <XCircle className="w-5 h-5 text-rose-400 shrink-0" />
                    <h3 className="text-base font-black text-rose-300">{idea.title}</h3>
                  </div>
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-rose-500/20 text-rose-400 border border-rose-500/30">
                    {idea.impactScore}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-xs mt-4">
                  <div className="p-3 rounded-xl bg-slate-950/40 border border-slate-800">
                    <span className="font-bold text-slate-400 block mb-1">Original Hypothesis:</span>
                    <p className="text-slate-300">{idea.originalHypothesis}</p>
                  </div>

                  <div className="p-3 rounded-xl bg-rose-950/20 border border-rose-900/40">
                    <span className="font-bold text-rose-400 block mb-1">Why Discarded (Fatal Flaw):</span>
                    <p className="text-rose-200">{idea.whyDiscarded}</p>
                  </div>

                  <div className="p-3 rounded-xl bg-amber-950/20 border border-amber-900/40">
                    <span className="font-bold text-amber-400 block mb-1">Empirical Test Metric:</span>
                    <p className="text-amber-200 font-mono text-[11px]">{idea.testFindingOrMetric}</p>
                  </div>

                  <div className="p-3 rounded-xl bg-emerald-950/20 border border-emerald-900/40">
                    <span className="font-bold text-emerald-400 block mb-1">Superior Alternative Adopted:</span>
                    <p className="text-emerald-200 font-semibold">{idea.superiorAlternativeAdopted}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* VIEW 4: AI Prompts & Guardrails Audit */}
      {activeSubTab === 'prompts' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Prompt Selector List */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Audited System Prompts</h3>
            {AI_PROMPT_AUDIT_LOGS.map((prompt) => (
              <button
                key={prompt.id}
                onClick={() => setSelectedPromptId(prompt.id)}
                className={`w-full text-left p-4 rounded-xl border transition-all ${
                  selectedPromptId === prompt.id
                    ? 'bg-indigo-600/20 border-indigo-500/50 text-indigo-200 shadow-md'
                    : 'bg-slate-900/70 border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                <div className="flex items-center justify-between text-[11px] mb-1">
                  <span className="font-bold uppercase tracking-wider text-cyan-400">{prompt.id}</span>
                  <span className="font-mono text-slate-500">Latency: {prompt.latencyBudgetMs}ms</span>
                </div>
                <h4 className="text-xs font-black text-slate-100">{prompt.module}</h4>
                <p className="text-[11px] text-slate-400 mt-1 line-clamp-2">{prompt.purpose}</p>
              </button>
            ))}
          </div>

          {/* Selected Prompt Detail Inspector */}
          <div className={`lg:col-span-2 p-6 rounded-2xl border space-y-5 ${
            theme === 'dark' ? 'bg-slate-900/90 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
          }`}>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-400">
                Module Code Audit: {activePrompt.id}
              </span>
              <h3 className="text-lg font-black mt-0.5">{activePrompt.module}</h3>
              <p className="text-xs text-slate-400 mt-1">{activePrompt.purpose}</p>
            </div>

            {/* System Prompt Code Box */}
            <div>
              <div className="flex items-center justify-between text-xs font-bold text-slate-400 mb-2">
                <span className="flex items-center gap-1.5">
                  <Terminal className="w-3.5 h-3.5 text-cyan-400" />
                  System Prompt Template (Strictly Audited)
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-mono">
                  Execution Budget: {activePrompt.latencyBudgetMs}ms
                </span>
              </div>
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs text-emerald-400/90 leading-relaxed overflow-x-auto whitespace-pre-wrap">
                {activePrompt.systemPrompt}
              </div>
            </div>

            {/* Guardrails & Hallucination Mitigation */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 space-y-1.5">
                <span className="font-bold text-amber-400 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4" />
                  Operational Guardrails
                </span>
                <ul className="space-y-1 text-slate-300 list-disc list-inside text-[11px]">
                  {activePrompt.guardrails.map((g, i) => (
                    <li key={i}>{g}</li>
                  ))}
                </ul>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 space-y-1.5">
                <span className="font-bold text-indigo-400 flex items-center gap-1.5">
                  <Zap className="w-4 h-4" />
                  Hallucination Mitigation
                </span>
                <p className="text-slate-300 text-[11px] leading-relaxed">
                  {activePrompt.hallucinationMitigation}
                </p>
                <div className="pt-2">
                  <span className="text-[10px] text-slate-500 font-bold uppercase block">Output Contract:</span>
                  <span className="font-mono text-[10px] text-cyan-300">{activePrompt.outputFormat}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
