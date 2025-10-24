"use strict";

/**
 * API client utilities for the React frontend.
 * Determines the backend base URL from environment with a sensible fallback
 * and provides a simple GET helper for calling endpoints.
 */

// PUBLIC_INTERFACE
export const BASE_URL =
  process.env.REACT_APP_API_BASE ||
  "https://vscode-internal-30361-beta.beta01.cloud.kavia.ai:3001";

/**
 * PUBLIC_INTERFACE
 * Lightweight GET helper using BASE_URL and sensible defaults.
 * - If 'path' is absolute (http/https), it is used as-is.
 * - Otherwise, it is appended to BASE_URL with a leading slash.
 * - Sets CORS mode by default and merges provided headers.
 *
 * @param {string} path - Endpoint path (e.g., "/api/hello") or absolute URL.
 * @param {RequestInit} [options] - Fetch options, merged with defaults.
 * @returns {Promise<Response>} The fetch Response object.
 */
export async function get(path, options = {}) {
  if (!path) {
    throw new Error("A path is required for GET requests.");
  }
  const isAbsolute = /^https?:\/\//i.test(path);
  const url = isAbsolute
    ? path
    : `${BASE_URL}${path.startsWith("/") ? "" : "/"}${path}`;

  const { headers = {}, mode = "cors", ...rest } = options;

  // Merge default headers with any provided headers
  const mergedHeaders = {
    Accept: "application/json, text/plain, */*",
    ...headers,
  };

  return fetch(url, {
    mode,
    headers: mergedHeaders,
    ...rest,
  });
}
