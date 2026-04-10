"use client";

import { useRouter } from "next/navigation";
import { useState, use } from "react";
import { resetPassword } from "@/lib/api";

export default function ResetPasswordPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = use(params);
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    const form = e.currentTarget;
    const password = (
      form.elements.namedItem("password") as HTMLInputElement
    ).value;
    const passwordConfirmation = (
      form.elements.namedItem("password_confirmation") as HTMLInputElement
    ).value;

    try {
      const res = await resetPassword(token, password, passwordConfirmation);
      if (res.ok) {
        router.push("/login");
      } else {
        setError("Passwords did not match.");
      }
    } catch {
      setError("An error occurred. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="max-w-sm mx-auto mt-12">
      <h1 className="text-2xl font-bold mb-4">Update your password</h1>

      {error && <p className="text-red-600 mb-4">{error}</p>}

      <form onSubmit={handleSubmit}>
        <div className="mb-3.5">
          <input
            type="password"
            name="password"
            required
            autoComplete="new-password"
            placeholder="Enter new password"
            maxLength={72}
            className="w-full px-2.5 py-2 border border-gray-300 rounded-lg"
          />
        </div>
        <div className="mb-3.5">
          <input
            type="password"
            name="password_confirmation"
            required
            autoComplete="new-password"
            placeholder="Repeat new password"
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
            {submitting ? "Saving..." : "Save"}
          </button>
        </div>
      </form>
    </div>
  );
}
