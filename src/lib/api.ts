import type { Album } from "./types";

const API_PATH_PREFIX = "/api";
const SERVER_APP_URL =
  process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3001";

function apiUrl(path: string) {
  const apiPath = `${API_PATH_PREFIX}${path}`;

  if (typeof window === "undefined") {
    return new URL(apiPath, SERVER_APP_URL).toString();
  }

  return apiPath;
}

export async function fetchAlbums(): Promise<Album[]> {
  const res = await fetch(apiUrl("/albums"), { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to fetch albums");
  return res.json();
}

export async function fetchAlbum(id: string): Promise<Album> {
  const res = await fetch(apiUrl(`/albums/${id}`), { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to fetch album");
  return res.json();
}

export async function createAlbum(formData: FormData): Promise<Album> {
  const res = await fetch(apiUrl("/albums"), {
    method: "POST",
    body: formData,
  });
  if (!res.ok) {
    const body = await res.json();
    throw new Error(JSON.stringify(body.errors ?? body));
  }
  return res.json();
}

export async function updateAlbum(
  id: number | string,
  formData: FormData,
): Promise<Album> {
  const res = await fetch(apiUrl(`/albums/${id}`), {
    method: "PATCH",
    body: formData,
  });

  if (!res.ok) {
    const body = await res.json();
    throw new Error(JSON.stringify(body.errors ?? body));
  }

  return res.json();
}

export async function deleteAlbum(id: number | string): Promise<void> {
  const res = await fetch(apiUrl(`/albums/${id}`), {
    method: "DELETE",
  });

  if (!res.ok) {
    let message = "Failed to delete album";

    try {
      const body = await res.json();
      message = JSON.stringify(body.errors ?? body);
    } catch {
      // Keep default message when the response body is not JSON.
    }

    throw new Error(message);
  }
}
