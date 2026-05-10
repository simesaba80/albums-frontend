import type { NextRequest } from "next/server";
import {
  BASIC_AUTH_COOKIE_NAME,
  basicAuthHeader,
} from "@/lib/basic-auth-session";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const DEFAULT_RAILS_API_URL = "http://localhost:8000";
const HOP_BY_HOP_HEADERS = new Set([
  "connection",
  "content-encoding",
  "content-length",
  "keep-alive",
  "transfer-encoding",
  "upgrade",
]);

type RouteContext = {
  params: Promise<{ path: string[] }>;
};

async function proxyRailsRequest(request: NextRequest, context: RouteContext) {
  const targetUrl = await getTargetUrl(request, context);
  const headers = new Headers({
    Accept: request.headers.get("accept") ?? "application/json",
  });
  const authorization =
    request.headers.get("authorization") ??
    basicAuthHeader(request.cookies.get(BASIC_AUTH_COOKIE_NAME)?.value);
  const contentType = request.headers.get("content-type");

  if (authorization) {
    headers.set("Authorization", authorization);
  }

  if (contentType) {
    headers.set("Content-Type", contentType);
  }

  const upstreamResponse = await fetch(targetUrl, {
    method: request.method,
    headers,
    body: hasRequestBody(request.method) ? await request.arrayBuffer() : null,
    cache: "no-store",
  });

  return new Response(upstreamResponse.body, {
    status: upstreamResponse.status,
    statusText: upstreamResponse.statusText,
    headers: getResponseHeaders(upstreamResponse.headers),
  });
}

async function getTargetUrl(request: Request, context: RouteContext) {
  const { path } = await context.params;
  const requestUrl = new URL(request.url);
  const baseUrl = process.env.RAILS_API_URL ?? DEFAULT_RAILS_API_URL;
  const targetUrl = new URL(`/${path.join("/")}`, baseUrl);
  targetUrl.search = requestUrl.search;
  return targetUrl;
}

function hasRequestBody(method: string) {
  return !["GET", "HEAD"].includes(method);
}

function getResponseHeaders(upstreamHeaders: Headers) {
  const headers = new Headers();

  upstreamHeaders.forEach((value, key) => {
    if (!HOP_BY_HOP_HEADERS.has(key.toLowerCase())) {
      headers.set(key, value);
    }
  });

  return headers;
}

export function GET(request: NextRequest, context: RouteContext) {
  return proxyRailsRequest(request, context);
}

export function POST(request: NextRequest, context: RouteContext) {
  return proxyRailsRequest(request, context);
}

export function PATCH(request: NextRequest, context: RouteContext) {
  return proxyRailsRequest(request, context);
}

export function PUT(request: NextRequest, context: RouteContext) {
  return proxyRailsRequest(request, context);
}

export function DELETE(request: NextRequest, context: RouteContext) {
  return proxyRailsRequest(request, context);
}
