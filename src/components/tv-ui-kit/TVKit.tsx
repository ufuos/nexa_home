import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ComponentPropsWithoutRef,
  type ComponentType,
  type ReactNode,
} from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Heartbeat, ArrowDown, ArrowLeft, ArrowRight, ArrowUp, ArrowsClockwise, Backspace, Barbell,
  BookOpen, Brain, CaretRight, Check, CheckCircle, Circle, Clock, Code, Compass, Confetti,
  Copy, CornersOut, Cpu, Cube, Eye, FastForward, FilmStrip, Fire, Gauge, Gear, Heart, House,
  Info, Keyboard, Lightbulb, Lightning, List, MagnifyingGlass, Microphone, Palette, Pause,
  Play, PuzzlePiece, Rewind, Rocket, ShieldCheck, Smiley, Sparkle, Stack, Star, Television,
  TextAa, Timer, Trophy, User, Users, WifiHigh, Wrench, X,
} from "@phosphor-icons/react";
import { cn } from "@/lib/utils";
import type { ActivityCard, AgendaPlan, AgentStatus, Category, RemoteAction, TVNavItem } from "@/types";

// ---- icons -----------------------------------------------------------
type PhosphorIcon = ComponentType<{ className?: string; weight?: string }>;

const ICONS: Record<string, PhosphorIcon> = {
  Heartbeat, ArrowDown, ArrowLeft, ArrowRight, ArrowUp, ArrowsClockwise, Backspace, Barbell,
  BookOpen, Brain, CaretRight, Check, CheckCircle, Circle, Clock, Code, Compass, Confetti,
  Copy, CornersOut, Cpu, Cube, Eye, FastForward, FilmStrip, Fire, Gauge, Gear, Heart, House,
  Info, Keyboard, Lightbulb, Lightning, List, MagnifyingGlass, Microphone, Palette, Pause,
  Play, PuzzlePiece, Rewind, Rocket, ShieldCheck, Smiley, Sparkle, Stack, Star, Television,
  TextAa, Timer, Trophy, User, Users, WifiHigh, Wrench, X,
};

export function Icon({ name, className, weight = "bold" }: { name: string; className?: string; weight?: string }) {
  const Cmp = ICONS[name] ?? Circle;
  return <Cmp className={className} weight={weight} />;
}

// ---- accents ---------------------------------------------------------
type Accent = { text: string; bg: string; border: string; glow: string; solid: string };

const ACCENTS: Record<string, Accent> = {
  sky: { text: "text-sky-200", bg: "bg-sky-500/15", border: "border-sky-400/40", glow: "rgba(56,189,248,0.55)", solid: "bg-sky-400" },
  emerald: { text: "text-emerald-200", bg: "bg-emerald-500/15", border: "border-emerald-400/40", glow: "rgba(52,211,153,0.55)", solid: "bg-emerald-400" },
  amber: { text: "text-amber-200", bg: "bg-amber-500/15", border: "border-amber-400/40", glow: "rgba(251,191,36,0.6)", solid: "bg-amber-400" },
  rose: { text: "text-rose-200", bg: "bg-rose-500/15", border: "border-rose-400/40", glow: "rgba(251,113,133,0.55)", solid: "bg-rose-400" },
  violet: { text: "text-violet-200", bg: "bg-violet-500/15", border: "border-violet-400/40", glow: "rgba(167,139,250,0.55)", solid: "bg-violet-400" },
};

export function accent(name: string) {
  return ACCENTS[name] ?? ACCENTS.amber;
}

const CATEGORY_ACCENT: Record<Category, string> = {
  entertainment: "sky",
  learning: "emerald",
  fitness: "amber",
  together: "rose",
};

export function categoryAccent(category: Category) {
  return CATEGORY_ACCENT[category];
}

// ---- spatial focus engine -------------------------------------------
type Dir = "up" | "down" | "left" | "right";

interface TVFocusValue {
  focusId: string | null;
  focus: (id: string) => void;
  register: (id: string, el: HTMLElement) => void;
  unregister: (id: string) => void;
  move: (dir: Dir) => void;
}

const TVFocusContext = createContext<TVFocusValue | null>(null);

export function useTVFocus() {
  const ctx = useContext(TVFocusContext);
  if (!ctx) throw new Error("useTVFocus must be used inside a TVFocusProvider");
  return ctx;
}

export function TVFocusProvider({ children }: { children: ReactNode }) {
  const [focusId, setFocusId] = useState<string | null>(null);
  const els = useRef<Map<string, HTMLElement>>(new Map());
  const focusIdRef = useRef<string | null>(null);

  const focus = useCallback((id: string) => {
    const el = els.current.get(id);
    if (!el) return;
    focusIdRef.current = id;
    setFocusId(id);
    el.focus({ preventScroll: true });
    el.scrollIntoView({ block: "nearest", inline: "nearest", behavior: "smooth" });
  }, []);

  const register = useCallback((id: string, el: HTMLElement) => {
    els.current.set(id, el);
    if (!focusIdRef.current) focus(id);
  }, [focus]);

  const unregister = useCallback((id: string) => {
    els.current.delete(id);
    if (focusIdRef.current === id) {
      focusIdRef.current = null;
      const first = els.current.keys().next().value as string | undefined;
      if (first) focus(first);
      else setFocusId(null);
    }
  }, [focus]);

  const move = useCallback((dir: Dir) => {
    const cur = focusIdRef.current;
    const curEl = cur ? els.current.get(cur) : null;
    if (!curEl) {
      const first = els.current.keys().next().value as string | undefined;
      if (first) focus(first);
      return;
    }
    const cr = curEl.getBoundingClientRect();
    const ccx = cr.left + cr.width / 2;
    const ccy = cr.top + cr.height / 2;
    const scored: { id: string; score: number }[] = [];
    els.current.forEach((el, id) => {
      if (id === cur) return;
      const r = el.getBoundingClientRect();
      if (r.width === 0 && r.height === 0) return;
      const dx = r.left + r.width / 2 - ccx;
      const dy = r.top + r.height / 2 - ccy;
      let primary = 0;
      let ortho = 0;
      if (dir === "left") { primary = -dx; ortho = Math.abs(dy); }
      if (dir === "right") { primary = dx; ortho = Math.abs(dy); }
      if (dir === "up") { primary = -dy; ortho = Math.abs(dx); }
      if (dir === "down") { primary = dy; ortho = Math.abs(dx); }
      if (primary <= 6) return;
      scored.push({ id, score: primary + ortho * 1.5 });
    });
    scored.sort((a, b) => a.score - b.score);
    if (scored[0]) focus(scored[0].id);
  }, [focus]);

  useEffect(() => {
    const arrowMap: Record<string, Dir> = { ArrowUp: "up", ArrowDown: "down", ArrowLeft: "left", ArrowRight: "right" };
    const onKey = (e: KeyboardEvent) => {
      const dir = arrowMap[e.key];
      if (!dir) return;
      const target = e.target as HTMLElement | null;
      if (target && (target.tagName === "INPUT" || target.tagName === "TEXTAREA")) return;
      e.preventDefault();
      move(dir);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [move]);

  return <TVFocusContext.Provider value={{ focusId, focus, register, unregister, move }}>{children}</TVFocusContext.Provider>;
}

// ---- focusable -------------------------------------------------------
export interface TVFocusableProps extends Omit<ComponentPropsWithoutRef<"button">, "id"> {
  id: string;
  onSelect?: () => void;
  glow?: string;
}

export function TVFocusable({ id, glow = "amber", className, children, onSelect, onClick, ...rest }: TVFocusableProps) {
  const { focusId, register, unregister } = useTVFocus();
  const ref = useRef<HTMLButtonElement>(null);
  const isFocused = focusId === id;
  const a = accent(glow);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    register(id, el);
    return () => unregister(id);
  }, [id, register, unregister]);

  return (
    <button
      ref={ref}
      type="button"
      onClick={(e) => {
        onClick?.(e);
        onSelect?.();
      }}
      className={cn(
        "relative outline-none transition-[transform,box-shadow,background-color,border-color] duration-200 ease-out",
        isFocused ? "z-10 scale-[1.03]" : "hover:border-white/25",
        className,
      )}
      style={isFocused ? { boxShadow: `0 0 0 3px rgba(255,255,255,0.92), 0 0 34px 8px ${a.glow}` } : undefined}
      {...rest}
    >
      {children}
    </button>
  );
}

// ---- shell -----------------------------------------------------------
export function AmbientBackdrop() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 overflow-hidden">
      <div className="absolute -left-40 -top-40 h-[38rem] w-[38rem] rounded-full bg-amber-500/20 blur-[140px]" style={{ animation: "tvAurora 22s ease-in-out infinite" }} />
      <div className="absolute -right-32 top-1/3 h-[32rem] w-[32rem] rounded-full bg-sky-500/20 blur-[140px]" style={{ animation: "tvAurora 26s ease-in-out infinite reverse" }} />
      <div className="absolute bottom-0 left-1/3 h-[26rem] w-[26rem] rounded-full bg-violet-600/15 blur-[150px]" style={{ animation: "tvAurora 30s ease-in-out infinite" }} />
    </div>
  );
}

export function TVNavigationShell({
  items,
  activeId,
  onSelect,
  right,
  children,
}: {
  items: TVNavItem[];
  activeId: string;
  onSelect: (id: string) => void;
  right?: ReactNode;
  children: ReactNode;
}) {
  return (
    <div className="relative min-h-[100dvh] bg-[#07080d] text-white" data-screen={activeId}>
      <AmbientBackdrop />
      <div className="relative z-20">
        <header className="mx-auto flex h-20 max-w-[1500px] items-center justify-between gap-6 px-6 md:px-10">
          <div className="flex items-center gap-3">
            <span className="grid h-11 w-11 place-items-center rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 text-slate-950">
              <Icon name="Sparkle" weight="fill" className="h-6 w-6" />
            </span>
            <div className="leading-tight">
              <p className="text-sm font-semibold tracking-[0.34em] text-white">NEXA HOME</p>
              <p className="text-[11px] font-medium text-white/45">Living room agent for Fire TV</p>
            </div>
          </div>
          <nav className="hidden items-center gap-1 lg:flex">
            {items.map((item) => (
              <TVFocusable
                key={item.id}
                id={`nav-${item.id}`}
                onSelect={() => onSelect(item.id)}
                className={cn(
                  "flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold",
                  activeId === item.id ? "bg-white text-slate-950" : "bg-white/[0.04] text-white/70",
                )}
              >
                <Icon name={item.icon} className="h-4 w-4" />
                {item.label}
              </TVFocusable>
            ))}
          </nav>
          <div className="flex items-center gap-3">{right}</div>
        </header>
        <main className="mx-auto max-w-[1500px] px-6 pb-36 pt-2 md:px-10">{children}</main>
      </div>
    </div>
  );
}

// ---- agent status ----------------------------------------------------
const STATUS_META: Record<AgentStatus, { label: string; dot: string; text: string; icon: string }> = {
  thinking: { label: "Thinking", dot: "bg-amber-400", text: "text-amber-200", icon: "Brain" },
  invoking: { label: "Calling tools", dot: "bg-sky-400", text: "text-sky-200", icon: "Lightning" },
  adapting: { label: "Adapting plan", dot: "bg-violet-400", text: "text-violet-200", icon: "ArrowsClockwise" },
  ready: { label: "Ready", dot: "bg-emerald-400", text: "text-emerald-200", icon: "CheckCircle" },
};

export function AgentStatusBadge({ status, className }: { status: AgentStatus; className?: string }) {
  const m = STATUS_META[status];
  return (
    <span className={cn("inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs font-semibold", m.text, className)}>
      <span className="relative flex h-2.5 w-2.5">
        <span className={cn("absolute inline-flex h-full w-full rounded-full opacity-70", m.dot)} style={{ animation: "tvPulse 1.4s ease-in-out infinite" }} />
        <span className={cn("relative inline-flex h-2.5 w-2.5 rounded-full", m.dot)} />
      </span>
      <Icon name={m.icon} className="h-3.5 w-3.5" />
      {m.label}
    </span>
  );
}

// ---- cards -----------------------------------------------------------
export function AgentPlanCard({ id, plan, onStart }: { id: string; plan: AgendaPlan; onStart: () => void }) {
  const total = plan.items.reduce((sum, item) => sum + item.durationMinutes, 0);
  return (
    <TVFocusable id={id} onSelect={onStart} className="tv-surface w-full rounded-3xl border border-white/10 bg-white/[0.04] p-6 text-left backdrop-blur">
      <div className="flex items-start justify-between gap-6">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.34em] text-amber-300">Agent plan</p>
          <h3 className="mt-1.5 text-2xl font-semibold text-white">{plan.title}</h3>
        </div>
        <span className="flex shrink-0 items-center gap-2 rounded-full bg-amber-400/15 px-3 py-1.5 text-sm font-semibold text-amber-200">
          <Icon name="Timer" className="h-4 w-4" />
          {total} min
        </span>
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        {plan.items.map((item) => {
          const a = accent(categoryAccent(item.category));
          return (
            <span key={item.id} className={cn("flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-semibold", a.bg, a.border, a.text)}>
              <Icon name={item.icon} className="h-3.5 w-3.5" />
              {item.title}
              <span className="text-white/45">{item.durationMinutes}m</span>
            </span>
          );
        })}
      </div>
      <div className="mt-5 flex items-center gap-4">
        <span className="flex items-center gap-2 rounded-xl bg-white px-5 py-2.5 text-sm font-semibold text-slate-950">
          <Icon name="Play" weight="fill" className="h-4 w-4" />
          Start plan
        </span>
        <p className="max-w-[46ch] text-sm leading-relaxed text-white/50">{plan.outcomeMessage}</p>
      </div>
    </TVFocusable>
  );
}

export function FamilyActivityCard({
  id,
  activity,
  onSelect,
  className,
}: {
  id: string;
  activity: ActivityCard;
  onSelect: () => void;
  className?: string;
}) {
  const a = accent(activity.accent);
  return (
    <TVFocusable
      id={id}
      glow={activity.accent}
      onSelect={onSelect}
      className={cn(
        "flex h-60 w-72 shrink-0 flex-col justify-between overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-white/[0.08] to-white/[0.02] p-5 text-left backdrop-blur",
        className,
      )}
    >
      <div className="flex items-start justify-between">
        <span className={cn("grid h-12 w-12 place-items-center rounded-2xl border", a.bg, a.border, a.text)}>
          <Icon name={activity.icon} className="h-6 w-6" />
        </span>
        {activity.tag ? (
          <span className="rounded-full bg-black/40 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider text-white/70">{activity.tag}</span>
        ) : null}
      </div>
      <div>
        <h4 className="text-lg font-semibold leading-snug text-white">{activity.title}</h4>
        {activity.subtitle ? <p className="mt-1 line-clamp-2 text-sm text-white/50">{activity.subtitle}</p> : null}
        <div className="mt-4 flex items-center gap-3">
          {activity.durationMinutes ? (
            <span className="flex items-center gap-1.5 text-xs font-semibold text-white/60">
              <Icon name="Clock" className="h-3.5 w-3.5" />
              {activity.durationMinutes} min
            </span>
          ) : null}
          <span className={cn("ml-auto flex items-center gap-1.5 text-xs font-semibold", a.text)}>
            Open <Icon name="CaretRight" className="h-3.5 w-3.5" />
          </span>
        </div>
      </div>
    </TVFocusable>
  );
}

// ---- virtual remote --------------------------------------------------
function RemoteButton({ icon, label, onClick, primary }: { icon: string; label?: string; onClick: () => void; primary?: boolean }) {
  return (
    <button
      type="button"
      aria-label={label ?? icon}
      onClick={onClick}
      className={cn(
        "grid h-12 w-full place-items-center rounded-2xl border border-white/15 text-white transition active:scale-95",
        primary ? "bg-white text-slate-950" : "bg-white/[0.06] hover:bg-white/[0.14]",
      )}
    >
      <Icon name={icon} className="h-5 w-5" />
    </button>
  );
}

export function VirtualTVRemote({ open, onClose, onAction }: { open: boolean; onClose: () => void; onAction: (action: RemoteAction) => void }) {
  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          initial={{ opacity: 0, y: 28, scale: 0.94 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 28, scale: 0.94 }}
          transition={{ type: "spring", stiffness: 320, damping: 28 }}
          className="fixed bottom-6 right-6 z-50 w-64 rounded-[28px] border border-white/15 bg-slate-950/85 p-4 shadow-2xl backdrop-blur-xl"
        >
          <div className="mb-3 flex items-center justify-between">
            <span className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.24em] text-white/60">
              <Icon name="Television" className="h-4 w-4" />
              Fire TV remote
            </span>
            <button type="button" aria-label="Hide remote" onClick={onClose} className="grid h-7 w-7 place-items-center rounded-full bg-white/10 text-white/70">
              <Icon name="X" className="h-3.5 w-3.5" />
            </button>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <span />
            <RemoteButton icon="ArrowUp" label="Up" onClick={() => onAction("up")} />
            <span />
            <RemoteButton icon="ArrowLeft" label="Left" onClick={() => onAction("left")} />
            <RemoteButton icon="Circle" label="Select" primary onClick={() => onAction("select")} />
            <RemoteButton icon="ArrowRight" label="Right" onClick={() => onAction("right")} />
            <span />
            <RemoteButton icon="ArrowDown" label="Down" onClick={() => onAction("down")} />
            <span />
          </div>
          <div className="mt-2 grid grid-cols-4 gap-2">
            <RemoteButton icon="ArrowLeft" label="Back" onClick={() => onAction("back")} />
            <RemoteButton icon="House" label="Home" onClick={() => onAction("home")} />
            <RemoteButton icon="Microphone" label="Voice" onClick={() => onAction("mic")} />
            <RemoteButton icon="Play" label="Play pause" onClick={() => onAction("play")} />
          </div>
          <p className="mt-3 flex items-center gap-2 text-[11px] font-medium text-white/40">
            <Icon name="Keyboard" className="h-3.5 w-3.5" />
            Arrow keys and Enter work everywhere.
          </p>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}