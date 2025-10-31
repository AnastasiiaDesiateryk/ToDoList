// src/lib/api.ts
const API = import.meta.env.VITE_API_URL;

// --- дата-конвертер ---
function toIsoOrNull(input?: string): string | undefined {
  if (!input) return undefined;
  const s = input.trim();

  // dd.mm.yyyy -> yyyy-mm-dd
  const m = s.match(/^(\d{2})\.(\d{2})\.(\d{4})$/);
  const isoDate = m ? `${m[3]}-${m[2]}-${m[1]}` : s;

  // ставим полдень, чтобы не уехать на -1 день из-за TZ
  const d = new Date(`${isoDate}T12:00:00`);
  if (isNaN(d.getTime())) return undefined;
  return d.toISOString();
}

// --- сборщик заголовков ---
function buildHeaders(init?: RequestInit): Headers {
  const h = new Headers(init?.headers || {});
  if (!h.has("Accept")) h.set("Accept", "application/json");
  if (init?.body !== undefined && !h.has("Content-Type")) {
    h.set("Content-Type", "application/json");
  }
  return h;
}

// --- HTTP-обёртка ---
async function http<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API}${path}`, {
    credentials: "include",
    // сначала spread init
    ...init,
    // потом гарантированно применяем правильные заголовки
    headers: buildHeaders(init),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`${init?.method ?? "GET"} ${path} ${res.status}: ${text}`);
  }

  if (res.status === 204) return undefined as T;
  return res.json() as Promise<T>;
}

// --- типы ---
export type CreateTaskPayload = {
  title: string;
  description?: string;
  priority: "High" | "Medium" | "Low";
  category: "Work" | "Personal";
  dueDate?: string; // ISO
  completed?: boolean;
  tags?: string[];
  metadata?: Record<string, unknown>;
};

export type PatchTaskPayload = Partial<CreateTaskPayload>;

// --- API ---
export const api = {
  listTasks: () => http<import("../types/task").Task[]>("/api/tasks"),

  createTask: (payload: CreateTaskPayload) =>
    http<import("../types/task").Task>("/api/tasks", {
      method: "POST",
      body: JSON.stringify({
        ...payload,
        dueDate: toIsoOrNull(payload.dueDate) ?? undefined,
      }),
    }),

  patchTask: (id: string, version: number, patch: PatchTaskPayload) =>
    http<import("../types/task").Task>(`/api/tasks/${id}`, {
      method: "PATCH",
      headers: { "If-Match": String(version) }, // оптимистическая блокировка
      body: JSON.stringify({
        ...patch,
        ...(patch.hasOwnProperty("dueDate")
          ? { dueDate: toIsoOrNull(patch.dueDate) ?? null }
          : {}),
      }),
    }),

  deleteTask: (id: string) =>
    http<void>(`/api/tasks/${id}`, { method: "DELETE" }),
};
