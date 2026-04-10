"use client";

import { Button, TextField } from "@charcoal-ui/react";
import { useRouter } from "next/navigation";
import { use, useState } from "react";
import { resetPassword } from "@/lib/api";

export default function ResetPasswordPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = use(params);
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

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
      <h1 className="text-2xl font-bold mb-6">Update your password</h1>

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
          label="New password"
          showLabel
          type="password"
          name="password"
          required
          autoComplete="new-password"
          placeholder="Enter new password"
          maxLength={72}
          value={password}
          onChange={setPassword}
        />

        <TextField
          label="Confirm password"
          showLabel
          type="password"
          name="password_confirmation"
          required
          autoComplete="new-password"
          placeholder="Repeat new password"
          maxLength={72}
          value={passwordConfirmation}
          onChange={setPasswordConfirmation}
        />

        <Button type="submit" variant="Primary" fullWidth disabled={submitting}>
          {submitting ? "Saving..." : "Save"}
        </Button>
      </form>
    </div>
  );
}
