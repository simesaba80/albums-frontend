import { AlbumActions } from "@/components/AlbumActions";
import { EmptyState } from "@/components/EmptyState";
import { LinkButton } from "@/components/LinkButton";
import { PageHeading } from "@/components/PageHeading";
import { PhotoCard } from "@/components/PhotoCard";
import { fetchAlbum } from "@/lib/api";

export default async function AlbumShowPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const album = await fetchAlbum(id);
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
