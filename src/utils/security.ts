/**
 * Defensive Security Utilities
 * - Anti-XSS String Sanitizer
 * - Anti-Brute Force Login Protector
 * - Form Submission Rate Limiter & Spam Filter
 */

/**
 * Strips HTML tags, script tags, javascript URIs, and dangerous attributes to prevent XSS.
 */
export function sanitizeText(input: string): string {
  if (!input || typeof input !== 'string') return '';

  return input
    // Remove script tags and their content
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    // Remove inline event handlers (e.g., onerror=, onclick=, onload=)
    .replace(/\bon\w+\s*=\s*(['"]).*?\1/gi, '')
    .replace(/\bon\w+\s*=\s*[^>\s]+/gi, '')
    // Remove javascript: pseudo-protocol
    .replace(/javascript\s*:/gi, '')
    // Remove HTML tags while preserving inner text
    .replace(/<\/?[^>]+(>|$)/g, '')
    .trim();
}

/**
 * Sanitizes an object of string fields recursively.
 */
export function sanitizeObject<T extends Record<string, any>>(obj: T): T {
  const result: any = { ...obj };
  for (const key in result) {
    if (typeof result[key] === 'string') {
      result[key] = sanitizeText(result[key]);
    } else if (Array.isArray(result[key])) {
      result[key] = result[key].map((item: any) =>
        typeof item === 'string' ? sanitizeText(item) : item
      );
    }
  }
  return result;
}

/**
 * Brute Force Protection Manager for Staff Authentication
 */
class BruteForceProtectorClass {
  private maxAttempts = 5;
  private lockoutDurationSeconds = 60;
  private storageKey = 'gta_rs_login_security';

  private getState(): { failedAttempts: number; lockoutUntil: number | null } {
    try {
      const data = localStorage.getItem(this.storageKey);
      if (data) {
        return JSON.parse(data);
      }
    } catch (e) {
      // Ignore
    }
    return { failedAttempts: 0, lockoutUntil: null };
  }

  private saveState(state: { failedAttempts: number; lockoutUntil: number | null }) {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(state));
    } catch (e) {
      // Ignore
    }
  }

  public isLocked(): { locked: boolean; remainingSeconds: number } {
    const state = this.getState();
    if (state.lockoutUntil) {
      const now = Date.now();
      if (now < state.lockoutUntil) {
        const remainingSeconds = Math.ceil((state.lockoutUntil - now) / 1000);
        return { locked: true, remainingSeconds };
      } else {
        // Lockout expired, reset
        this.reset();
      }
    }
    return { locked: false, remainingSeconds: 0 };
  }

  public recordFailure(): { locked: boolean; remainingSeconds: number; attemptsLeft: number } {
    const state = this.getState();
    state.failedAttempts += 1;

    if (state.failedAttempts >= this.maxAttempts) {
      state.lockoutUntil = Date.now() + this.lockoutDurationSeconds * 1000;
      this.saveState(state);
      return { locked: true, remainingSeconds: this.lockoutDurationSeconds, attemptsLeft: 0 };
    }

    this.saveState(state);
    return {
      locked: false,
      remainingSeconds: 0,
      attemptsLeft: this.maxAttempts - state.failedAttempts
    };
  }

  public recordSuccess() {
    this.reset();
  }

  public reset() {
    try {
      localStorage.removeItem(this.storageKey);
    } catch (e) {
      // Ignore
    }
  }
}

export const BruteForceProtector = new BruteForceProtectorClass();

/**
 * Client-Side Rate Limiter for Public Submissions (Anti-DDoS / Anti-Spam Flooding)
 */
class RateLimiterClass {
  private lastSubmissionTimes: Record<string, number> = {};

  public canSubmit(actionKey: string, cooldownSeconds: number = 5): { allowed: boolean; waitSeconds: number } {
    const now = Date.now();
    const lastTime = this.lastSubmissionTimes[actionKey] || 0;
    const elapsed = (now - lastTime) / 1000;

    if (elapsed < cooldownSeconds) {
      return {
        allowed: false,
        waitSeconds: Math.ceil(cooldownSeconds - elapsed)
      };
    }

    this.lastSubmissionTimes[actionKey] = now;
    return { allowed: true, waitSeconds: 0 };
  }
}

export const FormRateLimiter = new RateLimiterClass();
