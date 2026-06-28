import Link from "next/link";

export default function NotFound() {
  return (
    <div className="container-main py-24 text-center">
      <h1 className="font-serif text-5xl">404</h1>
      <p className="mt-4 text-muted">This page could not be found.</p>
      <Link
        href="/shop"
        className="mt-8 inline-block bg-foreground px-8 py-3 text-xs tracking-widest text-background uppercase"
      >
        Back to Shop
      </Link>
    </div>
  );
}
