/**
 * ============================================================
 * BACKEND API CLIENT (server only)
 * ============================================================
 *
 * This file talks to your Express backend (localhost:4000).
 *
 * ✅ USE in: Server Components, Server Actions, Route Handlers
 * ❌ DO NOT use in: "use client" components (SignInForm, etc.)
 *
 * Why? The BACKEND_API_KEY must stay secret on the server.
 *
 * Two functions:
 * 1. apiFetchPublic  → login & register (no user token)
 * 2. apiFetchAuth    → everything else (needs Bearer token from login)
 */

import type { ApiResponse } from "@/lib/types/api.types";

// From .env.local
const backendUrl = process.env.BACKEND_API_URL; // e.g. http://localhost:4000
const apiKey = process.env.BACKEND_API_KEY; // shared secret with backend

/**
 * Call backend routes that do NOT need a logged-in user.
 * Example: POST /api/auth/login, POST /api/auth/register
 */
export async function apiFetchPublic<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  if (!backendUrl || !apiKey) {
    throw new Error("Missing BACKEND_API_URL or BACKEND_API_KEY in .env.local");
  }

  const fullUrl = `${backendUrl}${path}`;

  const response = await fetch(fullUrl, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
      ...(options.headers ?? {}),
    },
  });

  const result: ApiResponse<T> = await response.json();

  if (!response.ok || !result.success) {
    throw new Error(result.message || "Request failed");
  }

  return result.data as T;
}

/**
 * Call backend routes that NEED a logged-in user.
 * Example: GET /api/recipes/featured, POST /api/users/1/saved-recipes/5/toggle
 *
 * @param path   - API path, e.g. "/api/recipes/featured"
 * @param token  - JWT from login (saved in NextAuth session as accessToken)
 */
export async function apiFetchAuth<T>(
  path: string,
  token: string,
  options: RequestInit = {},
): Promise<T> {
  if (!backendUrl || !apiKey) {
    throw new Error("Missing BACKEND_API_URL or BACKEND_API_KEY in .env.local");
  }

  if (!token) {
    throw new Error("Not authenticated — missing access token");
  }

  const fullUrl = `${backendUrl}${path}`;

  const response = await fetch(fullUrl, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
      Authorization: `Bearer ${token}`,
      ...(options.headers ?? {}),
    },
  });

  const result: ApiResponse<T> = await response.json();

  if (!response.ok || !result.success) {
    throw new Error(result.message || "Request failed");
  }

  return result.data as T;
}
