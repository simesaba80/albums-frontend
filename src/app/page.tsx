import { headers } from "next/headers";
import { AlbumCard } from "@/components/AlbumCard";
import { EmptyState } from "@/components/EmptyState";
import { LinkButton } from "@/components/LinkButton";
import { PageHeading } from "@/components/PageHeading";
import { ApiError, fetchAlbums } from "@/lib/api";
import type { Album } from "@/lib/types";

export default async function Home() {
  const requestHeaders = await headers();
  const authorization = requestHeaders.get("authorization");
  const cookie = requestHeaders.get("cookie");
  let albums: Album[] = [];
  let fetchError = false;
  let requiresLogin = false;

  try {
    albums = await fetchAlbums({ authorization, cookie });
  } catch (error) {
    if (error instanceof ApiError && error.status === 401) {
      requiresLogin = true;
    } else {
      fetchError = true;
    }
  }

  return (
    <>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "var(--charcoal-space-35)",
        }}
      >
        <PageHeading>Albums</PageHeading>
        <LinkButton href="/albums/new" variant="Primary" size="S">
          New Album
        </LinkButton>
      </div>

      {requiresLogin ? (
        <EmptyState
          message="Please log in to view albums."
          action={
            <LinkButton href="/api/auth/basic?returnTo=/" variant="Primary">
              Login
            </LinkButton>
          }
        />
      ) : fetchError ? (
        <EmptyState message="Failed to load albums. Please try again later." />
      ) : albums.length > 0 ? (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
            gap: "var(--charcoal-space-30)",
          }}
        >
          {albums.map((album) => (
            <AlbumCard key={album.id} album={album} />
          ))}
        </div>
      ) : (
        <EmptyState
          message="No albums yet. Create your first album."
          action={
            <LinkButton href="/albums/new" variant="Primary" size="S">
              Create Album
            </LinkButton>
          }
        />
      )}
    </>
  );
}
