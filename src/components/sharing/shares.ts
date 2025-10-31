// src/components/sharing/shares.ts
export type ShareRole = "viewer" | "editor";

export type SharedUser = {
  email: string;
  role: ShareRole;
};

const API = import.meta.env.VITE_API_URL; // например http://localhost:8080
const base = `${API}/api`; // ✅ учёт /api-префикса на бэке

export async function fetchSharedUsers(taskId: string): Promise<SharedUser[]> {
  const res = await fetch(`${base}/tasks/${taskId}/share`, {
    credentials: "include",
    headers: { Accept: "application/json" },
  });
  if (!res.ok)
    throw new Error(await safeText(res, "Failed to load shared users"));
  return (await res.json()) as SharedUser[];
}

export async function addShare(
  taskId: string,
  userEmail: string,
  role: ShareRole
) {
  const res = await fetch(`${base}/tasks/${taskId}/share`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    credentials: "include",
    body: JSON.stringify({ userEmail, role }), // 👈 lowercase role
  });
  if (!res.ok) throw new Error(await safeText(res, "Failed to share"));
}

export async function removeShare(taskId: string, email: string) {
  const res = await fetch(
    `${base}/tasks/${taskId}/share?email=${encodeURIComponent(email)}`,
    {
      method: "DELETE",
      credentials: "include",
    }
  );
  if (!res.ok) throw new Error(await safeText(res, "Failed to revoke access"));
}

async function safeText(res: Response, fallback: string) {
  try {
    return await res.text();
  } catch {
    return fallback;
  }
}
