"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { MeatballIcon } from "@/components/MeatballIcon";
import { deleteAlbum } from "@/lib/api";
import type { Album } from "@/lib/types";

export function AlbumCard({ album }: { album: Album }) {
  const router = useRouter();
  const menuRef = useRef<HTMLDivElement>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (!menuOpen) return;

    function handleOutsideClick(event: MouseEvent) {
      if (!menuRef.current?.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    }

    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setMenuOpen(false);
      }
    }

    document.addEventListener("mousedown", handleOutsideClick);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [menuOpen]);

  async function handleDelete() {
    if (deleting) return;

    const confirmed = window.confirm("Delete this album?");
    if (!confirmed) return;

    setDeleting(true);

    try {
      await deleteAlbum(album.id);
      setMenuOpen(false);
      router.refresh();
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to delete album";
      window.alert(message);
    } finally {
      setDeleting(false);
    }
  }

  return (
    <article className={`surface-card album-card${menuOpen ? " is-menu-open" : ""}`}>
      <div className="album-card-media">
        <Link href={`/albums/${album.id}`} className="album-card-link">
          {album.cover_image_url ? (
            <img
              src={album.cover_image_url}
              alt={album.title ?? "Album cover"}
              style={{
                width: "100%",
                height: 160,
                objectFit: "cover",
                display: "block",
              }}
            />
          ) : (
            <div
              className="surface-secondary text-tertiary"
              style={{
                height: 160,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              No cover image
            </div>
          )}
        </Link>
      </div>
      <div
        className="album-card-content"
        style={{
          padding: "var(--charcoal-space-25) var(--charcoal-space-30)",
        }}
      >
        <div
          className="album-card-title-row"
          style={{
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
            gap: "var(--charcoal-space-20)",
          }}
        >
          <Link href={`/albums/${album.id}`} className="album-card-title-link">
            <p
              style={{
                margin: 0,
                fontWeight: "var(--charcoal-text-font-weight-bold)",
              }}
            >
              {album.title || "Untitled Album"}
            </p>
          </Link>
          <div className="album-card-menu" ref={menuRef}>
            <button
              type="button"
              className="album-card-menu-trigger"
              aria-label="Open album actions"
              aria-haspopup="menu"
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen((prev) => !prev)}
            >
              <MeatballIcon />
            </button>
            {menuOpen && (
              <div className="album-card-menu-popover" role="menu">
                <Link
                  href={`/albums/${album.id}`}
                  className="album-card-menu-item"
                  role="menuitem"
                  onClick={() => setMenuOpen(false)}
                >
                  Open
                </Link>
                <button
                  type="button"
                  className="album-card-menu-item album-card-menu-item-danger"
                  role="menuitem"
                  disabled={deleting}
                  onClick={handleDelete}
                >
                  {deleting ? "Deleting..." : "Delete"}
                </button>
              </div>
            )}
          </div>
        </div>
        {album.description && (
          <p
            className="text-secondary caption album-card-description"
            style={{ margin: "var(--charcoal-space-15) 0 0" }}
          >
            {album.description}
          </p>
        )}
        <p
          className="text-tertiary caption-s"
          style={{ margin: "var(--charcoal-space-10) 0 0" }}
        >
          {album.status.replace("_", " ")}
        </p>
      </div>
    </article>
  );
}
