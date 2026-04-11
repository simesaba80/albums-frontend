"use client";

import { Button, TextField } from "@charcoal-ui/react";
import { useState } from "react";
import { requestPasswordReset } from "@/lib/api";
import { PageHeading } from "@/components/PageHeading";
import { AlertMessage } from "@/components/AlertMessage";

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
    <div className="form-narrow" style={{ marginTop: "var(--charcoal-space-60)" }}>
      <div style={{ marginBottom: "var(--charcoal-space-40)" }}>
        <PageHeading>Forgot your password?</PageHeading>
      </div>

      {error && (
        <div style={{ marginBottom: "var(--charcoal-space-30)" }}>
          <AlertMessage variant="error">{error}</AlertMessage>
        </div>
      )}
      {notice && (
        <div style={{ marginBottom: "var(--charcoal-space-30)" }}>
          <AlertMessage variant="success">{notice}</AlertMessage>
        </div>
      )}

      <form onSubmit={handleSubmit} className="stack-l">
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
