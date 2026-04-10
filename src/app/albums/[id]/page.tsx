import { LinkButton } from "@/components/LinkButton";
import { fetchAlbum } from "@/lib/api";

export default async function AlbumShowPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const album = await fetchAlbum(id);

  return (
    <>
      <h1 className="text-2xl font-bold mb-4">{album.title}</h1>

      {album.photos && album.photos.length > 0 ? (
        <div className="flex flex-wrap gap-3">
          {album.photos.map((photo) =>
            photo.image_url ? (
              <img
                key={photo.id}
                src={photo.image_url}
                alt={photo.caption ?? ""}
                className="w-[200px] h-[200px] object-cover"
                style={{
                  borderRadius: "var(--charcoal-radius-m)",
                }}
              />
            ) : null,
          )}
        </div>
      ) : (
        <p
          style={{
            color: "var(--charcoal-color-text-tertiary-default)",
          }}
        >
          No photos in this album.
        </p>
      )}

      <div className="mt-6">
        <LinkButton href="/" variant="Default" size="S">
          Back to Albums
        </LinkButton>
      </div>
    </>
  );
}
