from fastapi import APIRouter, HTTPException
from app.schemas.agent import AgentPromptRequest, AgentResponse
from app.services.langgraph_composer import agent_composer

router = APIRouter()

@router.post("/ask", response_model=AgentResponse)
async def ask_nexa_agent(request: AgentPromptRequest):
    try:
        result = await agent_composer.run_agent(prompt=request.prompt, user_id=request.user_id)
        return AgentResponse(**result)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))