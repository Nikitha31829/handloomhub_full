import { useParams, Link, useNavigate } from 'react-router-dom';
import { useEffect, useMemo, useState } from 'react';
import { products } from '../data/products';
import { byVendor } from '../lib/artisans';
import Rating from '../components/Rating';
import { useCart } from '../state/CartContext';

export default function ProductDetails(){
  const { id } = useParams();
  const navigate = useNavigate();
  // ensure we match by string so numeric ids work too
  const p = products.find(x => String(x.id) === String(id));
  const { add } = useCart();

  // --- UI state for gallery, options, qty, wishlist and tabs ---
  const images = useMemo(()=> (p?.images?.length ? p.images : (p ? [p.image] : [])), [p]);
  const [mainIndex, setMainIndex] = useState(0);
  useEffect(()=> setMainIndex(0), [id]);

  const [quantity, setQuantity] = useState(1);
  useEffect(()=> setQuantity(1), [id]);

  // sizes/colors if product provides them
  const sizes = p?.options?.sizes || (p?.size ? [p.size] : []);
  const colors = p?.options?.colors || (p?.color ? [p.color] : []);

  const [selectedSize, setSelectedSize] = useState(sizes?.[0] ?? '');
  const [selectedColor, setSelectedColor] = useState(colors?.[0] ?? '');
  useEffect(()=>{
    setSelectedSize(sizes?.[0] ?? '');
    setSelectedColor(colors?.[0] ?? '');
  }, [id]);

  const [wishlisted, setWishlisted] = useState(false);
  const [activeTab, setActiveTab] = useState('details');

  if(!p){
    return (
      <div className='container-px py-10'>
        <p className='text-neutral-600'>Sorry — we couldn't find that product.</p>
        <Link to='/shop' className='btn-ghost mt-4 inline-block'>Back to Shop</Link>
      </div>
    );
  }

  const seller = byVendor(p.vendor);

  // computed values: discount %
  const price = Number(p.price || 0);
  const compare = p.compareAt ? Number(p.compareAt) : null;
  const discount = compare ? Math.round(((compare - price) / compare) * 100) : null;

  // action handlers
  const addToCart = () => {
    add(p.id, Number(quantity), { size: selectedSize, color: selectedColor });
  };
  const buyNow = () => {
    add(p.id, Number(quantity), { size: selectedSize, color: selectedColor });
    navigate('/checkout');
  };
  const toggleWishlist = () => setWishlisted(s => !s);

  return (
    <div className='container-px py-10 grid lg:grid-cols-3 gap-10'>
      {/* left: gallery */}
      <div className='lg:col-span-2'>
        <div className='rounded-2xl overflow-hidden shadow-soft'>
          <img src={images[mainIndex]} alt={p.title} className='w-full h-[520px] object-cover'/>
        </div>

        {/* thumbnail strip */}
        <div className='mt-4 flex gap-3 overflow-x-auto'>
          {images.map((img, i) => (
            <button key={i} onClick={()=> setMainIndex(i)} className={`rounded-lg overflow-hidden border ${i===mainIndex ? 'ring-2 ring-primary-300' : 'border-neutral-200'} shrink-0`}>
              <img src={img} alt={`${p.title}-${i}`} className='w-28 h-20 object-cover' />
            </button>
          ))}
        </div>

        {/* summary & tabs */}
        <div className='mt-6 space-y-3'>
          <div className='flex items-start justify-between gap-4'>
            <div>
              <h1 className='text-3xl font-extrabold'>{p.title}</h1>
              <div className='flex items-center gap-3 mt-2'>
                <Rating value={p.rating} reviews={p.reviews}/>
                <span className='text-neutral-500'>by {p.vendor}</span>
              </div>
            </div>
            {/* badges */}
            <div className='flex gap-2'>
              {p.handwoven && <span className='text-xs bg-primary-100 text-primary-700 px-2 py-1 rounded-full'>Handwoven</span>}
              {p.ecoFriendly && <span className='text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full'>Eco-friendly dyes</span>}
              {p.stock && p.stock <= 5 && <span className='text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full'>Limited stock</span>}
            </div>
          </div>

          <p className='text-neutral-600'>Authentic handloom piece with careful attention to detail. Minor variations are natural and celebrated.</p>

          {/* Tabs */}
          <div className='mt-4'>
            <div className='flex gap-3 border-b pb-3'>
              <button onClick={()=> setActiveTab('details')} className={`text-sm ${activeTab==='details'? 'border-b-2 border-primary-600 pb-1 font-semibold' : 'text-neutral-500'}`}>Product Details</button>
              <button onClick={()=> setActiveTab('care')} className={`text-sm ${activeTab==='care'? 'border-b-2 border-primary-600 pb-1 font-semibold' : 'text-neutral-500'}`}>Care Instructions</button>
              <button onClick={()=> setActiveTab('artisan')} className={`text-sm ${activeTab==='artisan'? 'border-b-2 border-primary-600 pb-1 font-semibold' : 'text-neutral-500'}`}>Artisan Story</button>
            </div>

            <div className='mt-4 bg-white rounded-lg p-4 shadow-sm'>
              {activeTab === 'details' && (
                <div>
                  <p className='text-sm text-neutral-700'>{p.description || 'Handloom textile made with traditional techniques. Measurements and material details below.'}</p>
                  <ul className='mt-3 text-sm text-neutral-700 list-disc pl-5'>
                    <li>Material: {p.material || 'Handloom textile'}</li>
                    <li>Dimensions: {p.dimensions || 'Varies'}</li>
                    <li>Origin: {p.region || 'India'}</li>
                    {p.features?.map((f,i)=> <li key={i}>{f}</li>)}
                  </ul>
                </div>
              )}

              {activeTab === 'care' && (
                <div>
                  <h4 className='font-semibold'>Care</h4>
                  <div className='text-sm text-neutral-700 mt-2'>
                    {p.care || 'Hand wash cold, gentle detergent, line dry in shade. Avoid bleach.'}
                  </div>
                </div>
              )}

              {activeTab === 'artisan' && (
                <div>
                  {seller ? (
                    <div className='flex gap-4 items-start'>
                      <img src={seller.avatar} alt={seller.name} className='h-16 w-16 rounded-lg object-cover' />
                      <div>
                        <div className='font-semibold'>{seller.name}</div>
                        <div className='text-sm text-neutral-500'>{seller.craft} • {seller.location}</div>
                        <p className='text-sm text-neutral-700 mt-2'>{seller.bio || 'A devoted artisan keeping traditional weaving alive.'}</p>
                        <div className='mt-3 text-sm grid gap-2'>
                          {seller.contacts?.email && <a className='btn-ghost w-fit' href={`mailto:${seller.contacts.email}`}>Email</a>}
                          {seller.contacts?.website && <a className='btn-ghost w-fit' href={seller.contacts.website} target='_blank' rel='noreferrer'>Website</a>}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className='text-sm text-neutral-600'>Artisan details not available.</div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* right: purchase panel */}
      <aside>
        <div className='bg-white rounded-2xl shadow-soft p-6 sticky top-20'>
          <div className='flex items-baseline gap-3'>
            <div>
              <div className='text-3xl font-extrabold'>${price.toFixed(2)}</div>
              {compare && <div className='text-neutral-400 line-through text-sm'>${compare.toFixed(2)}</div>}
            </div>
            {discount && <div className='ml-auto text-sm bg-red-100 text-red-700 px-2 py-1 rounded-full'>{discount}% off</div>}
          </div>

          {/* options */}
          <div className='mt-4 space-y-3'>
            {sizes?.length > 0 && (
              <div>
                <div className='text-sm font-semibold mb-1'>Size</div>
                <div className='flex gap-2 flex-wrap'>
                  {sizes.map(s => <button key={s} onClick={()=>setSelectedSize(s)} className={`px-3 py-1 rounded-full border ${s===selectedSize ? 'bg-primary-50 border-primary-200' : 'bg-white border-neutral-200'}`}>{s}</button>)}
                </div>
              </div>
            )}

            {colors?.length > 0 && (
              <div>
                <div className='text-sm font-semibold mb-1'>Color</div>
                <div className='flex gap-2 items-center'>
                  {colors.map(c => <button key={c} onClick={()=>setSelectedColor(c)} className={`px-2 py-1 rounded-full border ${c===selectedColor ? 'ring-2 ring-primary-300' : 'border-neutral-200'}`}>{c}</button>)}
                </div>
              </div>
            )}

            <div>
              <div className='text-sm font-semibold mb-1'>Quantity</div>
              <div className='flex items-center gap-2'>
                <button onClick={()=> setQuantity(q=> Math.max(1, q-1))} className='px-3 py-1 border rounded'>-</button>
                <input aria-label='Quantity' value={quantity} onChange={e=> setQuantity(Math.max(1, Number(e.target.value || 1)))} className='w-16 text-center field' />
                <button onClick={()=> setQuantity(q=> q+1)} className='px-3 py-1 border rounded'>+</button>
                <div className='text-sm text-neutral-500 ml-2'>{p.stock ? `${p.stock} available` : 'In stock'}</div>
              </div>
            </div>
          </div>

          {/* actions */}
          <div className='mt-4 grid gap-2'>
            <button className='btn-primary w-full' onClick={addToCart}>Add to Cart</button>
            <button className='btn-ghost w-full' onClick={buyNow}>Buy Now</button>
            <button className={`btn-ghost w-full ${wishlisted ? 'bg-pink-50 border-pink-200 text-pink-700' : ''}`} onClick={toggleWishlist}>
              {wishlisted ? 'Saved to Wishlist' : 'Add to Wishlist'}
            </button>
          </div>

          {/* seller block */}
          {seller && (
            <div className='mt-6 border-t pt-6'>
              <h3 className='font-bold mb-3'>Sold by</h3>
              <Link to={`/artisan/${seller.id}`} className='flex items-center gap-3'>
                <img src={seller.avatar} alt={seller.name} className='h-12 w-12 rounded-lg object-cover'/>
                <div>
                  <div className='font-semibold'>{seller.name}</div>
                  <div className='text-sm text-neutral-500'>{seller.craft} • {seller.location}</div>
                </div>
              </Link>
              <div className='mt-4 grid gap-2 text-sm'>
                {seller.contacts?.email && <a className='btn-ghost' href={`mailto:${seller.contacts.email}`}>Email: {seller.contacts.email}</a>}
                {seller.contacts?.phone && <a className='btn-ghost' href={`tel:${seller.contacts.phone}`}>Phone: {seller.contacts.phone}</a>}
                {seller.contacts?.whatsapp && <a className='btn-ghost' href={seller.contacts.whatsapp} target='_blank' rel='noreferrer'>WhatsApp</a>}
                {seller.contacts?.website && <a className='btn-ghost' href={seller.contacts.website} target='_blank' rel='noreferrer'>Website</a>}
              </div>
            </div>
          )}
        </div>
      </aside>
    </div>
  );
}