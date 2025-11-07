import { useLocation, Link } from 'react-router-dom';
export default function Confirmed(){
  const { state }=useLocation();
  return (
    <div className='container-px py-20 text-center'>
      <div className='mx-auto mb-6 h-20 w-20 rounded-full bg-green-100 grid place-content-center'><span className='text-3xl'>✔</span></div>
      <h1 className='text-4xl font-extrabold mb-3'>Order Confirmed!</h1>
      <p className='text-neutral-600 mb-8'>Thank you for your purchase. Your order {state?.orderId?`(#${state.orderId.slice(0,8)}) `:''}has been confirmed. You’ll receive an email with tracking details.</p>
      <div className='flex justify-center gap-3'><Link to='/shop' className='btn-ghost'>Continue Shopping</Link><Link to='/' className='btn-primary'>Home</Link></div>
    </div>
  );
}