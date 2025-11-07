import { products } from '../data/products';
import ProductCard from '../components/ProductCard.jsx';
export default function Shop(){
  return (
    <div>
      <section className='bg-gradient-to-b from-brand-50 to-white'>
        <div className='container-px py-16 text-center'>
          <h1 className='text-4xl font-extrabold'>Discover Authentic Handloom</h1>
          <p className='text-neutral-600 mt-2'>Explore our curated collection of handcrafted textiles from skilled artisans</p>
          <div className='mt-6 max-w-2xl mx-auto'>
            <input className='field w-full' placeholder='Search products, artisans, or categories...' />
          </div>
        </div>
      </section>
      <div className='container-px py-10'>
        <div className='grid sm:grid-cols-2 lg:grid-cols-3 gap-6'>{products.map(p=> <ProductCard key={p.id} p={p} />)}</div>
      </div>
    </div>
  );
}