export const BASIC_AUTH_COOKIE_NAME = "rails_basic_auth";

export function basicAuthToken(authorization: string | null) {
  return authorization?.match(/^Basic\s+(.+)$/i)?.[1] ?? null;
}

export function basicAuthHeader(token: string | null | undefined) {
  if (!token) return null;

  return `Basic ${token}`;
}
