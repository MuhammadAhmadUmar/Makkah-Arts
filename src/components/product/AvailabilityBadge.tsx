import type { AvailabilityStatus } from "@/types/database";
import {
  getAvailabilityBadgeClass,
  getAvailabilityLabel,
} from "@/lib/utils/product";

interface AvailabilityBadgeProps {
  status: AvailabilityStatus;
  stockQuantity: number;
}

export function AvailabilityBadge({
  status,
  stockQuantity,
}: AvailabilityBadgeProps) {
  return (
    <span
      className={`inline-block border px-3 py-1 text-xs tracking-wide uppercase ${getAvailabilityBadgeClass(status, stockQuantity)}`}
    >
      {getAvailabilityLabel(status, stockQuantity)}
    </span>
  );
}
