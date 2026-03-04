const API_BASE = "http://localhost:5050";

export async function getJSON(path) {
  const response = await fetch(`${API_BASE}${path}`);
  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.error || `Request failed (${response.status})`);
  }
  return data;
}

export async function postJSON(path, body) {
    const res = await fetch(`${API_BASE}${path}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(body)
    });

    const data = await res.json().catch(() => ({}));
    
    if (!res.ok) {
        throw new Error(data.error || "Request failed");
    }

    return data;
}