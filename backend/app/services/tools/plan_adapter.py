import math
from typing import List, Dict, Any


class PlanAdapterTool:
    """Sub-second re-planning tool that scales and priority-filters schedules."""

    def adapt_schedule(
        self, 
        current_plan: List[Dict[str, Any]], 
        max_time_minutes: int,
        decay_gamma: float = 0.05
    ) -> List[Dict[str, Any]]:
        """
        Recalculates schedule tasks to fit within max_time_minutes.
        
        High priority tasks are preserved, low priority tasks are condensed
        or deferred using exponential decay logic for sub-second execution.
        """
        if not current_plan:
            return [{
                "task": f"Quick {max_time_minutes}-Min Ambient Reset",
                "duration": max_time_minutes,
                "priority": "High",
                "category": "Relaxation"
            }]

        total_current_time = sum(task.get("duration", 10) for task in current_plan)
        
        # If the plan already fits, return it immediately
        if total_current_time <= max_time_minutes:
            return current_plan

        # Calculate time delta for scaling calculations
        delta_c = total_current_time - max_time_minutes
        adapted_plan: List[Dict[str, Any]] = []
        allocated_time = 0

        # Sort tasks by priority (High > Medium > Low)
        priority_weights = {"High": 3, "Medium": 2, "Low": 1}
        sorted_tasks = sorted(
            current_plan, 
            key=lambda x: priority_weights.get(x.get("priority", "Medium"), 2), 
            reverse=True
        )

        for task in sorted_tasks:
            orig_duration = task.get("duration", 10)
            
            # Apply mathematical decay scaling
            scaled_duration = max(
                3,  # Minimum duration per task: 3 mins
                math.floor(orig_duration * math.exp(-decay_gamma * (delta_c / max_time_minutes)))
            )

            if allocated_time + scaled_duration <= max_time_minutes:
                task_copy = dict(task)
                task_copy["duration"] = scaled_duration
                if scaled_duration < orig_duration:
                    task_copy["task"] = f"{task['task']} (Scaled)"
                adapted_plan.append(task_copy)
                allocated_time += scaled_duration
            elif allocated_time < max_time_minutes:
                remaining = max_time_minutes - allocated_time
                if remaining >= 3:
                    task_copy = dict(task)
                    task_copy["duration"] = remaining
                    task_copy["task"] = f"{task['task']} (Condensed)"
                    adapted_plan.append(task_copy)
                    allocated_time += remaining
                break

        # Fallback if constraint is extremely tight
        if not adapted_plan:
            adapted_plan = [{
                "task": f"Express {max_time_minutes}-Min Routine",
                "duration": max_time_minutes,
                "priority": "High",
                "category": "Relaxation"
            }]

        return adapted_plan


# Global tool instance for LangGraph import
plan_adapter_tool = PlanAdapterTool()