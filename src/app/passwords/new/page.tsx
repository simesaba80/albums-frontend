"use client";

import { Button, TextField } from "@charcoal-ui/react";
import { useState } from "react";
import { requestPasswordReset } from "@/lib/api";

export default function ForgotPasswordPage() {
  const [emailAddress, setEmailAddress] = useState("");
  const [notice, setNotice] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

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
      <h1 className="text-2xl font-bold mb-6">Forgot your password?</h1>

      {error && (
        <p
          className="mb-4 text-sm"
          style={{ color: "var(--charcoal-color-text-negative-default)" }}
        >
          {error}
        </p>
      )}
      {notice && (
        <p
          className="mb-4 text-sm"
          style={{ color: "var(--charcoal-color-text-positive-default)" }}
        >
          {notice}
        </p>
      )}

      <form onSubmit={handleSubmit} className="grid gap-6">
        <TextField
          label="Email address"
          showLabel
          type="email"
          name="email_address"
          required
          autoFocus
          autoComplete="username"
          placeholder="Enter your email address"
          value={emailAddress}
          onChange={setEmailAddress}
        />

        <Button type="submit" variant="Primary" fullWidth disabled={submitting}>
          {submitting ? "Sending..." : "Email reset instructions"}
        </Button>
      </form>
    </div>
  );
}
