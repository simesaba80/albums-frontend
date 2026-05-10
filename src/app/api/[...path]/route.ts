export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const DEFAULT_RAILS_API_URL = "http://localhost:3000";
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

async function proxyRailsRequest(request: Request, context: RouteContext) {
  const basicAuthHeader = getBasicAuthHeader();

  if (!basicAuthHeader) {
    return Response.json(
      { error: "Rails Basic authentication is not configured." },
      { status: 500 },
    );
  }

  const targetUrl = await getTargetUrl(request, context);
  const headers = new Headers({
    Authorization: basicAuthHeader,
    Accept: request.headers.get("accept") ?? "application/json",
  });
  const contentType = request.headers.get("content-type");

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

function getBasicAuthHeader() {
  const username = process.env.RAILS_BASIC_AUTH_USERNAME;
  const password = process.env.RAILS_BASIC_AUTH_PASSWORD;

  if (!username || !password) return null;

  return `Basic ${Buffer.from(`${username}:${password}`).toString("base64")}`;
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

export function GET(request: Request, context: RouteContext) {
  return proxyRailsRequest(request, context);
}

export function POST(request: Request, context: RouteContext) {
  return proxyRailsRequest(request, context);
}

export function PATCH(request: Request, context: RouteContext) {
  return proxyRailsRequest(request, context);
}

export function PUT(request: Request, context: RouteContext) {
  return proxyRailsRequest(request, context);
}

export function DELETE(request: Request, context: RouteContext) {
  return proxyRailsRequest(request, context);
}
