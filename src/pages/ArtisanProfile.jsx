// src/pages/ArtisanProfile.jsx
import { useParams, Link } from "react-router-dom";
import { byId } from "../lib/artisans";
import { products } from "../data/products";
import ProductCard from "../components/ProductCard";
import { useAuth } from "../state/AuthContext";

export default function ArtisanProfile() {
  const { id } = useParams();
  const artisan = byId(id);
  const { user } = useAuth();

  if (!artisan) {
    return (
      <div className="container-px py-10">
        <p className="text-neutral-600">Artisan not found.</p>
        <Link to="/artisans" className="btn-ghost mt-4 inline-block">
          Back
        </Link>
      </div>
    );
  }

  const listed = products.filter((p) => p.vendor === artisan.vendorKey);
  const canEdit = user?.role === "Artisan" && user?.name === artisan.name;

  return (
    <div>
      {/* Banner (compact) */}
      <section className="relative">
        <div className="w-full h-[180px] sm:h-[220px] lg:h-[260px] overflow-hidden">
          <img
            src={artisan.banner}
            alt=""
            className="w-full h-full object-cover object-center"
          />
        </div>
        <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-black/0 to-black/10" />
      </section>

      {/* Profile header card (directly after banner; no overlap) */}
      <div className="container-px mt-4 pb-6">
        <div className="bg-white rounded-2xl shadow-soft ring-1 ring-black/5 p-5 sm:p-6">
          <div className="grid grid-cols-1 lg:grid-cols-[96px,1fr,auto] gap-4 lg:gap-6 items-center">
            {/* Avatar */}
            <div className="justify-self-start">
              <img
                src={artisan.avatar}
                alt={artisan.name}
                className="h-24 w-24 sm:h-28 sm:w-28 rounded-2xl object-cover ring-1 ring-black/5"
              />
            </div>

            {/* Text block */}
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold leading-tight">
                {artisan.name}
              </h1>
              <p className="text-neutral-600">
                {artisan.craft} • {artisan.location}
              </p>
              <p className="mt-2 text-neutral-700">{artisan.bio}</p>

              <div className="mt-3 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm">
                <span>
                  <b>{artisan.stats.products}</b> products
                </span>
                <span>
                  <b>{artisan.stats.years}</b> yrs experience
                </span>
                <span>
                  ⭐ <b>{artisan.stats.rating}</b>
                </span>
              </div>

              {canEdit && (
                <p className="mt-2 text-xs text-green-700">
                  You are viewing your public profile.
                </p>
              )}
            </div>

            {/* Contact buttons */}
            <div className="flex flex-col gap-2 justify-self-stretch lg:justify-self-end w-full max-w-[160px]">
              <a className="btn-ghost" href={`mailto:${artisan.contacts.email}`}>
                Email
              </a>
              <a className="btn-ghost" href={`tel:${artisan.contacts.phone}`}>
                Call
              </a>
              <a
                className="btn-ghost"
                href={artisan.contacts.whatsapp}
                target="_blank"
                rel="noreferrer"
              >
                WhatsApp
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Product grid */}
      <section className="container-px py-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl sm:text-2xl font-extrabold">
            Products by {artisan.name}
          </h2>
          <Link to="/shop" className="text-sm underline">
            View all
          </Link>
        </div>

        {listed.length === 0 ? (
          <p className="text-neutral-600">
            No products linked to this profile yet.
          </p>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {listed.map((p) => (
              <ProductCard key={p.id} p={p} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
