import { headers } from "next/headers";
import { AlbumActions } from "@/components/AlbumActions";
import { EmptyState } from "@/components/EmptyState";
import { LinkButton } from "@/components/LinkButton";
import { PageHeading } from "@/components/PageHeading";
import { PhotoCard } from "@/components/PhotoCard";
import { ApiError, fetchAlbum } from "@/lib/api";
import type { Album } from "@/lib/types";

export default async function AlbumShowPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const requestHeaders = await headers();
  const authorization = requestHeaders.get("authorization");
  const cookie = requestHeaders.get("cookie");
  let album: Album;

  try {
    album = await fetchAlbum(id, { authorization, cookie });
  } catch (error) {
    if (error instanceof ApiError && error.status === 401) {
      return (
        <EmptyState
          message="Please log in to view this album."
          action={
            <LinkButton
              href={`/api/auth/basic?returnTo=/albums/${id}`}
              variant="Primary"
            >
              Login
            </LinkButton>
          }
        />
      );
    }

    throw error;
  }

  const photos = [...(album.photos ?? [])].sort((a, b) => {
    const orderDiff =
      (a.display_order ?? Number.MAX_SAFE_INTEGER) -
      (b.display_order ?? Number.MAX_SAFE_INTEGER);
    if (orderDiff !== 0) return orderDiff;
    return a.id - b.id;
  });

  return (
    <>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "var(--charcoal-space-20)",
          marginBottom: "var(--charcoal-space-35)",
          flexWrap: "wrap",
        }}
      >
        <PageHeading>{album.title}</PageHeading>
        <AlbumActions albumId={id} />
      </div>

      {photos.length > 0 ? (
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "var(--charcoal-space-25)",
          }}
        >
          {photos.map((photo) => (
            <PhotoCard key={photo.id} photo={photo} />
          ))}
        </div>
      ) : (
        <EmptyState message="No photos in this album." />
      )}

      <div style={{ marginTop: "var(--charcoal-space-40)" }}>
        <LinkButton href="/">Back to Albums</LinkButton>
      </div>
    </>
  );
}
