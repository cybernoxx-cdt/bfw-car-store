"use client";

import { useEffect, useState } from "react";
import { Plus, GripVertical, Pencil, Trash2, Check, X, Loader2 } from "lucide-react";
import {
  getAllCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from "@/lib/firestore/categories";
import { ConfirmModal } from "@/components/shared/ConfirmModal";
import { EmptyState } from "@/components/shared/EmptyState";
import { useToast } from "@/hooks/useToast";
import type { Category } from "@/types";

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[] | null>(null);
  const [newName, setNewName] = useState("");
  const [adding, setAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState("");
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [pendingDelete, setPendingDelete] = useState<Category | null>(null);
  const [deleting, setDeleting] = useState(false);
  const { push } = useToast();

  const load = () => getAllCategories().then(setCategories);

  useEffect(() => {
    load();
  }, []);

  const handleAdd = async () => {
    if (!newName.trim() || !categories) return;
    setAdding(true);
    try {
      await createCategory(newName.trim(), categories.length);
      setNewName("");
      push("Category added.");
      load();
    } catch {
      push("Couldn't add the category.", "error");
    } finally {
      setAdding(false);
    }
  };

  const startEdit = (cat: Category) => {
    setEditingId(cat.id);
    setEditingName(cat.name);
  };

  const saveEdit = async () => {
    if (!editingId || !editingName.trim()) return;
    try {
      await updateCategory(editingId, { name: editingName.trim() });
      push("Category updated.");
      setEditingId(null);
      load();
    } catch {
      push("Couldn't update the category.", "error");
    }
  };

  const handleDrop = async (targetIndex: number) => {
    if (dragIndex === null || !categories || dragIndex === targetIndex) return;
    const next = [...categories];
    const [moved] = next.splice(dragIndex, 1);
    next.splice(targetIndex, 0, moved);
    setCategories(next);
    setDragIndex(null);
    try {
      await Promise.all(next.map((cat, i) => updateCategory(cat.id, { order: i })));
    } catch {
      push("Couldn't save the new order.", "error");
      load();
    }
  };

  const confirmDelete = async () => {
    if (!pendingDelete) return;
    setDeleting(true);
    try {
      await deleteCategory(pendingDelete.id);
      push("Category deleted.");
      setPendingDelete(null);
      load();
    } catch {
      push("Couldn't delete the category.", "error");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="mb-2 font-display text-2xl font-bold uppercase text-bone">Categories</h1>
      <p className="mb-8 text-sm text-bone-dim">
        Used to organize modifications — e.g. Exterior, Interior, Performance, Wheels.
      </p>

      <div className="mb-6 flex gap-3">
        <input
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleAdd()}
          placeholder="New category name…"
          className="flex-1 rounded-lg border border-white/10 bg-ink-900 px-3.5 py-2.5 text-sm text-bone placeholder:text-bone-dim/60 focus:border-ignition focus:outline-none"
        />
        <button
          onClick={handleAdd}
          disabled={adding || !newName.trim()}
          className="inline-flex items-center gap-2 rounded-lg bg-ignition px-4 py-2.5 text-xs font-semibold uppercase tracking-widest2 text-ink-900 disabled:opacity-50"
        >
          {adding ? <Loader2 size={14} className="animate-spin" /> : <Plus size={14} />} Add
        </button>
      </div>

      {categories === null ? (
        <p className="text-sm text-bone-dim">Loading…</p>
      ) : categories.length === 0 ? (
        <EmptyState title="No categories yet" description="Add your first modification category above." />
      ) : (
        <ul className="space-y-2">
          {categories.map((cat, i) => (
            <li
              key={cat.id}
              draggable
              onDragStart={() => setDragIndex(i)}
              onDragOver={(e) => e.preventDefault()}
              onDrop={() => handleDrop(i)}
              className="flex items-center gap-3 rounded-xl border border-white/10 bg-[#111114] px-4 py-3"
            >
              <span className="cursor-grab text-bone-dim active:cursor-grabbing"><GripVertical size={16} /></span>
              {editingId === cat.id ? (
                <>
                  <input
                    autoFocus
                    value={editingName}
                    onChange={(e) => setEditingName(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && saveEdit()}
                    className="flex-1 rounded-md border border-white/10 bg-ink-900 px-2.5 py-1.5 text-sm text-bone focus:border-ignition focus:outline-none"
                  />
                  <button onClick={saveEdit} className="text-signal-go" aria-label="Save"><Check size={16} /></button>
                  <button onClick={() => setEditingId(null)} className="text-bone-dim" aria-label="Cancel"><X size={16} /></button>
                </>
              ) : (
                <>
                  <span className="flex-1 text-sm text-bone">{cat.name}</span>
                  <button onClick={() => startEdit(cat)} className="text-bone-dim hover:text-ignition" aria-label="Edit"><Pencil size={15} /></button>
                  <button onClick={() => setPendingDelete(cat)} className="text-bone-dim hover:text-signal-stop" aria-label="Delete"><Trash2 size={15} /></button>
                </>
              )}
            </li>
          ))}
        </ul>
      )}

      <ConfirmModal
        open={Boolean(pendingDelete)}
        message={`Delete "${pendingDelete?.name}"? Modifications using this category will no longer be grouped correctly.`}
        loading={deleting}
        onConfirm={confirmDelete}
        onCancel={() => setPendingDelete(null)}
      />
    </div>
  );
}
