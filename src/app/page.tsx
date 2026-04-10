import { fetchAlbums } from "@/lib/api";
import type { Album } from "@/lib/types";
import { PageHeading } from "@/components/PageHeading";
import { LinkButton } from "@/components/LinkButton";
import { AlbumCard } from "@/components/AlbumCard";
import { EmptyState } from "@/components/EmptyState";

export default async function Home() {
  let albums: Album[] = [];
  let fetchError = false;

  try {
    albums = await fetchAlbums();
  } catch {
    fetchError = true;
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

      {fetchError ? (
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
