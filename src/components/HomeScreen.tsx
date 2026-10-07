import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { accent, AgentPlanCard, AgentStatusBadge, FamilyActivityCard, Icon, TVFocusable } from "@/components/tv-ui-kit/TVKit";
import { CATEGORY_TILES, HOUSEHOLD_STATS, RAILS } from "@/data/mockData";
import type { AgendaPlan, Profile, ScreenId } from "@/types";
import { cn } from "@/lib/utils";

function greeting(hour: number) {
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
}

export default function HomeScreen({
  profile,
  plan,
  onNavigate,
  onStartPlan,
  onQuickPrompt,
}: {
  profile: Profile;
  plan: AgendaPlan;
  onNavigate: (screen: ScreenId) => void;
  onStartPlan: () => void;
  onQuickPrompt: (prompt: string) => void;
}) {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const t = window.setInterval(() => setNow(new Date()), 30000);
    return () => window.clearInterval(t);
  }, []);

  const time = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  return (
    <div className="space-y-14">
      <section className="grid gap-8 lg:grid-cols-[1.5fr_1fr]">
        <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="flex flex-col justify-center">
          <span className="inline-flex w-fit items-center gap-2 rounded-full border border-amber-400/30 bg-amber-400/10 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.28em] text-amber-200">
            <Icon name="Sparkle" weight="fill" className="h-3.5 w-3.5" />
            Live household agenda
          </span>
          <h1 className="mt-5 text-4xl font-semibold leading-[1.08] tracking-tight text-white md:text-6xl">
            {greeting(now.getHours())}, {profile.name}.
            <span className="block text-white/55">What should we do?</span>
          </h1>
          <p className="mt-5 max-w-[52ch] text-lg leading-relaxed text-white/60">
            Say a goal in your own words. NEXA Home turns it into a multi activity agenda mixing watching, learning and
            moving, then reshapes the whole evening the moment your plans change.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <TVFocusable
              id="hero-ask"
              glow="violet"
              onSelect={() => onNavigate("ask-nexa")}
              className="flex items-center gap-3 rounded-2xl bg-white px-7 py-4 text-base font-semibold text-slate-950"
            >
              <Icon name="MagnifyingGlass" className="h-5 w-5" />
              Ask NEXA
            </TVFocusable>
            <TVFocusable
              id="hero-plan"
              glow="amber"
              onSelect={onStartPlan}
              className="flex items-center gap-3 rounded-2xl border border-white/15 bg-white/[0.06] px-7 py-4 text-base font-semibold text-white"
            >
              <Icon name="Play" weight="fill" className="h-5 w-5" />
              Start tonight
            </TVFocusable>
            <TVFocusable
              id="hero-uikit"
              glow="sky"
              onSelect={() => onNavigate("uikit")}
              className="flex items-center gap-3 rounded-2xl border border-white/15 px-6 py-4 text-base font-semibold text-white/70"
            >
              <Icon name="Code" className="h-5 w-5" />
              UI Kit
            </TVFocusable>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.08 }}
          className="tv-surface rounded-3xl border border-white/10 bg-white/[0.04] p-6 backdrop-blur"
        >
          <div className="flex items-start justify-between">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.34em] text-white/40">Living room</p>
              <p className="mt-1 text-3xl font-semibold text-white">{time}</p>
            </div>
            <AgentStatusBadge status="ready" />
          </div>
          <div className="mt-5 space-y-3">
            <div className="flex items-center justify-between rounded-2xl bg-white/[0.03] px-4 py-3">
              <span className="flex items-center gap-2 text-sm font-medium text-white/70">
                <Icon name="WifiHigh" className="h-4 w-4 text-emerald-300" />
                Fire TV Stick
              </span>
              <span className="text-xs font-semibold text-emerald-300">Connected</span>
            </div>
            <div className="flex items-center justify-between rounded-2xl bg-white/[0.03] px-4 py-3">
              <span className="flex items-center gap-2 text-sm font-medium text-white/70">
                <Icon name="Microphone" className="h-4 w-4 text-amber-300" />
                Voice remote
              </span>
              <span className="text-xs font-semibold text-white/50">Hold to speak</span>
            </div>
          </div>
          <div className="mt-5 grid grid-cols-3 gap-3">
            {HOUSEHOLD_STATS.map((stat) => {
              const a = accent(stat.accent);
              return (
                <div key={stat.id} className="rounded-2xl bg-white/[0.03] p-3">
                  <Icon name={stat.icon} className={cn("h-5 w-5", a.text)} />
                  <p className="mt-2 text-2xl font-semibold text-white">{stat.value}</p>
                  <p className="text-[11px] font-medium leading-tight text-white/40">{stat.label}</p>
                </div>
              );
            })}
          </div>
          <div className="mt-5 flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.03] p-4">
            <span className="grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 text-sm font-bold text-slate-950">
              {profile.initials}
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-white">{profile.name}</p>
              <p className="truncate text-xs text-white/45">{profile.role}</p>
            </div>
            <TVFocusable
              id="home-profile"
              glow="sky"
              onSelect={() => onNavigate("profiles")}
              className="grid h-11 w-11 place-items-center rounded-xl border border-white/15 text-white/70"
            >
              <Icon name="Gear" className="h-5 w-5" />
            </TVFocusable>
          </div>
        </motion.div>
      </section>

      <section className="space-y-5">
        <div className="flex items-end justify-between">
          <h2 className="text-2xl font-semibold text-white">Start somewhere</h2>
          <p className="text-sm text-white/40">Use the arrow keys to move between tiles</p>
        </div>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-5">
          {CATEGORY_TILES.map((tile) => {
            const a = accent(tile.accent);
            return (
              <TVFocusable
                key={tile.id}
                id={`tile-${tile.id}`}
                glow={tile.accent}
                onSelect={() => (tile.id === "ask" ? onNavigate("ask-nexa") : onQuickPrompt(tile.prompt))}
                className="flex h-44 flex-col justify-between rounded-3xl border border-white/10 bg-white/[0.04] p-5 text-left backdrop-blur"
              >
                <span className={cn("grid h-12 w-12 place-items-center rounded-2xl border", a.bg, a.border, a.text)}>
                  <Icon name={tile.icon} className="h-6 w-6" />
                </span>
                <div>
                  <p className="text-lg font-semibold text-white">{tile.label}</p>
                  <p className="mt-1 line-clamp-2 text-xs leading-snug text-white/45">{tile.prompt}</p>
                </div>
              </TVFocusable>
            );
          })}
        </div>
      </section>

      {RAILS.map((rail) => (
        <section key={rail.id} className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="flex items-center gap-3 text-2xl font-semibold text-white">
              <Icon name={rail.icon} className={cn("h-6 w-6", accent(rail.accent).text)} />
              {rail.label}
            </h2>
            <TVFocusable
              id={`rail-more-${rail.id}`}
              glow={rail.accent}
              onSelect={() => onQuickPrompt(rail.prompt)}
              className="flex items-center gap-2 rounded-full border border-white/10 px-4 py-2 text-sm font-semibold text-white/60"
            >
              Ask NEXA
              <Icon name="ArrowRight" className="h-4 w-4" />
            </TVFocusable>
          </div>
          <div className="no-scrollbar -mx-1 flex gap-4 overflow-x-auto px-1 pb-2">
            {rail.items.map((item) => (
              <FamilyActivityCard
                key={item.id}
                id={`${rail.id}-${item.id}`}
                activity={item}
                onSelect={() => onQuickPrompt(`${rail.prompt}. Include ${item.title}.`)}
              />
            ))}
          </div>
        </section>
      ))}

      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold text-white">Tonight for {profile.name}</h2>
          <TVFocusable
            id="plan-open"
            glow="amber"
            onSelect={() => onNavigate("plan")}
            className="flex items-center gap-2 rounded-full border border-white/10 px-4 py-2 text-sm font-semibold text-white/60"
          >
            Open planner
            <Icon name="ArrowRight" className="h-4 w-4" />
          </TVFocusable>
        </div>
        <AgentPlanCard id="home-plan" plan={plan} onStart={onStartPlan} />
      </section>
    </div>
  );
}