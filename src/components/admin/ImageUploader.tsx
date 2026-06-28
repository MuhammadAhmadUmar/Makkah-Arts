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

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError(null);

    const supabase = createClient();
    const ext = file.name.split(".").pop();
    const path = `${productId}/${Date.now()}.${ext}`;

    const { error: uploadError } = await supabase.storage
      .from("product-images")
      .upload(path, file);

    if (uploadError) {
      setError(uploadError.message);
      setUploading(false);
      return;
    }

    const {
      data: { publicUrl },
    } = supabase.storage.from("product-images").getPublicUrl(path);

    const result = await addProductImage(productId, publicUrl, file.name);
    if (result?.error) {
      setError(result.error);
    }

    setUploading(false);
    e.target.value = "";
  }

  return (
    <div>
      <label className="inline-block cursor-pointer border border-border bg-white px-4 py-2 text-sm hover:border-accent">
        {uploading ? "Uploading..." : "Upload Image"}
        <input
          type="file"
          accept="image/*"
          onChange={handleUpload}
          disabled={uploading}
          className="hidden"
        />
      </label>
      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
    </div>
  );
}
