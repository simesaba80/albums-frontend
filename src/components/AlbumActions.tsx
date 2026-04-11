"use client";

import { Button } from "@charcoal-ui/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { LinkButton } from "@/components/LinkButton";
import { deleteAlbum } from "@/lib/api";

type Props = {
  albumId: string | number;
};

export function AlbumActions({ albumId }: Props) {
  const router = useRouter();
  const [deleting, setDeleting] = useState(false);

  async function handleDelete() {
    if (deleting) return;
    if (!window.confirm("このアルバムを削除しますか？")) return;

    setDeleting(true);
    try {
      await deleteAlbum(albumId);
      router.push("/");
    } catch (error) {
      window.alert(error instanceof Error ? error.message : "Failed to delete album");
      setDeleting(false);
    }
  }

  return (
    <div style={{ display: "flex", gap: "var(--charcoal-space-15)" }}>
      <LinkButton href={`/albums/${albumId}/edit`} variant="Default" size="S">
        Edit
      </LinkButton>
      <Button
        type="button"
        variant="Danger"
        size="S"
        disabled={deleting}
        onClick={handleDelete}
      >
        {deleting ? "Deleting..." : "Delete"}
      </Button>
    </div>
  );
}
