import type { Album } from "./types";

const API_PATH_PREFIX = "/api";
const SERVER_APP_URL =
  process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

type ApiRequestOptions = {
  authorization?: string | null;
  cookie?: string | null;
};

export class ApiError extends Error {
  constructor(
    message: string,
    readonly status: number,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

function apiUrl(path: string) {
  const apiPath = `${API_PATH_PREFIX}${path}`;

  if (typeof window === "undefined") {
    return new URL(apiPath, SERVER_APP_URL).toString();
  }

  return apiPath;
}

function authHeaders(options?: ApiRequestOptions) {
  const headers = new Headers();

  if (options?.authorization) {
    headers.set("Authorization", options.authorization);
  }

  if (options?.cookie) {
    headers.set("Cookie", options.cookie);
  }

  return headers;
}

async function errorMessage(res: Response, fallback: string) {
  try {
    const body = await res.json();
    return JSON.stringify(body.errors ?? body);
  } catch {
    return fallback;
  }
}

async function assertOk(res: Response, fallback: string) {
  if (res.ok) return;
  throw new ApiError(await errorMessage(res, fallback), res.status);
}

export async function fetchAlbums(
  options?: ApiRequestOptions,
): Promise<Album[]> {
  const res = await fetch(apiUrl("/albums"), {
    cache: "no-store",
    headers: authHeaders(options),
  });

  await assertOk(res, "Failed to fetch albums");
  return res.json();
}

export async function fetchAlbum(
  id: string,
  options?: ApiRequestOptions,
): Promise<Album> {
  const res = await fetch(apiUrl(`/albums/${id}`), {
    cache: "no-store",
    headers: authHeaders(options),
  });

  await assertOk(res, "Failed to fetch album");
  return res.json();
}

export async function createAlbum(formData: FormData): Promise<Album> {
  const res = await fetch(apiUrl("/albums"), {
    method: "POST",
    body: formData,
  });

  await assertOk(res, "Failed to create album");
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

  await assertOk(res, "Failed to update album");

  return res.json();
}

export async function deleteAlbum(id: number | string): Promise<void> {
  const res = await fetch(apiUrl(`/albums/${id}`), {
    method: "DELETE",
  });

  await assertOk(res, "Failed to delete album");
}
