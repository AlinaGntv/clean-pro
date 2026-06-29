const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    credentials: "include",
    headers: { "Content-Type": "application/json", ...options.headers as Record<string, string> },
    ...options,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: "Request failed" }));
    throw new Error(err.error || `HTTP ${res.status}`);
  }
  return res.json();
}

export const api = {
  login: (data: { email: string; password: string }) =>
    request<{ token: string; user: { id: number; email: string; name: string } }>("/api/auth/login", { method: "POST", body: JSON.stringify(data) }),

  logout: () => request("/api/auth/logout", { method: "POST" }),

  me: () => request<{ id: number; email: string; name: string }>("/api/auth/me"),

  getLeads: (params?: { search?: string; status?: string; sort?: string; order?: string }) => {
    const q = new URLSearchParams();
    if (params?.search) q.set("search", params.search);
    if (params?.status) q.set("status", params.status);
    if (params?.sort) q.set("sort", params.sort);
    if (params?.order) q.set("order", params.order);
    return request<Lead[]>(`/api/leads?${q.toString()}`);
  },

  createLead: (data: LeadInput) => request<Lead>("/api/leads", { method: "POST", body: JSON.stringify(data) }),

  updateLeadStatus: (id: number, status: string) =>
    request<Lead>(`/api/leads/${id}/status`, { method: "PATCH", body: JSON.stringify({ status }) }),

  deleteLead: (id: number) => request(`/api/leads/${id}`, { method: "DELETE" }),

  getSettings: () => request<Record<string, string>>("/api/settings"),

  getSettingsGroup: (group: string) => request<Record<string, string>>(`/api/settings/group/${group}`),

  updateSettings: (data: Record<string, string>) =>
    request("/api/settings", { method: "PUT", body: JSON.stringify(data) }),

  updateSettingsBatch: (items: { key: string; value: string }[]) =>
    request("/api/settings/batch", { method: "PUT", body: JSON.stringify(items) }),

  sendChat: (message: string, context: { role: string; content: string }[]) =>
    request<{ reply: string; rate_limited?: boolean }>("/api/chat", { method: "POST", body: JSON.stringify({ message, context }) }),
};

export interface Lead {
  id: number;
  name: string;
  phone: string;
  whatsapp: string | null;
  telegram: string | null;
  comment: string | null;
  objectType: string;
  cleaningType: string;
  area: number;
  additional: string;
  preferredDate: string;
  priceMin: number;
  priceMax: number;
  status: string;
  createdAt: string;
}

export interface LeadInput {
  name: string;
  phone: string;
  whatsapp?: string;
  telegram?: string;
  comment?: string;
  objectType: string;
  cleaningType: string;
  area: number;
  additional?: string;
  preferredDate: string;
  priceMin: number;
  priceMax: number;
}
