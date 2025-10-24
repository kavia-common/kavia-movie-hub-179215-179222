"use strict";

/**
 * API client utilities for the React frontend.
 * Prefers relative paths by default so preview/proxy setups work seamlessly,
 * while allowing an override via REACT_APP_API_BASE_URL when present.
 */

// PUBLIC_INTERFACE
export const BASE_URL = (process.env.REACT_APP_API_BASE_URL || "").replace(/\/+$/, "");

/**
 * Ensure a leading slash for relative paths and join with BASE_URL (if provided).
 * If BASE_URL is empty, returns a relative URL so the app uses the same-origin.
 *
 * @param {string} path - Endpoint path (e.g., "/api/movies" or "api/hello")
 * @returns {string} Built URL (absolute if env override is provided, otherwise relative)
 */
// PUBLIC_INTERFACE
export function buildUrl(path) {
  if (!path) throw new Error("A path is required to build the URL.");
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  if (!BASE_URL) return normalizedPath;
  return `${BASE_URL}${normalizedPath}`;
}

/**
 * PUBLIC_INTERFACE
 * Lightweight GET helper using sensible defaults.
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
  const url = isAbsolute ? path : buildUrl(path);

  const { headers = {}, mode, ...rest } = options;

  const mergedHeaders = {
    Accept: "application/json, text/plain, */*",
    ...headers,
  };

  // If relative (same origin), omit mode to avoid CORS complications
  const finalMode = isAbsolute ? (mode || "cors") : (mode || undefined);

  return fetch(url, {
    mode: finalMode,
    headers: mergedHeaders,
    ...rest,
  });
}

/**
 * PUBLIC_INTERFACE
 * Lightweight POST helper for JSON payloads.
 *
 * @param {string} path - Endpoint path (e.g., "/api/movies") or absolute URL.
 * @param {object} data - JSON serializable body.
 * @param {RequestInit} [options] - Additional fetch options.
 * @returns {Promise<Response>} The fetch Response object.
 */
export async function post(path, data, options = {}) {
  if (!path) throw new Error("A path is required for POST requests.");
  const isAbsolute = /^https?:\/\//i.test(path);
  const url = isAbsolute ? path : buildUrl(path);

  const { headers = {}, mode, ...rest } = options;

  const mergedHeaders = {
    Accept: "application/json, text/plain, */*",
    "Content-Type": "application/json",
    ...headers,
  };

  const finalMode = isAbsolute ? (mode || "cors") : (mode || undefined);

  return fetch(url, {
    method: "POST",
    mode: finalMode,
    headers: mergedHeaders,
    body: JSON.stringify(data ?? {}),
    ...rest,
  });
}

/**
 * PUBLIC_INTERFACE
 * Helper to GET and parse JSON, throwing on non-2xx with the response text as message.
 *
 * @param {string} path
 * @param {RequestInit} [options]
 * @returns {Promise<any>}
 */
export async function getJSON(path, options = {}) {
  const res = await get(path, options);
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(text || `GET ${path} failed: ${res.status} ${res.statusText}`);
  }
  return res.json();
}

/**
 * PUBLIC_INTERFACE
 * Helper to POST JSON and parse JSON response, throwing on non-2xx.
 *
 * @param {string} path
 * @param {object} data
 * @param {RequestInit} [options]
 * @returns {Promise<any>}
 */
export async function postJSON(path, data, options = {}) {
  const res = await post(path, data, options);
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(text || `POST ${path} failed: ${res.status} ${res.statusText}`);
  }
  return res.json();
}
