import type { AvailabilityStatus } from "@/types/database";
import { AVAILABILITY_LABELS } from "@/lib/constants";

export function canAddToCart(
  status: AvailabilityStatus,
  stockQuantity: number,
): boolean {
  if (status === "coming_soon") return false;
  if (status === "pre_order") return true;
  return status === "in_stock" && stockQuantity > 0;
}

export function getAvailabilityLabel(
  status: AvailabilityStatus,
  stockQuantity: number,
): string {
  if (status === "in_stock" && stockQuantity <= 0) {
    return "Out of Stock";
  }
  return AVAILABILITY_LABELS[status];
}

export function getAvailabilityBadgeClass(
  status: AvailabilityStatus,
  stockQuantity: number,
): string {
  if (status === "in_stock" && stockQuantity > 0) {
    return "bg-emerald-50 text-emerald-800 border-emerald-200";
  }
  if (status === "pre_order") {
    return "bg-amber-50 text-amber-800 border-amber-200";
  }
  if (status === "coming_soon") {
    return "bg-stone-100 text-stone-600 border-stone-200";
  }
  return "bg-stone-100 text-stone-500 border-stone-200";
}

export function getPrimaryImageUrl(
  images: { url: string; sort_order: number }[],
): string | null {
  if (!images.length) return null;
  const sorted = [...images].sort((a, b) => a.sort_order - b.sort_order);
  return sorted[0]?.url ?? null;
}
