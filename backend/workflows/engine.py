
from agents.agent import run_agent

def run_workflow(prompt):
    step1 = run_agent(prompt)
    step2 = run_agent("Improve this answer: " + step1)
    return step2
