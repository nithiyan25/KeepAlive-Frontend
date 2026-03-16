import { getToken } from "./context/AuthContext";

const BASE = import.meta.env.VITE_API_URL || "";

async function request(method, path, body) {
  const token = getToken();
  const headers = {};
  if (body)  headers["Content-Type"] = "application/json";
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const res = await fetch(`${BASE}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!res.ok) throw new Error(`${method} ${path} → HTTP ${res.status}`);
  return res.json();
}

export const api = {
  // ── Services ──────────────────────────────────────────────────────────────
  getServices:   ()           => request("GET",    "/api/services"),
  createService: (data)       => request("POST",   "/api/services", data),
  updateService: (id, data)   => request("PUT",    `/api/services/${id}`, data),
  deleteService: (id)         => request("DELETE", `/api/services/${id}`),
  pingService:   (id)         => request("POST",   `/api/services/${id}/ping`),
  getLog:        ()           => request("GET",    "/api/log"),

  // ── Admin ─────────────────────────────────────────────────────────────────
  getAdminUsers: ()   => request("GET",    "/api/admin/users"),
  getPending:    ()   => request("GET",    "/api/admin/users/pending"),
  approveUser:   (id) => request("POST",   `/api/admin/users/${id}/approve`),
  rejectUser:    (id) => request("POST",   `/api/admin/users/${id}/reject`),
  deleteUser:    (id) => request("DELETE", `/api/admin/users/${id}`),
  getAdminStats: ()   => request("GET",    "/api/admin/stats"),
};