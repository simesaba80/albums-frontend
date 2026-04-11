"use client";

type FileInputProps = {
  id: string;
  label: string;
  accept?: string;
  onChange: (file: File | null) => void;
};

export function FileInput({ id, label, accept, onChange }: FileInputProps) {
  return (
    <div>
      <label htmlFor={id} className="field-label">
        {label}
      </label>
      <input
        type="file"
        id={id}
        accept={accept}
        className="caption file-control"
        onChange={(e) => onChange(e.target.files?.[0] ?? null)}
      />
    </div>
  );
}
