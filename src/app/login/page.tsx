"use client";

import { Button, Clickable, TextField } from "@charcoal-ui/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";
import { login } from "@/lib/api";
import { PageHeading } from "@/components/PageHeading";
import { AlertMessage } from "@/components/AlertMessage";

export default function LoginPage() {
  const router = useRouter();
  const [emailAddress, setEmailAddress] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

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
    <div className="form-narrow" style={{ marginTop: "var(--charcoal-space-60)" }}>
      <div style={{ marginBottom: "var(--charcoal-space-40)" }}>
        <PageHeading>Sign in</PageHeading>
      </div>

      {error && (
        <div style={{ marginBottom: "var(--charcoal-space-30)" }}>
          <AlertMessage variant="error">{error}</AlertMessage>
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

        <TextField
          label="Password"
          showLabel
          type="password"
          name="password"
          required
          autoComplete="current-password"
          placeholder="Enter your password"
          maxLength={72}
          value={password}
          onChange={setPassword}
        />

        <Button type="submit" variant="Primary" fullWidth disabled={submitting}>
          {submitting ? "Signing in..." : "Sign in"}
        </Button>
      </form>

      <div style={{ marginTop: "var(--charcoal-space-30)" }}>
        <Clickable component={Link} href="/passwords/new">
          <span className="caption text-secondary">Forgot password?</span>
        </Clickable>
      </div>
    </div>
  );
}
