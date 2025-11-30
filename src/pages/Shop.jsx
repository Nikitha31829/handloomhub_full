// src/pages/Shop.jsx
import { useMemo, useState } from "react";
import { products } from "../data/products";
import ProductCard from "../components/ProductCard";

export default function Shop() {
  // ---------- derive filter options from product data ----------

  // Product type (fallback to category if you don’t have type)
  const types = useMemo(
    () =>
      Array.from(
        new Set(
          products
            .map(
              (p) =>
                p.type ||
                p.productType ||
                p.kind ||
                p.category // fallback
            )
            .filter(Boolean)
        )
      ),
    []
  );

  const categories = useMemo(
    () =>
      Array.from(
        new Set(products.map((p) => p.category).filter(Boolean))
      ),
    []
  );

  const materials = useMemo(
    () =>
      Array.from(
        new Set(products.map((p) => p.material).filter(Boolean))
      ),
    []
  );

  const regions = useMemo(
    () =>
      Array.from(
        new Set(products.map((p) => p.region).filter(Boolean))
      ),
    []
  );

  const priceMin = useMemo(
    () =>
      Math.min(
        ...products.map((p) => (typeof p.price === "number" ? p.price : 0))
      ),
    []
  );

  const priceMax = useMemo(
    () =>
      Math.max(
        ...products.map((p) => (typeof p.price === "number" ? p.price : 0))
      ),
    []
  );

  // ---------- local filter state ----------
  const [search, setSearch] = useState("");
  const [type, setType] = useState("");          // NEW
  const [category, setCategory] = useState("");
  const [material, setMaterial] = useState("");
  const [region, setRegion] = useState("");
  const [minPrice, setMinPrice] = useState(priceMin);
  const [maxPrice, setMaxPrice] = useState(priceMax);
  const [minRating, setMinRating] = useState(0);
  const [sortBy, setSortBy] = useState("recommended");

  // ---------- apply filters + sort ----------
  const filtered = useMemo(() => {
    let list = [...products];

    const q = search.trim().toLowerCase();

    if (q) {
      list = list.filter((p) => {
        const text =
          `${p.title ?? ""} ${p.vendor ?? ""} ${
            p.category ?? ""
          } ${p.material ?? ""}`.toLowerCase();
        return text.includes(q);
      });
    }

    // Type filter
    if (type) {
      list = list.filter((p) => {
        const t =
          p.type || p.productType || p.kind || p.category;
        return t === type;
      });
    }

    if (category) {
      list = list.filter((p) => p.category === category);
    }

    if (material) {
      list = list.filter((p) => p.material === material);
    }

    if (region) {
      list = list.filter((p) => p.region === region);
    }

    list = list.filter((p) => {
      const price = typeof p.price === "number" ? p.price : 0;
      return price >= minPrice && price <= maxPrice;
    });

    if (minRating > 0) {
      list = list.filter(
        (p) => (typeof p.rating === "number" ? p.rating : 0) >= minRating
      );
    }

    // sort
    list.sort((a, b) => {
      const pa = a.price ?? 0;
      const pb = b.price ?? 0;
      const ra = a.rating ?? 0;
      const rb = b.rating ?? 0;

      switch (sortBy) {
        case "price-low":
          return pa - pb;
        case "price-high":
          return pb - pa;
        case "rating-high":
          return rb - ra;
        case "newest":
          return (b.id ?? 0) - (a.id ?? 0);
        case "recommended":
        default:
          if (rb !== ra) return rb - ra;
          return pa - pb;
      }
    });

    return list;
  }, [
    search,
    type,
    category,
    material,
    region,
    minPrice,
    maxPrice,
    minRating,
    sortBy,
  ]);

  const handleReset = () => {
    setSearch("");
    setType("");
    setCategory("");
    setMaterial("");
    setRegion("");
    setMinPrice(priceMin);
    setMaxPrice(priceMax);
    setMinRating(0);
    setSortBy("recommended");
  };

  return (
    <div className="container-px py-10">
      <header className="text-center mb-8">
        <h1 className="text-3xl sm:text-4xl font-extrabold">
          Discover Authentic Handloom
        </h1>
        <p className="mt-2 text-neutral-600 text-sm sm:text-base">
          Explore handcrafted textiles from skilled artisans
        </p>

        {/* search bar */}
        <div className="mt-6 max-w-2xl mx-auto">
          <input
            type="text"
            placeholder="Search products, artisans, or categories..."
            className="w-full rounded-full border border-neutral-200 px-5 py-3 text-sm outline-none focus:ring-2 focus:ring-primary-500"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-[260px,1fr] gap-8">
        {/* --------- FILTER SIDEBAR ---------- */}
        <aside className="bg-white rounded-2xl shadow-sm border border-neutral-200 p-5 h-fit">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-sm">Filters</h2>
            <button
              className="text-xs text-primary-600 hover:underline"
              onClick={handleReset}
            >
              Reset
            </button>
          </div>

          {/* Type (NEW) */}
          <div className="mb-4">
            <label className="block text-xs font-semibold mb-1">
              Type
            </label>
            <select
              className="w-full border border-neutral-200 rounded-lg px-3 py-2 text-sm"
              value={type}
              onChange={(e) => setType(e.target.value)}
            >
              <option value="">Any</option>
              {types.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>

          {/* Category */}
          <div className="mb-4">
            <label className="block text-xs font-semibold mb-1">
              Category
            </label>
            <select
              className="w-full border border-neutral-200 rounded-lg px-3 py-2 text-sm"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="">Any</option>
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          {/* Material */}
          <div className="mb-4">
            <label className="block text-xs font-semibold mb-1">
              Material
            </label>
            <select
              className="w-full border border-neutral-200 rounded-lg px-3 py-2 text-sm"
              value={material}
              onChange={(e) => setMaterial(e.target.value)}
            >
              <option value="">Any</option>
              {materials.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
          </div>

          {/* Region */}
          <div className="mb-4">
            <label className="block text-xs font-semibold mb-1">
              Region
            </label>
            <select
              className="w-full border border-neutral-200 rounded-lg px-3 py-2 text-sm"
              value={region}
              onChange={(e) => setRegion(e.target.value)}
            >
              <option value="">Any</option>
              {regions.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </div>

          {/* Price range */}
          <div className="mb-4">
            <label className="block text-xs font-semibold mb-1">
              Price range
            </label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                className="w-1/2 border border-neutral-200 rounded-lg px-3 py-2 text-sm"
                value={minPrice}
                onChange={(e) =>
                  setMinPrice(Number(e.target.value) || priceMin)
                }
              />
              <span className="text-xs text-neutral-500">—</span>
              <input
                type="number"
                className="w-1/2 border border-neutral-200 rounded-lg px-3 py-2 text-sm"
                value={maxPrice}
                onChange={(e) =>
                  setMaxPrice(Number(e.target.value) || priceMax)
                }
              />
            </div>
            <p className="text-[11px] text-neutral-400 mt-1">
              Min {priceMin} — Max {priceMax}
            </p>
          </div>

          {/* Rating */}
          <div className="mb-2">
            <label className="block text-xs font-semibold mb-1">
              Minimum rating
            </label>
            <select
              className="w-full border border-neutral-200 rounded-lg px-3 py-2 text-sm"
              value={minRating}
              onChange={(e) => setMinRating(Number(e.target.value))}
            >
              <option value={0}>Any</option>
              <option value={3}>3★ & up</option>
              <option value={3.5}>3.5★ & up</option>
              <option value={4}>4★ & up</option>
              <option value={4.5}>4.5★ & up</option>
            </select>
          </div>
        </aside>

        {/* --------- PRODUCTS LIST ---------- */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-neutral-500">
              {filtered.length} result{filtered.length !== 1 ? "s" : ""}
            </p>

            <div className="flex items-center gap-2 text-sm">
              <span className="text-neutral-500 text-xs sm:text-sm">
                Sort
              </span>
              <select
                className="border border-neutral-200 rounded-lg px-3 py-2 text-xs sm:text-sm"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="recommended">Recommended</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating-high">Rating</option>
                <option value="newest">Newest</option>
              </select>
            </div>
          </div>

          {filtered.length === 0 ? (
            <div className="bg-white rounded-2xl border border-neutral-200 p-6 text-sm text-neutral-600">
              No products match these filters. Try clearing some filters.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((p) => (
                <ProductCard key={p.id} p={p} />
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
