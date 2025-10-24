import React, { useEffect, useState } from "react";
import { get } from "./apiClient";
import Movies from "./components/Movies";

// PUBLIC_INTERFACE
export default function Home() {
  /**
   * Minimal home hero using Tailwind and Royal Purple accents.
   * On mount, fetches from the Flask backend using relative "/api/hello"
   * and displays the returned text (or an error) below the welcome heading.
   */
  const [status, setStatus] = useState({ loading: true, message: "", error: "" });

  useEffect(() => {
    let isMounted = true;

    async function fetchHello() {
      try {
        const res = await get("/api/hello", {
          headers: {
            Accept: "text/plain, */*",
          },
        });

        if (!res.ok) {
          const text = await res.text().catch(() => "");
          throw new Error(`HTTP ${res.status} ${res.statusText}${text ? ` - ${text}` : ""}`);
        }

        const text = await res.text();
        if (isMounted) {
          setStatus({ loading: false, message: text || "Hello from Flask", error: "" });
        }
      } catch (err) {
        if (isMounted) {
          setStatus({
            loading: false,
            message: "",
            error:
              err?.message ||
              "Failed to reach backend. Ensure Flask is running and that /api is reachable.",
          });
        }
      }
    }

    fetchHello();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <main className="min-h-screen flex items-start justify-center bg-gradient-to-b from-royal-start to-royal-end">
      <div className="mx-4 w-full max-w-2xl my-10">
        <section className="rounded-2xl shadow-xl bg-white/70 backdrop-blur-md border border-white/60">
          <div className="p-10 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 text-primary text-3xl mb-4 shadow">
              🎬
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-primary">
              Welcome to MovieAI
            </h1>
            <p className="mt-3 text-secondary">
              Elegant, minimal starting point powered by Tailwind CSS.
            </p>

            <div className="mt-6">
              {status.loading && (
                <p className="text-secondary animate-pulse">Connecting to Flask backend...</p>
              )}
              {!status.loading && status.message && (
                <p className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-success/10 text-success border border-success/20">
                  <span className="w-2 h-2 rounded-full bg-success animate-pulse" />
                  {status.message}
                </p>
              )}
              {!status.loading && status.error && (
                <p
                  className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-error/10 text-error border border-error/20"
                  title="Backend connectivity error"
                >
                  <span className="w-2 h-2 rounded-full bg-error" />
                  {status.error}
                </p>
              )}
            </div>

            {/* Divider and Movies section */}
            <div className="mt-8">
              <div className="mx-auto max-w-3xl text-left">
                <Movies />
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
