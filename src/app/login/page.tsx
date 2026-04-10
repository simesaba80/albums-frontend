"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { login } from "@/lib/api";

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    const form = e.currentTarget;
    const emailAddress = (
      form.elements.namedItem("email_address") as HTMLInputElement
    ).value;
    const password = (
      form.elements.namedItem("password") as HTMLInputElement
    ).value;

    try {
      const res = await login(emailAddress, password);
      if (res.ok) {
        router.push("/");
      } else {
        setError("Try another email address or password.");
      }
    } catch {
      setError("An error occurred. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="max-w-sm mx-auto mt-12">
      <h1 className="text-2xl font-bold mb-4">Sign in</h1>

      {error && <p className="text-red-600 mb-4">{error}</p>}

      <form onSubmit={handleSubmit}>
        <div className="mb-3.5">
          <input
            type="email"
            name="email_address"
            required
            autoFocus
            autoComplete="username"
            placeholder="Enter your email address"
            className="w-full px-2.5 py-2 border border-gray-300 rounded-lg"
          />
        </div>
        <div className="mb-3.5">
          <input
            type="password"
            name="password"
            required
            autoComplete="current-password"
            placeholder="Enter your password"
            maxLength={72}
            className="w-full px-2.5 py-2 border border-gray-300 rounded-lg"
          />
        </div>
        <div className="mb-3.5">
          <button
            type="submit"
            disabled={submitting}
            className="w-full px-3 py-2 rounded-lg text-white bg-gray-900 border border-gray-900 text-sm cursor-pointer disabled:opacity-50"
          >
            {submitting ? "Signing in..." : "Sign in"}
          </button>
        </div>
      </form>

      <Link href="/passwords/new" className="text-sm text-gray-600 hover:text-gray-900">
        Forgot password?
      </Link>
    </div>
  );
}
