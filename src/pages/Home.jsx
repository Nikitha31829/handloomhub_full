import { Link } from 'react-router-dom';
import { products } from '../data/products';
import ProductCard from '../components/ProductCard';

export default function Home() {
  const featured = products.slice(0, 6); // use up to 6 cards for featured collections

  const categories = ['Banarasi', 'Block Print', 'Ikat', 'Cotton', 'Silk', 'Hand-dyed'];

  // lightweight mock for artisan highlights, link to /artisans
  const weavers = [
    { id: 1, name: 'Radha Devi', craft: 'Banarasi Brocade', bio: '3 generations of brocade weaving. Known for intricate zari work.' },
    { id: 2, name: 'Hassan Khan', craft: 'Ikat Master', bio: 'Specializes in traditional tie-dye Ikat techniques from Andhra.' },
    { id: 3, name: 'Anita Rao', craft: 'Block Prints', bio: 'Vibrant block-print patterns rooted in Rajasthani motifs.' },
  ];

  return (
    <div className="space-y-10">
      {/* Hero */}
      <section className="relative">
        <img
          src="/images/loom-hero.jpg"
          alt="Artisan weaving on a loom"
          className="absolute inset-0 w-full h-[520px] object-cover -z-20"
        />
        {/* darker overlay for better text visibility */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/60 to-black/25 -z-10" />
        <div className="container-px py-24 md:py-32 text-white relative">
          <div className="max-w-4xl">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight text-white drop-shadow-lg">
              Handcrafted Textiles. Timeless Traditions.
            </h1>
            <p className="mt-4 text-lg text-neutral-100 max-w-2xl drop-shadow">
              Discover curated collections from authentic artisans — ethically sourced, beautifully made.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                to="/shop"
                className="inline-flex items-center px-5 py-3 rounded-xl bg-white text-black font-medium shadow-xl hover:bg-neutral-100 transition"
              >
                Shop Collections
              </Link>
              <Link
                to="/signup"
                className="inline-flex items-center px-5 py-3 rounded-xl bg-black/80 text-white font-medium shadow-xl border border-white/20 hover:bg-black transition"
              >
                Sell on HandloomHub
              </Link>
            </div>

            <div className="mt-6 flex flex-wrap gap-3 text-sm">
              <Badge>Fair trade</Badge>
              <Badge>Eco-friendly dyes</Badge>
              <Badge>Verified artisans</Badge>
              <Badge>Secure payments</Badge>
            </div>
          </div>
        </div>
      </section>

      {/* Category Strip */}
      <section className="container-px">
        <div className="overflow-x-auto py-4">
          <nav className="flex gap-3 w-full">
            {categories.map((cat) => (
              <Link
                key={cat}
                to={`/shop?category=${encodeURIComponent(cat)}`}
                className="chip inline-flex items-center px-4 py-2 whitespace-nowrap border border-neutral-200 hover:shadow-sm bg-white"
              >
                {cat}
              </Link>
            ))}
          </nav>
        </div>
      </section>

      {/* Featured Collections */}
      <section className="container-px">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold">Featured Collections</h2>
            <p className="text-sm text-neutral-600 mt-1">Handpicked favorites from our artisans</p>
          </div>
          <Link to="/shop" className="text-sm text-primary-600 hover:underline hidden sm:inline">
            Browse all collections →
          </Link>
        </div>

        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
          {featured.map((p) => (
            <ProductCard key={p.id} p={p} />
          ))}
        </div>
      </section>

      {/* Why HandloomHub */}
      <section className="bg-neutral-50">
        <div className="container-px py-14">
          <h3 className="text-2xl font-extrabold text-center">Why HandloomHub</h3>
          <p className="text-center text-sm text-neutral-600 mt-2 max-w-2xl mx-auto">
            A marketplace that respects artisanship, people and the planet.
          </p>

          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <FeatureCard title="Fair Trade" desc="Transparent pricing — artisans earn fairly." icon="🤝" />
            <FeatureCard title="Verified Artisans" desc="Profiles verified for quality & authenticity." icon="✅" />
            <FeatureCard title="Eco-friendly" desc="Low-impact dyes and sustainable fibers." icon="🌿" />
            <FeatureCard title="Secure Payments" desc="Fast, secure checkout and buyer protection." icon="🔒" />
          </div>
        </div>
      </section>

      {/* Stories from Our Weavers */}
      <section className="container-px py-12">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-2xl font-extrabold">Stories from Our Weavers</h3>
            <p className="text-sm text-neutral-600 mt-1">Meet the makers behind the textiles you love</p>
          </div>
          <Link to="/artisans" className="text-sm text-primary-600 hover:underline hidden sm:inline">
            See all artisans →
          </Link>
        </div>

        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {weavers.map((w) => (
            <Link
              key={w.id}
              to="/artisans"
              className="group block border rounded-lg p-5 hover:shadow-lg transition-shadow bg-white"
            >
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-xl bg-neutral-100 flex items-center justify-center text-2xl">
                  🧵
                </div>
                <div>
                  <h4 className="font-semibold">{w.name}</h4>
                  <div className="text-xs text-neutral-500">{w.craft}</div>
                </div>
              </div>
              <p className="mt-3 text-sm text-neutral-600">{w.bio}</p>
              <div className="mt-3 text-sm text-primary-600 group-hover:underline">Read story →</div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}

/* small presentational helpers */
function FeatureCard({ title, desc, icon }) {
  return (
    <div className="flex gap-4 items-start p-4 bg-white border rounded-lg">
      <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-gradient-to-br from-primary-600 to-primary-400 text-white text-xl">
        {icon}
      </div>
      <div>
        <div className="font-semibold">{title}</div>
        <div className="text-sm text-neutral-600 mt-1">{desc}</div>
      </div>
    </div>
  );
}

function Chip({ children }) {
  return <span className="chip bg-white border border-neutral-200">{children}</span>;
}

function Badge({ children }) {
  return (
    <span className="inline-flex items-center px-3 py-1 rounded-full bg-white/90 text-slate-900 text-xs font-medium shadow-sm">
      {children}
    </span>
  );
}
