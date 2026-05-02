"use client";

import {
  Button,
  DropdownSelector,
  MenuItem,
  TextArea,
  TextField,
} from "@charcoal-ui/react";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { AlertMessage } from "@/components/AlertMessage";
import { FileInput } from "@/components/FileInput";
import { LinkButton } from "@/components/LinkButton";
import { PageHeading } from "@/components/PageHeading";
import { fetchAlbum, updateAlbum } from "@/lib/api";
import type { Photo } from "@/lib/types";

type ExistingPhotoDraft = {
  id: number;
  imageUrl: string | null;
  caption: string;
  displayOrder: string;
  replacementImage: File | null;
  markedForDeletion: boolean;
};

type NewPhotoDraft = {
  tempId: string;
  image: File | null;
  caption: string;
  displayOrder: string;
};

export default function AlbumEditPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const albumId = params.id;

  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("draft");
  const [coverImage, setCoverImage] = useState<File | null>(null);
  const [currentCoverUrl, setCurrentCoverUrl] = useState<string | null>(null);
  const [existingPhotos, setExistingPhotos] = useState<ExistingPhotoDraft[]>(
    [],
  );
  const [newPhotos, setNewPhotos] = useState<NewPhotoDraft[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    let active = true;

    async function loadAlbum() {
      setLoading(true);
      setError(null);

      try {
        const album = await fetchAlbum(albumId);
        if (!active) return;

        setTitle(album.title ?? "");
        setDescription(album.description ?? "");
        setStatus(album.status);
        setCurrentCoverUrl(album.cover_image_url);
        setExistingPhotos(
          (album.photos ?? []).map((photo: Photo) => ({
            id: photo.id,
            imageUrl: photo.image_url,
            caption: photo.caption ?? "",
            displayOrder:
              photo.display_order !== null && photo.display_order !== undefined
                ? String(photo.display_order)
                : "",
            replacementImage: null,
            markedForDeletion: false,
          })),
        );
        setNewPhotos([]);
      } catch {
        if (!active) return;
        setError("Failed to load album");
      } finally {
        if (active) setLoading(false);
      }
    }

    loadAlbum();
    return () => {
      active = false;
    };
  }, [albumId]);

  function updateExistingPhoto(
    photoId: number,
    patch: Partial<Omit<ExistingPhotoDraft, "id">>,
  ) {
    setExistingPhotos((prev) =>
      prev.map((photo) =>
        photo.id === photoId ? { ...photo, ...patch } : photo,
      ),
    );
  }

  function addNewPhotoRow() {
    setNewPhotos((prev) => [
      ...prev,
      {
        tempId: `${Date.now()}-${prev.length}`,
        image: null,
        caption: "",
        displayOrder: "",
      },
    ]);
  }

  function updateNewPhoto(
    tempId: string,
    patch: Partial<Omit<NewPhotoDraft, "tempId">>,
  ) {
    setNewPhotos((prev) =>
      prev.map((photo) =>
        photo.tempId === tempId ? { ...photo, ...patch } : photo,
      ),
    );
  }

  function removeNewPhoto(tempId: string) {
    setNewPhotos((prev) => prev.filter((photo) => photo.tempId !== tempId));
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

    let photoAttributeIndex = 0;

    existingPhotos.forEach((photo) => {
      const baseKey = `album[photos_attributes][${photoAttributeIndex}]`;
      formData.append(`${baseKey}[id]`, String(photo.id));

      if (photo.markedForDeletion) {
        formData.append(`${baseKey}[_destroy]`, "1");
      } else {
        formData.append(`${baseKey}[caption]`, photo.caption);
        formData.append(`${baseKey}[display_order]`, photo.displayOrder);
        if (photo.replacementImage) {
          formData.append(`${baseKey}[image]`, photo.replacementImage);
        }
      }

      photoAttributeIndex += 1;
    });

    newPhotos.forEach((photo) => {
      if (!photo.image) return;
      const baseKey = `album[photos_attributes][${photoAttributeIndex}]`;
      formData.append(`${baseKey}[image]`, photo.image);
      formData.append(`${baseKey}[caption]`, photo.caption);
      formData.append(`${baseKey}[display_order]`, photo.displayOrder);
      photoAttributeIndex += 1;
    });

    try {
      await updateAlbum(albumId, formData);
      router.push(`/albums/${albumId}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update album");
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return <p className="caption text-secondary">Loading album...</p>;
  }

  return (
    <>
      <div className="new-album-header">
        <PageHeading>Update Album</PageHeading>
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

        <div className="stack-m">
          {currentCoverUrl && !coverImage && (
            <Image
              src={currentCoverUrl}
              alt="Current cover"
              width={280}
              height={280}
              unoptimized
              style={{
                width: "100%",
                maxWidth: 280,
                height: "auto",
                borderRadius: "var(--charcoal-radius-s)",
                border: "1px solid var(--charcoal-color-border-default)",
              }}
            />
          )}
          <FileInput
            id="cover_image"
            label="Replace cover image"
            accept="image/*"
            onChange={setCoverImage}
          />
        </div>

        <div className="stack-m">
          <span className="field-label">Photos (bulk edit)</span>
          {existingPhotos.length > 0 ? (
            <div className="stack-m">
              {existingPhotos.map((photo) => (
                <div
                  key={photo.id}
                  className="surface-card"
                  style={{
                    padding: "var(--charcoal-space-25)",
                    opacity: photo.markedForDeletion ? 0.6 : 1,
                  }}
                >
                  <div className="stack-m">
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "var(--charcoal-space-20)",
                        flexWrap: "wrap",
                      }}
                    >
                      {photo.imageUrl ? (
                        <Image
                          src={photo.imageUrl}
                          alt={String(photo.id)}
                          width={96}
                          height={96}
                          unoptimized
                          style={{
                            width: 96,
                            height: 96,
                            objectFit: "cover",
                            borderRadius: "var(--charcoal-radius-s)",
                            border:
                              "1px solid var(--charcoal-color-border-default)",
                          }}
                        />
                      ) : (
                        <div
                          className="surface-secondary text-tertiary caption"
                          style={{
                            width: 96,
                            height: 96,
                            borderRadius: "var(--charcoal-radius-s)",
                            display: "grid",
                            placeItems: "center",
                            border:
                              "1px solid var(--charcoal-color-border-default)",
                          }}
                        >
                          No image
                        </div>
                      )}
                      <div
                        style={{ minWidth: 220, flex: 1 }}
                        className="stack-m"
                      >
                        <TextField
                          label="Caption"
                          showLabel
                          value={photo.caption}
                          onChange={(value) =>
                            updateExistingPhoto(photo.id, { caption: value })
                          }
                          disabled={photo.markedForDeletion}
                        />
                        <TextField
                          label="Display order"
                          showLabel
                          value={photo.displayOrder}
                          onChange={(value) =>
                            updateExistingPhoto(photo.id, {
                              displayOrder: value,
                            })
                          }
                          disabled={photo.markedForDeletion}
                        />
                      </div>
                    </div>

                    <input
                      type="file"
                      accept="image/*"
                      className="caption file-control"
                      disabled={photo.markedForDeletion}
                      onChange={(event) =>
                        updateExistingPhoto(photo.id, {
                          replacementImage: event.target.files?.[0] ?? null,
                        })
                      }
                    />
                    {photo.replacementImage && (
                      <p
                        className="caption text-secondary"
                        style={{ margin: 0 }}
                      >
                        Replacement: {photo.replacementImage.name}
                      </p>
                    )}

                    <div>
                      <Button
                        type="button"
                        variant={photo.markedForDeletion ? "Default" : "Danger"}
                        size="S"
                        onClick={() =>
                          updateExistingPhoto(photo.id, {
                            markedForDeletion: !photo.markedForDeletion,
                          })
                        }
                      >
                        {photo.markedForDeletion
                          ? "Undo delete"
                          : "Mark for delete"}
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="caption text-tertiary new-album-photo-empty">
              No existing photos.
            </p>
          )}
        </div>

        <div className="stack-m">
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: "var(--charcoal-space-20)",
              flexWrap: "wrap",
            }}
          >
            <span className="field-label" style={{ marginBottom: 0 }}>
              Add photos
            </span>
            <Button
              type="button"
              variant="Default"
              size="S"
              onClick={addNewPhotoRow}
            >
              Add row
            </Button>
          </div>

          {newPhotos.length > 0 ? (
            <div className="stack-m">
              {newPhotos.map((photo) => (
                <div
                  key={photo.tempId}
                  className="surface-card"
                  style={{ padding: "var(--charcoal-space-25)" }}
                >
                  <div className="stack-m">
                    <input
                      type="file"
                      accept="image/*"
                      className="caption file-control"
                      onChange={(event) =>
                        updateNewPhoto(photo.tempId, {
                          image: event.target.files?.[0] ?? null,
                        })
                      }
                    />
                    {photo.image && (
                      <p
                        className="caption text-secondary"
                        style={{ margin: 0 }}
                      >
                        Selected: {photo.image.name}
                      </p>
                    )}
                    <TextField
                      label="Caption"
                      showLabel
                      value={photo.caption}
                      onChange={(value) =>
                        updateNewPhoto(photo.tempId, { caption: value })
                      }
                    />
                    <TextField
                      label="Display order"
                      showLabel
                      value={photo.displayOrder}
                      onChange={(value) =>
                        updateNewPhoto(photo.tempId, { displayOrder: value })
                      }
                    />
                    <div>
                      <Button
                        type="button"
                        variant="Danger"
                        size="S"
                        onClick={() => removeNewPhoto(photo.tempId)}
                      >
                        Remove row
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="caption text-tertiary new-album-photo-empty">
              No new photos queued.
            </p>
          )}
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
            {submitting ? "Updating..." : "Update Album"}
          </Button>
          <LinkButton href={`/albums/${albumId}`}>Cancel</LinkButton>
        </div>
      </form>
    </>
  );
}
