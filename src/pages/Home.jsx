import { Link } from 'react-router-dom';
import { products } from '../data/products';
import ProductCard from '../components/ProductCard';

export default function Home(){
  const featured = products.slice(0,3);
  return (
    <div>
      <section className='relative'>
        <img src='/images/loom-hero.jpg' className='absolute inset-0 w-full h-full object-cover' />
        <div className='absolute inset-0 bg-gradient-to-r from-black/60 to-black/20' />
        <div className='relative container-px py-24 text-white'>
          <h1 className='text-5xl lg:text-6xl font-extrabold leading-tight'>Discover Authentic Handloom</h1>
          <p className='mt-4 max-w-2xl text-lg text-white/90'>From Banarasi brocades to Jaipur block prints — shop directly from skilled artisans.</p>
          <div className='mt-8 flex gap-3'>
            <Link to='/shop' className='btn-primary'>Start Shopping</Link>
            <Link to='/signup' className='btn-ghost bg-white/10 border-white/30 text-white'>Become an Artisan</Link>
          </div>
          <div className='mt-10 flex flex-wrap gap-4 text-sm text-white/90'>
            <Badge>Fair trade</Badge><Badge>Eco-friendly dyes</Badge><Badge>Secure checkout</Badge><Badge>Global shipping</Badge>
          </div>
        </div>
      </section>
      <section className='container-px py-8'>
        <div className='flex flex-wrap gap-3'><Chip>Banarasi</Chip><Chip>Block Print</Chip><Chip>Ikat</Chip><Chip>Cotton</Chip><Chip>Silk</Chip></div>
      </section>
      <section className='container-px pb-12'>
        <h2 className='text-3xl font-extrabold text-center'>Featured Products</h2>
        <p className='text-center text-neutral-600 mt-2'>Handpicked selections from our talented artisans</p>
        <div className='mt-8 grid sm:grid-cols-2 lg:grid-cols-3 gap-6'>{featured.map(p=> <ProductCard key={p.id} p={p} />)}</div>
      </section>
      <section className='bg-neutral-950 text-white'>
        <div className='container-px py-14 text-center'>
          <h3 className='text-3xl font-extrabold mb-3'>Join Our Community</h3>
          <p className='text-white/80 max-w-3xl mx-auto'>Whether you’re an artisan or a buyer seeking authentic handmade products, HandloomHub is your destination for meaningful connections.</p>
          <div className='mt-6 flex justify-center gap-3'><Link to='/shop' className='btn-ghost bg-white text-neutral-900'>Start Shopping</Link><Link to='/signup' className='btn-primary'>Become an Artisan</Link></div>
        </div>
      </section>
    </div>
  );
}
function Chip({children}){return <span className='chip bg-white border border-neutral-200'>{children}</span>}
function Badge({children}){return <span className='chip bg-white/15 border border-white/20 text-white'>{children}</span>}