import Link from "next/link";
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
                className="w-[200px] h-[200px] object-cover rounded-lg"
              />
            ) : null,
          )}
        </div>
      ) : (
        <p className="text-gray-500">No photos in this album.</p>
      )}

      <div className="mt-3">
        <Link
          href="/"
          className="inline-block px-3 py-2 rounded-lg border border-gray-300 text-gray-900 bg-white no-underline text-sm"
        >
          Back to Albums
        </Link>
      </div>
    </>
  );
}
