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
    const [photoFiles, setPhotoFiles] = useState<
        { file: File; caption: string }[]
    >([]);
    const [error, setError] = useState<string | null>(null);
    const [submitting, setSubmitting] = useState(false);

    function addPhotoFile(file: File | null) {
        if (file) setPhotoFiles((prev) => [...prev, { file, caption: "" }]);
    }

    function removePhotoFile(index: number) {
        setPhotoFiles((prev) => prev.filter((_, i) => i !== index));
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
        photoFiles.forEach(({ file, caption }, index) => {
            formData.append(`album[photos_attributes][${index}][image]`, file);
            formData.append(
                `album[photos_attributes][${index}][caption]`,
                caption,
            );
            formData.append(
                `album[photos_attributes][${index}][display_order]`,
                String(index),
            );
        });

        try {
            await createAlbum(formData);
            router.push("/");
        } catch (err) {
            setError(
                err instanceof Error ? err.message : "Failed to create album",
            );
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
                    <label className="field-label">Photos</label>
                    <div className="stack-m">
                        {photoFiles.length > 0 ? (
                            <div className="stack-m">
                                {photoFiles.map(({ file, caption }, index) => (
                                    <div
                                        key={`${file.name}-${index}`}
                                        className="new-album-photo-row"
                                    >
                                        <span className="caption text-secondary new-album-photo-name">
                                            {file.name}
                                        </span>
                                        <input
                                            type="text"
                                            placeholder="Caption"
                                            value={caption}
                                            onChange={(e) =>
                                                updatePhotoCaption(
                                                    index,
                                                    e.target.value,
                                                )
                                            }
                                            className="caption new-album-photo-caption"
                                        />
                                        <Button
                                            variant="Danger"
                                            size="S"
                                            type="button"
                                            onClick={() =>
                                                removePhotoFile(index)
                                            }
                                        >
                                            Remove
                                        </Button>
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
                    <Button
                        type="submit"
                        variant="Primary"
                        disabled={submitting}
                    >
                        {submitting ? "Creating..." : "Create Album"}
                    </Button>
                    <LinkButton href="/">Back to Albums</LinkButton>
                </div>
            </form>
        </>
    );
}
