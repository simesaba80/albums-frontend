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
import { AlertMessage } from "@/components/AlertMessage";
import { FileInput } from "@/components/FileInput";
import { LinkButton } from "@/components/LinkButton";
import { PageHeading } from "@/components/PageHeading";
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

  function addPhotoFile(file: File | null) {
    if (file) setPhotoFiles((prev) => [...prev, file]);
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
      <div style={{ marginBottom: "var(--charcoal-space-40)" }}>
        <PageHeading>New Album</PageHeading>
      </div>

      {error && (
        <div style={{ marginBottom: "var(--charcoal-space-30)" }}>
          <AlertMessage variant="error">{error}</AlertMessage>
        </div>
      )}

      <form onSubmit={handleSubmit} className="form-wide stack-l">
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
          <label className="field-label">Photos</label>
          <div className="stack-m">
            {photoFiles.map((file, index) => (
              <div
                key={`${file.name}-${index}`}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "var(--charcoal-space-20)",
                }}
              >
                <span
                  className="caption text-secondary"
                  style={{
                    flex: 1,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
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
              accept="image/*"
              className="caption"
              style={{ display: "block", width: "100%" }}
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

        <div style={{ display: "flex", gap: "var(--charcoal-space-20)" }}>
          <Button type="submit" variant="Primary" disabled={submitting}>
            {submitting ? "Creating..." : "Create Album"}
          </Button>
          <LinkButton href="/">Back to Albums</LinkButton>
        </div>
      </form>
    </>
  );
}
