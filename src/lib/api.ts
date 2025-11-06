// src/lib/api.ts
const API = import.meta.env.VITE_API_URL ?? "";

/** Преобразовать дату к формату, который ест OffsetDateTime:
 *  - если уже ISO с временем (есть 'T') — вернуть как есть;
 *  - если dd.mm.yyyy → yyyy-mm-dd;
 *  - если yyyy-mm-dd → добавить 23:59:00 с локальным оффсетом.
 */
function normalizeDueDate(input?: string): string | undefined {
  if (!input) return undefined;
  const s = input.trim();

  // 1) Уже ISO с временем (например, 2025-08-25T23:59:00Z или +01:00) — не трогаем.
  if (/^\d{4}-\d{2}-\d{2}T/.test(s)) return s;

  // 2) dd.mm.yyyy -> yyyy-mm-dd
  const m = s.match(/^(\d{2})\.(\d{2})\.(\d{4})$/);
  const yyyyMmDd = m ? `${m[3]}-${m[2]}-${m[1]}` : s;

  // 3) Если это не "yyyy-mm-dd" — считаем формат не нашим.
  if (!/^\d{4}-\d{2}-\d{2}$/.test(yyyyMmDd)) return undefined;

  // 4) Конец дня с локальным оффсетом: 23:59:00+HH:mm
  const dt = new Date(`${yyyyMmDd}T23:59:00`);
  const offMin = -dt.getTimezoneOffset();
  const sign = offMin >= 0 ? "+" : "-";
  const hh = String(Math.floor(Math.abs(offMin) / 60)).padStart(2, "0");
  const mm = String(Math.abs(offMin) % 60).padStart(2, "0");
  return `${yyyyMmDd}T23:59:00${sign}${hh}:${mm}`;
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
        dueDate: normalizeDueDate(payload.dueDate),
      }),
    }),

  patchTask: (id: string, version: number, patch: PatchTaskPayload) =>
    http<import("../types/task").Task>(`/api/tasks/${id}`, {
      method: "PATCH",
      headers: { "If-Match": String(version) }, // оптимистическая блокировка
      body: JSON.stringify({
        ...patch,
        ...(patch.hasOwnProperty("dueDate")
          ? { dueDate: normalizeDueDate(patch.dueDate) ?? null }
          : {}),
      }),
    }),

  deleteTask: (id: string) =>
    http<void>(`/api/tasks/${id}`, { method: "DELETE" }),
};
