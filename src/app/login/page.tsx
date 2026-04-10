"use client";

import { Button, TextField } from "@charcoal-ui/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { login } from "@/lib/api";

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
    <div className="max-w-sm mx-auto mt-12">
      <h1 className="text-2xl font-bold mb-6">Sign in</h1>

      {error && (
        <p
          className="mb-4 text-sm"
          style={{ color: "var(--charcoal-color-text-negative-default)" }}
        >
          {error}
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

      <div className="mt-4">
        <Link
          href="/passwords/new"
          className="text-sm"
          style={{ color: "var(--charcoal-color-text-secondary-default)" }}
        >
          Forgot password?
        </Link>
      </div>
    </div>
  );
}
