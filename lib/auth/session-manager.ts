import { v4 as uuidv4 } from 'uuid';

export interface AnonymousSession {
  sessionId: string;
  userName?: string;
  createdAt: string;
  lastActiveAt: string;
}

// Client-side utilities for session management
export const clientSessionUtils = {
  getSessionFromLocalStorage(): AnonymousSession | null {
    if (typeof window === 'undefined') return null;

    const stored = localStorage.getItem('practice_session');
    if (!stored) return null;

    try {
      return JSON.parse(stored) as AnonymousSession;
    } catch {
      return null;
    }
  },

  saveSessionToLocalStorage(session: AnonymousSession): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem('practice_session', JSON.stringify(session));
  },

  clearLocalStorage(): void {
    if (typeof window === 'undefined') return;
    localStorage.removeItem('practice_session');
  },

  createNewSession(): AnonymousSession {
    return {
      sessionId: uuidv4(),
      createdAt: new Date().toISOString(),
      lastActiveAt: new Date().toISOString()
    };
  },

  getOrCreateSession(): AnonymousSession {
    let session = this.getSessionFromLocalStorage();
    if (!session) {
      session = this.createNewSession();
      this.saveSessionToLocalStorage(session);
    } else {
      // Update last active time
      session.lastActiveAt = new Date().toISOString();
      this.saveSessionToLocalStorage(session);
    }
    return session;
  }
};
