import type { ProductWithRelations } from "@/types/database";
import { buildProductWhatsAppMessage, buildWhatsAppUrl } from "@/lib/utils/whatsapp";

interface WhatsAppOrderButtonProps {
  product: ProductWithRelations;
}

export function WhatsAppOrderButton({ product }: WhatsAppOrderButtonProps) {
  const message = buildProductWhatsAppMessage(
    product.title,
    product.slug,
    product.price,
  );
  const url = buildWhatsAppUrl(message);

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="flex w-full items-center justify-center gap-2 border border-[#25D366] py-4 text-sm tracking-widest text-[#25D366] uppercase transition hover:bg-[#25D366] hover:text-white"
    >
      Order on WhatsApp
    </a>
  );
}
