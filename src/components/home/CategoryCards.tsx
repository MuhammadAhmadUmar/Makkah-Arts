import Link from "next/link";
import Image from "next/image";
import type { Category } from "@/types/database";

interface CategoryCardsProps {
  categories: Category[];
}

const fallbackImages = [
  "https://images.unsplash.com/photo-1581044777550-4cfa60707c03?w=600&q=80",
  "https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=600&q=80",
  "https://images.unsplash.com/photo-1612336307429-8a0d2184e985?w=600&q=80",
];

export function CategoryCards({ categories }: CategoryCardsProps) {
  if (!categories.length) return null;

  return (
    <section className="bg-white py-16 md:py-24">
      <div className="container-main">
        <p className="text-xs tracking-[0.25em] text-muted uppercase">
          Browse by Style
        </p>
        <h2 className="mt-2 font-serif text-3xl md:text-4xl">Categories</h2>

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((category, index) => (
            <Link
              key={category.id}
              href={`/category/${category.slug}`}
              className="group relative aspect-[4/5] overflow-hidden bg-stone-100"
            >
              <Image
                src={category.image_url ?? fallbackImages[index % fallbackImages.length]}
                alt={category.name}
                fill
                className="object-contain object-center transition duration-500 group-hover:scale-105"
                sizes="(max-width: 768px) 100vw, 33vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute right-0 bottom-0 left-0 p-6 text-white">
                <h3 className="font-serif text-2xl">{category.name}</h3>
                {category.description && (
                  <p className="mt-1 text-sm text-white/80">{category.description}</p>
                )}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
