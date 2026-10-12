import time
from typing import TypedDict, List, Dict, Any
from langgraph.graph import StateGraph, END
from langgraph.checkpoint.memory import MemorySaver

# Define state schema for the agent
class AgentState(TypedDict):
    prompt: str
    time_constraint: int
    plan: List[Dict[str, Any]]
    status: str

class LangGraphComposer:
    def __init__(self):
        self.memory = MemorySaver()
        self.workflow = self._build_graph()
        
    def _build_graph(self):
        workflow = StateGraph(AgentState)
        
        # Add workflow nodes
        workflow.add_node("analyze_constraint", self._analyze_constraint)
        workflow.add_node("replan_schedule", self._replan_schedule)
        
        # Define edges
        workflow.set_entry_point("analyze_constraint")
        workflow.add_edge("analyze_constraint", "replan_schedule")
        workflow.add_edge("replan_schedule", END)
        
        return workflow.compile(checkpointer=self.memory)

    def _analyze_constraint(self, state: AgentState) -> AgentState:
        # Analyze prompt for time constraints or shortcuts
        prompt = state.get("prompt", "").lower()
        if "15 minutes" in prompt or "15 mins" in prompt:
            state["time_constraint"] = 15
        elif "10 minutes" in prompt or "10 mins" in prompt:
            state["time_constraint"] = 10
        else:
            state["time_constraint"] = state.get("time_constraint", 30)
        state["status"] = "Constraint analyzed successfully"
        return state

    def _replan_schedule(self, state: AgentState) -> AgentState:
        limit = state["time_constraint"]
        # Default mock schedule items
        full_plan = [
            {"task": "Evening Warmup & Stretching", "duration": 10, "priority": "High"},
            {"task": "Ambient Music & Lighting Setup", "duration": 10, "priority": "Medium"},
            {"task": "Guided Breathing & Wind Down", "duration": 15, "priority": "High"}
        ]
        
        # Filter or compress tasks based on time constraint
        compressed_plan = []
        total_time = 0
        for item in full_plan:
            if total_time + item["duration"] <= limit:
                compressed_plan.append(item)
                total_time += item["duration"]
            elif total_time < limit:
                item["duration"] = limit - total_time
                item["task"] += " (Condensed)"
                compressed_plan.append(item)
                break
                
        state["plan"] = compressed_plan if compressed_plan else [{"task": "Quick 5-Min Reset", "duration": limit, "priority": "High"}]
        state["status"] = "Plan successfully adapted in-memory"
        return state

    async def run_agent(self, prompt: str, user_id: str = "default_user") -> Dict[str, Any]:
        start_time = time.time()
        initial_state = {"prompt": prompt, "time_constraint": 30, "plan": [], "status": "Initializing"}
        config = {"configurable": {"thread_id": user_id}}
        
        # Invoke LangGraph workflow
        result = self.workflow.invoke(initial_state, config)
        execution_time = (time.time() - start_time) * 1000
        
        return {
            "status": result["status"],
            "message": f"Processed prompt: '{prompt}'",
            "updated_plan": result["plan"],
            "execution_time_ms": round(execution_time, 2)
        }

# Global instance
agent_composer = LangGraphComposer()