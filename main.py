import uvicorn
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel
from typing import Optional, Dict, Any, List
from agent_service import agent_runtime

app = FastAPI(
    title="Antigravity ADK Customer Service AI Agent API Bridge",
    version="2.0.0",
    description="FastAPI bridge connecting the Antigravity ADK backend runtime and MCP tools with the web frontend chat widget."
)

# Enable CORS for cross-origin web widgets
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- REQUEST / RESPONSE SCHEMAS ---
class ChatRequest(BaseModel):
    session_id: str
    message: str

class ChatResponse(BaseModel):
    session_id: str
    response: str
    tools_used: Optional[List[str]] = []
    ticket: Optional[Dict[str, Any]] = None

# --- ENDPOINTS ---
@app.get("/api/health")
def health_check():
    return {
        "status": "healthy",
        "agent": agent_runtime.metadata.get("name", "customer_agent"),
        "role": agent_runtime.metadata.get("role", "Customer Support"),
        "adk_version": "2.0.0-antigravity",
        "mcp_tools": ["order_tracker", "kb_search", "escalate_ticket"]
    }

@app.post("/api/chat", response_model=ChatResponse)
def chat_endpoint(payload: ChatRequest):
    if not payload.message or not payload.message.strip():
        raise HTTPException(status_code=400, detail="Message content cannot be empty.")
    
    session_id = payload.session_id if payload.session_id else "default_session"
    result = agent_runtime.execute_chat(session_id=session_id, message=payload.message)
    
    return ChatResponse(
        session_id=result["session_id"],
        response=result["response"],
        tools_used=result.get("tools_used", []),
        ticket=result.get("ticket")
    )

# Mount static web widget files
app.mount("/widget", StaticFiles(directory="public/widget", html=True), name="widget")

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
