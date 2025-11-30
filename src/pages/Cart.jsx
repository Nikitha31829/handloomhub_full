import { useCart } from '../state/CartContext.jsx';
import { Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';
export default function Cart(){
  const { items, subtotal, shipping, tax, total, setQty, remove, clear } = useCart();

  return (
    <div className='container-px py-10 grid lg:grid-cols-3 gap-8'>
      <div className='lg:col-span-2'>
        <div className='flex items-start justify-between mb-4'>
          <div>
            <h2 className='text-3xl font-extrabold'>Shopping Cart</h2>
            <div className='text-sm text-neutral-500 mt-1'>{items.length} item(s)</div>
          </div>
          <div className='flex gap-3 items-center'>
            <button className='btn-ghost text-red-600' onClick={() => clear()} disabled={items.length===0}>Clear cart</button>
            <Link to='/shop' className='btn-ghost'>Continue shopping</Link>
          </div>
        </div>

        <div className='bg-white rounded-2xl shadow-soft divide-y'>
          {items.length===0 && <p className='p-6 text-neutral-600'>Your cart is empty.</p>}
          {items.map(i => (
            <div key={i.id} className='p-6 flex flex-col sm:flex-row items-start sm:items-center gap-4'>
              <img src={i.image} alt={i.title} className='h-20 w-20 rounded-lg object-cover'/>
              <div className='flex-1 min-w-0'>
                <div className='flex items-start justify-between gap-2'>
                  <div className='min-w-0'>
                    <div className='font-semibold truncate'>{i.title}</div>
                    <div className='text-sm text-neutral-500'>by {i.vendor}</div>
                    {i.selected?.size && <div className='text-xs text-neutral-400 mt-1'>Size: {i.selected.size}</div>}
                    {i.selected?.color && <div className='text-xs text-neutral-400 mt-1'>Color: {i.selected.color}</div>}
                  </div>
                  <div className='text-sm font-semibold'>${i.price.toFixed(2)}</div>
                </div>

                <div className='mt-3 flex items-center gap-3'>
                  <div className='flex items-center border rounded-lg'>
                    <button className='px-3 py-1' onClick={() => setQty(i.id, Math.max(1, i.qty - 1))}>−</button>
                    <input className='w-12 text-center field text-sm' value={i.qty} onChange={(e) => {
                      const v = Math.max(1, Number(e.target.value || 1));
                      setQty(i.id, v);
                    }} />
                    <button className='px-3 py-1' onClick={() => setQty(i.id, i.qty + 1)}>+</button>
                  </div>

                  <div className='text-sm text-neutral-500'>Line total: <span className='font-semibold text-neutral-800'>${i.lineTotal.toFixed(2)}</span></div>

                  <button className='btn-ghost text-red-600 ml-auto' onClick={() => remove(i.id)} aria-label='Remove item'>
                    <Trash2 className='h-5 w-5'/>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <aside className='lg:col-span-1'>
        <div className='bg-white rounded-2xl shadow-soft p-6 sticky top-20'>
          <h3 className='text-lg font-bold mb-4'>Order Summary</h3>
          <SummaryRow label='Subtotal' value={subtotal}/>
          <SummaryRow label='Shipping (est.)' value={subtotal >= 100 ? 0 : 8} />
          <SummaryRow label='Tax (8%)' value={subtotal * 0.08}/>
          <div className='border-t my-4'></div>
          <SummaryRow label='Total' value={ subtotal >= 100 ? (subtotal + subtotal * 0.08) : (subtotal + 8 + subtotal * 0.08) } bold />
          <p className='mt-2 text-sm text-green-700'>🎉 Free shipping on orders over $100!</p>

          <div className='mt-6 grid gap-2'>
            <Link to='/checkout' className='btn-primary w-full block text-center'>Proceed to Checkout</Link>
            <button className='btn-ghost w-full text-center' onClick={() => clear()}>Clear cart</button>
          </div>
        </div>
      </aside>
    </div>
  );
}

function SummaryRow({label, value, bold}) {
  return (
    <div className='flex items-center justify-between my-1'>
      <span className={bold ? 'font-extrabold' : 'font-medium'}>{label}</span>
      <span className={bold ? 'font-extrabold' : 'font-semibold'}>${(value || 0).toFixed(2)}</span>
    </div>
  );
}