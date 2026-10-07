import type {
  ActivityCard,
  AgendaItem,
  AgendaPlan,
  AgentToolInvocation,
  Category,
  CategoryTile,
  KitComponentDoc,
  Profile,
  QuizQuestion,
  Rail,
} from "@/types";

export const PROFILES: Profile[] = [
  {
    id: "family",
    name: "The Henderson Family",
    initials: "HF",
    role: "Household",
    bio: "Two grown-ups and two kids. A balanced mix of watching, learning and moving before bedtime.",
    fontScale: "standard",
    highContrast: false,
    interests: ["Space", "Family trivia", "Indoor movement", "Movie nights"],
    prompts: [
      "Plan a 20-minute evening mix for the kids: space, movement and a quiz",
      "Find an educational documentary about Saturn and build a 3-question quiz",
      "Family fitness workout for the living room with zero equipment",
    ],
  },
  {
    id: "maya",
    name: "Maya",
    initials: "MY",
    role: "Child - age 8",
    bio: "High energy and endless questions about planets. Friendly large text for easy reading.",
    fontScale: "large",
    highContrast: false,
    interests: ["Space", "Animals", "Dancing"],
    prompts: [
      "Teach me something amazing about space in 10 minutes",
      "Give me a quick dance and jump challenge",
    ],
  },
  {
    id: "david",
    name: "David",
    initials: "DV",
    role: "Parent",
    bio: "Wants a fast strength session followed by a smart digest he can finish before bed.",
    fontScale: "standard",
    highContrast: false,
    interests: ["Fitness", "Technology", "Documentaries"],
    prompts: [
      "20 minutes: quick core workout then a technology digest",
      "Give me a 15-minute living room workout",
    ],
  },
  {
    id: "eleanor",
    name: "Eleanor",
    initials: "EL",
    role: "Senior",
    bio: "Relaxed pace, extra-large typography and high-contrast borders for comfortable viewing.",
    fontScale: "extra-large",
    highContrast: true,
    interests: ["Gardening", "Classic films", "Gentle mobility"],
    prompts: [
      "A calm 20-minute evening with a gentle stretch and a classic film",
      "Gentle chair mobility routine for 10 minutes",
    ],
  },
  {
    id: "solo",
    name: "Solo Explorer",
    initials: "SE",
    role: "Individual",
    bio: "Late-night deep dives, long documentaries and one focused strength block.",
    fontScale: "standard",
    highContrast: false,
    interests: ["Astrophysics", "Long-form docs", "Strength"],
    prompts: [
      "A 45-minute deep dive: space documentary and a strength block",
      "Plan a focused 30-minute learning session",
    ],
  },
];

export const FAMILY_QUIZ: QuizQuestion[] = [
  {
    id: "q1",
    question: "Which planet in our solar system has the most moons?",
    options: ["Saturn", "Mars", "Venus", "Mercury"],
    answerIndex: 0,
  },
  {
    id: "q2",
    question: "How many minutes of movement do children need every day?",
    options: ["10 minutes", "30 minutes", "60 minutes", "120 minutes"],
    answerIndex: 2,
  },
  {
    id: "q3",
    question: "What is the closest star to Earth?",
    options: ["Sirius", "The Sun", "Proxima Centauri", "Polaris"],
    answerIndex: 1,
  },
];

export const SPACE_FACTS: string[] = [
  "Olympus Mons on Mars is about three times taller than Mount Everest.",
  "A single day on Venus lasts longer than its entire year.",
  "Jupiter's Great Red Spot is a storm that has raged for over 350 years.",
  "Saturn's rings are mostly water ice, with pieces as small as grains of sand.",
];

export const MOVEMENT_ROUTINE: string[] = [
  "20 jumping jacks to wake up the room",
  "30 seconds of high knees",
  "10 slow squats",
  "15 arm circles each way",
  "20-second plank hold",
  "30-second full body stretch",
];

export const CATEGORY_META: Record<Category, { label: string; icon: string }> = {
  entertainment: { label: "Watch", icon: "Television" },
  learning: { label: "Learn", icon: "BookOpen" },
  fitness: { label: "Move", icon: "Barbell" },
  together: { label: "Together", icon: "Users" },
};

export const CATEGORY_TILES: CategoryTile[] = [
  {
    id: "watch",
    label: "Watch",
    icon: "Television",
    accent: "sky",
    prompt: "Find a family-friendly film for tonight",
  },
  {
    id: "learn",
    label: "Learn",
    icon: "BookOpen",
    accent: "emerald",
    prompt: "Teach us something amazing about space in 10 minutes",
  },
  {
    id: "move",
    label: "Move",
    icon: "Barbell",
    accent: "amber",
    prompt: "Give us a zero-equipment living room workout",
  },
  {
    id: "together",
    label: "Together",
    icon: "Users",
    accent: "rose",
    prompt: "Plan something the whole family can do together",
  },
  {
    id: "ask",
    label: "Ask NEXA",
    icon: "Sparkle",
    accent: "violet",
    prompt: "Plan our evening from scratch",
  },
];

export const RAILS: Rail[] = [
  {
    id: "watch",
    label: "Watch tonight",
    icon: "Television",
    accent: "sky",
    prompt: "Find a family-friendly film for tonight",
    items: [
      { id: "w1", title: "Saturn: Ringed Giant", subtitle: "Documentary short - 4K space visuals", icon: "Compass", accent: "sky", durationMinutes: 12, tag: "Learning doc" },
      { id: "w2", title: "Moonlight Picnic", subtitle: "Feel-good family comedy", icon: "FilmStrip", accent: "sky", durationMinutes: 96, tag: "Movie" },
      { id: "w3", title: "Deep Ocean Frontiers", subtitle: "Nature series episode two", icon: "Eye", accent: "sky", durationMinutes: 44, tag: "Series" },
      { id: "w4", title: "Classic Film Night", subtitle: "Restored 1954 comedy", icon: "FilmStrip", accent: "sky", durationMinutes: 88, tag: "Classic" },
    ],
  },
  {
    id: "learn",
    label: "Learn something",
    icon: "BookOpen",
    accent: "emerald",
    prompt: "Teach us something amazing about space in 10 minutes",
    items: [
      { id: "l1", title: "How Rockets Actually Launch", subtitle: "Engine physics in five minutes", icon: "Rocket", accent: "emerald", durationMinutes: 6, tag: "Space" },
      { id: "l2", title: "Why the Sky is Blue", subtitle: "Light and atmosphere for kids", icon: "Lightbulb", accent: "emerald", durationMinutes: 5, tag: "Science" },
      { id: "l3", title: "Space Trivia Builder", subtitle: "Agent-generated three question quiz", icon: "Brain", accent: "emerald", durationMinutes: 4, tag: "Quiz" },
      { id: "l4", title: "Numbers in the Solar System", subtitle: "Planet distances made simple", icon: "Gauge", accent: "emerald", durationMinutes: 7, tag: "Maths" },
    ],
  },
  {
    id: "move",
    label: "Move together",
    icon: "Barbell",
    accent: "amber",
    prompt: "Give us a zero-equipment living room workout",
    items: [
      { id: "m1", title: "Living Room Energizer", subtitle: "No equipment, full body burst", icon: "Barbell", accent: "amber", durationMinutes: 8, tag: "Fitness" },
      { id: "m2", title: "Family Dance Off", subtitle: "Follow the beat, everyone joins", icon: "Confetti", accent: "amber", durationMinutes: 6, tag: "Fun" },
      { id: "m3", title: "Core and Balance", subtitle: "Strength block for grown-ups", icon: "Heartbeat", accent: "amber", durationMinutes: 12, tag: "Strength" },
      { id: "m4", title: "Gentle Chair Mobility", subtitle: "Slow seated routine", icon: "Heart", accent: "amber", durationMinutes: 10, tag: "Gentle" },
    ],
  },
  {
    id: "together",
    label: "Do it together",
    icon: "Users",
    accent: "rose",
    prompt: "Plan something the whole family can do together",
    items: [
      { id: "t1", title: "Family Trivia Round", subtitle: "Three questions, everyone answers", icon: "Trophy", accent: "rose", durationMinutes: 5, tag: "Quiz" },
      { id: "t2", title: "Story Builders", subtitle: "Build a story one line at a time", icon: "Users", accent: "rose", durationMinutes: 10, tag: "Creative" },
      { id: "t3", title: "Map the Night Sky", subtitle: "Spot three constellations from the sofa", icon: "Star", accent: "rose", durationMinutes: 9, tag: "Stargazing" },
      { id: "t4", title: "Kitchen Science", subtitle: "Safe experiment with household items", icon: "ShieldCheck", accent: "rose", durationMinutes: 14, tag: "Hands on" },
    ],
  },
];

export const AGENT_TOOL_NAMES: { tool: string; icon: string }[] = [
  { tool: "Content Search", icon: "MagnifyingGlass" },
  { tool: "Family Scheduler", icon: "Users" },
  { tool: "Movement Routine", icon: "Barbell" },
  { tool: "Learning Quiz", icon: "Brain" },
];

export const HOUSEHOLD_STATS = [
  { id: "streak", label: "Day streak", value: "12", icon: "Fire", accent: "amber" },
  { id: "moved", label: "Minutes moved today", value: "34", icon: "Timer", accent: "emerald" },
  { id: "badges", label: "Badges earned", value: "5", icon: "Trophy", accent: "rose" },
];

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}

export function createPlan(minutes: number, profileId: string): AgendaPlan {
  const safe = clamp(Math.round(minutes), 5, 90);
  const profile = PROFILES.find((p) => p.id === profileId) ?? PROFILES[0];
  const short = safe <= 12;
  const learning = short ? Math.max(3, Math.round(safe * 0.35)) : Math.round(safe * 0.3);
  const fitness = short ? Math.max(3, Math.round(safe * 0.35)) : Math.round(safe * 0.25);
  const watch = short ? 0 : Math.round(safe * 0.25);
  const quiz = Math.max(2, safe - learning - fitness - watch);

  const items: AgendaItem[] = [
    {
      id: "act-space",
      title: "Space Discovery",
      durationMinutes: learning,
      category: "learning",
      icon: "Rocket",
      description: "A guided look at rockets, planets and the ringed giant, ending with three surprising facts.",
      status: "active",
      details: SPACE_FACTS,
      quiz: FAMILY_QUIZ,
    },
    {
      id: "act-move",
      title: "Living Room Movement",
      durationMinutes: fitness,
      category: "fitness",
      icon: "Barbell",
      description: "Zero equipment routine the whole household can follow from the sofa.",
      status: "pending",
      details: ["Follow-on-screen prompts", "No equipment needed", "Beat the room record"],
      routine: MOVEMENT_ROUTINE,
    },
  ];

  if (watch > 0) {
    items.push({
      id: "act-film",
      title: "Movie and Chill",
      durationMinutes: watch,
      category: "entertainment",
      icon: "FilmStrip",
      description: "Curated family film block matched to the household interests.",
      status: "pending",
      details: ["Family-friendly rating", "Short recap if time is tight", "Auto pause for dinner"],
    });
  }

  items.push({
    id: "act-quiz",
    title: "Family Trivia",
    durationMinutes: quiz,
    category: "together",
    icon: "Confetti",
    description: "D-pad friendly three question round so everyone can take part together.",
    status: "pending",
    details: ["Everyone answers", "Track family score", "Rematch on demand"],
    quiz: FAMILY_QUIZ,
  });

  return {
    id: `plan-${safe}-${profileId}`,
    title: `${profile.name} - ${safe} minute evening mix`,
    targetMinutes: safe,
    profileId,
    items,
    outcomeMessage: outcomeFor(safe),
    lastModified: new Date().toISOString(),
  };
}

function outcomeFor(minutes: number) {
  if (minutes <= 10) {
    return "I trimmed the documentary to its core highlights and condensed the workout into a 3-minute energizer so you still make dinner on time.";
  }
  if (minutes <= 22) {
    return "A balanced mix: a space discovery short, an indoor movement burst, and a family trivia round to finish together.";
  }
  return "A longer session: a full learning block, a strength and movement build up, a film chapter, and trivia to close the evening.";
}

export function planFromPrompt(prompt: string, profileId: string): AgendaPlan {
  const match = prompt.match(/(\d{1,3})\s*-?\s*(?:min|minute)/i);
  let minutes = match ? Number(match[1]) : 20;
  if (!match && /only have|quick|short|fast/i.test(prompt)) minutes = 10;
  return createPlan(minutes, profileId);
}

export function buildInvocations(prompt: string): AgentToolInvocation[] {
  const lower = prompt.toLowerCase();
  const picks: AgentToolInvocation[] = [];
  const stamp = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  picks.push({ id: "inv-1", tool: "Intent Parser", query: `Reading household goal: "${prompt.slice(0, 64)}"`, status: "thinking", timestamp: stamp });
  picks.push({ id: "inv-2", tool: "Content Search", query: lower.includes("saturn") ? "NASA Saturn archive, family rated" : "Family rated educational catalogue", status: "thinking", timestamp: stamp });
  picks.push({ id: "inv-3", tool: "Family Scheduler", query: "Fitting activities into the household calendar", status: "thinking", timestamp: stamp });
  if (/move|workout|fitness|stretch|dance|jump/i.test(lower) || true) {
    picks.push({ id: "inv-4", tool: "Movement Routine", query: "Zero equipment living room block", status: "thinking", timestamp: stamp });
  }
  picks.push({ id: "inv-5", tool: "Learning Quiz", query: "Generating three D-pad friendly questions", status: "thinking", timestamp: stamp });
  return picks;
}

export const KIT_DOCS: KitComponentDoc[] = [
  {
    name: "TVFocusProvider / useTVFocus",
    summary: "Spatial D-pad focus engine. Tracks every registered focusable and moves focus to the nearest element in the pressed direction.",
    props: [
      { name: "children", type: "ReactNode", note: "Wrap any TV surface to enable arrow key navigation." },
    ],
    snippet: `import { TVFocusProvider, useTVFocus } from "nexa-tv-agent-ui-kit";

<TVFocusProvider>
  <App />
</TVFocusProvider>

const { move, focusId, focus } = useTVFocus();`,
  },
  {
    name: "TVFocusable",
    summary: "Accessible button that registers itself with the focus engine and renders a high contrast living room focus ring.",
    props: [
      { name: "id", type: "string", note: "Unique focus id used by the spatial engine." },
      { name: "onSelect", type: "() => void", note: "Fired on remote Select or Enter." },
      { name: "glow", type: "string", note: "Accent token used for the focus glow." },
    ],
    snippet: `<TVFocusable id="hero-cta" glow="amber" onSelect={start}>
  Start plan
</TVFocusable>`,
  },
  {
    name: "TVNavigationShell",
    summary: "Ten foot layout shell with a single line top bar, ambient backdrop and safe area padding for the living room.",
    props: [
      { name: "items", type: "TVNavItem[]", note: "Top level destinations." },
      { name: "activeId", type: "string", note: "Currently selected destination." },
      { name: "onSelect", type: "(id: string) => void", note: "Destination change handler." },
    ],
    snippet:
      '<TVNavigationShell items={NAV} activeId={screen} onSelect={go}>...</TVNavigationShell>',
  },
  {
    name: "AgentStatusBadge",
    summary: "Animated agent state pill that pulses through thinking, invoking tools, adapting the plan and ready.",
    props: [
      { name: "status", type: "AgentStatus", note: "thinking | invoking | adapting | ready" },
    ],
    snippet: '<AgentStatusBadge status="adapting" />',
  },
  {
    name: "AgentPlanCard",
    summary: "Large focusable summary of a generated agenda with per activity duration pills and an instant start action.",
    props: [
      { name: "plan", type: "AgendaPlan", note: "Agent generated multi activity plan." },
      { name: "onStart", type: "() => void", note: "Launches the plan runner." },
    ],
    snippet: '<AgentPlanCard id="today-plan" plan={plan} onStart={run} />',
  },
  {
    name: "FamilyActivityCard",
    summary: "Media card for a single household activity with accent glow, duration badge and completion progress bar.",
    props: [
      { name: "activity", type: "ActivityCard", note: "Card content and accent token." },
      { name: "onSelect", type: "() => void", note: "Opens or plays the activity." },
    ],
    snippet: '<FamilyActivityCard id="card-1" activity={item} onSelect={play} />',
  },
  {
    name: "VirtualTVRemote",
    summary: "Floating on-screen Fire TV remote so mouse and touch reviewers can drive the D-pad experience.",
    props: [
      { name: "open", type: "boolean", note: "Visibility toggle." },
      { name: "onAction", type: "(a: RemoteAction) => void", note: "up, down, left, right, select, back, home, mic, play" },
    ],
    snippet: '<VirtualTVRemote open={remote} onClose={close} onAction={dispatch} />',
  },
];

export const KIT_README = `NEXA TV Agent UI Kit
Open source, MIT licensed building blocks for 10 foot agent driven TV interfaces.

install
  bun add nexa-tv-agent-ui-kit

what you get
  TVFocusProvider  spatial D-pad focus engine with arrow key navigation
  TVFocusable      accessible focus ring button for the living room
  TVNavigationShell  single line top bar shell with ambient backdrop
  AgentStatusBadge animated agent state pill
  AgentPlanCard    focusable multi activity agenda summary
  FamilyActivityCard media card with duration badge and progress
  VirtualTVRemote  on screen Fire TV remote for testing

design rules
  1. Every interactive element is reachable with the arrow keys and select.
  2. Body text renders at 10 foot legibility, minimum 18px equivalent.
  3. Focus states use a high contrast white ring plus an accent glow.
  4. Supports a high contrast mode and three typography scales.

Accessibility
  Reduced motion is respected. The kit degrades to instant state changes when the visitor prefers reduced motion.`;