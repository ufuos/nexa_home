from pydantic import BaseModel
from typing import List, Optional

class ProfileOption(BaseModel):
    id: str
    name: str
    role: str
    avatar_url: Optional[str] = None
    accessibility_mode: str = "standard"  # "standard" | "high_contrast" | "voice_view"
    preferences: List[str] = []

class ProfileListResponse(BaseModel):
    active_profile_id: str
    profiles: List[ProfileOption]