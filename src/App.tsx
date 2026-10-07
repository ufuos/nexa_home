import { useState } from "react";
import { Toaster, toast } from "sonner";
import AdaptivePlanView from "@/components/AdaptivePlanView";
import AgentHub from "@/components/AgentHub";
import HomeScreen from "@/components/HomeScreen";
import { KitShowcase, ProfileSwitcher } from "@/components/ProfileAndKitModal";
import { Icon, TVFocusable, TVFocusProvider, TVNavigationShell, useTVFocus, VirtualTVRemote } from "@/components/tv-ui-kit/TVKit";
import { createPlan, PROFILES } from "@/data/mockData";
import type { AgendaPlan, Profile, RemoteAction, ScreenId, TVNavItem } from "@/types";
import { cn } from "@/lib/utils";

const NAV_ITEMS: TVNavItem[] = [
  { id: "home", label: "Home", icon: "House" },
  { id: "ask-nexa", label: "Ask NEXA", icon: "Sparkle" },
  { id: "plan", label: "Planner", icon: "Stack" },
  { id: "profiles", label: "Profiles", icon: "Users" },
  { id: "uikit", label: "UI Kit", icon: "Code" },
];

function TVApp() {
  const { move } = useTVFocus();
  const [screen, setScreen] = useState<ScreenId>("home");
  const [profiles, setProfiles] = useState<Profile[]>(PROFILES);
  const [profileId, setProfileId] = useState(PROFILES[0].id);
  const [plan, setPlan] = useState<AgendaPlan>(() => createPlan(20, PROFILES[0].id));
  const [seed, setSeed] = useState<string | undefined>(undefined);
  const [remoteOpen, setRemoteOpen] = useState(true);
  const [voice, setVoice] = useState(false);
  const [listening, setListening] = useState(false);

  const profile = profiles.find((p) => p.id === profileId) ?? profiles[0];

  const go = (next: ScreenId) => {
    setScreen(next);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const quickPrompt = (prompt: string) => {
    setSeed(prompt);
    go("ask-nexa");
  };

  const startPlan = () => {
    if (plan.items.length === 0) {
      toast.error("No activities yet. Ask NEXA to build the agenda first.");
      return;
    }
    go("plan");
    toast.success("Tonight's agenda is live");
  };

  const replan = (minutes: number) => {
    const next = createPlan(minutes, profile.id);
    setPlan(next);
    toast.success(`Agenda reshaped for a ${minutes} minute evening`);
  };

  const pickProfile = (next: Profile) => {
    setProfileId(next.id);
    setPlan(createPlan(plan.targetMinutes, next.id));
    toast.success(`Switched to ${next.name}`);
  };

  const updateProfile = (next: Profile) => {
    setProfiles((prev) => prev.map((p) => (p.id === next.id ? next : p)));
  };

  const onRemote = (action: RemoteAction) => {
    switch (action) {
      case "up":
      case "down":
      case "left":
      case "right":
        move(action);
        break;
      case "select": {
        const el = document.activeElement as HTMLElement | null;
        el?.click();
        break;
      }
      case "back":
      case "home":
        go("home");
        break;
      case "mic":
        setVoice(true);
        toast.info("Listening for a household goal");
        break;
      case "play":
        startPlan();
        break;
    }
  };

  const scaleClass =
    profile.fontScale === "extra-large" ? "text-[1.08rem]" : profile.fontScale === "large" ? "text-[1.02rem]" : "text-base";

  return (
    <div className={cn(scaleClass, profile.highContrast && "tv-contrast")}>
      <TVNavigationShell
        items={NAV_ITEMS}
        activeId={screen}
        onSelect={(id) => go(id as ScreenId)}
        right={
          <>
            <TVFocusable
              id="header-profile"
              glow="amber"
              onSelect={() => go("profiles")}
              className="flex items-center gap-2.5 rounded-2xl border border-white/15 bg-white/[0.06] px-3 py-2"
            >
              <span className="grid h-8 w-8 place-items-center rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 text-xs font-bold text-slate-950">
                {profile.initials}
              </span>
              <span className="hidden text-sm font-semibold text-white sm:block">{profile.name}</span>
            </TVFocusable>
            <TVFocusable
              id="header-remote"
              glow="sky"
              onSelect={() => setRemoteOpen((v) => !v)}
              className="grid h-11 w-11 place-items-center rounded-2xl border border-white/15 bg-white/[0.06] text-white/70"
            >
              <Icon name="Television" className="h-5 w-5" />
            </TVFocusable>
          </>
        }
      >
        {screen === "home" ? (
          <HomeScreen
            profile={profile}
            plan={plan}
            onNavigate={go}
            onStartPlan={startPlan}
            onQuickPrompt={quickPrompt}
          />
        ) : null}

        {screen === "ask-nexa" ? (
          <AgentHub
            profile={profile}
            seedPrompt={seed}
            onPlanGenerated={setPlan}
            onOpenPlan={() => go("plan")}
            onBack={() => go("home")}
          />
        ) : null}

        {screen === "plan" ? (
          <AdaptivePlanView
            plan={plan}
            profile={profile}
            onPlanUpdate={setPlan}
            onReplan={replan}
            onBack={() => go("home")}
          />
        ) : null}

        {screen === "profiles" ? (
          <ProfileSwitcher
            profiles={profiles}
            activeId={profileId}
            onSelect={pickProfile}
            onUpdate={updateProfile}
            onBack={() => go("home")}
          />
        ) : null}

        {screen === "uikit" ? <KitShowcase onBack={() => go("home")} /> : null}
      </TVNavigationShell>

      <VirtualTVRemote open={remoteOpen} onClose={() => setRemoteOpen(false)} onAction={onRemote} />

      <div
        className={cn(
          "fixed bottom-6 left-6 z-40 flex items-center gap-3 rounded-2xl border px-4 py-3 backdrop-blur transition",
          listening ? "border-emerald-400/50 bg-emerald-500/15" : "border-white/12 bg-slate-950/70",
        )}
      >
        <button
          type="button"
          aria-label="Talk to NEXA"
          onClick={() => {
            setListening((v) => !v);
            if (!listening) setVoice(true);
          }}
          className={cn(
            "grid h-11 w-11 place-items-center rounded-xl text-slate-950 transition",
            listening ? "bg-emerald-400" : "bg-white",
          )}
        >
          <Icon name="Microphone" className="h-5 w-5" />
        </button>
        <div className="hidden sm:block">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-white/50">NEXA voice</p>
          <p className="text-sm font-semibold text-white/80">{listening ? "Listening" : "Tap to speak"}</p>
        </div>
      </div>

      {voice ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-6 backdrop-blur">
          <div className="w-[min(46rem,92vw)] rounded-3xl border border-amber-400/40 bg-slate-950/90 p-8 text-center">
            <span
              className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-amber-400/20 text-amber-200"
              style={{ animation: "tvPulse 1.2s ease-in-out infinite" }}
            >
              <Icon name="Microphone" className="h-8 w-8" />
            </span>
            <p className="mt-4 text-2xl font-semibold text-white">Listening, what should we do?</p>
            <p className="mt-1.5 text-sm text-white/55">Pick a natural language goal for the agent to turn into an agenda.</p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              {profile.prompts.map((p, i) => (
                <TVFocusable
                  key={p}
                  id={`voice-${i}`}
                  glow="amber"
                  onSelect={() => {
                    setVoice(false);
                    setListening(false);
                    quickPrompt(p);
                  }}
                  className="max-w-[38ch] truncate rounded-full border border-white/15 bg-white/[0.06] px-4 py-2.5 text-sm font-medium text-white/80"
                >
                  {p}
                </TVFocusable>
              ))}
            </div>
            <TVFocusable
              id="voice-close"
              glow="rose"
              onSelect={() => {
                setVoice(false);
                setListening(false);
              }}
              className="mt-7 rounded-2xl border border-white/15 px-7 py-3.5 text-sm font-semibold text-white/70"
            >
              Cancel
            </TVFocusable>
          </div>
        </div>
      ) : null}

      <Toaster
        position="top-center"
        theme="dark"
        toastOptions={{
          style: {
            background: "rgba(11,13,20,0.94)",
            border: "1px solid rgba(255,255,255,0.14)",
            color: "#fff",
          },
        }}
      />
    </div>
  );
}

export default function App() {
  return (
    <TVFocusProvider>
      <TVApp />
    </TVFocusProvider>
  );
}