"use client";

import { useState } from "react";
import { requestPasswordReset } from "@/lib/api";

export default function ForgotPasswordPage() {
  const [notice, setNotice] = useState<string | null>(null);
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

    try {
      const res = await requestPasswordReset(emailAddress);
      if (res.ok) {
        setNotice(
          "Password reset instructions sent (if user with that email address exists).",
        );
      } else {
        setError("An error occurred. Please try again.");
      }
    } catch {
      setError("An error occurred. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="max-w-sm mx-auto mt-12">
      <h1 className="text-2xl font-bold mb-4">Forgot your password?</h1>

      {error && <p className="text-red-600 mb-4">{error}</p>}
      {notice && <p className="text-green-600 mb-4">{notice}</p>}

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
          <button
            type="submit"
            disabled={submitting}
            className="w-full px-3 py-2 rounded-lg text-white bg-gray-900 border border-gray-900 text-sm cursor-pointer disabled:opacity-50"
          >
            {submitting ? "Sending..." : "Email reset instructions"}
          </button>
        </div>
      </form>
    </div>
  );
}
