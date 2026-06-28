import { Hero } from "@/components/home/Hero";
import { FeaturedCollection } from "@/components/home/FeaturedCollection";
import { CategoryCards } from "@/components/home/CategoryCards";
import { WhyShopWithUs } from "@/components/home/WhyShopWithUs";
import { WhatsAppCTA } from "@/components/home/WhatsAppCTA";
import { Newsletter } from "@/components/home/Newsletter";
import {
  getCategories,
  getFeaturedProducts,
} from "@/lib/data/products";

export default async function HomePage() {
  const [featuredProducts, categories] = await Promise.all([
    getFeaturedProducts(),
    getCategories(),
  ]);

  return (
    <>
      <Hero />
      <FeaturedCollection products={featuredProducts} />
      <CategoryCards categories={categories} />
      <WhyShopWithUs />
      <WhatsAppCTA />
      <Newsletter />
    </>
  );
}
