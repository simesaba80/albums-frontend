"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { createAlbum } from "@/lib/api";

export default function NewAlbumPage() {
  const router = useRouter();
  const [photoFiles, setPhotoFiles] = useState<File[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  function addPhotoFile(file: File) {
    setPhotoFiles((prev) => [...prev, file]);
  }

  function removePhotoFile(index: number) {
    setPhotoFiles((prev) => prev.filter((_, i) => i !== index));
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    const form = e.currentTarget;
    const formData = new FormData();

    const title = (form.elements.namedItem("title") as HTMLInputElement).value;
    const description = (
      form.elements.namedItem("description") as HTMLTextAreaElement
    ).value;
    const status = (form.elements.namedItem("status") as HTMLSelectElement)
      .value;
    const coverImage = (
      form.elements.namedItem("cover_image") as HTMLInputElement
    ).files?.[0];

    formData.append("album[title]", title);
    formData.append("album[description]", description);
    formData.append("album[status]", status);
    if (coverImage) {
      formData.append("album[cover_image]", coverImage);
    }
    for (const file of photoFiles) {
      formData.append("album[photo_images][]", file);
    }

    try {
      await createAlbum(formData);
      router.push("/");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create album");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      <h1 className="text-2xl font-bold mb-4">New Album</h1>

      {error && (
        <p className="text-red-600 mb-4">{error}</p>
      )}

      <form onSubmit={handleSubmit}>
        <div className="mb-3.5">
          <label htmlFor="title" className="block mb-1.5 font-semibold">
            Title
          </label>
          <input
            type="text"
            id="title"
            name="title"
            className="w-full max-w-[560px] px-2.5 py-2 border border-gray-300 rounded-lg"
          />
        </div>

        <div className="mb-3.5">
          <label htmlFor="cover_image" className="block mb-1.5 font-semibold">
            Cover image
          </label>
          <input
            type="file"
            id="cover_image"
            name="cover_image"
            accept="image/*"
            className="w-full max-w-[560px] px-2.5 py-2 border border-gray-300 rounded-lg"
          />
        </div>

        <div className="mb-3.5">
          <label className="block mb-1.5 font-semibold">Photos</label>
          <div className="grid gap-2 max-w-[560px]">
            {photoFiles.map((file, index) => (
              <div key={`${file.name}-${index}`} className="flex items-center gap-2">
                <span className="text-sm text-gray-600 truncate flex-1">
                  {file.name}
                </span>
                <button
                  type="button"
                  onClick={() => removePhotoFile(index)}
                  className="px-3 py-1.5 border border-red-200 rounded-lg text-red-700 bg-white text-sm cursor-pointer"
                >
                  Remove
                </button>
              </div>
            ))}
            <input
              type="file"
              accept="image/*"
              className="w-full px-2.5 py-2 border border-gray-300 rounded-lg"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  addPhotoFile(file);
                  e.target.value = "";
                }
              }}
            />
          </div>
        </div>

        <div className="mb-3.5">
          <label htmlFor="description" className="block mb-1.5 font-semibold">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            className="w-full max-w-[560px] px-2.5 py-2 border border-gray-300 rounded-lg min-h-[120px] resize-y"
          />
        </div>

        <div className="mb-3.5">
          <label htmlFor="status" className="block mb-1.5 font-semibold">
            Status
          </label>
          <select
            id="status"
            name="status"
            className="w-full max-w-[560px] px-2.5 py-2 border border-gray-300 rounded-lg"
          >
            <option value="draft">Draft</option>
            <option value="public_album">Public album</option>
            <option value="private_album">Private album</option>
          </select>
        </div>

        <div className="mb-3.5">
          <button
            type="submit"
            disabled={submitting}
            className="px-3 py-2 rounded-lg text-white bg-gray-900 border border-gray-900 text-sm cursor-pointer disabled:opacity-50"
          >
            {submitting ? "Creating..." : "Create Album"}
          </button>
        </div>
      </form>

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
