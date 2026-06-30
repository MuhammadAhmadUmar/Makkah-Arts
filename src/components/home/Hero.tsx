import Link from "next/link";
import Image from "next/image";

export function Hero() {
  return (
    <section className="relative overflow-hidden border-b border-border bg-stone-900 text-white">
      <Image
        src="https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=1920&q=80"
        alt="Premium lawn suit collection by Makkah Arts"
        fill
        priority
        className="object-cover opacity-60"
        sizes="100vw"
      />
      <div className="absolute inset-0 bg-black/35" />
      <div className="relative container-main grid min-h-[78vh] items-end gap-10 py-16 md:py-24 lg:grid-cols-[1.05fr_0.95fr] lg:py-28">
        <div className="max-w-2xl">
          <p className="text-[11px] uppercase tracking-[0.35em] text-white/80">
            Premium Pakistani Fashion
          </p>
          <h1 className="mt-4 max-w-2xl text-5xl leading-[0.95] sm:text-6xl lg:text-7xl">
            Graceful 3-Piece Lawn Suits
          </h1>
          <p className="mt-6 max-w-lg text-base leading-relaxed text-white/85">
            Discover curated lawn collections from Makkah Arts — authentic fabrics,
            elegant embroidery, and nationwide delivery across Pakistan.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              href="/shop"
              className="relative inline-flex items-center justify-center overflow-hidden rounded-full bg-gradient-to-r from-white via-slate-100 to-slate-200 px-8 py-3 text-[11px] font-medium tracking-[0.3em] text-foreground uppercase shadow-[0_16px_45px_rgba(255,255,255,0.18)] transition duration-300 hover:text-white shaky-button"
            >
              <span className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.5),transparent_40%)] opacity-70" />
              <span className="relative">Shop Collection</span>
            </Link>
            <Link
              href="/shop?availability=in_stock"
              className="rounded-full border border-white/70 px-8 py-3 text-[11px] font-medium tracking-[0.3em] uppercase transition hover:bg-white/10"
            >
              In Stock Now
            </Link>
          </div>
        </div>

        <div className="justify-self-start rounded-[2rem] border border-white/20 bg-black/20 p-5 backdrop-blur-sm sm:max-w-md lg:justify-self-end">
          <p className="text-[11px] uppercase tracking-[0.35em] text-white/80">
            Curated for the season
          </p>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <div className="rounded-[1.25rem] border border-white/15 bg-white/10 p-4">
              <p className="text-2xl font-semibold text-white">01</p>
              <p className="mt-2 text-sm text-white/80">Thoughtfully designed essentials</p>
            </div>
            <div className="rounded-[1.25rem] border border-white/15 bg-white/10 p-4">
              <p className="text-2xl font-semibold text-white">02</p>
              <p className="mt-2 text-sm text-white/80">Premium finishes and refined textures</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
