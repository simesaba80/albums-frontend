import Link from "next/link";
import type { Album } from "@/lib/types";

export function AlbumCard({ album }: { album: Album }) {
  return (
    <Link href={`/albums/${album.id}`}>
      <article className="surface-card">
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
        <div
          style={{
            padding: "var(--charcoal-space-25) var(--charcoal-space-30)",
          }}
        >
          <p style={{ margin: 0, fontWeight: "var(--charcoal-text-font-weight-bold)" }}>
            {album.title || "Untitled Album"}
          </p>
          <p
            className="text-tertiary caption-s"
            style={{ margin: "var(--charcoal-space-10) 0 0" }}
          >
            {album.status.replace("_", " ")}
          </p>
        </div>
      </article>
    </Link>
  );
}
