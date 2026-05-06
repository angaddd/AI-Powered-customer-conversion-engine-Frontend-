export const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:8000/api";

export async function request(path, token, options = {}) {
  const headers = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers || {})
  };

  const response = await fetch(`${API_BASE}${path}`, { ...options, headers });
  const data = response.status === 204 ? null : await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data.detail || data.message || `API error ${response.status}`);
  }
  return data;
}

export function normalizeList(data) {
  return Array.isArray(data) ? data : data?.results || [];
}
