export interface TVNavItem {
  id: string;
  label: string;
  icon: string;
}

export type Category = "entertainment" | "learning" | "fitness" | "together";
export type ActivityStatus = "pending" | "active" | "completed";
export type FontScale = "standard" | "large" | "extra-large";
export type AgentStatus = "thinking" | "invoking" | "adapting" | "ready";
export type ScreenId = "home" | "ask-nexa" | "plan" | "profiles" | "uikit";
export type RemoteAction =
  | "up"
  | "down"
  | "left"
  | "right"
  | "select"
  | "back"
  | "home"
  | "mic"
  | "play";

export interface Profile {
  id: string;
  name: string;
  initials: string;
  role: string;
  bio: string;
  fontScale: FontScale;
  highContrast: boolean;
  interests: string[];
  prompts: string[];
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  answerIndex: number;
}

export interface AgendaItem {
  id: string;
  title: string;
  durationMinutes: number;
  category: Category;
  icon: string;
  description: string;
  status: ActivityStatus;
  details: string[];
  quiz?: QuizQuestion[];
  routine?: string[];
}

export interface AgendaPlan {
  id: string;
  title: string;
  targetMinutes: number;
  profileId: string;
  items: AgendaItem[];
  outcomeMessage: string;
  lastModified: string;
}

export interface AgentToolInvocation {
  id: string;
  tool: string;
  query: string;
  status: AgentStatus;
  timestamp: string;
}

export interface ActivityCard {
  id: string;
  title: string;
  subtitle?: string;
  icon: string;
  accent: string;
  durationMinutes?: number;
  tag?: string;
}

export interface Rail {
  id: string;
  label: string;
  icon: string;
  accent: string;
  prompt: string;
  items: ActivityCard[];
}

export interface CategoryTile {
  id: string;
  label: string;
  icon: string;
  accent: string;
  prompt: string;
}

export interface KitProp {
  name: string;
  type: string;
  note: string;
}

export interface KitComponentDoc {
  name: string;
  summary: string;
  props: KitProp[];
  snippet: string;
}