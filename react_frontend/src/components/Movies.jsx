import React, { useCallback, useEffect, useMemo, useState } from "react";
import { getJSON, postJSON } from "../apiClient";

/**
 * PUBLIC_INTERFACE
 * Movies component (Royal Purple themed):
 * - Fetches GET /api/movies on mount and every 7 seconds (polling).
 * - Displays a list of movies with title and basic details (overview, date).
 * - Provides a simple POST form (title + description) to add a movie.
 * - Uses relative URLs by default; prefixes with REACT_APP_API_BASE_URL when provided (via apiClient).
 * - Includes loading and error states.
 */
export default function Movies() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  const [form, setForm] = useState({ title: "", description: "" });
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [submitSuccess, setSubmitSuccess] = useState("");

  // Poll every 7 seconds
  const pollIntervalMs = 7000;

  const hasMovies = Array.isArray(movies) && movies.length > 0;

  const fetchMovies = useCallback(async () => {
    try {
      setLoadError("");
      const data = await getJSON("/api/movies");
      if (Array.isArray(data)) {
        setMovies(data);
      } else {
        setMovies([]);
        setLoadError("Unexpected response format from /api/movies.");
      }
    } catch (err) {
      setLoadError(err?.message || "Failed to load movies.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      await fetchMovies();
    })();

    const id = setInterval(async () => {
      if (cancelled) return;
      await fetchMovies();
    }, pollIntervalMs);

    return () => {
      cancelled = true;
      clearInterval(id);
    };
  }, [fetchMovies]);

  const onChange = useCallback((e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setSubmitError("");
    setSubmitSuccess("");
  }, []);

  const canSubmit = useMemo(() => {
    return (form.title || "").trim().length > 0 && !submitting;
  }, [form.title, submitting]);

  const onSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      setSubmitError("");
      setSubmitSuccess("");
      if (!canSubmit) return;

      setSubmitting(true);
      try {
        // Map "description" to backend's "overview"
        const payload = {
          title: (form.title || "").trim(),
          ...(form.description ? { overview: form.description } : {}),
        };

        await postJSON("/api/movies", payload);
        setSubmitSuccess("Movie added successfully.");
        setForm({ title: "", description: "" });
        await fetchMovies();
      } catch (err) {
        setSubmitError(err?.message || "Failed to add movie.");
      } finally {
        setSubmitting(false);
      }
    },
    [canSubmit, fetchMovies, form.description, form.title]
  );

  return (
    <section className="mt-8">
      <div className="rounded-2xl border border-white/60 bg-white/70 backdrop-blur-md shadow-xl">
        <div className="p-6 md:p-8">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl md:text-3xl font-bold text-primary">Movies</h2>
            <button
              type="button"
              onClick={fetchMovies}
              className="px-3 py-2 rounded-lg bg-primary text-white hover:opacity-90 transition disabled:opacity-60"
              disabled={loading}
              title="Refresh movies"
            >
              Refresh
            </button>
          </div>

          {/* Loading and error state */}
          <div className="mt-4">
            {loading && (
              <p className="text-secondary animate-pulse">Loading movies...</p>
            )}
            {!loading && loadError && (
              <p className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-error/10 text-error border border-error/20">
                <span className="w-2 h-2 rounded-full bg-error" />
                {loadError}
              </p>
            )}
          </div>

          {/* Movie list */}
          {!loading && !loadError && (
            <div className="mt-4">
              {!hasMovies ? (
                <p className="text-secondary">No movies yet. Add one below.</p>
              ) : (
                <ul className="divide-y divide-gray-200/60">
                  {movies.map((m) => {
                    const desc = m.overview || m.description || "";
                    const createdLabel = m.created_at
                      ? new Date(m.created_at).toLocaleString()
                      : null;

                    return (
                      <li key={m.id ?? `${m.title}-${m.created_at ?? ""}`} className="py-3">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                          <div>
                            <div className="font-semibold text-text">
                              {m.title}
                              {m.year ? (
                                <span className="text-secondary"> &middot; {m.year}</span>
                              ) : null}
                            </div>
                            {desc ? (
                              <p className="text-sm text-secondary mt-1">{desc}</p>
                            ) : null}
                          </div>
                          {createdLabel ? (
                            <div className="text-xs text-secondary mt-2 md:mt-0">
                              Added: {createdLabel}
                            </div>
                          ) : null}
                        </div>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          )}

          {/* Divider */}
          <div className="my-6 border-t border-primary/20" />

          {/* Create form */}
          <form onSubmit={onSubmit} className="grid gap-4 md:grid-cols-3">
            <div className="md:col-span-1">
              <label className="block text-sm font-medium text-secondary mb-1" htmlFor="title">
                Title <span className="text-error">*</span>
              </label>
              <input
                id="title"
                name="title"
                type="text"
                placeholder="Inception"
                className="w-full rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary/50 px-3 py-2 bg-surface"
                value={form.title}
                onChange={onChange}
                required
              />
            </div>

            <div className="md:col-span-3">
              <label className="block text-sm font-medium text-secondary mb-1" htmlFor="description">
                Description
              </label>
              <textarea
                id="description"
                name="description"
                rows={3}
                placeholder="A mind-bending heist."
                className="w-full rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary/50 px-3 py-2 bg-surface"
                value={form.description}
                onChange={onChange}
              />
            </div>

            <div className="md:col-span-3 flex items-center gap-3">
              <button
                type="submit"
                className="px-4 py-2 rounded-lg bg-primary text-white hover:opacity-90 transition disabled:opacity-60"
                disabled={!canSubmit}
                title="Add movie"
              >
                {submitting ? "Adding..." : "Add Movie"}
              </button>
              {submitSuccess && (
                <span className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-success/10 text-success border border-success/20 text-sm">
                  <span className="w-2 h-2 rounded-full bg-success animate-pulse" />
                  {submitSuccess}
                </span>
              )}
              {submitError && (
                <span className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-error/10 text-error border border-error/20 text-sm">
                  <span className="w-2 h-2 rounded-full bg-error" />
                  {submitError}
                </span>
              )}
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
