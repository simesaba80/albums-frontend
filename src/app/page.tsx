import Link from "next/link";
import { fetchAlbums } from "@/lib/api";
import type { Album } from "@/lib/types";

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
      <div className="flex justify-between items-center mb-5">
        <h1 className="text-2xl font-bold">Albums</h1>
        <Link
          href="/albums/new"
          className="inline-block px-3 py-2 rounded-lg text-white bg-gray-900 border border-gray-900 text-sm"
        >
          New Album
        </Link>
      </div>

      {fetchError ? (
        <p className="text-gray-500">
          Failed to load albums. Please try again later.
        </p>
      ) : albums.length > 0 ? (
        <div className="grid grid-cols-[repeat(auto-fill,minmax(220px,1fr))] gap-4">
          {albums.map((album) => (
            <Link
              key={album.id}
              href={`/albums/${album.id}`}
              className="no-underline text-inherit"
            >
              <article className="border border-gray-200 rounded-xl overflow-hidden bg-white">
                {album.cover_image_url ? (
                  <img
                    src={album.cover_image_url}
                    alt={album.title ?? "Album cover"}
                    className="w-full h-40 object-cover block"
                  />
                ) : (
                  <div className="h-40 flex items-center justify-center bg-gray-100 text-gray-500">
                    No cover image
                  </div>
                )}
                <div className="px-3 py-2.5">
                  <p className="m-0 font-semibold">
                    {album.title || "Untitled Album"}
                  </p>
                  <p className="mt-1.5 mb-0 text-xs text-gray-500">
                    {album.status.replace("_", " ")}
                  </p>
                </div>
              </article>
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-500 mb-4">
            No albums yet. Create your first album.
          </p>
          <Link
            href="/albums/new"
            className="inline-block px-4 py-2 rounded-lg text-white bg-gray-900 text-sm"
          >
            Create Album
          </Link>
        </div>
      )}
    </>
  );
}
