import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuth } from '../state/AuthContext.jsx';
import { Link, useNavigate } from 'react-router-dom';
const schema=z.object({name:z.string().min(3,'Name must be at least 3 characters'),email:z.string().email('Enter a valid email'),password:z.string().min(8,'Minimum 8 characters').regex(/[A-Z]/,'Include an uppercase letter').regex(/[a-z]/,'Include a lowercase letter').regex(/\d/,'Include a number').regex(/[^\w\s]/,'Include a special character'),confirm:z.string(),role:z.enum(['Buyer','Artisan','Marketing','Admin']),}).refine((data)=>data.password===data.confirm,{message:'Passwords do not match',path:['confirm']});
export default function Signup(){
  const { signup, roles }=useAuth();
  const nav=useNavigate();
  const { register, handleSubmit, formState:{errors,isSubmitting}, setError }=useForm({resolver:zodResolver(schema),mode:'onBlur',defaultValues:{role:'Buyer'}});
  const onSubmit=(data)=>{try{signup(data);nav('/shop');}catch(e){setError('root',{message:e.message});}};
  return (
    <div className='container-px py-12 grid place-items-center'>
      <div className='w-full max-w-md bg-white p-6 rounded-2xl shadow-soft'>
        <h1 className='text-2xl font-extrabold mb-6'>Create account</h1>
        <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
          <div><div className='label'>Full Name</div><input className='field' {...register('name')} placeholder='Priya Sharma'/>{errors.name&&<p className='text-sm text-red-600 mt-1'>{errors.name.message}</p>}</div>
          <div><div className='label'>Email</div><input className='field' {...register('email')} placeholder='you@example.com'/>{errors.email&&<p className='text-sm text-red-600 mt-1'>{errors.email.message}</p>}</div>
          <div><div className='label'>Password</div><input type='password' className='field' {...register('password')} placeholder='Strong password'/>{errors.password&&<p className='text-sm text-red-600 mt-1'>{errors.password.message}</p>}</div>
          <div><div className='label'>Confirm Password</div><input type='password' className='field' {...register('confirm')} placeholder='Repeat password'/>{errors.confirm&&<p className='text-sm text-red-600 mt-1'>{errors.confirm.message}</p>}</div>
          <div><div className='label'>Role</div><select className='field' {...register('role')}>{roles.map(r=><option key={r} value={r}>{r}</option>)}</select>{errors.role&&<p className='text-sm text-red-600 mt-1'>{errors.role.message}</p>}</div>
          {errors.root&&<p className='text-sm text-red-600'>{errors.root.message}</p>}
          <button disabled={isSubmitting} className='btn-primary w-full'>Create account</button>
        </form>
        <p className='text-sm text-neutral-600 mt-4'>Already have an account? <Link to='/login' className='underline'>Login</Link></p>
      </div>
    </div>
  );
}