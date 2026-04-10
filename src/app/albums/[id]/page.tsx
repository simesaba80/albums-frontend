import { fetchAlbum } from "@/lib/api";
import { PageHeading } from "@/components/PageHeading";
import { LinkButton } from "@/components/LinkButton";
import { EmptyState } from "@/components/EmptyState";

export default async function AlbumShowPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const album = await fetchAlbum(id);

  return (
    <>
      <div style={{ marginBottom: "var(--charcoal-space-35)" }}>
        <PageHeading>{album.title}</PageHeading>
      </div>

      {album.photos && album.photos.length > 0 ? (
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "var(--charcoal-space-25)",
          }}
        >
          {album.photos.map((photo) =>
            photo.image_url ? (
              <img
                key={photo.id}
                src={photo.image_url}
                alt={photo.caption ?? ""}
                style={{
                  width: 200,
                  height: 200,
                  objectFit: "cover",
                  borderRadius: "var(--charcoal-radius-m)",
                }}
              />
            ) : null,
          )}
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
