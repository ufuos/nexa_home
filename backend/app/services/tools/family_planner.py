from typing import List, Dict, Any, Optional


class FamilyPlannerTool:
    """Tool for generating structured multi-item routine agendas."""

    def __init__(self):
        # Base default routines for standard household profiles
        self.default_templates: Dict[str, List[Dict[str, Any]]] = {
            "evening": [
                {"task": "Evening Warmup & Light Stretch", "duration": 10, "priority": "High", "category": "Fitness"},
                {"task": "Ambient Lighting & Soundscape", "duration": 10, "priority": "Medium", "category": "Ambient"},
                {"task": "Guided Breathing & Wind Down", "duration": 15, "priority": "High", "category": "Relaxation"}
            ],
            "morning": [
                {"task": "5-Min Hydration & Breathing Reset", "duration": 5, "priority": "High", "category": "Relaxation"},
                {"task": "15-Min Energizing Stretch", "duration": 15, "priority": "High", "category": "Fitness"},
                {"task": "10-Min Daily Focus & News Briefing", "duration": 10, "priority": "Medium", "category": "Entertainment"}
            ]
        }

    def compose_routine(
        self, 
        routine_type: str = "evening", 
        target_duration: Optional[int] = None
    ) -> List[Dict[str, Any]]:
        """Assemble an initial ordered list of activities for a routine."""
        routine = [
            dict(item) for item in self.default_templates.get(
                routine_type.lower(), self.default_templates["evening"]
            )
        ]

        if target_duration is not None:
            total = sum(item["duration"] for item in routine)
            if total > target_duration:
                # Truncate tasks to fit initial duration request
                accumulated = 0
                adjusted_routine = []
                for item in routine:
                    if accumulated + item["duration"] <= target_duration:
                        adjusted_routine.append(item)
                        accumulated += item["duration"]
                    elif accumulated < target_duration:
                        item["duration"] = target_duration - accumulated
                        item["task"] += " (Condensed)"
                        adjusted_routine.append(item)
                        break
                return adjusted_routine

        return routine


# Global tool instance for LangGraph import
family_planner_tool = FamilyPlannerTool()