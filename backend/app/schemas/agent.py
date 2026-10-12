from pydantic import BaseModel
from typing import List, Optional, Dict, Any

class AgentPromptRequest(BaseModel):
    prompt: str
    user_id: Optional[str] = "default_user"
    time_constraint_minutes: Optional[int] = None

class AgentResponse(BaseModel):
    status: str
    message: str
    updated_plan: List[Dict[str, Any]]
    execution_time_ms: float