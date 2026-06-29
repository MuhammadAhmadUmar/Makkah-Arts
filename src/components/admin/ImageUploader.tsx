"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { addProductImage } from "@/app/admin/actions";

interface ImageUploaderProps {
  productId: string;
}

export function ImageUploader({ productId }: ImageUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    if (!files.length) return;

    setUploading(true);
    setError(null);
    setMessage(null);

    const supabase = createClient();
    const bucket = supabase.storage.from("product-images");

    try {
      for (const [index, file] of files.entries()) {
        const ext = file.name.split(".").pop() ?? "jpg";
        const path = `${productId}/${Date.now()}-${index}.${ext}`;

        const { error: uploadError } = await bucket.upload(path, file, {
          cacheControl: "3600",
          upsert: false,
        });

        if (uploadError) {
          throw new Error(uploadError.message);
        }

        const {
          data: { publicUrl },
        } = bucket.getPublicUrl(path);

        const result = await addProductImage(productId, publicUrl, file.name, index);
        if (result?.error) {
          throw new Error(result.error);
        }
      }

      setMessage(`${files.length} image${files.length > 1 ? "s" : ""} uploaded successfully.`);
    } catch (uploadError) {
      setError(uploadError instanceof Error ? uploadError.message : "Unable to upload image(s).");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  }

  return (
    <div>
      <label className="inline-block cursor-pointer border border-border bg-white px-4 py-2 text-sm hover:border-accent">
        {uploading ? "Uploading..." : "Upload Images"}
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={handleUpload}
          disabled={uploading}
          className="hidden"
        />
      </label>
      <p className="mt-2 text-xs text-muted">You can select multiple images at once.</p>
      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
      {message && <p className="mt-2 text-sm text-emerald-700">{message}</p>}
    </div>
  );
}
