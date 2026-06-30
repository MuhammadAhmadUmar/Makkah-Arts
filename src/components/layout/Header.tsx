"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BRAND_NAME } from "@/lib/constants";
import { CartButton } from "@/components/cart/CartButton";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/shop", label: "Shop" },
];

export function Header() {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith("/admin");

  if (isAdmin) return null;

  return (
    <header className="sticky top-0 z-40 border-b border-border/80 bg-background/95 backdrop-blur-xl">
      <div className="container-main flex h-14 items-center justify-between gap-4 sm:h-15">
        <div className="flex items-center gap-2">
          <Link href="/" className="font-serif text-xl tracking-[0.08em] text-foreground sm:text-2xl">
            {BRAND_NAME}
          </Link>
        </div>

        <nav className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-sm tracking-[0.24em] transition-colors hover:text-accent ${
                pathname === link.href ? "text-accent" : "text-foreground"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2 sm:gap-3">
          <CartButton />
          <Link
            href="/shop"
            className="hidden rounded-full border border-foreground/80 bg-foreground px-5 py-2 text-[11px] font-medium tracking-[0.28em] text-background uppercase transition hover:bg-transparent hover:text-foreground sm:inline-flex"
          >
            Shop Now
          </Link>
        </div>
      </div>
    </header>
  );
}
