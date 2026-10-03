"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { Upload, X, Loader2, ImageIcon, Film } from "lucide-react";
import { uploadToCloudinary, cldResponsive } from "@/lib/cloudinary";
import { recordMediaUpload } from "@/lib/firestore/media";
import { useToast } from "@/hooks/useToast";

interface BaseProps {
  label: string;
  folder: string;
  resourceType?: "image" | "video";
}

async function doUpload(
  file: File,
  folder: string,
  resourceType: "image" | "video",
  onProgress: (n: number) => void
) {
  const result = await uploadToCloudinary(file, { folder, resourceType, onProgress });
  await recordMediaUpload({
    url: result.url,
    publicId: result.publicId,
    resourceType: result.resourceType,
    folder,
  }).catch(() => {}); // media-library bookkeeping only — never block the form on this
  return result.url;
}

/** Single-asset uploader (hero image, logo, owner photo, background video…). */
export function MediaUploader({
  label,
  folder,
  resourceType = "image",
  value,
  onChange,
}: BaseProps & { value: string; onChange: (url: string) => void }) {
  const [progress, setProgress] = useState<number | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const { push } = useToast();

  const handleFile = async (file: File | undefined) => {
    if (!file) return;
    setProgress(0);
    try {
      const url = await doUpload(file, folder, resourceType, setProgress);
      onChange(url);
      push("Upload complete.", "success");
    } catch (err) {
      push(err instanceof Error ? err.message : "Upload failed.", "error");
    } finally {
      setProgress(null);
    }
  };

  return (
    <div>
      <p className="mb-2 text-xs font-semibold uppercase tracking-widest2 text-bone-dim">{label}</p>
      <div className="flex items-center gap-4">
        <div className="relative flex h-24 w-32 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-white/10 bg-ink-900">
          {value ? (
            resourceType === "video" ? (
              <video src={value} className="h-full w-full object-cover" muted />
            ) : (
              <Image src={cldResponsive(value, 300)} alt={label} fill className="object-cover" />
            )
          ) : resourceType === "video" ? (
            <Film size={20} className="text-bone-dim" />
          ) : (
            <ImageIcon size={20} className="text-bone-dim" />
          )}
        </div>

        <div className="flex flex-1 flex-col gap-2">
          <input
            ref={inputRef}
            type="file"
            accept={resourceType === "video" ? "video/*" : "image/*"}
            className="hidden"
            onChange={(e) => handleFile(e.target.files?.[0])}
          />
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              disabled={progress !== null}
              className="inline-flex items-center gap-2 rounded-lg border border-white/15 px-4 py-2 text-xs font-semibold uppercase tracking-widest2 text-bone transition-colors hover:bg-white/5 disabled:opacity-50"
            >
              {progress !== null ? <Loader2 size={14} className="animate-spin" /> : <Upload size={14} />}
              {progress !== null ? `Uploading ${progress}%` : value ? "Replace" : "Upload"}
            </button>
            {value && (
              <button
                type="button"
                onClick={() => onChange("")}
                className="inline-flex items-center gap-1.5 rounded-lg border border-white/15 px-3 py-2 text-xs font-semibold uppercase tracking-widest2 text-bone-dim hover:text-signal-stop"
              >
                <X size={13} /> Remove
              </button>
            )}
          </div>
          {progress !== null && (
            <div className="h-1 w-full max-w-[200px] overflow-hidden rounded-full bg-white/10">
              <div className="h-full bg-ignition transition-all" style={{ width: `${progress}%` }} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/** Multi-image uploader for gallery arrays. */
export function MultiImageUploader({
  label,
  folder,
  value,
  onChange,
}: BaseProps & { value: string[]; onChange: (urls: string[]) => void }) {
  const [progress, setProgress] = useState<number | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const { push } = useToast();

  const handleFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setProgress(0);
    try {
      const urls: string[] = [];
      for (let i = 0; i < files.length; i++) {
        const url = await doUpload(files[i], folder, "image", (p) =>
          setProgress(Math.round(((i + p / 100) / files.length) * 100))
        );
        urls.push(url);
      }
      onChange([...value, ...urls]);
      push(`${urls.length} image${urls.length > 1 ? "s" : ""} uploaded.`, "success");
    } catch (err) {
      push(err instanceof Error ? err.message : "Upload failed.", "error");
    } finally {
      setProgress(null);
    }
  };

  const removeAt = (index: number) => onChange(value.filter((_, i) => i !== index));

  return (
    <div>
      <p className="mb-2 text-xs font-semibold uppercase tracking-widest2 text-bone-dim">{label}</p>
      <div className="flex flex-wrap gap-3">
        {value.map((url, i) => (
          <div key={url + i} className="relative h-24 w-32 overflow-hidden rounded-lg border border-white/10 bg-ink-900">
            <Image src={cldResponsive(url, 300)} alt="" fill className="object-cover" />
            <button
              type="button"
              onClick={() => removeAt(i)}
              className="absolute right-1 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-black/60 text-bone"
              aria-label="Remove image"
            >
              <X size={12} />
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={progress !== null}
          className="flex h-24 w-32 flex-col items-center justify-center gap-1 rounded-lg border border-dashed border-white/20 text-bone-dim transition-colors hover:border-ignition hover:text-ignition disabled:opacity-50"
        >
          {progress !== null ? <Loader2 size={16} className="animate-spin" /> : <Upload size={16} />}
          <span className="text-[10px] font-semibold uppercase tracking-widest2">
            {progress !== null ? `${progress}%` : "Add"}
          </span>
        </button>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={(e) => handleFiles(e.target.files)}
        />
      </div>
    </div>
  );
}
