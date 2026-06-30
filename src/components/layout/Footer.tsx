"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BRAND_NAME, WHATSAPP_NUMBER } from "@/lib/constants";

export function Footer() {
  const pathname = usePathname();
  if (pathname.startsWith("/admin")) return null;

  return (
    <footer className="mt-auto border-t border-border bg-background">
      <div className="container-main grid gap-10 py-14 md:grid-cols-[1.2fr_0.7fr_0.8fr] md:py-16 lg:gap-12">
        <div>
          <p className="font-serif text-2xl tracking-[0.12em]">{BRAND_NAME}</p>
          <p className="mt-4 max-w-md text-sm leading-relaxed text-muted">
            Premium 3-piece lawn suits crafted for the modern Pakistani woman.
            Authentic fabrics, timeless designs, and refined elegance.
          </p>
        </div>

        <div>
          <p className="text-[11px] uppercase tracking-[0.35em] text-muted">Quick Links</p>
          <ul className="mt-4 space-y-2 text-sm">
            <li>
              <Link href="/shop" className="transition hover:text-accent">
                Shop All
              </Link>
            </li>
            <li>
              <Link href="/shop?availability=in_stock" className="transition hover:text-accent">
                In Stock
              </Link>
            </li>
            <li>
              <Link href="/checkout" className="transition hover:text-accent">
                Checkout
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <p className="text-[11px] uppercase tracking-[0.35em] text-muted">Contact</p>
          <ul className="mt-4 space-y-2 text-sm text-muted">
            <li>Pakistan — Nationwide Delivery</li>
            <li>
              <a
                href={`https://wa.me/${WHATSAPP_NUMBER}`}
                target="_blank"
                rel="noopener noreferrer"
                className="transition hover:text-accent"
              >
                WhatsApp Orders
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-border py-4 text-center text-xs uppercase tracking-[0.28em] text-muted">
        © {new Date().getFullYear()} {BRAND_NAME}. All rights reserved.
      </div>
    </footer>
  );
}
