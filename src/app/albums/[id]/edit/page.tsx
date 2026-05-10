"use client";

import {
  IconArrowCcw,
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
  kind: "existing";
  id: number;
  imageUrl: string | null;
  caption: string;
  replacementImage: File | null;
  markedForDeletion: boolean;
};

type NewPhotoDraft = {
  kind: "new";
  tempId: string;
  image: File | null;
  caption: string;
};

type PhotoDraft = ExistingPhotoDraft | NewPhotoDraft;

function isOrderablePhoto(photo: PhotoDraft) {
  return photo.kind === "existing" ? !photo.markedForDeletion : !!photo.image;
}

function getPhotoDisplayOrder(photo: Photo) {
  return photo.display_order ?? Number.MAX_SAFE_INTEGER;
}

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
  const [photos, setPhotos] = useState<PhotoDraft[]>([]);
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

        const orderedPhotos = [...(album.photos ?? [])].sort((a, b) => {
          const orderDiff = getPhotoDisplayOrder(a) - getPhotoDisplayOrder(b);
          if (orderDiff !== 0) return orderDiff;
          return a.id - b.id;
        });

        setTitle(album.title ?? "");
        setDescription(album.description ?? "");
        setStatus(album.status);
        setCurrentCoverUrl(album.cover_image_url);
        setPhotos(
          orderedPhotos.map((photo) => ({
            kind: "existing" as const,
            id: photo.id,
            imageUrl: photo.image_url,
            caption: photo.caption ?? "",
            replacementImage: null,
            markedForDeletion: false,
          })),
        );
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
    patch: Partial<Omit<ExistingPhotoDraft, "id" | "kind">>,
  ) {
    setPhotos((prev) =>
      prev.map((photo) =>
        photo.kind === "existing" && photo.id === photoId
          ? { ...photo, ...patch }
          : photo,
      ),
    );
  }

  function addNewPhotoFile(file: File | null) {
    if (!file) return;

    setPhotos((prev) => [
      ...prev,
      {
        kind: "new" as const,
        tempId: `${file.name}-${file.lastModified}-${file.size}-${Date.now()}-${prev.length}`,
        image: file,
        caption: "",
      },
    ]);
  }

  function updateNewPhoto(
    tempId: string,
    patch: Partial<Omit<NewPhotoDraft, "tempId" | "kind">>,
  ) {
    setPhotos((prev) =>
      prev.map((photo) =>
        photo.kind === "new" && photo.tempId === tempId
          ? { ...photo, ...patch }
          : photo,
      ),
    );
  }

  function removeNewPhoto(tempId: string) {
    setPhotos((prev) =>
      prev.filter((photo) => photo.kind !== "new" || photo.tempId !== tempId),
    );
  }

  function movePhoto(index: number, direction: -1 | 1) {
    setPhotos((prev) => {
      const nextIndex = index + direction;
      if (nextIndex < 0 || nextIndex >= prev.length) return prev;

      const next = [...prev];
      [next[index], next[nextIndex]] = [next[nextIndex], next[index]];
      return next;
    });
  }

  function getPhotoPosition(index: number) {
    const photo = photos[index];
    if (!photo || !isOrderablePhoto(photo)) return null;

    let position = 0;
    for (let i = 0; i <= index; i += 1) {
      if (isOrderablePhoto(photos[i])) {
        position += 1;
      }
    }
    return position;
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
    // let photoAttributeIndex = 0;
    // let displayOrder = 0;
    //
    // photos.forEach((photo) => {
    //   const baseKey = `album[photos_attributes][${photoAttributeIndex}]`;
    //
    //   if (photo.kind === "existing") {
    //     formData.append(`${baseKey}[id]`, String(photo.id));
    //
    //     if (photo.markedForDeletion) {
    //       formData.append(`${baseKey}[_destroy]`, "1");
    //     } else {
    //       formData.append(`${baseKey}[caption]`, photo.caption);
    //       formData.append(`${baseKey}[display_order]`, String(displayOrder));
    //       if (photo.replacementImage) {
    //         formData.append(`${baseKey}[image]`, photo.replacementImage);
    //       }
    //       displayOrder += 1;
    //     }
    //
    //     photoAttributeIndex += 1;
    //     return;
    //   }
    //
    //   if (!photo.image) return;
    //
    //   formData.append(`${baseKey}[image]`, photo.image);
    //   formData.append(`${baseKey}[caption]`, photo.caption);
    //   formData.append(`${baseKey}[display_order]`, String(displayOrder));
    //   photoAttributeIndex += 1;
    //   displayOrder += 1;
    // });
    let displayOrder = 0;

    photos.forEach((photo) => {
      if (photo.kind === "existing") {
        if (photo.markedForDeletion) {
          formData.append("photos[destroy][][id]", String(photo.id));
          return;
        }

        formData.append("photos[update][][id]", String(photo.id));
        formData.append("photos[update][][caption]", photo.caption);
        formData.append(
          "photos[update][][display_order]",
          String(displayOrder),
        );
        if (photo.replacementImage) {
          formData.append("photos[update][][image]", photo.replacementImage);
        }
        displayOrder += 1;
        return;
      }

      if (!photo.image) return;

      formData.append("photos[create][][image]", photo.image);
      formData.append("photos[create][][caption]", photo.caption);
      formData.append("photos[create][][display_order]", String(displayOrder));
      displayOrder += 1;
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
          <span className="field-label" style={{ marginBottom: 0 }}>
            Photos
          </span>

          {photos.length > 0 ? (
            <div className="stack-m">
              {photos.map((photo, index) => {
                const position = getPhotoPosition(index);
                const positionLabel =
                  photo.kind === "existing" && photo.markedForDeletion
                    ? "Delete"
                    : position !== null
                      ? `#${position}`
                      : "New";
                const photoLabel =
                  photo.kind === "existing"
                    ? `photo ${photo.id}`
                    : (photo.image?.name ?? "new photo");

                if (photo.kind === "existing") {
                  return (
                    <div
                      key={`existing-${photo.id}`}
                      className={`surface-card photo-order-card${
                        photo.markedForDeletion ? " is-marked-for-deletion" : ""
                      }`}
                    >
                      <div className="photo-order-row photo-order-row-edit">
                        <span className="caption-s text-tertiary photo-order-index">
                          {positionLabel}
                        </span>
                        {photo.imageUrl ? (
                          <Image
                            src={photo.imageUrl}
                            alt={
                              photo.caption || `Photo ${position ?? index + 1}`
                            }
                            width={96}
                            height={96}
                            unoptimized
                            className="photo-order-thumbnail"
                          />
                        ) : (
                          <div className="surface-secondary text-tertiary caption photo-order-thumbnail photo-order-thumbnail-placeholder">
                            No image
                          </div>
                        )}
                        <div className="photo-order-fields stack-m">
                          <TextField
                            label="Caption"
                            showLabel
                            value={photo.caption}
                            onChange={(value) =>
                              updateExistingPhoto(photo.id, { caption: value })
                            }
                            disabled={photo.markedForDeletion}
                          />

                          <input
                            type="file"
                            accept="image/*"
                            className="caption file-control"
                            disabled={photo.markedForDeletion}
                            onChange={(event) =>
                              updateExistingPhoto(photo.id, {
                                replacementImage:
                                  event.target.files?.[0] ?? null,
                              })
                            }
                          />
                          {photo.replacementImage && (
                            <p className="caption text-secondary photo-order-selected-file">
                              Replacement: {photo.replacementImage.name}
                            </p>
                          )}
                        </div>

                        <div className="photo-order-actions">
                          <button
                            type="button"
                            className="photo-order-icon-button"
                            aria-label={`Move ${photoLabel} up`}
                            title="Move up"
                            disabled={index === 0}
                            onClick={() => movePhoto(index, -1)}
                          >
                            <IconArrowUp aria-hidden />
                          </button>
                          <button
                            type="button"
                            className="photo-order-icon-button"
                            aria-label={`Move ${photoLabel} down`}
                            title="Move down"
                            disabled={index === photos.length - 1}
                            onClick={() => movePhoto(index, 1)}
                          >
                            <IconArrowDown aria-hidden />
                          </button>
                          <button
                            type="button"
                            className={`photo-order-icon-button${
                              photo.markedForDeletion
                                ? ""
                                : " photo-order-icon-button-danger"
                            }`}
                            aria-label={
                              photo.markedForDeletion
                                ? `Undo delete ${photoLabel}`
                                : `Mark ${photoLabel} for delete`
                            }
                            title={
                              photo.markedForDeletion
                                ? "Undo delete"
                                : "Mark for delete"
                            }
                            onClick={() =>
                              updateExistingPhoto(photo.id, {
                                markedForDeletion: !photo.markedForDeletion,
                              })
                            }
                          >
                            {photo.markedForDeletion ? (
                              <IconArrowCcw aria-hidden />
                            ) : (
                              <IconDelete aria-hidden />
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                }

                return (
                  <div
                    key={`new-${photo.tempId}`}
                    className="surface-card photo-order-card"
                  >
                    <div className="photo-order-row photo-order-row-edit">
                      <span className="caption-s text-tertiary photo-order-index">
                        {positionLabel}
                      </span>
                      <div className="surface-secondary text-tertiary caption photo-order-thumbnail photo-order-thumbnail-placeholder">
                        {photo.image ? "Selected" : "No image"}
                      </div>
                      <div className="photo-order-fields stack-m">
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
                          <p className="caption text-secondary photo-order-selected-file">
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
                      </div>

                      <div className="photo-order-actions">
                        <button
                          type="button"
                          className="photo-order-icon-button"
                          aria-label={`Move ${photoLabel} up`}
                          title="Move up"
                          disabled={index === 0}
                          onClick={() => movePhoto(index, -1)}
                        >
                          <IconArrowUp aria-hidden />
                        </button>
                        <button
                          type="button"
                          className="photo-order-icon-button"
                          aria-label={`Move ${photoLabel} down`}
                          title="Move down"
                          disabled={index === photos.length - 1}
                          onClick={() => movePhoto(index, 1)}
                        >
                          <IconArrowDown aria-hidden />
                        </button>
                        <button
                          type="button"
                          className="photo-order-icon-button photo-order-icon-button-danger"
                          aria-label={`Remove ${photoLabel}`}
                          title="Remove"
                          onClick={() => removeNewPhoto(photo.tempId)}
                        >
                          <IconDelete aria-hidden />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="caption text-tertiary new-album-photo-empty">
              No photos queued.
            </p>
          )}

          <input
            type="file"
            accept="image/*"
            className="caption file-control"
            onChange={(event) => {
              addNewPhotoFile(event.target.files?.[0] ?? null);
              event.target.value = "";
            }}
          />
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
