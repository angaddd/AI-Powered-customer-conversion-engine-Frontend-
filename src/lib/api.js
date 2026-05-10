export const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:8000/api";
export const API_ORIGIN = API_BASE.replace(/\/api\/?$/, "");

function formatApiError(data, fallback) {
  if (data.detail || data.message) {
    return data.detail || data.message;
  }

  if (data && typeof data === "object") {
    const messages = Object.entries(data).flatMap(([field, value]) => {
      const values = Array.isArray(value) ? value : [value];
      return values.map((message) => `${field}: ${message}`);
    });

    if (messages.length) {
      return messages.join(" ");
    }
  }

  return fallback;
}

export async function request(path, token, options = {}) {
  const headers = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers || {})
  };

  const response = await fetch(`${API_BASE}${path}`, { ...options, headers });
  const data = response.status === 204 ? null : await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(formatApiError(data, `API error ${response.status}`));
  }
  return data;
}

export function normalizeList(data) {
  return Array.isArray(data) ? data : data?.results || [];
}
