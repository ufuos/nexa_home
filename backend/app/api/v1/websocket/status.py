import asyncio
import json
from fastapi import APIRouter, WebSocket, WebSocketDisconnect

router = APIRouter()

@router.websocket("/ws/status/{client_id}")
async def websocket_status_endpoint(websocket: WebSocket, client_id: str):
    """
    Streams real-time NEXA Agent status updates to the Fire TV UI.
    """
    await websocket.accept()
    try:
        # Initial connection acknowledgement
        await websocket.send_text(json.dumps({
            "event": "connection_established",
            "client_id": client_id,
            "status": "Ready for active prompts"
        }))
        
        while True:
            # Wait for incoming messages/triggers from the client
            data = await websocket.receive_text()
            payload = json.loads(data) if data.startswith("{") else {"action": data}
            
            # Simulate real-time state execution stages
            stages = [
                {"event": "agent_thinking", "step": 1, "message": "Parsing time constraints..."},
                {"event": "langgraph_execution", "step": 2, "message": "Re-calculating sub-second schedule..."},
                {"event": "agent_complete", "step": 3, "message": "Routine successfully adapted!"}
            ]
            
            for stage in stages:
                await asyncio.sleep(0.3)  # Fast sub-second updates
                await websocket.send_text(json.dumps(stage))

    except WebSocketDisconnect:
        print(f"Client {client_id} disconnected from WebSocket status channel.")
    except Exception as e:
        await websocket.close(code=1011, reason=str(e))