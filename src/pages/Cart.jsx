import { useCart } from '../state/CartContext.jsx';
import { Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';
export default function Cart(){
  const { items, subtotal, shipping, tax, total, setQty, remove }=useCart();
  return (
    <div className='container-px py-10 grid lg:grid-cols-3 gap-8'>
      <div className='lg:col-span-2'>
        <h2 className='text-3xl font-extrabold mb-6'>Shopping Cart</h2>
        <div className='bg-white rounded-2xl shadow-soft divide-y'>
          {items.length===0&&<p className='p-6 text-neutral-600'>Your cart is empty.</p>}
          {items.map(i=>(
            <div key={i.id} className='p-6 flex items-center gap-4'>
              <img src={i.image} alt={i.title} className='h-20 w-20 rounded-lg object-cover'/>
              <div className='flex-1'><div className='font-semibold'>{i.title}</div><div className='text-sm text-neutral-500'>by {i.vendor}</div><div className='mt-1 font-semibold'>${i.price}</div></div>
              <div className='flex items-center gap-2'><button className='btn-ghost' onClick={()=>setQty(i.id,i.qty-1)}>-</button><span className='w-8 text-center'>{i.qty}</span><button className='btn-ghost' onClick={()=>setQty(i.id,i.qty+1)}>+</button></div>
              <div className='w-24 text-right font-semibold'>${i.lineTotal.toFixed(2)}</div>
              <button className='btn-ghost text-red-600' onClick={()=>remove(i.id)}><Trash2 className='h-5 w-5'/></button>
            </div>
          ))}
        </div>
      </div>
      <aside className='lg:col-span-1'>
        <div className='bg-white rounded-2xl shadow-soft p-6'>
          <h3 className='text-lg font-bold mb-4'>Order Summary</h3>
          <SummaryRow label='Subtotal' value={subtotal}/>
          <SummaryRow label='Shipping' value={shipping} free/>
          <SummaryRow label='Tax (8%)' value={tax}/>
          <div className='border-t my-4'></div>
          <SummaryRow label='Total' value={total} bold/>
          <p className='mt-2 text-sm text-green-700'>🎉 Free shipping on orders over $100!</p>
          <Link to='/checkout' className='btn-primary w-full mt-6 block text-center'>Proceed to Checkout</Link>
          <Link to='/shop' className='btn-ghost w-full mt-3 block text-center'>Continue Shopping</Link>
        </div>
      </aside>
    </div>
  );
}
function SummaryRow({label,value,free,bold}){
  return (<div className='flex items-center justify-between'><span className={bold?'font-extrabold':'font-medium'}>{label}</span><span className={bold?'font-extrabold':'font-semibold'}>{free?'Free':`$${value.toFixed(2)}`}</span></div>);
}