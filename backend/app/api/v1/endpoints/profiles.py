from fastapi import APIRouter, HTTPException
from app.schemas.profiles import ProfileListResponse, ProfileOption

router = APIRouter()

# In-memory mock profiles tailored for TV UI & accessibility demos
MOCK_PROFILES = [
    ProfileOption(
        id="p1",
        name="Evening Ambient",
        role="Default Household",
        accessibility_mode="standard",
        preferences=["Guided Relaxation", "Ambient Lighting Sync", "Short Routines"]
    ),
    ProfileOption(
        id="p2",
        name="Accessibility View",
        role="VoiceView & High Contrast",
        accessibility_mode="voice_view",
        preferences=["Large Focus Rings", "Screen Reader Verbal Cues", "D-Pad Direct Shortcuts"]
    )
]

@router.get("/", response_model=ProfileListResponse)
async def get_profiles():
    """Retrieve available user profiles and active UI accessibility modes."""
    return ProfileListResponse(
        active_profile_id="p1",
        profiles=MOCK_PROFILES
    )

@router.get("/{profile_id}", response_model=ProfileOption)
async def get_profile_by_id(profile_id: str):
    """Retrieve a specific profile configuration."""
    for profile in MOCK_PROFILES:
        if profile.id == profile_id:
            return profile
    raise HTTPException(status_code=404, detail="Profile not found")