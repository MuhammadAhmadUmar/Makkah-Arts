"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BRAND_NAME, WHATSAPP_NUMBER } from "@/lib/constants";

export function Footer() {
  const pathname = usePathname();
  if (pathname.startsWith("/admin")) return null;

  return (
    <footer className="mt-auto border-t border-border bg-white">
      <div className="container-main grid gap-10 py-12 md:grid-cols-3">
        <div>
          <p className="font-serif text-xl">{BRAND_NAME}</p>
          <p className="mt-3 text-sm leading-relaxed text-muted">
            Premium 3-piece lawn suits crafted for the modern Pakistani woman.
            Authentic fabrics, timeless designs.
          </p>
        </div>

        <div>
          <p className="text-xs tracking-widest text-muted uppercase">Quick Links</p>
          <ul className="mt-4 space-y-2 text-sm">
            <li>
              <Link href="/shop" className="hover:text-accent">
                Shop All
              </Link>
            </li>
            <li>
              <Link href="/shop?availability=in_stock" className="hover:text-accent">
                In Stock
              </Link>
            </li>
            <li>
              <Link href="/checkout" className="hover:text-accent">
                Checkout
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <p className="text-xs tracking-widest text-muted uppercase">Contact</p>
          <ul className="mt-4 space-y-2 text-sm text-muted">
            <li>Pakistan — Nationwide Delivery</li>
            <li>
              <a
                href={`https://wa.me/${WHATSAPP_NUMBER}`}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-accent"
              >
                WhatsApp Orders
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-border py-4 text-center text-xs text-muted">
        © {new Date().getFullYear()} {BRAND_NAME}. All rights reserved.
      </div>
    </footer>
  );
}
