import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { accent, AgentStatusBadge, categoryAccent, Icon, TVFocusable } from "@/components/tv-ui-kit/TVKit";
import { CATEGORY_META } from "@/data/mockData";
import type { ActivityStatus, AgendaPlan, Profile } from "@/types";
import { cn } from "@/lib/utils";

const REPLAN_OPTIONS = [
  { minutes: 8, label: "We only have 8 minutes", icon: "Timer" },
  { minutes: 20, label: "Reset to a 20 minute mix", icon: "ArrowsClockwise" },
  { minutes: 45, label: "We have 45 minutes tonight", icon: "Fire" },
];

const STATUS_DOT: Record<ActivityStatus, string> = {
  completed: "bg-emerald-400",
  active: "bg-amber-400",
  pending: "bg-white/25",
};

export default function AdaptivePlanView({
  plan,
  profile,
  onPlanUpdate,
  onReplan,
  onBack,
}: {
  plan: AgendaPlan;
  profile: Profile;
  onPlanUpdate: (plan: AgendaPlan) => void;
  onReplan: (minutes: number) => void;
  onBack: () => void;
}) {
  const [selected, setSelected] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    const idx = plan.items.findIndex((i) => i.status !== "completed");
    setSelected(idx === -1 ? 0 : idx);
    setAnswers({});
    setPlaying(false);
  }, [plan]);

  if (plan.items.length === 0) {
    return (
      <div className="space-y-6">
        <TVFocusable id="plan-back-empty" glow="amber" onSelect={onBack} className="flex items-center gap-2 rounded-full border border-white/15 px-4 py-2 text-sm font-semibold text-white/70">
          <Icon name="ArrowLeft" className="h-4 w-4" />
          Home
        </TVFocusable>
        <div className="rounded-3xl border border-dashed border-white/15 p-10 text-center">
          <Icon name="Stack" className="mx-auto h-8 w-8 text-white/40" />
          <p className="mt-3 text-lg font-semibold text-white">No activities in this agenda yet</p>
          <p className="mt-1 text-sm text-white/50">Ask NEXA for a goal and it will build the plan for you.</p>
        </div>
      </div>
    );
  }

  const item = plan.items[selected] ?? plan.items[0];
  const total = plan.items.reduce((sum, i) => sum + i.durationMinutes, 0);
  const completed = plan.items.filter((i) => i.status === "completed").length;
  const progress = Math.round((completed / plan.items.length) * 100);
  const a = accent(categoryAccent(item.category));
  const label = CATEGORY_META[item.category];

  const completeAndAdvance = (mode: "complete" | "skip") => {
    const nextIdx = plan.items.findIndex((i, idx) => idx > selected && i.status !== "completed");
    const nextActive = nextIdx === -1 ? null : plan.items[nextIdx];
    const items = plan.items.map((i) => {
      if (i.id === item.id) return { ...i, status: "completed" as ActivityStatus };
      if (nextActive && i.id === nextActive.id) return { ...i, status: "active" as ActivityStatus };
      return i;
    });
    onPlanUpdate({ ...plan, items, lastModified: new Date().toISOString() });
    setPlaying(false);
    setAnswers({});
    if (nextActive) {
      const target = items.findIndex((i) => i.id === nextActive.id);
      setSelected(target);
      toast.success(mode === "complete" ? `${item.title} complete. Next: ${nextActive.title}` : `Skipped ${item.title}`);
    } else {
      toast.success("Agenda complete. Great evening!");
    }
  };

  const answer = (questionId: string, optionIndex: number) => {
    if (answers[questionId] !== undefined) return;
    setAnswers((prev) => ({ ...prev, [questionId]: optionIndex }));
  };

  const quizScore = item.quiz
    ? item.quiz.filter((q) => answers[q.id] === q.answerIndex).length
    : 0;
  const quizAnswered = item.quiz ? item.quiz.filter((q) => answers[q.id] !== undefined).length : 0;

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <TVFocusable id="plan-back" glow="amber" onSelect={onBack} className="flex items-center gap-2 rounded-full border border-white/15 px-4 py-2 text-sm font-semibold text-white/70">
          <Icon name="ArrowLeft" className="h-4 w-4" />
          Home
        </TVFocusable>
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-2 rounded-full bg-white/[0.05] px-4 py-2 text-sm font-semibold text-white/70">
            <Icon name="Timer" className="h-4 w-4 text-amber-300" />
            {total} min planned
          </span>
          <AgentStatusBadge status="ready" />
        </div>
      </div>

      <div>
        <h1 className="text-3xl font-semibold tracking-tight text-white md:text-4xl">{plan.title}</h1>
        <p className="mt-2 max-w-[70ch] text-base text-white/55">{plan.outcomeMessage}</p>
      </div>

      <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-5 backdrop-blur">
        <div className="flex items-center justify-between text-sm font-semibold text-white/60">
          <span>{completed} of {plan.items.length} activities complete</span>
          <span>{progress}%</span>
        </div>
        <div className="mt-3 h-2.5 w-full overflow-hidden rounded-full bg-white/10">
          <div className={cn("h-full rounded-full transition-all duration-500", a.solid)} style={{ width: `${progress}%` }} />
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_1.35fr]">
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-white">Tonight&apos;s agenda</h2>
          <div className="space-y-3">
            {plan.items.map((entry, idx) => {
              const ea = accent(categoryAccent(entry.category));
              const isActive = idx === selected;
              return (
                <TVFocusable
                  key={entry.id}
                  id={`timeline-${entry.id}`}
                  glow={categoryAccent(entry.category)}
                  onSelect={() => {
                    setSelected(idx);
                    setPlaying(false);
                    setAnswers({});
                  }}
                  className={cn(
                    "flex w-full items-center gap-4 rounded-2xl border p-4 text-left backdrop-blur",
                    isActive ? cn(ea.bg, ea.border) : "border-white/10 bg-white/[0.03]",
                  )}
                >
                  <span className={cn("h-3 w-3 shrink-0 rounded-full", STATUS_DOT[entry.status])} />
                  <span className={cn("grid h-11 w-11 shrink-0 place-items-center rounded-xl border", ea.bg, ea.border, ea.text)}>
                    <Icon name={entry.icon} className="h-5 w-5" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-base font-semibold text-white">{entry.title}</span>
                    <span className="block text-xs font-medium text-white/45">
                      {CATEGORY_META[entry.category].label} - {entry.durationMinutes} min
                      {entry.status === "completed" ? " - done" : ""}
                    </span>
                  </span>
                  {entry.status === "completed" ? <Icon name="CheckCircle" className="h-5 w-5 shrink-0 text-emerald-400" /> : null}
                </TVFocusable>
              );
            })}
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-5 backdrop-blur">
            <h3 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.22em] text-white/50">
              <Icon name="Lightning" className="h-4 w-4 text-violet-300" />
              Adapt the plan
            </h3>
            <p className="mt-2 text-sm text-white/50">Plans change. The agent reshapes the whole agenda without you starting over.</p>
            <div className="mt-4 space-y-2">
              {REPLAN_OPTIONS.map((option) => (
                <TVFocusable
                  key={option.minutes}
                  id={`replan-${option.minutes}`}
                  glow="violet"
                  onSelect={() => onReplan(option.minutes)}
                  className={cn(
                    "flex w-full items-center justify-between rounded-2xl border px-4 py-3 text-left text-sm font-semibold",
                    plan.targetMinutes === option.minutes ? "border-violet-400/50 bg-violet-500/15 text-violet-100" : "border-white/10 bg-white/[0.03] text-white/70",
                  )}
                >
                  <span className="flex items-center gap-2">
                    <Icon name={option.icon} className="h-4 w-4" />
                    {option.label}
                  </span>
                  <span className="text-xs text-white/40">{option.minutes} min</span>
                </TVFocusable>
              ))}
            </div>
          </div>
        </div>

        <motion.div
          key={item.id}
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="space-y-5 rounded-3xl border border-white/10 bg-white/[0.04] p-6 backdrop-blur"
        >
          <div className="flex items-start justify-between gap-4">
            <div>
              <span className={cn("inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-semibold", a.bg, a.border, a.text)}>
                <Icon name={item.icon} className="h-3.5 w-3.5" />
                {label.label}
              </span>
              <h2 className="mt-3 text-2xl font-semibold text-white">{item.title}</h2>
              <p className="mt-2 max-w-[58ch] text-base leading-relaxed text-white/60">{item.description}</p>
            </div>
            <span className="flex shrink-0 items-center gap-2 rounded-2xl bg-white/[0.05] px-4 py-2 text-sm font-semibold text-white/70">
              <Icon name="Clock" className="h-4 w-4" />
              {item.durationMinutes} min
            </span>
          </div>

          {item.category === "entertainment" ? (
            <div className="overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-sky-500/20 to-slate-950/60 p-6">
              <div className="flex h-40 items-center justify-center">
                <button
                  type="button"
                  aria-label={playing ? "Pause" : "Play"}
                  onClick={() => setPlaying((p) => !p)}
                  className="grid h-20 w-20 place-items-center rounded-full bg-white text-slate-950 transition hover:scale-105"
                >
                  <Icon name={playing ? "Pause" : "Play"} weight="fill" className="h-9 w-9" />
                </button>
              </div>
              <div className="flex items-center justify-center gap-3">
                <TVFocusable id="media-rewind" glow="sky" onSelect={() => toast.info("Rewound 15 seconds")} className="grid h-12 w-12 place-items-center rounded-xl border border-white/15 text-white/80">
                  <Icon name="Rewind" className="h-5 w-5" />
                </TVFocusable>
                <TVFocusable id="media-back" glow="sky" onSelect={() => setPlaying(false)} className="grid h-12 w-12 place-items-center rounded-xl border border-white/15 text-white/80">
                  <Icon name="Pause" className="h-5 w-5" />
                </TVFocusable>
                <TVFocusable id="media-forward" glow="sky" onSelect={() => toast.info("Skipped ahead 15 seconds")} className="grid h-12 w-12 place-items-center rounded-xl border border-white/15 text-white/80">
                  <Icon name="FastForward" className="h-5 w-5" />
                </TVFocusable>
                <TVFocusable id="media-full" glow="sky" onSelect={() => toast.info("Full screen viewing")} className="grid h-12 w-12 place-items-center rounded-xl border border-white/15 text-white/80">
                  <Icon name="CornersOut" className="h-5 w-5" />
                </TVFocusable>
              </div>
            </div>
          ) : null}

          {item.details.length > 0 ? (
            <div className="grid gap-2 sm:grid-cols-2">
              {item.details.map((detail) => (
                <div key={detail} className="flex items-start gap-2 rounded-2xl bg-white/[0.03] px-4 py-3">
                  <Icon name="Star" weight="fill" className={cn("mt-0.5 h-4 w-4 shrink-0", a.text)} />
                  <span className="text-sm leading-snug text-white/65">{detail}</span>
                </div>
              ))}
            </div>
          ) : null}

          {item.routine && item.routine.length > 0 ? (
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
              <h3 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.2em] text-white/50">
                <Icon name="Barbell" className="h-4 w-4 text-amber-300" />
                Follow along
              </h3>
              <ol className="mt-3 space-y-2">
                {item.routine.map((step, i) => (
                  <li key={step} className="flex items-center gap-3 text-sm text-white/70">
                    <span className="grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-amber-500/15 text-xs font-bold text-amber-200">{i + 1}</span>
                    {step}
                  </li>
                ))}
              </ol>
            </div>
          ) : null}

          {item.quiz && item.quiz.length > 0 ? (
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
              <div className="flex items-center justify-between">
                <h3 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.2em] text-white/50">
                  <Icon name="Trophy" className="h-4 w-4 text-rose-300" />
                  Family quiz
                </h3>
                <span className="text-xs font-semibold text-white/45">
                  {quizAnswered}/{item.quiz.length} answered - score {quizScore}
                </span>
              </div>
              <div className="mt-4 space-y-5">
                {item.quiz.map((question) => {
                  const picked = answers[question.id];
                  return (
                    <div key={question.id}>
                      <p className="text-base font-medium text-white">{question.question}</p>
                      <div className="mt-3 grid gap-2 sm:grid-cols-2">
                        {question.options.map((option, idx) => {
                          const isPicked = picked === idx;
                          const isCorrect = idx === question.answerIndex;
                          const revealed = picked !== undefined;
                          return (
                            <TVFocusable
                              key={option}
                              id={`quiz-${question.id}-${idx}`}
                              glow={revealed && isCorrect ? "emerald" : "rose"}
                              onSelect={() => answer(question.id, idx)}
                              className={cn(
                                "flex items-center justify-between gap-3 rounded-2xl border px-4 py-3 text-left text-sm font-medium",
                                revealed && isCorrect
                                  ? "border-emerald-400/50 bg-emerald-500/15 text-emerald-100"
                                  : isPicked
                                    ? "border-rose-400/50 bg-rose-500/15 text-rose-100"
                                    : "border-white/10 bg-white/[0.03] text-white/70",
                              )}
                            >
                              {option}
                              {revealed && isCorrect ? <Icon name="Check" className="h-4 w-4 shrink-0" /> : null}
                              {isPicked && !isCorrect ? <Icon name="X" className="h-4 w-4 shrink-0" /> : null}
                            </TVFocusable>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : null}

          <div className="flex flex-wrap items-center gap-3 pt-1">
            <TVFocusable
              id={`complete-${item.id}`}
              glow="emerald"
              onSelect={() => completeAndAdvance("complete")}
              className="flex items-center gap-2 rounded-2xl bg-white px-6 py-4 text-base font-semibold text-slate-950"
            >
              <Icon name="Check" weight="bold" className="h-5 w-5" />
              Mark complete
            </TVFocusable>
            <TVFocusable
              id={`skip-${item.id}`}
              glow="amber"
              onSelect={() => completeAndAdvance("skip")}
              className="flex items-center gap-2 rounded-2xl border border-white/15 px-6 py-4 text-base font-semibold text-white/70"
            >
              Skip for tonight
              <Icon name="CaretRight" className="h-5 w-5" />
            </TVFocusable>
            <span className="text-xs font-medium text-white/40">Last updated for {profile.name}</span>
          </div>
        </motion.div>
      </div>
    </div>
  );
}