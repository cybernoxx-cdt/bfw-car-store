"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { Upload, Loader2, Copy, Trash2, Check } from "lucide-react";
import { getAllMedia, deleteMediaRecord, recordMediaUpload } from "@/lib/firestore/media";
import { uploadToCloudinary, cldResponsive } from "@/lib/cloudinary";
import { ConfirmModal } from "@/components/shared/ConfirmModal";
import { EmptyState } from "@/components/shared/EmptyState";
import { useToast } from "@/hooks/useToast";
import type { MediaItem } from "@/types";

const FOLDERS = ["cars", "modifications", "modifications/overlays", "hero", "about", "branding"];

export default function MediaLibraryPage() {
  const [items, setItems] = useState<MediaItem[] | null>(null);
  const [folderFilter, setFolderFilter] = useState("");
  const [uploadFolder, setUploadFolder] = useState("branding");
  const [uploading, setUploading] = useState<number | null>(null);
  const [pendingDelete, setPendingDelete] = useState<MediaItem | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const { push } = useToast();

  const load = () => getAllMedia().then(setItems);

  useEffect(() => {
    load();
  }, []);

  const filtered = useMemo(() => {
    if (!items) return [];
    if (!folderFilter) return items;
    return items.filter((i) => i.folder === folderFilter);
  }, [items, folderFilter]);

  const handleUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setUploading(0);
    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const resourceType = file.type.startsWith("video") ? "video" : "image";
        const result = await uploadToCloudinary(file, {
          folder: uploadFolder,
          resourceType,
          onProgress: (p) => setUploading(Math.round(((i + p / 100) / files.length) * 100)),
        });
        await recordMediaUpload({ url: result.url, publicId: result.publicId, resourceType: result.resourceType, folder: uploadFolder });
      }
      push("Upload complete.");
      load();
    } catch (err) {
      push(err instanceof Error ? err.message : "Upload failed.", "error");
    } finally {
      setUploading(null);
    }
  };

  const copyUrl = (item: MediaItem) => {
    navigator.clipboard?.writeText(item.url).then(() => {
      setCopiedId(item.id);
      setTimeout(() => setCopiedId(null), 1500);
    });
  };

  const confirmDelete = async () => {
    if (!pendingDelete) return;
    setDeleting(true);
    try {
      await deleteMediaRecord(pendingDelete.id);
      push("Media record deleted. (The file remains on Cloudinary unless removed there too.)");
      setPendingDelete(null);
      load();
    } catch {
      push("Couldn't delete the record.", "error");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div>
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold uppercase text-bone">Media Library</h1>
          <p className="text-sm text-bone-dim">Everything uploaded to Cloudinary across the admin panel.</p>
        </div>
        <div className="flex items-center gap-2">
          <select
            value={uploadFolder}
            onChange={(e) => setUploadFolder(e.target.value)}
            className="rounded-lg border border-white/10 bg-ink-900 px-3 py-2.5 text-sm text-bone focus:border-ignition focus:outline-none"
          >
            {FOLDERS.map((f) => <option key={f} value={f}>{f}</option>)}
          </select>
          <input ref={inputRef} type="file" multiple accept="image/*,video/*" className="hidden" onChange={(e) => handleUpload(e.target.files)} />
          <button
            onClick={() => inputRef.current?.click()}
            disabled={uploading !== null}
            className="inline-flex items-center gap-2 rounded-lg bg-ignition px-4 py-2.5 text-xs font-semibold uppercase tracking-widest2 text-ink-900 disabled:opacity-60"
          >
            {uploading !== null ? <Loader2 size={14} className="animate-spin" /> : <Upload size={14} />}
            {uploading !== null ? `${uploading}%` : "Upload"}
          </button>
        </div>
      </div>

      <div className="mb-6 flex flex-wrap gap-2">
        <button
          onClick={() => setFolderFilter("")}
          className={`rounded-full border px-3 py-1.5 text-xs font-medium ${!folderFilter ? "border-ignition bg-ignition/10 text-ignition" : "border-white/15 text-bone-dim"}`}
        >
          All
        </button>
        {FOLDERS.map((f) => (
          <button
            key={f}
            onClick={() => setFolderFilter(f)}
            className={`rounded-full border px-3 py-1.5 text-xs font-medium ${folderFilter === f ? "border-ignition bg-ignition/10 text-ignition" : "border-white/15 text-bone-dim"}`}
          >
            {f}
          </button>
        ))}
      </div>

      {items === null ? (
        <p className="text-sm text-bone-dim">Loading…</p>
      ) : filtered.length === 0 ? (
        <EmptyState title="No media yet" description="Upload an image or video above to add it to the library." />
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {filtered.map((item) => (
            <div key={item.id} className="group relative overflow-hidden rounded-xl border border-white/10 bg-[#111114]">
              <div className="relative aspect-square bg-ink-900">
                {item.resourceType === "video" ? (
                  <video src={item.url} className="h-full w-full object-cover" muted />
                ) : (
                  <Image src={cldResponsive(item.url, 300)} alt="" fill className="object-cover" />
                )}
              </div>
              <div className="flex items-center justify-between gap-1 p-2">
                <span className="truncate text-[10px] text-bone-dim">{item.folder}</span>
                <div className="flex shrink-0 gap-1">
                  <button onClick={() => copyUrl(item)} aria-label="Copy URL" className="text-bone-dim hover:text-ignition">
                    {copiedId === item.id ? <Check size={14} /> : <Copy size={14} />}
                  </button>
                  <button onClick={() => setPendingDelete(item)} aria-label="Delete" className="text-bone-dim hover:text-signal-stop">
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <ConfirmModal
        open={Boolean(pendingDelete)}
        message="Remove this item from the media library? This only deletes the record — delete the asset in your Cloudinary dashboard too if you want it fully removed."
        loading={deleting}
        onConfirm={confirmDelete}
        onCancel={() => setPendingDelete(null)}
      />
    </div>
  );
}
