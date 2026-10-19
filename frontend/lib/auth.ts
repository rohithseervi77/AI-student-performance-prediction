import { UserSession } from "@/types";

const TOKEN_KEY = "edupredict_token";
const SESSION_KEY = "edupredict_session";

export function saveSession(session: UserSession) {
  if (typeof window !== "undefined") {
    localStorage.setItem(TOKEN_KEY, session.token);
    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  }
}

export function getSession(): UserSession | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem(SESSION_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(TOKEN_KEY);
}

export function clearSession() {
  if (typeof window !== "undefined") {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(SESSION_KEY);
  }
}

export function isAuthenticated(): boolean {
  return !!getToken();
}

export function isStudent(): boolean {
  const session = getSession();
  return session?.role === "student";
}

export function isAdmin(): boolean {
  const session = getSession();
  return session?.role === "admin";
}
