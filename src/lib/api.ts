import type { Album } from "./types";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000";

export async function fetchAlbums(): Promise<Album[]> {
  const res = await fetch(`${API_URL}/albums`, { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to fetch albums");
  return res.json();
}

export async function fetchAlbum(id: string): Promise<Album> {
  const res = await fetch(`${API_URL}/albums/${id}`, { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to fetch album");
  return res.json();
}

export async function createAlbum(formData: FormData): Promise<Album> {
  const res = await fetch(`${API_URL}/albums`, {
    method: "POST",
    body: formData,
  });
  if (!res.ok) {
    const body = await res.json();
    throw new Error(JSON.stringify(body.errors ?? body));
  }
  return res.json();
}

export async function login(
  emailAddress: string,
  password: string,
): Promise<Response> {
  return fetch(`${API_URL}/session`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email_address: emailAddress, password }),
    credentials: "include",
  });
}

export async function requestPasswordReset(
  emailAddress: string,
): Promise<Response> {
  return fetch(`${API_URL}/passwords`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email_address: emailAddress }),
  });
}

export async function resetPassword(
  token: string,
  password: string,
  passwordConfirmation: string,
): Promise<Response> {
  return fetch(`${API_URL}/passwords/${token}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      password,
      password_confirmation: passwordConfirmation,
    }),
  });
}
