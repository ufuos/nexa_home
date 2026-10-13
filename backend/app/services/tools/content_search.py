from typing import List, Dict, Any, Optional

# In-memory activity catalog optimized for 10-foot TV interactions
MOCK_ACTIVITIES_CATALOG: List[Dict[str, Any]] = [
    {
        "id": "act_01",
        "title": "5-Min Quick Body Reset",
        "category": "Fitness",
        "duration_minutes": 5,
        "intensity": "Low",
        "tags": ["stretching", "quick", "energy", "morning"]
    },
    {
        "id": "act_02",
        "title": "10-Min Guided Mindful Breathing",
        "category": "Relaxation",
        "duration_minutes": 10,
        "intensity": "Low",
        "tags": ["breathing", "meditation", "calm", "wind down"]
    },
    {
        "id": "act_03",
        "title": "15-Min Ambient Fireplace & Jazz",
        "category": "Ambient",
        "duration_minutes": 15,
        "intensity": "None",
        "tags": ["ambient", "music", "lighting", "cozy"]
    },
    {
        "id": "act_04",
        "title": "20-Min Family Trivia Challenge",
        "category": "Entertainment",
        "duration_minutes": 20,
        "intensity": "Medium",
        "tags": ["family", "games", "interactive", "dpad"]
    },
    {
        "id": "act_05",
        "title": "30-Min Evening Yoga & Unwind",
        "category": "Fitness",
        "duration_minutes": 30,
        "intensity": "Low",
        "tags": ["yoga", "stretch", "evening", "sleep"]
    }
]


class ContentSearchTool:
    """Tool for searching and filtering the NEXA Home activity catalog."""

    def __init__(self, catalog: Optional[List[Dict[str, Any]]] = None):
        self.catalog = catalog if catalog is not None else MOCK_ACTIVITIES_CATALOG

    def search_by_query(self, query: str, max_results: int = 5) -> List[Dict[str, Any]]:
        """Search activities by keyword matching against titles and tags."""
        query_lower = query.lower().strip()
        matched: List[Dict[str, Any]] = []

        for item in self.catalog:
            title_match = query_lower in item["title"].lower()
            tag_match = any(query_lower in tag.lower() for tag in item.get("tags", []))
            category_match = query_lower in item["category"].lower()

            if title_match or tag_match or category_match:
                matched.append(item)

        return matched[:max_results]

    def filter_by_duration(self, max_minutes: int) -> List[Dict[str, Any]]:
        """Return activities that fit strictly within a given duration constraint."""
        return [
            item for item in self.catalog 
            if item["duration_minutes"] <= max_minutes
        ]

    def get_by_category(self, category: str) -> List[Dict[str, Any]]:
        """Filter activities by specific primary category."""
        return [
            item for item in self.catalog 
            if item["category"].lower() == category.lower()
        ]


# Global tool instance for LangGraph import
content_search_tool = ContentSearchTool()