const API = "http://localhost:8000";

export async function sendContact(data:any) {
  return fetch(`${API}/contact`,{
    method:"POST",
    headers:{ "Content-Type":"application/json"},
    body: JSON.stringify(data)
  });
}