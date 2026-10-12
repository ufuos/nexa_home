from pydantic import BaseModel
from typing import List, Optional

class ContentItem(BaseModel):
    id: str
    title: str
    category: str  # "Relaxation", "Fitness", "Ambient", "Entertainment"
    duration_minutes: int
    recommended_for_dpad: bool = True
    thumbnail_url: Optional[str] = None

class ContentCatalogResponse(BaseModel):
    total_items: int
    items: List[ContentItem]