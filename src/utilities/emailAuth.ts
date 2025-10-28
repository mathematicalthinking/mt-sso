// mail/emailAuth.ts
import { emailEnv } from '../config/emails';

/**
 * App-only (client-credentials) OAuth2 access token for SMTP AUTH XOAUTH2.
 * Token is short-lived; fetch per send or add a simple cache if needed.
 */
export async function getMsAppAccessToken(): Promise<string> {
  const tenantId = emailEnv.tenantId();
  const clientId = emailEnv.clientId();
  const clientSecret = emailEnv.clientSecret();

  const url = `https://login.microsoftonline.com/${tenantId}/oauth2/v2.0/token`;
  const body = new URLSearchParams({
    client_id: clientId,
    client_secret: clientSecret,
    grant_type: 'client_credentials',
    scope: 'https://outlook.office365.com/SMTP.Send',
  });

  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body,
  });

  if (!res.ok) {
    throw new Error(
      `Token request failed (${res.status}): ${await res.text()}`,
    );
  }

  const data = (await res.json()) as { access_token: string };
  return data.access_token;
}
