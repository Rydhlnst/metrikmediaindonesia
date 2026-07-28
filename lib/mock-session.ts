"use client";

const MOCK_SESSION_KEY = "mock-session";

export interface MockUser {
  id: string;
  name: string;
  email: string;
  role?: string;
  avatar?: string;
}

export function getMockSession(): MockUser | null {
  if (typeof window === "undefined") return null;
  
  const mockSession = localStorage.getItem(MOCK_SESSION_KEY);
  if (mockSession) {
    try {
      return JSON.parse(mockSession);
    } catch {
      return null;
    }
  }
  return null;
}

export function setMockSession(user: MockUser | null) {
  if (typeof window === "undefined") return;
  
  if (user) {
    localStorage.setItem(MOCK_SESSION_KEY, JSON.stringify(user));
  } else {
    localStorage.removeItem(MOCK_SESSION_KEY);
  }
}

export function enableMockSession() {
  setMockSession({
    id: "1",
    name: "Ahmad Rizky Pratama",
    email: "ahmad@metrikmedia.id",
    role: "Journalist",
  });
}

export function disableMockSession() {
  setMockSession(null);
}

export function isMockSessionEnabled(): boolean {
  return getMockSession() !== null;
}

// Expose to window for console access
if (typeof window !== "undefined") {
  (window as any).mockSession = {
    enable: enableMockSession,
    disable: disableMockSession,
    status: isMockSessionEnabled,
  };
}
