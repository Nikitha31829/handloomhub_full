import { useParams, Link } from 'react-router-dom';
import { products } from '../data/products';
import { byVendor } from '../lib/artisans';
import Rating from '../components/Rating';
import { useCart } from '../state/CartContext';

export default function ProductDetails(){
  const { id } = useParams();
  const p = products.find(x=>x.id===id);
  const { add } = useCart();
  if(!p){
    return (<div className='container-px py-10'><p className='text-neutral-600'>Product not found.</p><Link to='/shop' className='btn-ghost mt-4 inline-block'>Back to Shop</Link></div>);
  }
  const seller = byVendor(p.vendor);
  return (
    <div className='container-px py-10 grid lg:grid-cols-3 gap-10'>
      <div className='lg:col-span-2'>
        <div className='rounded-2xl overflow-hidden shadow-soft'><img src={p.image} alt={p.title} className='w-full h-[520px] object-cover'/></div>
        <div className='mt-6 space-y-3'>
          <h1 className='text-3xl font-extrabold'>{p.title}</h1>
          <div className='flex items-center gap-3'><Rating value={p.rating} reviews={p.reviews}/><span className='text-neutral-500'>by {p.vendor}</span></div>
          <p className='text-neutral-600'>Authentic handloom piece with careful attention to detail. Minor variations are natural.</p>
          <ul className='mt-2 text-sm text-neutral-700 list-disc pl-5'><li>Material: Cotton/Silk blend</li><li>Care: Hand wash cold, line dry</li><li>Origin: India</li></ul>
        </div>
      </div>
      <aside>
        <div className='bg-white rounded-2xl shadow-soft p-6'>
          <div className='flex items-baseline gap-2'><span className='text-3xl font-extrabold'>${p.price}</span>{p.compareAt&&<span className='text-neutral-400 line-through'>${p.compareAt}</span>}</div>
          <button className='btn-primary w-full mt-4' onClick={()=>add(p.id,1)}>Add to Cart</button>
          <Link to='/checkout' className='btn-ghost w-full mt-2 block text-center'>Buy Now</Link>
          {seller&&(<div className='mt-6 border-t pt-6'><h3 className='font-bold mb-3'>Sold by</h3><Link to={`/artisan/${seller.id}`} className='flex items-center gap-3'><img src={seller.avatar} alt={seller.name} className='h-12 w-12 rounded-lg object-cover'/><div><div className='font-semibold'>{seller.name}</div><div className='text-sm text-neutral-500'>{seller.craft} • {seller.location}</div></div></Link><div className='mt-4 grid gap-2 text-sm'><a className='btn-ghost' href={`mailto:${seller.contacts.email}`}>Email: {seller.contacts.email}</a><a className='btn-ghost' href={`tel:${seller.contacts.phone}`}>Phone: {seller.contacts.phone}</a><a className='btn-ghost' href={seller.contacts.whatsapp} target='_blank' rel='noreferrer'>WhatsApp</a><a className='btn-ghost' href={seller.contacts.website} target='_blank' rel='noreferrer'>Website</a></div></div>)}
        </div>
      </aside>
    </div>
  );
}