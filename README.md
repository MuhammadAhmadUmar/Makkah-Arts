# Makkah Arts — Premium Lawn Suits Ecommerce

Production-grade MVP ecommerce website for **Makkah Arts**, selling premium 3-piece lawn suits in Pakistan.

## Tech Stack

- **Next.js 16** (App Router) + TypeScript
- **Tailwind CSS v4**
- **Supabase** (PostgreSQL + Storage + Auth)
- **Vercel** deployment
- **Zustand** cart (localStorage)
- **Zod** validation

## Features

- Homepage with hero, featured collection, categories, trust section, WhatsApp CTA, newsletter
- Shop with search, filters (price, category, availability, color), sorting
- Product detail pages with JSON-LD, OpenGraph, gallery, honest availability badges
- Cart drawer + checkout (COD, EasyPaisa, bank transfer, WhatsApp — no payment gateway)
- Protected admin dashboard (products CRUD, image upload, orders)
- SEO: sitemap, robots.txt, canonical URLs, dynamic metadata
- Google Analytics 4 ready

## Local Setup

### 1. Clone and install

```bash
cd lawn-suits-pk
npm install
```

### 2. Environment variables

```bash
cp .env.local.example .env.local
```

Fill in your values:

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_SITE_URL` | `http://localhost:3000` locally |
| `NEXT_PUBLIC_SUPABASE_URL` | From Supabase project settings |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | From Supabase project settings |
| `SUPABASE_SERVICE_ROLE_KEY` | For checkout order inserts (server only) |
| `NEXT_PUBLIC_GA_ID` | Google Analytics 4 measurement ID |
| `NEXT_PUBLIC_GSC_VERIFICATION` | Google Search Console verification code |
| `NEXT_PUBLIC_WHATSAPP_NUMBER` | e.g. `923001234567` |
| `NEXT_PUBLIC_EASYPAISA_NUMBER` | Shown on checkout confirmation |
| `NEXT_PUBLIC_BANK_DETAILS` | Shown on checkout confirmation |
| `NEXT_PUBLIC_BRAND_NAME` | `Makkah Arts` |

### 3. Supabase setup

1. Create a free project at [supabase.com](https://supabase.com)
2. Open **SQL Editor** and run [`supabase/migrations/001_initial_schema.sql`](supabase/migrations/001_initial_schema.sql)
3. Optionally run [`supabase/seed.sql`](supabase/seed.sql) for sample categories
4. Create a **Storage** bucket named `product-images` (public)
5. Add storage policies (SQL Editor):

```sql
CREATE POLICY "Public read product images"
ON storage.objects FOR SELECT
USING (bucket_id = 'product-images');

CREATE POLICY "Auth upload product images"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'product-images' AND auth.role() = 'authenticated');

CREATE POLICY "Auth delete product images"
ON storage.objects FOR DELETE
USING (bucket_id = 'product-images' AND auth.role() = 'authenticated');
```

6. Create an admin user: **Authentication → Users → Add user** (email + password)

### 4. Run locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

Admin: [http://localhost:3000/admin/login](http://localhost:3000/admin/login)

### 5. Verify production build

```bash
npm run build
npm start
```

## Deployment (Vercel)

1. Push to GitHub
2. Import repo at [vercel.com](https://vercel.com)
3. Add all environment variables (Production + Preview)
4. Deploy
5. In Supabase → **Authentication → URL Configuration**, add:
   - Site URL: `https://yourdomain.com`
   - Redirect URLs: `https://yourdomain.com/**`
6. Connect custom domain in Vercel
7. Submit `https://yourdomain.com/sitemap.xml` to Google Search Console

## Project Structure

```
src/
├── app/                  # Pages and routes
│   ├── admin/            # Protected admin dashboard
│   ├── shop/             # Product listing
│   ├── product/[slug]/   # Product detail
│   ├── category/[slug]/  # Category listing
│   └── checkout/         # Order form
├── components/           # UI components
├── lib/                  # Supabase, cart, utils, data
└── types/                # TypeScript types
supabase/
├── migrations/           # Database schema
└── seed.sql              # Sample categories
```

## Availability Rules

| Status | Badge | Add to Cart |
|--------|-------|-------------|
| In Stock + qty > 0 | In Stock | Yes |
| Pre-order | Pre-order | Yes |
| Coming Soon | Coming Soon | No (WhatsApp only) |

Stock is never faked — availability reflects real inventory.

## URLs

| Path | Description |
|------|-------------|
| `/` | Homepage |
| `/shop` | All products |
| `/product/[slug]` | Product detail |
| `/category/[slug]` | Category products |
| `/checkout` | Checkout form |
| `/admin` | Admin dashboard |

## License

Private — Makkah Arts
