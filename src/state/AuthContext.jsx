import { createContext, useContext, useMemo, useState } from 'react';
import { storage } from '../lib/storage';
const AuthCtx=createContext(null);
const ROLES=['Buyer','Artisan','Marketing','Admin'];
export function AuthProvider({children}){
  const [user,setUser]=useState(()=>storage.get('hh:user',null));
  const value=useMemo(()=>({user,roles:ROLES,
    login(credentials){
      const users=storage.get('hh:users',[]);
      const found=users.find(u=>u.email===credentials.email);
      if(!found||found.password!==credentials.password){
        const err=new Error('Invalid email or password'); err.code='AUTH_INVALID'; throw err;
      }
      const session={id:found.id,name:found.name,email:found.email,role:found.role};
      storage.set('hh:user',session); setUser(session); return session;
    },
    signup(data){
      const users=storage.get('hh:users',[]);
      if(users.some(u=>u.email===data.email)){
        const err=new Error('Email already registered'); err.code='EMAIL_EXISTS'; throw err;
      }
      const newUser={id:crypto.randomUUID(),name:data.name,email:data.email,password:data.password,role:data.role};
      users.push(newUser); storage.set('hh:users',users);
      const session={id:newUser.id,name:newUser.name,email:newUser.email,role:newUser.role};
      storage.set('hh:user',session); setUser(session); return session;
    },
    logout(){ storage.remove('hh:user'); setUser(null); },
  }),[user]);
  return <AuthCtx.Provider value={value}>{children}</AuthCtx.Provider>
}
export const useAuth=()=>useContext(AuthCtx);