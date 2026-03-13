"""
schemas/prompt.py

Production-grade request/response schemas for AI agent interaction.
Designed for scalable AI systems (agents, memory, tools, automations).
"""

from pydantic import BaseModel, Field
from typing import Optional, Dict, Any, List
from datetime import datetime


class PromptRequest(BaseModel):
    """
    Core request schema used when sending a prompt to an AI agent.
    """

    prompt: str = Field(
        ...,
        description="The main user prompt or instruction sent to the AI agent.",
        example="Generate a marketing email for my SaaS product."
    )

    agent_id: Optional[str] = Field(
        None,
        description="ID of the AI agent that should handle the request."
    )

    user_id: Optional[str] = Field(
        None,
        description="Unique identifier for the user making the request."
    )

    session_id: Optional[str] = Field(
        None,
        description="Conversation session ID for maintaining memory."
    )

    metadata: Optional[Dict[str, Any]] = Field(
        default_factory=dict,
        description="Additional contextual metadata for the agent."
    )

    tools: Optional[List[str]] = Field(
        default_factory=list,
        description="List of tools the AI agent is allowed to use."
    )

    temperature: Optional[float] = Field(
        0.7,
        description="LLM temperature setting."
    )

    max_tokens: Optional[int] = Field(
        1200,
        description="Maximum tokens for AI response."
    )

    timestamp: datetime = Field(
        default_factory=datetime.utcnow,
        description="Time the request was created."
    )


class PromptResponse(BaseModel):
    """
    Standardized response returned by AI agents.
    """

    response: str = Field(
        ...,
        description="Generated AI response."
    )

    agent_id: Optional[str] = None
    session_id: Optional[str] = None

    tokens_used: Optional[int] = None

    processing_time: Optional[float] = Field(
        None,
        description="Execution time in seconds."
    )

    metadata: Optional[Dict[str, Any]] = None

    timestamp: datetime = Field(
        default_factory=datetime.utcnow
    )


class ConversationMessage(BaseModel):
    """
    Represents a message stored in memory history.
    """

    role: str = Field(
        ...,
        description="Role of the message sender (user, assistant, system)."
    )

    content: str = Field(
        ...,
        description="Actual message content."
    )

    timestamp: datetime = Field(
        default_factory=datetime.utcnow
    )


class AgentExecution(BaseModel):
    """
    Used for triggering advanced AI agent workflows.
    """

    agent_id: str

    task: str = Field(
        ...,
        description="Task the AI agent should execute."
    )

    parameters: Optional[Dict[str, Any]] = Field(
        default_factory=dict
    )

    tools_allowed: Optional[List[str]] = Field(
        default_factory=list
    )

    session_id: Optional[str] = None

    user_id: Optional[str] = None