NEXA HOME (nexa-home)Your living room, intelligently connected.Ask. Watch. Learn. Move. Connect.NEXA Home is a 10-foot, remote-first AI living room companion built for Amazon Fire TV. Operating on Fire OS and Vega OS platforms, NEXA transforms television screens from passive video players into adaptive household orchestrators. Rather than acting as a static chatbot or traditional recommendation grid, NEXA interprets vague natural-language requests, evaluates multi-user household contexts, synthesizes structured cross-domain plans (combining entertainment, learning, and fitness), and dynamically updates active routines in real time when time constraints or family preferences shift.Technical Architecture & Core System FlowNEXA Home follows a clean client-agent architecture optimized for lean-back 10-foot TV interactions, low latency streaming response delivery, and remote control D-pad navigation.                 +-------------------------------------------------+
                 |              FIRE TV CLIENT (10-FT UI)           |
                 |  React Native for TV / Vega OS Web App Shell     |
                 +------------------------+------------------------+
                                          |
                         HTTP / WebSocket | Prompt Invocations
                                          v
                 +-------------------------------------------------+
                 |                BACKEND SERVICE                  |
                 |               FastAPI / Python 3.11             |
                 +------------------------+------------------------+
                                          |
                                          v
                 +-------------------------------------------------+
                 |               AGENTIC COMPOSER                  |
                 |            LangGraph / LangChain Orchestration  |
                 +------------------------+------------------------+
                                          |
                                          v
                 +-------------------------------------------------+
                 |             AWS BEDROCK & AGENTCORE             |
                 | Amazon Bedrock (Claude 3.5 Sonnet / Haiku)       |
                 | AgentCore Memory, Tools & Identity Security     |
                 +------------------------+------------------------+
                                          |
         +--------------------------------+--------------------------------+
         |                                |                                |
         v                                v                                v
+------------------+             +------------------+             +------------------+
| CONTENT SEARCH   |             | FAMILY PLANNER   |             | PLAN ADAPTER     |
| catalog search   |             | multi-activity   |             | real-time scale  |
+------------------+             +------------------+             +------------------+
         |                                |                                |
         v                                v                                v
+------------------+             +------------------+             +------------------+
| FITNESS PLANNER  |             | LEARNING PLANNER |             | USER PREFERENCES |
| workouts/stretches|            | quizzes/lessons  |             | profile storage  |
+------------------+             +------------------+             +------------------+
Agentic Loop MechanicsUser Intent Capture: Natural language enters via remote Quick-Prompts or the On-Screen TV Keyboard.Context Resolution: The system retrieves current session profile parameters (FAMILY, PARENT, CHILD, SENIOR, INDIVIDUAL), active time budgets, and accessibility parameters.Agentic Reasoner: LangGraph coordinates with Amazon Bedrock and AgentCore to determine necessary steps, avoiding exposure of private chain-of-thought to the UI.Tool Execution: Agent tools execute modular actions (e.g., create_family_plan(), adapt_existing_plan(), create_workout()) to assemble structured JSON agenda objects.UI Rendering: The Fire TV UI renders active timelines with high-contrast, focal-focused UI cards.Adaptive Feedback Loop: Mid-stream user modifications (e.g., "Actually, we only have 8 minutes") re-invoke adapt_existing_plan() to trim, re-calculate, and update active routines dynamically.Key Features & Product Capabilities1. Hero Interface & 10-Foot NavigationD-Pad Directional Support: Full spatial navigation (Up, Down, Left, Right, Select, Back) using native remote listeners and physical keycode mapping.High-Contrast Focus System: Custom focus boundaries engineered specifically for viewing distances of 10 feet or greater.Virtual TV Remote & Voice Overlay: Integrated simulator overlay allowing reviewers on desktop browsers to trigger D-pad buttons, voice overlays, and profile shortcuts effortlessly.2. "Ask NEXA" Agent HubQuick-Prompt Selector: One-click pre-configured prompts (Plan a family activity, Find something educational, Give us a 10-minute workout) designed for zero-typing navigation.On-Screen TV Keyboard: Built-in TV matrix keyboard supporting simulator-based custom queries when hardware microphones are bypassed.Agent Status Indicator: Safe, user-friendly high-level state reporting (Understanding your request..., Checking preferences..., Adapting your plan...) hiding raw chain-of-thought logs.3. Adaptive Agentic Planning (Signature Feature)Real-Time Plan Restructuring: Modifies existing multi-activity plans on the fly without resetting state or re-prompting from scratch.Proportional Time Scaling: Trims 20-minute agendas down to 8 minutes while maintaining balanced activity ratios across Watch, Learn, and Move segments.4. Accessibility & Multi-Profile Support5 Pre-Configured Demo Profiles:FAMILY: Balanced entertainment, learning, and physical movement.PARENT: Curated activity scheduling and child management features.CHILD: Simplified, high-safety interface with vibrant, age-appropriate content.SENIOR: Expanded typography scaling, high contrast ratios, and simplified navigation paths.INDIVIDUAL: Personalized fitness routines and solo skill building.Application Operational GuideHome Screen NavigationLaunch the application to land on the primary 10-foot dashboard displaying the hero prompt: "Good evening. What should we do?"Use the D-Pad Arrow Keys (or Virtual Remote on simulator) to focus across core category tiles: WATCH, LEARN, MOVE, TOGETHER, and ASK NEXA.Use SELECT (Enter/Space on simulator) to enter any category or trigger a action card.Executing an Adaptive Planning SessionNavigate to ASK NEXA on the main menu.Select the quick-prompt: "Plan a family activity".The Agent status bar will step through status states (Understanding..., Planning..., Ready).Review the generated 20-Minute Family Adventure:10 min — Space Discovery (Learn)7 min — Family Movement (Move)3 min — Quick Quiz (Together)Trigger the quick-prompt or voice action: "Actually, we only have 8 minutes."Observe real-time plan adaptation into an 8-Minute Family Adventure:3 min — Space Discovery3 min — Family Movement2 min — Quick QuizThe agent displays a conversational confirmation message: "I've adapted the plan to fit your new 8-minute window."Changing Household ProfilesFocus on the profile icon in the upper navigation bar.Press SELECT to open the profile overlay.Switch between Family, Parent, Child, Senior, or Individual to inspect custom UI contrast, text size scaling, and content filtering.AWS Services & Architecture IntegrationNEXA Home uses actual AWS service abstractions and SDK integrations to orchestrate agent reasoning, content delivery, and data persistence.AWS ServiceArchitecture Role & ImplementationAmazon BedrockPrimary LLM runtime executing Claude 3.5 Sonnet / Haiku for structured intent parsing and plan generation.Amazon Bedrock AgentCoreProvides agent runtime environments, tool dispatching, session memory persistence, and IAM-level security enforcement.AWS LambdaStateless micro-functions executing remote catalog lookups and algorithmic schedule adjustments.Amazon DynamoDBLow-latency NoSQL persistence storing household profiles, execution histories, and preference states.Amazon S3Object storage hosting media thumbnails, UI Kit static assets, and video preview clips.Amazon CloudWatchCentralized log ingestion tracking agent execution metrics, tool invocation latency, and error states.AWS Secrets ManagerSecure, encrypted storage for backend API credentials and AWS service authorization keys.Open Source Companion: NEXA TV Agent UI KitExtracted directly as a reusable open-source component library, the NEXA TV Agent UI Kit lives in the packages/nexa-tv-agent-ui-kit subfolder within this repository. It provides TV-native UI primitives for React Native / Vega OS applications building AI agent interfaces.Included ComponentsTVFocusManager: Spatial focus engine handling remote D-pad state management and focus trapping.TVNavigationShell: High-contrast, lean-back top and side navigation layout frame.AgentStatus: Lightweight animated indicator surfacing agent state without revealing internal logs.AgentPlanCard: Structural card for rendering multi-segment agentic timelines with progress tracking.FamilyActivityCard: Multi-modal card featuring high-visibility action targets and age indicators.TVProgressIndicator: High-contrast linear and circular progress displays engineered for big screens.AccessibilityControls: Dynamic font scaler and high-contrast toggle hook collection.VoicePromptUI: Visualizer surface for voice input and quick-prompt chips.UI Kit Quick StartBash# Navigate to package subfolder
cd packages/nexa-tv-agent-ui-kit

# Install dependencies and build library
npm install
npm run build
TypeScriptimport React from 'react';
import { TVNavigationShell, AgentStatus, AgentPlanCard } from '@nexa-home/tv-agent-ui-kit';

export const PlanView = ({ plan, status }) => (
  <TVNavigationShell title="NEXA Planner">
    <AgentStatus state={status} message="Adapting schedule..." />
    <AgentPlanCard 
      title={plan.title}
      duration={plan.totalDuration}
      activities={plan.items}
      onSelectActivity={(id) => console.log('Selected:', id)}
    />
  </TVNavigationShell>
);
Local Development & Setup InstructionsPrerequisitesNode.js: v18.x or v20.xPython: 3.11+Package Manager: npm or pnpmSimulator / Emulator: Fire TV Android Emulator, Vega OS Simulator, or standard Web-based 10-foot Simulator.Backend Setup (FastAPI + LangGraph)Bash# Navigate to backend directory
cd backend

# Create and activate virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Configure Environment Variables
cp .env.example .env
# Edit .env to set AWS credentials or activate local mock modes:
# USE_MOCK_AWS=true

# Start Backend Server
uvicorn main:app --reload --port 8000
Frontend Setup (Fire TV Client)Bash# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start Local Web/TV Simulator
npm run dev
Open http://localhost:3000 or load the build package into your target Fire OS / Vega OS simulator device.Testing & Platform VerificationFor detailed device test execution reports, performance metrics, and simulator logs, consult the test report document located at:docs/FIRE_TV_TEST_REPORT.md
Key Verification MetricsRemote D-Pad Navigation: Passed across all primary views with zero missing focus states.Adaptive Replanning Speed: Sub-second agenda recalculation and UI re-render on simulated prompt triggers.Font Scaling & Accessibility: Verified across 100% (Standard) to 150% (Senior Profile) typography scales.License & LegalThis project is released under the MIT License. See the LICENSE file for details.NEXA Home and NEXA TV Agent UI Kit are created for the Amazon Developer Hackathon.