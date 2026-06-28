"use client";

import { useState } from "react";

export function Newsletter() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    const existing = JSON.parse(
      localStorage.getItem("makkah-arts-newsletter") ?? "[]",
    ) as string[];
    if (!existing.includes(email)) {
      localStorage.setItem(
        "makkah-arts-newsletter",
        JSON.stringify([...existing, email]),
      );
    }
    setSubmitted(true);
    setEmail("");
  }

  return (
    <section className="border-t border-border bg-white py-16 md:py-20">
      <div className="container-main mx-auto max-w-xl text-center">
        <h2 className="font-serif text-3xl">Stay in Touch</h2>
        <p className="mt-3 text-sm text-muted">
          Be the first to know about new lawn collections and restocks.
        </p>

        {submitted ? (
          <p className="mt-8 text-sm text-accent">
            Thank you! We&apos;ll keep you updated on new arrivals.
          </p>
        ) : (
          <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-3 sm:flex-row">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Your email address"
              className="flex-1 border border-border bg-background px-4 py-3 text-sm outline-none focus:border-accent"
            />
            <button
              type="submit"
              className="bg-foreground px-6 py-3 text-xs tracking-widest text-background uppercase transition hover:bg-accent"
            >
              Subscribe
            </button>
          </form>
        )}
      </div>
    </section>
  );
}
