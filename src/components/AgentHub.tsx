import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { toast } from "sonner";
import { AgentPlanCard, AgentStatusBadge, Icon, TVFocusable } from "@/components/tv-ui-kit/TVKit";
import { AGENT_TOOL_NAMES, buildInvocations, planFromPrompt } from "@/data/mockData";
import type { AgendaPlan, AgentStatus, AgentToolInvocation, Profile } from "@/types";
import { cn } from "@/lib/utils";

const KEY_ROWS = [
  ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
  ["A", "S", "D", "F", "G", "H", "J", "K", "L"],
  ["Z", "X", "C", "V", "B", "N", "M"],
];

type Phase = "idle" | "running" | "done";

export default function AgentHub({
  profile,
  seedPrompt,
  onPlanGenerated,
  onOpenPlan,
  onBack,
}: {
  profile: Profile;
  seedPrompt?: string;
  onPlanGenerated: (plan: AgendaPlan) => void;
  onOpenPlan: () => void;
  onBack: () => void;
}) {
  const [prompt, setPrompt] = useState(seedPrompt || profile.prompts[0] || "Plan our evening");
  const [phase, setPhase] = useState<Phase>("idle");
  const [invocations, setInvocations] = useState<AgentToolInvocation[]>([]);
  const [revealed, setRevealed] = useState(0);
  const [plan, setPlan] = useState<AgendaPlan | null>(null);
  const timers = useRef<number[]>([]);

  useEffect(() => {
    if (seedPrompt) setPrompt(seedPrompt);
  }, [seedPrompt]);

  useEffect(() => () => timers.current.forEach((t) => window.clearTimeout(t)), []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (phase !== "idle") return;
      const target = e.target as HTMLElement | null;
      if (target && (target.tagName === "INPUT" || target.tagName === "TEXTAREA")) return;
      if (e.key === "Backspace") {
        e.preventDefault();
        setPrompt((p) => p.slice(0, -1));
        return;
      }
      if (e.key === "Enter") return;
      if (e.key === " ") {
        if (target && target.tagName === "BUTTON") return;
        e.preventDefault();
        setPrompt((p) => `${p} `.slice(0, 150));
        return;
      }
      if (e.key.length === 1) setPrompt((p) => (p + e.key).slice(0, 150));
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [phase]);

  const run = () => {
    if (!prompt.trim()) {
      toast.error("Tell NEXA what your household wants to do.");
      return;
    }
    const inv = buildInvocations(prompt);
    timers.current.forEach((t) => window.clearTimeout(t));
    timers.current = [];
    setInvocations(inv);
    setRevealed(0);
    setPlan(null);
    setPhase("running");
    inv.forEach((_, i) => {
      timers.current.push(window.setTimeout(() => setRevealed(i + 1), 430 * (i + 1)));
    });
    timers.current.push(
      window.setTimeout(() => {
        const generated = planFromPrompt(prompt, profile.id);
        setPlan(generated);
        setPhase("done");
        onPlanGenerated(generated);
        toast.success(`Agenda ready with ${generated.items.length} activities`);
      }, 430 * (inv.length + 2)),
    );
  };

  const append = (ch: string) => setPrompt((p) => (p + ch).slice(0, 150));
  const status: AgentStatus = phase === "done" ? "ready" : phase === "running" ? (revealed >= invocations.length ? "adapting" : "invoking") : "thinking";
  const visible = invocations.slice(0, revealed);

  return (
    <div className="grid gap-8 lg:grid-cols-[1.15fr_1fr]">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <TVFocusable
            id="agent-back"
            glow="violet"
            onSelect={onBack}
            className="flex items-center gap-2 rounded-full border border-white/15 px-4 py-2 text-sm font-semibold text-white/70"
          >
            <Icon name="ArrowLeft" className="h-4 w-4" />
            Home
          </TVFocusable>
          <AgentStatusBadge status={status} />
        </div>

        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-white md:text-4xl">Tell NEXA your goal</h1>
          <p className="mt-2 text-base text-white/55">
            Speak or type in natural language. The agent searches content, schedules activities and builds the agenda.
          </p>
        </div>

        <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 backdrop-blur">
          <div className="flex items-start gap-3">
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-violet-400 to-fuchsia-500 text-slate-950">
              <Icon name="Sparkle" weight="fill" className="h-5 w-5" />
            </span>
            <p className="min-h-[4.5rem] flex-1 text-xl font-medium leading-relaxed text-white">
              {prompt}
              {phase === "idle" ? <span className="ml-0.5 inline-block h-6 w-0.5 translate-y-1 bg-amber-400" style={{ animation: "tvPulse 1s steps(2) infinite" }} /> : null}
            </p>
          </div>
          <p className="mt-4 text-xs font-medium text-white/40">Type with your keyboard, or use the on-screen keys with the D-pad.</p>
        </div>

        <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-5 backdrop-blur">
          <div className="space-y-2">
            {KEY_ROWS.map((row, ri) => (
              <div key={ri} className="flex justify-center gap-2">
                {row.map((ch) => (
                  <TVFocusable
                    key={ch}
                    id={`key-${ch}`}
                    glow="violet"
                    onSelect={() => append(ch)}
                    className="grid h-12 w-12 place-items-center rounded-xl border border-white/10 bg-white/[0.05] text-base font-semibold text-white"
                  >
                    {ch}
                  </TVFocusable>
                ))}
              </div>
            ))}
            <div className="flex justify-center gap-2 pt-1">
              <TVFocusable id="key-space" glow="violet" onSelect={() => append(" ")} className="flex h-12 w-48 items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.05] text-sm font-semibold text-white/80">
                <Icon name="TextAa" className="h-4 w-4" />
                Space
              </TVFocusable>
              <TVFocusable id="key-backspace" glow="violet" onSelect={() => setPrompt((p) => p.slice(0, -1))} className="flex h-12 w-28 items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.05] text-sm font-semibold text-white/80">
                <Icon name="Backspace" className="h-4 w-4" />
                Delete
              </TVFocusable>
              <TVFocusable id="key-clear" glow="violet" onSelect={() => setPrompt("")} className="flex h-12 w-24 items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.05] text-sm font-semibold text-white/80">
                <Icon name="X" className="h-4 w-4" />
                Clear
              </TVFocusable>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          {profile.prompts.map((p, i) => (
            <TVFocusable
              key={p}
              id={`qp-${i}`}
              glow="violet"
              onSelect={() => setPrompt(p)}
              className="max-w-[42ch] truncate rounded-full border border-violet-400/30 bg-violet-500/10 px-4 py-2 text-sm font-medium text-violet-100"
            >
              {p}
            </TVFocusable>
          ))}
        </div>

        <TVFocusable
          id="agent-generate"
          glow="violet"
          onSelect={run}
          className={cn(
            "flex w-full items-center justify-center gap-3 rounded-2xl px-7 py-5 text-lg font-semibold",
            phase === "running" ? "bg-white/20 text-white/60" : "bg-white text-slate-950",
          )}
        >
          <Icon name="Lightning" weight="fill" className="h-5 w-5" />
          {phase === "running" ? "Agent working" : "Generate agenda"}
        </TVFocusable>
      </div>

      <div className="space-y-6">
        <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 backdrop-blur">
          <div className="flex items-center justify-between">
            <h2 className="flex items-center gap-2 text-lg font-semibold text-white">
              <Icon name="Cpu" className="h-5 w-5 text-sky-300" />
              Agent reasoning
            </h2>
            <span className="text-xs font-semibold text-white/40">{revealed}/{invocations.length || AGENT_TOOL_NAMES.length} steps</span>
          </div>
          <div className="mt-4 space-y-3">
            <AnimatePresence initial={false}>
              {visible.length === 0 ? (
                <p className="rounded-2xl border border-dashed border-white/15 px-4 py-6 text-center text-sm text-white/40">
                  Waiting for a goal. Generate an agenda to watch the agent call its tools.
                </p>
              ) : (
                visible.map((inv, i) => {
                  const itemStatus: AgentStatus = i === visible.length - 1 ? (phase === "done" ? "ready" : "thinking") : "invoking";
                  return (
                    <motion.div
                      key={inv.id}
                      initial={{ opacity: 0, x: 14 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.28 }}
                      className="flex items-start gap-3 rounded-2xl bg-white/[0.03] p-4"
                    >
                      <span className={cn("mt-0.5 grid h-9 w-9 shrink-0 place-items-center rounded-xl", itemStatus === "ready" ? "bg-emerald-500/15 text-emerald-200" : itemStatus === "thinking" ? "bg-amber-500/15 text-amber-200" : "bg-sky-500/15 text-sky-200")}>
                        <Icon name={itemStatus === "ready" ? "Check" : "Lightning"} className="h-4 w-4" />
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-semibold text-white">{inv.tool}</p>
                        <p className="truncate text-xs text-white/50">{inv.query}</p>
                      </div>
                      <span className="shrink-0 text-[11px] font-medium text-white/35">{inv.timestamp}</span>
                    </motion.div>
                  );
                })
              )}
            </AnimatePresence>
          </div>
        </div>

        <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur">
          <h2 className="flex items-center gap-2 text-lg font-semibold text-white">
            <Icon name="Wrench" className="h-5 w-5 text-amber-300" />
            Tools available
          </h2>
          <div className="mt-4 grid grid-cols-2 gap-3">
            {AGENT_TOOL_NAMES.map((tool) => (
              <div key={tool.tool} className="flex items-center gap-2 rounded-2xl bg-white/[0.03] px-3 py-3">
                <Icon name={tool.icon} className="h-4 w-4 text-white/60" />
                <span className="text-xs font-semibold text-white/70">{tool.tool}</span>
              </div>
            ))}
          </div>
        </div>

        {plan ? (
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }} className="space-y-4">
            <AgentPlanCard id="agent-result-plan" plan={plan} onStart={onOpenPlan} />
            <TVFocusable
              id="agent-open"
              glow="emerald"
              onSelect={onOpenPlan}
              className="flex w-full items-center justify-center gap-3 rounded-2xl border border-emerald-400/40 bg-emerald-500/10 px-6 py-4 text-base font-semibold text-emerald-100"
            >
              <Icon name="CaretRight" className="h-5 w-5" />
              Open the adaptive planner
            </TVFocusable>
          </motion.div>
        ) : null}
      </div>
    </div>
  );
}