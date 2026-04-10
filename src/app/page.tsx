import Image from "next/image";
import Link from "next/link";
import { LinkButton } from "@/components/LinkButton";
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
        <LinkButton href="/albums/new" variant="Primary" size="S">
          New Album
        </LinkButton>
      </div>

      {fetchError ? (
        <p style={{ color: "var(--charcoal-color-text-tertiary-default)" }}>
          Failed to load albums. Please try again later.
        </p>
      ) : albums.length > 0 ? (
        <div className="grid grid-cols-[repeat(auto-fill,minmax(220px,1fr))] gap-4">
          {albums.map((album) => (
            <Link key={album.id} href={`/albums/${album.id}`}>
              <article
                className="rounded-xl overflow-hidden"
                style={{
                  border: `1px solid var(--charcoal-color-border-default)`,
                  backgroundColor: "var(--charcoal-color-container-default)",
                }}
              >
                {album.cover_image_url ? (
                  <Image
                    src={album.cover_image_url}
                    alt={album.title ?? "Album cover"}
                    className="w-full h-40 object-cover block"
                    width={400}
                    height={160}
                    unoptimized
                  />
                ) : (
                  <div
                    className="h-40 flex items-center justify-center"
                    style={{
                      backgroundColor:
                        "var(--charcoal-color-container-secondary-default)",
                      color: "var(--charcoal-color-text-tertiary-default)",
                    }}
                  >
                    No cover image
                  </div>
                )}
                <div className="px-3 py-2.5">
                  <p className="m-0 font-semibold">
                    {album.title || "Untitled Album"}
                  </p>
                  <p
                    className="mt-1.5 mb-0 text-xs"
                    style={{
                      color: "var(--charcoal-color-text-tertiary-default)",
                    }}
                  >
                    {album.status.replace("_", " ")}
                  </p>
                </div>
              </article>
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p
            className="mb-4"
            style={{
              color: "var(--charcoal-color-text-tertiary-default)",
            }}
          >
            No albums yet. Create your first album.
          </p>
          <LinkButton href="/albums/new" variant="Primary" size="S">
            Create Album
          </LinkButton>
        </div>
      )}
    </>
  );
}
