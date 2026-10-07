import { useState } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { accent, Icon, TVFocusable } from "@/components/tv-ui-kit/TVKit";
import { KIT_DOCS, KIT_README } from "@/data/mockData";
import type { FontScale, Profile } from "@/types";
import { cn } from "@/lib/utils";

const FONT_SCALES: { id: FontScale; label: string; sample: string }[] = [
  { id: "standard", label: "Standard", sample: "Aa" },
  { id: "large", label: "Large", sample: "Aa" },
  { id: "extra-large", label: "Extra large", sample: "Aa" },
];

const KIT_CHECKLIST = [
  "Every control is reachable with the arrow keys and Select in one press.",
  "Body text stays legible at 10 feet with a 18px minimum equivalent size.",
  "Focus states pair a white ring with an accent glow so the cursor is never lost.",
  "Three typography scales and a high contrast mode are built in.",
  "Animations respect the reduced motion preference.",
];

export function ProfileSwitcher({
  profiles,
  activeId,
  onSelect,
  onUpdate,
  onBack,
}: {
  profiles: Profile[];
  activeId: string;
  onSelect: (profile: Profile) => void;
  onUpdate: (profile: Profile) => void;
  onBack: () => void;
}) {
  const active = profiles.find((p) => p.id === activeId) ?? profiles[0];
  const [fontScale, setFontScale] = useState<FontScale>(active.fontScale);
  const [contrast, setContrast] = useState(active.highContrast);

  const apply = (scale: FontScale, highContrast: boolean) => {
    setFontScale(scale);
    setContrast(highContrast);
    onUpdate({ ...active, fontScale: scale, highContrast });
    toast.success(`Preferences saved for ${active.name}`);
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <TVFocusable id="profiles-back" glow="sky" onSelect={onBack} className="flex items-center gap-2 rounded-full border border-white/15 px-4 py-2 text-sm font-semibold text-white/70">
          <Icon name="ArrowLeft" className="h-4 w-4" />
          Home
        </TVFocusable>
        <span className="flex items-center gap-2 rounded-full bg-white/[0.05] px-4 py-2 text-sm font-semibold text-white/60">
          <Icon name="Users" className="h-4 w-4 text-sky-300" />
          {profiles.length} household profiles
        </span>
      </div>

      <div>
        <h1 className="text-3xl font-semibold tracking-tight text-white md:text-4xl">Who is watching?</h1>
        <p className="mt-2 max-w-[70ch] text-base text-white/55">
          Each profile keeps its own interests, text size and contrast so the agenda fits the person in front of the screen.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {profiles.map((p) => {
          const isActive = p.id === activeId;
          return (
            <TVFocusable
              key={p.id}
              id={`profile-${p.id}`}
              glow={isActive ? "amber" : "sky"}
              onSelect={() => onSelect(p)}
              className={cn(
                "flex h-full flex-col gap-4 rounded-3xl border p-5 text-left backdrop-blur",
                isActive ? "border-amber-400/50 bg-amber-500/10" : "border-white/10 bg-white/[0.04]",
              )}
            >
              <div className="flex items-center gap-3">
                <span className="grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br from-sky-400 to-violet-500 text-sm font-bold text-slate-950">
                  {p.initials}
                </span>
                <div className="min-w-0">
                  <p className="truncate text-lg font-semibold text-white">{p.name}</p>
                  <p className="truncate text-xs font-medium text-white/45">{p.role}</p>
                </div>
                {isActive ? <span className="ml-auto rounded-full bg-amber-400/20 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-amber-200">Active</span> : null}
              </div>
              <p className="text-sm leading-snug text-white/55">{p.bio}</p>
              <div className="flex flex-wrap gap-2">
                {p.interests.map((interest) => (
                  <span key={interest} className="rounded-full bg-white/[0.06] px-3 py-1 text-xs font-medium text-white/60">
                    {interest}
                  </span>
                ))}
              </div>
            </TVFocusable>
          );
        })}
      </div>

      <div className="grid gap-5 lg:grid-cols-[1.2fr_1fr]">
        <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 backdrop-blur">
          <h2 className="flex items-center gap-2 text-lg font-semibold text-white">
            <Icon name="TextAa" className="h-5 w-5 text-emerald-300" />
            Typography scale for {active.name}
          </h2>
          <p className="mt-2 text-sm text-white/50">Choose the size that is comfortable from across the room.</p>
          <div className="mt-4 grid grid-cols-3 gap-3">
            {FONT_SCALES.map((scale) => (
              <TVFocusable
                key={scale.id}
                id={`font-${scale.id}`}
                glow="emerald"
                onSelect={() => apply(scale.id, contrast)}
                className={cn(
                  "flex flex-col items-center gap-2 rounded-2xl border px-3 py-5",
                  fontScale === scale.id ? "border-emerald-400/50 bg-emerald-500/15 text-emerald-100" : "border-white/10 bg-white/[0.03] text-white/70",
                )}
              >
                <span className={cn("font-semibold", scale.id === "standard" ? "text-2xl" : scale.id === "large" ? "text-3xl" : "text-4xl")}>{scale.sample}</span>
                <span className="text-xs font-semibold">{scale.label}</span>
              </TVFocusable>
            ))}
          </div>
          <TVFocusable
            id="contrast-toggle"
            glow="emerald"
            onSelect={() => apply(fontScale, !contrast)}
            className={cn(
              "mt-4 flex w-full items-center justify-between rounded-2xl border px-5 py-4 text-left text-sm font-semibold",
              contrast ? "border-emerald-400/50 bg-emerald-500/15 text-emerald-100" : "border-white/10 bg-white/[0.03] text-white/70",
            )}
          >
            <span className="flex items-center gap-2">
              <Icon name="Eye" className="h-4 w-4" />
              High contrast borders
            </span>
            <span className={cn("rounded-full px-3 py-1 text-xs font-bold", contrast ? "bg-emerald-400 text-slate-950" : "bg-white/10 text-white/60")}>
              {contrast ? "On" : "Off"}
            </span>
          </TVFocusable>
        </div>

        <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur">
          <h2 className="flex items-center gap-2 text-lg font-semibold text-white">
            <Icon name="Heart" weight="fill" className="h-5 w-5 text-rose-300" />
            How the agenda adapts
          </h2>
          <div className="mt-4 space-y-3">
            {[
              { label: "Interests", value: active.interests.join(", ") },
              { label: "Evening length", value: `${active.fontScale === "extra-large" ? "Calm and shorter" : "Balanced mix"}` },
              { label: "Suggested prompts", value: `${active.prompts.length} ready to run` },
            ].map((row) => (
              <div key={row.label} className="rounded-2xl bg-white/[0.03] px-4 py-3">
                <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-white/40">{row.label}</p>
                <p className="mt-1 text-sm text-white/70">{row.value}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export function KitShowcase({ onBack }: { onBack: () => void }) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      if (!navigator.clipboard) {
        toast.error("Clipboard is unavailable in this browser");
        return;
      }
      await navigator.clipboard.writeText(KIT_README);
      setCopied(true);
      toast.success("UI Kit README copied");
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Could not copy to the clipboard");
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <TVFocusable id="kit-back" glow="violet" onSelect={onBack} className="flex items-center gap-2 rounded-full border border-white/15 px-4 py-2 text-sm font-semibold text-white/70">
          <Icon name="ArrowLeft" className="h-4 w-4" />
          Home
        </TVFocusable>
        <span className="flex items-center gap-2 rounded-full border border-emerald-400/30 bg-emerald-500/10 px-4 py-2 text-sm font-semibold text-emerald-200">
          <Icon name="ShieldCheck" className="h-4 w-4" />
          MIT licensed - open source challenge
        </span>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="rounded-3xl border border-violet-400/25 bg-gradient-to-br from-violet-600/20 to-slate-950/40 p-7 backdrop-blur"
      >
        <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.28em] text-violet-100">
          <Icon name="Sparkle" weight="fill" className="h-3.5 w-3.5" />
          NEXA TV Agent UI Kit
        </span>
        <h1 className="mt-4 text-3xl font-semibold tracking-tight text-white md:text-4xl">
          The 10-foot building blocks behind NEXA Home
        </h1>
        <p className="mt-3 max-w-[76ch] text-base leading-relaxed text-white/65">
          A small, dependency-light React package for remote-first television interfaces: spatial D-pad focus, agent status
          surfaces, adaptive agenda cards and an accessible navigation shell. Built for the Fire TV living room and released
          openly so other teams can ship agentic TV experiences faster.
        </p>
        <div className="mt-5 flex flex-wrap items-center gap-3">
          <code className="rounded-2xl bg-slate-950/70 px-5 py-3 text-sm font-semibold text-emerald-200">bun add nexa-tv-agent-ui-kit</code>
          <TVFocusable
            id="kit-copy"
            glow="emerald"
            onSelect={copy}
            className="flex items-center gap-2 rounded-2xl bg-white px-5 py-3 text-sm font-semibold text-slate-950"
          >
            <Icon name={copied ? "Check" : "Copy"} className="h-4 w-4" />
            {copied ? "Copied" : "Copy README"}
          </TVFocusable>
        </div>
      </motion.div>

      <div className="grid gap-4 md:grid-cols-3">
        {[
          { id: "components", label: "Components", value: `${KIT_DOCS.length}`, icon: "Cube", accent: "violet" },
          { id: "a11y", label: "Focus checks", value: "D-pad ready", icon: "Keyboard", accent: "emerald" },
          { id: "license", label: "License", value: "MIT", icon: "ShieldCheck", accent: "amber" },
        ].map((stat) => {
          const a = accent(stat.accent);
          return (
            <div key={stat.id} className="rounded-3xl border border-white/10 bg-white/[0.04] p-5 backdrop-blur">
              <Icon name={stat.icon} className={cn("h-6 w-6", a.text)} />
              <p className="mt-3 text-2xl font-semibold text-white">{stat.value}</p>
              <p className="text-xs font-medium uppercase tracking-[0.22em] text-white/40">{stat.label}</p>
            </div>
          );
        })}
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        {KIT_DOCS.map((doc) => (
          <motion.div
            key={doc.name}
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.3 }}
            className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 backdrop-blur"
          >
            <h2 className="flex items-center gap-2 text-lg font-semibold text-white">
              <Icon name="Code" className="h-5 w-5 text-violet-300" />
              {doc.name}
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-white/55">{doc.summary}</p>
            <div className="mt-4 space-y-2">
              {doc.props.map((prop) => (
                <div key={prop.name} className="flex flex-wrap items-baseline gap-2 rounded-xl bg-white/[0.03] px-4 py-2.5">
                  <code className="text-xs font-bold text-emerald-200">{prop.name}</code>
                  <code className="text-xs text-sky-200">{prop.type}</code>
                  <span className="text-xs text-white/50">{prop.note}</span>
                </div>
              ))}
            </div>
            <pre className="mt-4 overflow-x-auto rounded-2xl bg-slate-950/70 p-4 text-xs leading-relaxed text-emerald-100">
              <code>{doc.snippet}</code>
            </pre>
          </motion.div>
        ))}
      </div>

      <div className="grid gap-5 lg:grid-cols-[1fr_1fr]">
        <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur">
          <h2 className="flex items-center gap-2 text-lg font-semibold text-white">
            <Icon name="List" className="h-5 w-5 text-amber-300" />
            Quality checklist
          </h2>
          <ul className="mt-4 space-y-3">
            {KIT_CHECKLIST.map((rule) => (
              <li key={rule} className="flex items-start gap-3 text-sm leading-snug text-white/65">
                <Icon name="CheckCircle" className="mt-0.5 h-4 w-4 shrink-0 text-emerald-300" />
                {rule}
              </li>
            ))}
          </ul>
        </div>
        <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur">
          <h2 className="flex items-center gap-2 text-lg font-semibold text-white">
            <Icon name="Palette" className="h-5 w-5 text-sky-300" />
            Design rules
          </h2>
          <div className="mt-4 grid grid-cols-2 gap-3">
            {[
              { id: "focus", label: "Focus first", icon: "Circle", accent: "amber" },
              { id: "scale", label: "Readable at 10 feet", icon: "TextAa", accent: "emerald" },
              { id: "contrast", label: "Contrast safe", icon: "Eye", accent: "sky" },
              { id: "motion", label: "Calm motion", icon: "Sparkle", accent: "violet" },
            ].map((rule) => {
              const a = accent(rule.accent);
              return (
                <div key={rule.id} className="flex items-center gap-3 rounded-2xl bg-white/[0.03] px-4 py-4">
                  <Icon name={rule.icon} className={cn("h-5 w-5", a.text)} />
                  <span className="text-sm font-semibold text-white/70">{rule.label}</span>
                </div>
              );
            })}
          </div>
          <p className="mt-4 text-xs leading-relaxed text-white/40">
            The kit ships with no runtime icon fonts and no global CSS reset, so it drops into any React 18 or 19 application.
          </p>
        </div>
      </div>
    </div>
  );
}