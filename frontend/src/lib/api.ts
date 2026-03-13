const API_BASE = "http://127.0.0.1:8000/api/v1";

// Clients
export async function createClient(data: any) {
  const res = await fetch(`${API_BASE}/clients`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res.json();
}

// Leads
export async function createLead(data: any) {
  const res = await fetch(`${API_BASE}/leads`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res.json();
}

// AI Agents
export async function getAgents() {
  const res = await fetch(`${API_BASE}/ai-agents`);
  return res.json();
}

// Automations
export async function createAutomation(data: any) {
  const res = await fetch(`${API_BASE}/automations`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res.json();
}

// Optional: get all clients
export async function getClients() {
  const res = await fetch(`${API_BASE}/clients`);
  return res.json();
}