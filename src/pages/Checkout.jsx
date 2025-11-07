import { useCart } from '../state/CartContext.jsx';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { storage } from '../lib/storage';
import { useNavigate } from 'react-router-dom';

const schema=z.object({email:z.string().email('Enter a valid email'),firstName:z.string().min(2,'First name is too short'),lastName:z.string().min(2,'Last name is too short'),address:z.string().min(5,'Address is required'),city:z.string().min(2,'City is required'),zip:z.string().regex(/^\d{5}(-\d{4})?$/,'ZIP must be 5 digits'),cardNumber:z.string().regex(/^\d{16}$/,'Card must be 16 digits'),nameOnCard:z.string().min(4,'Name on card required'),exp:z.string().regex(/^(0[1-9]|1[0-2])\/\d{2}$/,'Use MM/YY'),cvv:z.string().regex(/^\d{3}$/,'CVV must be 3 digits')});

export default function Checkout(){
  const { items, subtotal, shipping, tax, total, clear }=useCart();
  const nav=useNavigate();
  const { register, handleSubmit, formState:{errors,isSubmitting} }=useForm({resolver:zodResolver(schema),mode:'onBlur'});
  const onSubmit=(data)=>{
    const order={id:crypto.randomUUID(),createdAt:new Date().toISOString(),items:items.map(({id,qty,title,price})=>({id,qty,title,price})),amounts:{subtotal,shipping,tax,total},shipTo:{name:`${data.firstName} ${data.lastName}`,address:data.address,city:data.city,zip:data.zip,email:data.email}};
    const orders=storage.get('hh:orders',[]);orders.push(order);storage.set('hh:orders',orders);clear();nav('/confirmed',{state:{orderId:order.id}});
  };
  return (
    <div className='container-px py-10 grid lg:grid-cols-3 gap-8'>
      <form onSubmit={handleSubmit(onSubmit)} className='lg:col-span-2 bg-white rounded-2xl shadow-soft p-6'>
        <h2 className='text-3xl font-extrabold mb-6'>Checkout</h2>
        <Section title='Contact Information'><Field label='Email Address' error={errors.email?.message}><input className='field' placeholder='your@email.com' {...register('email')}/></Field></Section>
        <Section title='Shipping Address' cols>
          <Field label='First Name' error={errors.firstName?.message}><input className='field' {...register('firstName')}/></Field>
          <Field label='Last Name' error={errors.lastName?.message}><input className='field' {...register('lastName')}/></Field>
          <Field label='Address' span error={errors.address?.message}><input className='field' {...register('address')}/></Field>
          <Field label='City' error={errors.city?.message}><input className='field' {...register('city')}/></Field>
          <Field label='ZIP Code' error={errors.zip?.message}><input className='field' {...register('zip')}/></Field>
        </Section>
        <Section title='Payment Information' cols>
          <Field label='Card Number' error={errors.cardNumber?.message} span><input className='field' placeholder='1234123412341234' {...register('cardNumber')}/></Field>
          <Field label='Name on Card' error={errors.nameOnCard?.message} span><input className='field' {...register('nameOnCard')}/></Field>
          <Field label='Exp (MM/YY)' error={errors.exp?.message}><input className='field' placeholder='08/28' {...register('exp')}/></Field>
          <Field label='CVV' error={errors.cvv?.message}><input className='field' placeholder='123' {...register('cvv')}/></Field>
        </Section>
        <div className='mt-6 flex gap-3'><button disabled={isSubmitting} className='btn-primary'>Complete Order</button><a href='/cart' className='btn-ghost'>Back to Cart</a></div>
      </form>
      <aside className='lg:col-span-1'>
        <div className='bg-white rounded-2xl shadow-soft p-6'>
          <h3 className='text-lg font-bold mb-4'>Order Summary</h3>
          {items.map(i=>(<div key={i.id} className='flex items-center gap-3 mb-3'><img className='h-12 w-12 rounded object-cover' src={i.image} alt={i.title}/><div className='flex-1'><div className='text-sm font-semibold'>{i.title}</div><div className='text-xs text-neutral-500'>x{i.qty}</div></div><div className='text-sm font-semibold'>${i.lineTotal.toFixed(2)}</div></div>))}
          <div className='border-t my-3'/>
          <Row k='Subtotal' v={`$${subtotal.toFixed(2)}`}/>
          <Row k='Shipping' v='Free'/>
          <Row k='Tax' v={`$${tax.toFixed(2)}`}/>
          <div className='border-t my-3'/>
          <Row k='Total' v={`$${total.toFixed(2)}`} bold/>
          <p className='mt-2 text-sm text-green-700'>🎉 Free shipping on orders over $100!</p>
        </div>
      </aside>
    </div>
  );
}
function Section({title,children,cols}){return(<section className='mb-6'><h3 className='text-lg font-bold mb-3'>{title}</h3><div className={cols?'grid grid-cols-1 md:grid-cols-2 gap-4':''}>{children}</div></section>)}
function Field({label,error,children,span}){return(<div className={span?'md:col-span-2':''}><div className='label'>{label}</div>{children}{error&&<p className='mt-1 text-sm text-red-600'>{error}</p>}</div>)}
function Row({k,v,bold}){return(<div className='flex items-center justify-between'><span className={bold?'font-extrabold':'font-medium'}>{k}</span><span className={bold?'font-extrabold':'font-semibold'}>{v}</span></div>)}