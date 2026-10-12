from fastapi import APIRouter, Query
from typing import Optional
from app.schemas.content import ContentCatalogResponse, ContentItem

router = APIRouter()

MOCK_CATALOG = [
    ContentItem(
        id="c1",
        title="5-Min Evening Stretch",
        category="Fitness",
        duration_minutes=5,
        recommended_for_dpad=True
    ),
    ContentItem(
        id="c2",
        title="Ambient Fireplace & Soft Jazz",
        category="Ambient",
        duration_minutes=30,
        recommended_for_dpad=True
    ),
    ContentItem(
        id="c3",
        title="Guided Wind Down Breathing",
        category="Relaxation",
        duration_minutes=10,
        recommended_for_dpad=True
    ),
    ContentItem(
        id="c4",
        title="15-Min Quick Routine Reset",
        category="Relaxation",
        duration_minutes=15,
        recommended_for_dpad=True
    )
]

@router.get("/catalog", response_model=ContentCatalogResponse)
async def get_catalog(category: Optional[str] = Query(None, description="Filter catalog by category")):
    """Retrieve content items for Fire TV routine composition."""
    if category:
        filtered = [item for item in MOCK_CATALOG if item.category.lower() == category.lower()]
        return ContentCatalogResponse(total_items=len(filtered), items=filtered)
    
    return ContentCatalogResponse(total_items=len(MOCK_CATALOG), items=MOCK_CATALOG)