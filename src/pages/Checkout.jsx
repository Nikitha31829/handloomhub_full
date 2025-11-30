import { useState } from 'react';
import { useCart } from '../state/CartContext.jsx';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { storage } from '../lib/storage';
import { useNavigate } from 'react-router-dom';

// --- update validation to include phone + state + allow step-by-step checks ---
const baseSchema = z.object({
  email: z.string().email('Enter a valid email'),
  firstName: z.string().min(2, 'First name is too short'),
  lastName: z.string().min(2, 'Last name is too short'),
  phone: z.string().min(6, 'Enter a valid phone number'),
  address: z.string().min(5, 'Address is required'),
  city: z.string().min(2, 'City is required'),
  state: z.string().min(2, 'State/region is required'),
  zip: z.string().regex(/^\d{5,6}$/, 'ZIP/PIN must be 5-6 digits'),
  paymentMethod: z.enum(['card', 'upi']).default('card'),

  // keep these as plain strings; we’ll validate them conditionally
  cardNumber: z.string().optional(),
  nameOnCard: z.string().optional(),
  exp: z.string().optional(),
  cvv: z.string().optional(),
});

const schema = baseSchema.superRefine((data, ctx) => {
  if (data.paymentMethod === 'card') {
    if (!/^\d{16}$/.test(data.cardNumber ?? '')) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['cardNumber'],
        message: 'Card must be 16 digits',
      });
    }

    if (!data.nameOnCard || data.nameOnCard.trim().length < 4) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['nameOnCard'],
        message: 'Name on card required',
      });
    }

    if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(data.exp ?? '')) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['exp'],
        message: 'Use MM/YY',
      });
    }

    if (!/^\d{3}$/.test(data.cvv ?? '')) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['cvv'],
        message: 'CVV must be 3 digits',
      });
    }
  }
});


export default function Checkout(){
  const { items, subtotal, clear } = useCart();
  const nav = useNavigate();

  // stepper
  const [step, setStep] = useState(0);
  const steps = ['Cart', 'Address', 'Payment', 'Review'];

  // coupon state
  const [coupon, setCoupon] = useState('');
  const [couponError, setCouponError] = useState('');
  const [discountPct, setDiscountPct] = useState(0);

  // form
  const { register, handleSubmit, trigger, watch, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(schema),
    mode: 'onBlur',
    defaultValues: {
      paymentMethod: 'card',
    }
  });

  // shipping rule and derived totals
  const shippingEstimate = subtotal >= 100 ? 0 : 8;
  const taxAmt = +(subtotal * 0.08);
  const discountAmt = +(subtotal * (discountPct / 100));
  const finalTotal = +(subtotal - discountAmt + shippingEstimate + taxAmt);

  const applyCoupon = () => {
    setCouponError('');
    const code = (coupon || '').trim().toUpperCase();
    if (code === 'HANDLOOM10') {
      setDiscountPct(10);
    } else {
      setDiscountPct(0);
      setCouponError('Invalid coupon code');
    }
  };

  const removeCoupon = () => {
    setCoupon('');
    setCouponError('');
    setDiscountPct(0);
  };

  const onFinalSubmit = (data) => {
    // build order payload and persist
    const order = {
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      items: items.map(({id, qty, title, price}) => ({id, qty, title, price})),
      amounts: { subtotal, shipping: shippingEstimate, tax: taxAmt, discount: discountAmt, total: finalTotal },
      shipTo: { name: `${data.firstName} ${data.lastName}`, address: data.address, city: data.city, zip: data.zip, email: data.email, phone: data.phone },
      payment: { method: data.paymentMethod, card: data.paymentMethod === 'card' ? { last4: String(data.cardNumber).slice(-4) } : null }
    };
    const orders = storage.get('hh:orders', []);
    orders.push(order);
    storage.set('hh:orders', orders);
    clear();
    nav('/confirmed', { state: { orderId: order.id } });
  };

  // helper to validate current step fields before moving forward
  const handleNext = async () => {
    if (step === 0) { setStep(1); return; } // cart -> address
    if (step === 1) {
      // validate address fields
      const ok = await trigger(['email','firstName','lastName','phone','address','city','zip','state']);
      if (ok) setStep(s => s + 1);
      return;
    }
    if (step === 2) {
      // validate payment fields depending on method
      const method = watch('paymentMethod');
      if (method === 'card') {
        const ok = await trigger(['paymentMethod','cardNumber','nameOnCard','exp','cvv']);
        if (ok) setStep(s => s + 1);
        return;
      }
      // UPI chosen - no extra required for our demo
      setStep(s => s + 1);
      return;
    }
  };

  if (items.length === 0) {
    return (
      <div className='container-px py-10'>
        <p className='text-neutral-600'>Your cart is empty — add items before checking out.</p>
        <div className='mt-4'>
          <a className='btn-ghost' href='/shop'>Continue shopping</a>
        </div>
      </div>
    );
  }

  return (
    <div className='container-px py-10 grid lg:grid-cols-3 gap-8'>
      {/* left: step 0 shows Cart summary; address/payment/review otherwise */}
      <div className='lg:col-span-2 bg-white rounded-2xl shadow-soft p-6'>
        <div className='flex items-center gap-4 mb-6'>
          {steps.map((s, i) => (
            <div key={s} className={`flex items-center gap-3 ${i > 0 ? 'opacity-60' : ''}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${i <= step ? 'bg-primary-600 text-white' : 'bg-neutral-100 text-neutral-600'}`}>{i+1}</div>
              <div className={`text-sm ${i === step ? 'font-semibold' : 'text-neutral-500'}`}>{s}</div>
              {i < steps.length - 1 && <div className='w-6 h-px bg-neutral-200 mx-2 hidden sm:block' />}
            </div>
          ))}
        </div>

        {/* step contents */}
        {step === 0 && (
          <section>
            <h3 className='text-xl font-bold mb-4'>Cart</h3>
            <div className='space-y-4'>
              {items.map(it => (
                <div key={it.id} className='flex items-center gap-4 p-4 border rounded-lg'>
                  <img src={it.image} alt={it.title} className='h-16 w-16 rounded object-cover'/>
                  <div className='flex-1'>
                    <div className='font-semibold'>{it.title}</div>
                    <div className='text-sm text-neutral-500'>by {it.vendor}</div>
                    <div className='text-sm text-neutral-700 mt-1'>${it.lineTotal.toFixed(2)}</div>
                  </div>
                  <div className='text-sm text-neutral-500'>x{it.qty}</div>
                </div>
              ))}
            </div>
            <div className='mt-6 flex gap-3 justify-end'>
              <button className='btn-ghost' onClick={() => nav('/cart')}>Edit cart</button>
              <button className='btn-primary' onClick={handleNext}>Continue to address</button>
            </div>
          </section>
        )}

        {step === 1 && (
          <form onSubmit={(e)=>{ e.preventDefault(); handleNext(); }}>
            <h3 className='text-xl font-bold mb-4'>Shipping Address</h3>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              <div>
                <label className='label'>Email</label>
                <input className='field' {...register('email')} />
                {errors.email && <p className='mt-1 text-sm text-red-600'>{errors.email.message}</p>}
              </div>
              <div>
                <label className='label'>Phone</label>
                <input className='field' {...register('phone')} />
                {errors.phone && <p className='mt-1 text-sm text-red-600'>{errors.phone.message}</p>}
              </div>

              <div>
                <label className='label'>First name</label>
                <input className='field' {...register('firstName')} />
                {errors.firstName && <p className='mt-1 text-sm text-red-600'>{errors.firstName.message}</p>}
              </div>
              <div>
                <label className='label'>Last name</label>
                <input className='field' {...register('lastName')} />
                {errors.lastName && <p className='mt-1 text-sm text-red-600'>{errors.lastName.message}</p>}
              </div>

              <div className='md:col-span-2'>
                <label className='label'>Address</label>
                <input className='field' {...register('address')} />
                {errors.address && <p className='mt-1 text-sm text-red-600'>{errors.address.message}</p>}
              </div>

              <div>
                <label className='label'>City</label>
                <input className='field' {...register('city')} />
                {errors.city && <p className='mt-1 text-sm text-red-600'>{errors.city.message}</p>}
              </div>
              <div>
                <label className='label'>State / Region</label>
                <input className='field' {...register('state')} />
                {errors.state && <p className='mt-1 text-sm text-red-600'>{errors.state.message}</p>}
              </div>

              <div>
                <label className='label'>ZIP / PIN</label>
                <input className='field' {...register('zip')} />
                {errors.zip && <p className='mt-1 text-sm text-red-600'>{errors.zip.message}</p>}
              </div>
            </div>

            <div className='mt-6 flex gap-3 justify-between'>
              <button type='button' className='btn-ghost' onClick={() => setStep(s => Math.max(0, s - 1))}>Back</button>
              <button type='submit' className='btn-primary'>Continue to payment</button>
            </div>
          </form>
        )}

        {step === 2 && (
          <form onSubmit={(e)=>{ e.preventDefault(); handleNext(); }}>
            <h3 className='text-xl font-bold mb-4'>Payment</h3>
            <div className='space-y-4'>
              <div className='flex items-center gap-4'>
                <label className={`p-3 rounded-lg border ${watch('paymentMethod') === 'card' ? 'ring-2 ring-primary-200' : 'border-neutral-200'}`}>
                  <input type='radio' {...register('paymentMethod')} value='card' className='mr-2' /> Card
                </label>
                <label className={`p-3 rounded-lg border ${watch('paymentMethod') === 'upi' ? 'ring-2 ring-primary-200' : 'border-neutral-200'}`}>
                  <input type='radio' {...register('paymentMethod')} value='upi' className='mr-2' /> UPI
                </label>
              </div>

              {watch('paymentMethod') === 'card' && (
                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                  <div className='md:col-span-2'>
                    <label className='label'>Card Number</label>
                    <input className='field' placeholder='1234123412341234' {...register('cardNumber')} />
                    {errors.cardNumber && <p className='mt-1 text-sm text-red-600'>{errors.cardNumber.message}</p>}
                  </div>
                  <div>
                    <label className='label'>Name on card</label>
                    <input className='field' {...register('nameOnCard')} />
                    {errors.nameOnCard && <p className='mt-1 text-sm text-red-600'>{errors.nameOnCard.message}</p>}
                  </div>
                  <div>
                    <label className='label'>Exp (MM/YY)</label>
                    <input className='field' placeholder='08/28' {...register('exp')} />
                    {errors.exp && <p className='mt-1 text-sm text-red-600'>{errors.exp.message}</p>}
                  </div>
                  <div>
                    <label className='label'>CVV</label>
                    <input className='field' placeholder='123' {...register('cvv')} />
                    {errors.cvv && <p className='mt-1 text-sm text-red-600'>{errors.cvv.message}</p>}
                  </div>
                </div>
              )}

              {watch('paymentMethod') === 'upi' && (
                <div>
                  <label className='label'>UPI ID</label>
                  <input className='field' placeholder='yourid@bank' />
                  <p className='text-sm text-neutral-500 mt-1'>This demo accepts UPI input but performs no real transaction.</p>
                </div>
              )}
            </div>

            <div className='mt-6 flex gap-3 justify-between'>
              <button type='button' className='btn-ghost' onClick={() => setStep(s => Math.max(0, s - 1))}>Back</button>
              <button type='submit' className='btn-primary'>Review order</button>
            </div>
          </form>
        )}

        {step === 3 && (
          <section>
            <h3 className='text-xl font-bold mb-4'>Review & place order</h3>

            <div className='bg-neutral-50 rounded-lg p-4 space-y-3'>
              {items.map(it => (
                <div key={it.id} className='flex items-center gap-3'>
                  <img src={it.image} alt={it.title} className='h-12 w-12 rounded object-cover'/>
                  <div className='flex-1'>
                    <div className='font-semibold text-sm'>{it.title}</div>
                    <div className='text-xs text-neutral-500'>x{it.qty}</div>
                  </div>
                  <div className='font-semibold'>${it.lineTotal.toFixed(2)}</div>
                </div>
              ))}
            </div>

            <div className='mt-6 grid grid-cols-1 md:grid-cols-2 gap-3'>
              <button className='btn-ghost' onClick={() => setStep(s => Math.max(0, s - 1))}>Back to payment</button>
              <button className='btn-primary' onClick={handleSubmit(onFinalSubmit)} disabled={isSubmitting}>Place order — ${finalTotal.toFixed(2)}</button>
            </div>
          </section>
        )}
      </div>

      {/* right: summary + coupon */}
      <aside className='lg:col-span-1'>
        <div className='bg-white rounded-2xl shadow-soft p-6 sticky top-20'>
          <h3 className='text-lg font-bold mb-4'>Order Summary</h3>
          <div className='text-sm text-neutral-500 mb-2'>{items.length} item(s)</div>

          <div className='space-y-2'>
            <div className='flex items-center justify-between'><span className='text-sm text-neutral-600'>Subtotal</span><span className='font-semibold'>${subtotal.toFixed(2)}</span></div>
            <div className='flex items-center justify-between'><span className='text-sm text-neutral-600'>Shipping (est.)</span><span className='font-semibold'>${shippingEstimate.toFixed(2)}</span></div>
            <div className='flex items-center justify-between'><span className='text-sm text-neutral-600'>Tax</span><span className='font-semibold'>${taxAmt.toFixed(2)}</span></div>
            <div className='flex items-center justify-between'><span className='text-sm text-neutral-600'>Discount</span><span className='font-semibold text-emerald-600'>−${discountAmt.toFixed(2)}</span></div>
            <div className='border-t my-3'/>
            <div className='flex items-center justify-between'><span className='font-extrabold'>Total</span><span className='font-extrabold'>${finalTotal.toFixed(2)}</span></div>
          </div>

          <div className='mt-4'>
            <label className='label'>Have a coupon?</label>
            <div className='flex gap-2'>
              <input className='field' value={coupon} placeholder='Code ( HANDLOOM10 )' onChange={(e)=> setCoupon(e.target.value)} />
              <button className='btn-primary px-4' onClick={applyCoupon}>Apply</button>
            </div>
            {couponError && <div className='text-sm text-red-600 mt-2'>{couponError}</div>}
            {discountPct > 0 && <div className='text-sm text-emerald-600 mt-2'>Coupon applied: {discountPct}% off</div>}
            {discountPct > 0 && <button className='btn-ghost mt-2 text-sm' onClick={removeCoupon}>Remove coupon</button>}
          </div>

          <div className='mt-6'>
            <div className='text-sm text-neutral-500'>Need help? Contact support — we’re happy to help.</div>
          </div>
        </div>
      </aside>
    </div>
  );
}