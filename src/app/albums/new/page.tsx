"use client";

import {
  IconArrowDown,
  IconArrowUp,
  IconDelete,
} from "@charcoal-ui/icons/react/v2";
import {
  Button,
  DropdownSelector,
  MenuItem,
  TextArea,
  TextField,
} from "@charcoal-ui/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { AlertMessage } from "@/components/AlertMessage";
import { FileInput } from "@/components/FileInput";
import { LinkButton } from "@/components/LinkButton";
import { PageHeading } from "@/components/PageHeading";
import { createAlbum } from "@/lib/api";

type PhotoFileDraft = {
  tempId: string;
  file: File;
  caption: string;
};

export default function NewAlbumPage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("draft");
  const [coverImage, setCoverImage] = useState<File | null>(null);
  const [photoFiles, setPhotoFiles] = useState<PhotoFileDraft[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  function addPhotoFile(file: File | null) {
    if (!file) return;

    setPhotoFiles((prev) => [
      ...prev,
      {
        tempId: `${file.name}-${file.lastModified}-${file.size}-${Date.now()}-${prev.length}`,
        file,
        caption: "",
      },
    ]);
  }

  function removePhotoFile(index: number) {
    setPhotoFiles((prev) => prev.filter((_, i) => i !== index));
  }

  function movePhotoFile(index: number, direction: -1 | 1) {
    setPhotoFiles((prev) => {
      const nextIndex = index + direction;
      if (nextIndex < 0 || nextIndex >= prev.length) return prev;

      const next = [...prev];
      [next[index], next[nextIndex]] = [next[nextIndex], next[index]];
      return next;
    });
  }

  function updatePhotoCaption(index: number, caption: string) {
    setPhotoFiles((prev) =>
      prev.map((p, i) => (i === index ? { ...p, caption } : p)),
    );
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
    // Previous backend format:
    // photoFiles.forEach(({ file, caption }, index) => {
    //   formData.append(`album[photos_attributes][${index}][image]`, file);
    //   formData.append(`album[photos_attributes][${index}][caption]`, caption);
    //   formData.append(
    //     `album[photos_attributes][${index}][display_order]`,
    //     String(index),
    //   );
    // });
    photoFiles.forEach(({ file, caption }, index) => {
      // Previous payload format before the latest backend change:
      // formData.append(`photos[create][${index}][image]`, file);
      // formData.append(`photos[create][${index}][caption]`, caption);
      // formData.append(`photos[create][${index}][display_order]`, String(index));
      formData.append("photos[create][][image]", file);
      formData.append("photos[create][][caption]", caption);
      formData.append("photos[create][][display_order]", String(index));
    });

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
      <div className="new-album-header">
        <PageHeading>New Album</PageHeading>
      </div>

      {error && (
        <div className="new-album-alert">
          <AlertMessage variant="error">{error}</AlertMessage>
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="form-wide stack-l surface-card new-album-form"
      >
        <TextField
          label="Title"
          showLabel
          name="title"
          placeholder="Album title"
          value={title}
          onChange={setTitle}
        />

        <FileInput
          id="cover_image"
          label="Cover image"
          accept="image/*"
          onChange={setCoverImage}
        />

        <div>
          <span className="field-label">Photos</span>
          <div className="stack-m">
            {photoFiles.length > 0 ? (
              <div className="stack-m">
                {photoFiles.map(({ tempId, file, caption }, index) => (
                  <div
                    key={tempId}
                    className="new-album-photo-row photo-order-row"
                  >
                    <span className="caption-s text-tertiary photo-order-index">
                      #{index + 1}
                    </span>
                    <span className="caption text-secondary photo-order-file-name">
                      {file.name}
                    </span>
                    <input
                      type="text"
                      placeholder="Caption"
                      value={caption}
                      onChange={(e) =>
                        updatePhotoCaption(index, e.target.value)
                      }
                      className="caption photo-order-caption"
                    />
                    <div className="photo-order-actions">
                      <button
                        type="button"
                        className="photo-order-icon-button"
                        aria-label={`Move ${file.name} up`}
                        title="Move up"
                        disabled={index === 0}
                        onClick={() => movePhotoFile(index, -1)}
                      >
                        <IconArrowUp aria-hidden />
                      </button>
                      <button
                        type="button"
                        className="photo-order-icon-button"
                        aria-label={`Move ${file.name} down`}
                        title="Move down"
                        disabled={index === photoFiles.length - 1}
                        onClick={() => movePhotoFile(index, 1)}
                      >
                        <IconArrowDown aria-hidden />
                      </button>
                      <button
                        type="button"
                        className="photo-order-icon-button photo-order-icon-button-danger"
                        aria-label={`Remove ${file.name}`}
                        title="Remove"
                        onClick={() => removePhotoFile(index)}
                      >
                        <IconDelete aria-hidden />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="caption text-tertiary new-album-photo-empty">
                No photos added yet.
              </p>
            )}
            <input
              type="file"
              accept="image/*"
              className="caption file-control"
              onChange={(e) => {
                addPhotoFile(e.target.files?.[0] ?? null);
                e.target.value = "";
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

        <div className="new-album-actions">
          <Button type="submit" variant="Primary" disabled={submitting}>
            {submitting ? "Creating..." : "Create Album"}
          </Button>
          <LinkButton href="/">Back to Albums</LinkButton>
        </div>
      </form>
    </>
  );
}
