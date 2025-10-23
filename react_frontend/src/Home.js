import React from "react";

// PUBLIC_INTERFACE
export default function Home() {
  /** Minimal home hero using Tailwind and Royal Purple accents */
  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-b from-royal-start to-royal-end">
      <div className="mx-4 w-full max-w-2xl">
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
          </div>
        </section>
      </div>
    </main>
  );
}
