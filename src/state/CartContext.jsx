import { createContext, useContext, useMemo, useState } from 'react';
import { storage } from '../lib/storage';
import { products as catalog } from '../data/products';
const CartCtx=createContext(null);
export function CartProvider({children}){
  const [items,setItems]=useState(()=>storage.get('hh:cart',[]));
  const withDetails=useMemo(()=>items.map(i=>{const p=catalog.find(x=>x.id===i.id);return {...p,qty:i.qty,lineTotal:p.price*i.qty}}),[items]);
  const count=withDetails.reduce((s,i)=>s+i.qty,0);
  const subtotal=withDetails.reduce((s,i)=>s+i.lineTotal,0);
  const shipping=subtotal>0?0:0;
  const tax=subtotal*0.08;
  const total=subtotal+shipping+tax;
  function persist(next){storage.set('hh:cart',next);setItems(next);}
  const api=useMemo(()=>({items:withDetails,count,subtotal,shipping,tax,total,
    add(id,qty=1){const next=[...items];const idx=next.findIndex(i=>i.id===id);if(idx>=0)next[idx].qty+=qty;else next.push({id,qty});persist(next);},
    remove(id){persist(items.filter(i=>i.id!==id));},
    setQty(id,qty){if(qty<=0)return persist(items.filter(i=>i.id!==id));persist(items.map(i=>i.id===id?{...i,qty}:i));},
    clear(){persist([]);},
  }),[items,withDetails,count,subtotal,shipping,tax,total]);
  return <CartCtx.Provider value={api}>{children}</CartCtx.Provider>;
}
export const useCart=()=>useContext(CartCtx);