import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuth } from '../state/AuthContext.jsx';
import { Link, useNavigate } from 'react-router-dom';
const schema=z.object({email:z.string().email('Enter a valid email'),password:z.string().min(8,'Minimum 8 characters')});
export default function Login(){
  const { login }=useAuth();
  const nav=useNavigate();
  const { register, handleSubmit, formState:{errors,isSubmitting}, setError }=useForm({resolver:zodResolver(schema),mode:'onBlur'});
  const onSubmit=async (data)=>{try{login(data);nav('/shop');}catch(e){setError('root',{message:e.message});}};
  return (
    <div className='container-px py-12 grid place-items-center'>
      <div className='w-full max-w-md bg-white p-6 rounded-2xl shadow-soft'>
        <h1 className='text-2xl font-extrabold mb-6'>Login</h1>
        <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
          <div><div className='label'>Email</div><input className='field' {...register('email')} placeholder='you@example.com'/>{errors.email&&<p className='text-sm text-red-600 mt-1'>{errors.email.message}</p>}</div>
          <div><div className='label'>Password</div><input type='password' className='field' {...register('password')} placeholder='********'/>{errors.password&&<p className='text-sm text-red-600 mt-1'>{errors.password.message}</p>}</div>
          {errors.root&&<p className='text-sm text-red-600'>{errors.root.message}</p>}
          <button disabled={isSubmitting} className='btn-primary w-full'>Login</button>
        </form>
        <p className='text-sm text-neutral-600 mt-4'>New here? <Link to='/signup' className='underline'>Create an account</Link></p>
      </div>
    </div>
  );
}