"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useState } from "react";
import type { Category } from "@/types/database";
import { AVAILABILITY_LABELS, SORT_OPTIONS } from "@/lib/constants";

interface ShopFiltersProps {
  categories: Category[];
  colors: string[];
}

export function ShopFilters({ categories, colors }: ShopFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(searchParams.get("q") ?? "");

  const updateParams = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
      router.push(`/shop?${params.toString()}`);
    },
    [router, searchParams],
  );

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    updateParams("q", query.trim());
  }

  return (
    <aside className="space-y-6">
      <form onSubmit={handleSearch}>
        <label htmlFor="search" className="text-xs tracking-widest text-muted uppercase">
          Search
        </label>
        <div className="mt-2 flex gap-2">
          <input
            id="search"
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search suits..."
            className="w-full border border-border bg-white px-3 py-2 text-sm outline-none focus:border-accent"
          />
          <button
            type="submit"
            className="bg-foreground px-4 py-2 text-xs text-background uppercase"
          >
            Go
          </button>
        </div>
      </form>

      <div>
        <label htmlFor="sort" className="text-xs tracking-widest text-muted uppercase">
          Sort
        </label>
        <select
          id="sort"
          value={searchParams.get("sort") ?? "newest"}
          onChange={(e) => updateParams("sort", e.target.value === "newest" ? "" : e.target.value)}
          className="mt-2 w-full border border-border bg-white px-3 py-2 text-sm outline-none"
        >
          {SORT_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <p className="text-xs tracking-widest text-muted uppercase">Category</p>
        <div className="mt-2 space-y-2">
          <button
            type="button"
            onClick={() => updateParams("category", "")}
            className={`block text-sm ${!searchParams.get("category") ? "text-accent" : "text-foreground"}`}
          >
            All
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => updateParams("category", cat.slug)}
              className={`block text-sm ${searchParams.get("category") === cat.slug ? "text-accent" : "text-foreground"}`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      <div>
        <p className="text-xs tracking-widest text-muted uppercase">Availability</p>
        <div className="mt-2 space-y-2">
          <button
            type="button"
            onClick={() => updateParams("availability", "")}
            className={`block text-sm ${!searchParams.get("availability") ? "text-accent" : "text-foreground"}`}
          >
            All
          </button>
          {Object.entries(AVAILABILITY_LABELS).map(([value, label]) => (
            <button
              key={value}
              type="button"
              onClick={() => updateParams("availability", value)}
              className={`block text-sm ${searchParams.get("availability") === value ? "text-accent" : "text-foreground"}`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {colors.length > 0 && (
        <div>
          <p className="text-xs tracking-widest text-muted uppercase">Color</p>
          <div className="mt-2 space-y-2">
            <button
              type="button"
              onClick={() => updateParams("color", "")}
              className={`block text-sm ${!searchParams.get("color") ? "text-accent" : "text-foreground"}`}
            >
              All
            </button>
            {colors.map((color) => (
              <button
                key={color}
                type="button"
                onClick={() => updateParams("color", color)}
                className={`block text-sm ${searchParams.get("color") === color ? "text-accent" : "text-foreground"}`}
              >
                {color}
              </button>
            ))}
          </div>
        </div>
      )}

      <div>
        <p className="text-xs tracking-widest text-muted uppercase">Price (PKR)</p>
        <div className="mt-2 flex gap-2">
          <input
            type="number"
            placeholder="Min"
            defaultValue={searchParams.get("min") ?? ""}
            onBlur={(e) => updateParams("min", e.target.value)}
            className="w-full border border-border bg-white px-3 py-2 text-sm outline-none"
          />
          <input
            type="number"
            placeholder="Max"
            defaultValue={searchParams.get("max") ?? ""}
            onBlur={(e) => updateParams("max", e.target.value)}
            className="w-full border border-border bg-white px-3 py-2 text-sm outline-none"
          />
        </div>
      </div>
    </aside>
  );
}
