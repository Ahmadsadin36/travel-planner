"use client";

import { useState } from "react";
import { createTrip } from "../actions";

export default function TripForm() {
  const [preview, setPreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleUpload(file: File) {
    setError(null);
    try {
      setUploading(true);
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Upload failed");
      setImageUrl(data.url); // public URL stored
    } catch (e: any) {
      setError(e.message ?? "Upload failed");
      setImageUrl(null);
      setPreview(null);
    } finally {
      setUploading(false);
    }
  }

  function onFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file); // instant preview
    setPreview(url);
    handleUpload(file); // upload in background
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    const form = e.currentTarget as HTMLFormElement; // capture before await!
    const fd = new FormData(form);
    if (imageUrl) fd.set("imageUrl", imageUrl);

    try {
      await createTrip(fd); // server action
      form.reset(); // safe now
      setPreview(null);
      setImageUrl(null);
    } catch (err: any) {
      setError(err.message ?? "Failed to create trip");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form className="space-y-4" onSubmit={onSubmit}>
      {/* Title */}
      <div className="form-control max-lg:flex max-lg:flex-col">
        <label className="label">
          <span className="label-text">Title *</span>
        </label>
        <input
          name="title"
          required
          className="input input-bordered rounded-md max-lg:w-full"
          placeholder="e.g., Rome Weekend"
        />
      </div>

      {/* Description (optional) */}
      <div className="form-control  max-lg:flex max-lg:flex-col">
        <label className="label">
          <span className="label-text">Description</span>
        </label>
        <textarea
          name="description"
          className="textarea textarea-bordered rounded-md max-lg:w-full"
          placeholder="(optional) short notes"
        />
      </div>

      {/* Dates */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="form-control max-lg:flex max-lg:flex-col">
          <label className="label">
            <span className="label-text">Start date *</span>
          </label>
          <input
            type="date"
            name="startDate"
            required
            className="input input-bordered rounded-md max-lg:w-full"
          />
        </div>
        <div className="form-control max-lg:flex max-lg:flex-col">
          <label className="label">
            <span className="label-text">End date *</span>
          </label>
          <input
            type="date"
            name="endDate"
            required
            className="input input-bordered rounded-md max-lg:w-full"
          />
        </div>
      </div>

      {/* Image upload (optional) */}
      <div className="form-control max-lg:flex max-lg:flex-col">
        <label className="label">
          <span className="label-text">Cover image (optional)</span>
        </label>
        <input
          type="file"
          accept="image/png,image/jpeg,image/webp"
          onChange={onFileChange}
          className="file-input file-input-bordered rounded-md"
        />
        {preview && (
          <div className="mt-3">
            <p className="text-sm opacity-70 mb-2">Preview</p>
            <img
              src={preview}
              alt="preview"
              className="w-full max-h-64 object-cover rounded-lg border"
            />
            {uploading ? (
              <p className="text-xs mt-2">Uploading…</p>
            ) : imageUrl ? (
              <p className="text-xs mt-2 text-success">Uploaded</p>
            ) : null}
          </div>
        )}
      </div>

      {/* Hidden image URL for server action */}
      <input type="hidden" name="imageUrl" value={imageUrl ?? ""} />

      {/* Submit */}
      <div className="flex items-center gap-2">
        <button
          className="btn btn-primary rounded-md"
          type="submit"
          disabled={uploading || submitting}
        >
          {submitting ? "Adding…" : "Add trip"}
        </button>
        {error && <span className="text-error text-sm">{error}</span>}
      </div>
    </form>
  );
}
