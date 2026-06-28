import Link from "next/link";
import Image from "next/image";

export function Hero() {
  return (
    <section className="relative min-h-[70vh] overflow-hidden bg-stone-900 text-white">
      <Image
        src="https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=1920&q=80"
        alt="Premium lawn suit collection by Makkah Arts"
        fill
        priority
        className="object-cover opacity-60"
        sizes="100vw"
      />
      <div className="relative container-main flex min-h-[70vh] flex-col justify-center py-20">
        <p className="text-xs tracking-[0.3em] text-white/80 uppercase">
          Premium Pakistani Fashion
        </p>
        <h1 className="mt-4 max-w-2xl font-serif text-5xl leading-tight sm:text-6xl lg:text-7xl">
          Timeless 3-Piece Lawn Suits
        </h1>
        <p className="mt-6 max-w-lg text-base leading-relaxed text-white/85">
          Discover curated lawn collections from Makkah Arts — authentic fabrics,
          elegant embroidery, and nationwide delivery across Pakistan.
        </p>
        <div className="mt-10 flex flex-wrap gap-4">
          <Link
            href="/shop"
            className="bg-white px-8 py-3 text-xs tracking-widest text-foreground uppercase transition hover:bg-accent hover:text-white"
          >
            Shop Collection
          </Link>
          <Link
            href="/shop?availability=in_stock"
            className="border border-white/60 px-8 py-3 text-xs tracking-widest uppercase transition hover:bg-white/10"
          >
            In Stock Now
          </Link>
        </div>
      </div>
    </section>
  );
}
