import type { Photo } from "@/lib/types";

type Props = {
  photo: Photo;
};

export function PhotoCard({ photo }: Props) {
  if (!photo.image_url) return null;

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "var(--charcoal-space-10)",
        width: 200,
      }}
    >
      {/* biome-ignore lint/performance/noImgElement: 外部URLのため next/image は使用しない */}
      <img
        src={photo.image_url}
        alt={photo.caption ?? ""}
        style={{
          width: 200,
          height: 200,
          objectFit: "cover",
          borderRadius: "var(--charcoal-radius-m)",
          display: "block",
        }}
      />
      {photo.caption && (
        <p className="caption text-secondary" style={{ margin: 0 }}>
          {photo.caption}
        </p>
      )}
    </div>
  );
}
