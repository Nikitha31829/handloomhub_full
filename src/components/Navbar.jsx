import { Link, NavLink, useNavigate } from 'react-router-dom';
import { ShoppingCart, Search } from 'lucide-react';
import { useCart } from '../state/CartContext.jsx';
import { useAuth } from '../state/AuthContext.jsx';
import clsx from 'clsx';

export default function Navbar(){
  const {count}=useCart();
  const {user,logout}=useAuth();
  const nav=useNavigate();
  return (
    <header className='sticky top-0 z-40 bg-white/90 backdrop-blur border-b border-neutral-100'>
      <div className='container-px h-16 flex items-center justify-between'>
        <Link to='/' className='font-extrabold text-xl tracking-tight'>HandloomHub</Link>
        <nav className='hidden md:flex items-center gap-6'>
          <Nav to='/'>Home</Nav>
          <Nav to='/shop'>Shop</Nav>
          <Nav to='/artisans'>Artisans</Nav>
        </nav>
        <div className='flex items-center gap-3'>
          <button className='btn-ghost hidden sm:inline-flex'><Search className='h-5 w-5 mr-2'/>Search</button>
          <Link to='/cart' className='relative btn-ghost'><ShoppingCart className='h-5 w-5'/>{count>0&&(<span className='absolute -top-2 -right-2 bg-neutral-900 text-white text-[10px] rounded-full px-1.5 py-0.5'>{count}</span>)}</Link>
          {!user?(<>
            <Link to='/login' className='btn-ghost'>Login as Buyer</Link>
            <Link to='/signup' className='btn-primary'>Join as Artisan</Link>
          </>):(
            <div className='flex items-center gap-2'>
              <span className='hidden sm:block text-sm font-medium'>{user.name} <span className='text-neutral-500'>({user.role})</span></span>
              <button className='btn-ghost' onClick={()=>{logout();nav('/');}}>Logout</button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
function Nav({to,children}){
  return (
    <NavLink to={to} className={({isActive})=>clsx('text-sm font-medium hover:text-neutral-900',isActive?'text-neutral-900':'text-neutral-500')}>{children}</NavLink>
  );
}