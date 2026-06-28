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
    <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur-sm">
      <div className="container-main flex h-16 items-center justify-between">
        <Link href="/" className="font-serif text-2xl tracking-wide text-foreground">
          {BRAND_NAME}
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-sm tracking-wide transition-colors hover:text-accent ${
                pathname === link.href ? "text-accent" : "text-foreground"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-4">
          <CartButton />
          <Link
            href="/shop"
            className="hidden rounded-none border border-foreground bg-foreground px-5 py-2 text-xs tracking-widest text-background uppercase transition hover:bg-transparent hover:text-foreground sm:inline-block"
          >
            Shop Now
          </Link>
        </div>
      </div>
    </header>
  );
}
