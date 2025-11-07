import { Link } from 'react-router-dom';
import Rating from './Rating.jsx';
import { useCart } from '../state/CartContext.jsx';
import { Heart } from 'lucide-react';

export default function ProductCard({ p }){
  const { add }=useCart();
  return (
    <div className='group bg-white rounded-2xl shadow-soft overflow-hidden flex flex-col ring-1 ring-transparent hover:ring-neutral-200 hover:shadow-lg hover:-translate-y-0.5 transition'>
      <Link to={`/product/${p.id}`} className='relative block'>
        <img src={p.image} alt={p.title} className='h-56 w-full object-cover' />
        <button className='absolute top-3 right-3 btn-ghost p-2 rounded-full opacity-0 group-hover:opacity-100 transition'><Heart className='h-5 w-5'/></button>
        {p.badges?.length?(<div className='absolute left-3 top-3 flex flex-col gap-1'>{p.badges.map(b=>(<span key={b} className='chip bg-white/90 border border-neutral-200'>{b}</span>))}</div>):null}
      </Link>
      <div className='p-4 flex-1 flex flex-col gap-2'>
        <Link to={`/product/${p.id}`} className='text-lg font-semibold leading-snug hover:underline'>{p.title}</Link>
        <p className='text-sm text-neutral-500'>by {p.vendor}</p>
        <Rating value={p.rating} reviews={p.reviews}/>
        <div className='mt-auto flex items-center justify-between'>
          <div className='space-x-2'><span className='price'>${p.price}</span>{p.compareAt&&(<span className='text-neutral-400 line-through'>${p.compareAt}</span>)}</div>
          <button className='btn-primary' onClick={()=>add(p.id,1)}>Add to Cart</button>
        </div>
      </div>
    </div>
  );
}