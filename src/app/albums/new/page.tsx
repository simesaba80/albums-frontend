"use client";

import {
  Button,
  DropdownSelector,
  MenuItem,
  TextArea,
  TextField,
} from "@charcoal-ui/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { LinkButton } from "@/components/LinkButton";
import { createAlbum } from "@/lib/api";

export default function NewAlbumPage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("draft");
  const [coverImage, setCoverImage] = useState<File | null>(null);
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

    const formData = new FormData();
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
      <h1 className="text-2xl font-bold mb-6">New Album</h1>

      {error && (
        <p
          className="mb-4 text-sm"
          style={{ color: "var(--charcoal-color-text-negative-default)" }}
        >
          {error}
        </p>
      )}

      <form onSubmit={handleSubmit} className="grid gap-6 max-w-[560px]">
        <TextField
          label="Title"
          showLabel
          name="title"
          placeholder="Album title"
          value={title}
          onChange={setTitle}
        />

        <div>
          <label htmlFor="cover_image" className="block mb-2 text-sm font-bold">
            Cover image
          </label>
          <input
            type="file"
            id="cover_image"
            accept="image/*"
            className="block w-full text-sm"
            onChange={(e) => setCoverImage(e.target.files?.[0] ?? null)}
          />
        </div>

        <div>
          <label htmlFor="photo_image" className="block mb-2 text-sm font-bold">
            Photos
          </label>
          <div className="grid gap-2">
            {photoFiles.map((file, index) => (
              <div
                key={`${file.name}-${index}`}
                className="flex items-center gap-2"
              >
                <span
                  className="text-sm truncate flex-1"
                  style={{
                    color: "var(--charcoal-color-text-secondary-default)",
                  }}
                >
                  {file.name}
                </span>
                <Button
                  variant="Danger"
                  size="S"
                  type="button"
                  onClick={() => removePhotoFile(index)}
                >
                  Remove
                </Button>
              </div>
            ))}
            <input
              type="file"
              id="photo_image"
              accept="image/*"
              className="block w-full text-sm"
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

        <TextArea
          label="Description"
          showLabel
          name="description"
          placeholder="Album description"
          value={description}
          onChange={setDescription}
          rows={5}
        />

        <DropdownSelector
          label="Status"
          showLabel
          name="status"
          value={status}
          onChange={setStatus}
        >
          <MenuItem value="draft">Draft</MenuItem>
          <MenuItem value="public_album">Public album</MenuItem>
          <MenuItem value="private_album">Private album</MenuItem>
        </DropdownSelector>

        <div className="flex gap-3">
          <Button type="submit" variant="Primary" disabled={submitting}>
            {submitting ? "Creating..." : "Create Album"}
          </Button>
          <LinkButton href="/" variant="Default" size="S">
            Back to Albums
          </LinkButton>
        </div>
      </form>
    </>
  );
}
