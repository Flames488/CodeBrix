
from openai import OpenAI
from core.config import OPENAI_API_KEY
from tools.tools import TOOLS
from memory.vector_store import search

client = OpenAI(api_key=OPENAI_API_KEY)

SYSTEM = """
You are an autonomous AI agent.
You can use tools when needed.
Available tools: time
"""

def run_agent(prompt):

    context = search(prompt)

    messages = [
        {"role":"system","content":SYSTEM},
        {"role":"user","content":prompt + "\nContext:" + str(context)}
    ]

    response = client.chat.completions.create(
        model="gpt-4.1-mini",
        messages=messages
    )

    text = response.choices[0].message.content

    if "tool:time" in text:
        tool_output = TOOLS["time"]()
        return f"{text}\nTool Result: {tool_output}"

    return text
