// config/emails.ts
export const CONFIRM_EMAIL_TOKEN_EXPIRY = 1000 * 60 * 60 * 24 * 365; // 1 year
export type AuthMethod = 'password' | 'oauth2_cc' | 'oauth2_delegated';

function requireEnv(key: string): string {
  const v = process.env[key];
  if (!v) throw new Error(`Missing ${key}`);
  return v;
}

/** Centralized accessors for mail-related env vars */
export const emailEnv = {
  host(): string {
    return requireEnv('EMAIL_HOST'); // e.g. smtp.office365.com
  },
  port(): number {
    const v = process.env.EMAIL_PORT;
    if (!v) throw new Error('Missing EMAIL_PORT');
    const n = Number(v);
    if (!Number.isFinite(n)) throw new Error('EMAIL_PORT must be a number');
    return n;
  },
  secure(): boolean {
    return process.env.EMAIL_SECURE === 'true'; // false => STARTTLS on 587
  },
  method(): AuthMethod {
    const m = process.env.EMAIL_AUTH_METHOD
      ? process.env.EMAIL_AUTH_METHOD.toLowerCase()
      : undefined;
    if (m === 'oauth2_cc' || m === 'oauth2_delegated' || m === 'password') {
      return m as AuthMethod;
    }
    console.log(`Unsupported EMAIL_AUTH_METHOD: ${m}. Defaulting to password`);
    return 'password';
  },
  username(): string {
    return requireEnv('EMAIL_USERNAME'); // mailbox UPN you send as
  },

  // Password method
  password(): string {
    return requireEnv('EMAIL_PASSWORD');
  },

  // OAuth2 Client Credentials (app-only)
  tenantId(): string {
    return requireEnv('EMAIL_AUTH_TENANTID');
  },
  clientId(): string {
    return requireEnv('EMAIL_AUTH_CLIENTID');
  },
  clientSecret(): string {
    return requireEnv('EMAIL_AUTH_CLIENTSECRET');
  },

  // Delegated (refresh-token) — optional; not used unless you add it
  refreshToken(): string {
    return requireEnv('EMAIL_AUTH_REFRESHTOKEN');
  },
};
