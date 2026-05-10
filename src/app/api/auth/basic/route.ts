import { type NextRequest, NextResponse } from "next/server";
import {
  BASIC_AUTH_COOKIE_NAME,
  basicAuthHeader,
  basicAuthToken,
} from "@/lib/basic-auth-session";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const DEFAULT_RAILS_API_URL = "http://localhost:8000";
const BASIC_AUTH_CHALLENGE = 'Basic realm="Application"';

export async function GET(request: NextRequest) {
  const authorization =
    request.headers.get("authorization") ??
    basicAuthHeader(request.cookies.get(BASIC_AUTH_COOKIE_NAME)?.value);
  const token = basicAuthToken(authorization);

  if (!authorization || !token) {
    return basicAuthChallenge();
  }

  const upstreamResponse = await fetch(new URL("/albums", railsApiUrl()), {
    headers: {
      Authorization: authorization,
      Accept: "application/json",
    },
    cache: "no-store",
  });

  if (upstreamResponse.status === 401) {
    const response = basicAuthChallenge();
    response.cookies.delete(BASIC_AUTH_COOKIE_NAME);
    return response;
  }

  if (!upstreamResponse.ok) {
    return Response.json(
      { error: "Authentication check failed." },
      { status: upstreamResponse.status },
    );
  }

  const response = NextResponse.redirect(getReturnUrl(request));
  response.cookies.set(BASIC_AUTH_COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });

  return response;
}

function railsApiUrl() {
  return process.env.RAILS_API_URL ?? DEFAULT_RAILS_API_URL;
}

function basicAuthChallenge() {
  return new NextResponse("Authentication required", {
    status: 401,
    headers: {
      "WWW-Authenticate": BASIC_AUTH_CHALLENGE,
      "Cache-Control": "no-store",
    },
  });
}

function getReturnUrl(request: Request) {
  const requestUrl = new URL(request.url);
  const returnTo = requestUrl.searchParams.get("returnTo") ?? "/";

  if (!returnTo.startsWith("/") || returnTo.startsWith("//")) {
    return new URL("/", requestUrl.origin);
  }

  return new URL(returnTo, requestUrl.origin);
}
