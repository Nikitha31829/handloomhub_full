import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { storage } from '../lib/storage';
import { products } from '../data/products';
import { useAuth } from '../state/AuthContext.jsx';

export default function Profile() {
  const navigate = useNavigate();
  const auth = useAuth?.(); // guard if exported differently (assumes hook returns { user })
  const user = auth?.user ?? null;

  useEffect(() => {
    if (!user) navigate('/login', { replace: true });
  }, [user, navigate]);

  // ------- initial data -------
  // orders previously saved by checkout flow
  const allOrders = storage.get('hh:orders', []);
  const myOrders = useMemo(() => {
    if (!user) return [];
    return allOrders.filter(o => (o.shipTo?.email ?? '').toLowerCase() === (user.email ?? '').toLowerCase());
  }, [allOrders, user]);

  // wishlist stored in local storage (array of product ids) or fallback
  const storedWishlist = storage.get('hh:wishlist', null);
  const wishlistIds = Array.isArray(storedWishlist) ? storedWishlist : [ products[0]?.id, products[2]?.id ].filter(Boolean);
  const wishlistItems = products.filter(p => wishlistIds.includes(p.id));

  // addresses (local component state persisted to storage)
  const initialAddresses = storage.get('hh:addresses', user?.addresses ?? [
    { id: 'a1', label: 'Home', name: `${user?.firstName ?? 'You'} ${user?.lastName ?? ''}`.trim(), phone: user?.phone ?? '', line: user?.address ?? 'Your address', city: user?.city ?? '', state: user?.state ?? '', zip: user?.zip ?? '' }
  ]);
  const [addresses, setAddresses] = useState(initialAddresses);
  const [activeTab, setActiveTab] = useState('profile');
  const [editingAddr, setEditingAddr] = useState(null);

  // profile form (front-end only)
  const [profileForm, setProfileForm] = useState({
    firstName: user?.firstName ?? user?.name?.split?.(' ')?.[0] ?? '',
    lastName: user?.lastName ?? user?.name?.split?.(' ')?.slice(1).join(' ') ?? '',
    email: user?.email ?? '',
    phone: user?.phone ?? '',
    defaultAddress: user?.address ?? addresses?.[0]?.line ?? ''
  });

  useEffect(() => storage.set('hh:addresses', addresses), [addresses]);

  // orders mock fallback if none
  const ordersToShow = myOrders.length ? myOrders : [
    { id: 'ORD-0001', createdAt: new Date().toISOString(), amounts: { total: 129.99 }, status: 'Delivered', items: [{ title: 'Banarasi Sari' }] },
    { id: 'ORD-0002', createdAt: new Date().toISOString(), amounts: { total: 79.5 }, status: 'Packed', items: [{ title: 'Ikat Shawl' }] }
  ];

  // helpers
  const saveProfile = () => {
    // local-only: store a copy for demo
    const newUser = { ...user, firstName: profileForm.firstName, lastName: profileForm.lastName, phone: profileForm.phone, address: profileForm.defaultAddress };
    storage.set('hh:user', newUser);
    // If your auth store exposes an update function, use it here.
    alert('Profile changes saved locally (demo).');
  };

  const addAddress = (addr) => {
    const next = [{ ...addr, id: `a_${Date.now()}` }, ...addresses];
    setAddresses(next);
  };
  const updateAddress = (id, updates) => setAddresses(prev => prev.map(a => a.id === id ? { ...a, ...updates } : a));
  const deleteAddress = (id) => setAddresses(prev => prev.filter(a => a.id !== id));

  return (
    <div className="container-px py-10">
      <div className="bg-white rounded-2xl p-6 shadow-soft">
        <div className="flex flex-col md:flex-row items-center gap-6">
          {/* avatar */}
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-primary-600 to-primary-400 flex items-center justify-center text-white text-2xl font-bold">
              {user?.avatar ? <img src={user.avatar} alt={user.name} className='w-full h-full rounded-full object-cover' /> : (user?.firstName ? `${user.firstName[0] ?? ''}${user.lastName?.[0] ?? ''}` : (user?.email?.[0] ?? 'U'))}
            </div>
            <div>
              <div className="text-lg font-semibold">{user?.firstName ? `${user.firstName} ${user.lastName ?? ''}`.trim() : user?.name ?? 'Guest'}</div>
              <div className="text-sm text-neutral-500">{user?.email ?? 'no-email@example.com'}</div>
              <div className="text-xs text-neutral-400 mt-1">Member since {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : '—'}</div>
            </div>
          </div>

          <div className="ml-auto flex gap-3">
            <Link to="/orders" className="btn-ghost">My Orders</Link>
            <Link to="/shop" className="btn-primary">Shop</Link>
          </div>
        </div>
      </div>

      {/* tabs */}
      <div className="mt-6 grid grid-cols-1 lg:grid-cols-4 gap-6">
        <nav className="bg-white rounded-2xl p-4 shadow-sm lg:col-span-1">
          <ul className="space-y-2">
            <li>
              <button onClick={() => setActiveTab('profile')} className={`w-full text-left px-3 py-2 rounded ${activeTab==='profile' ? 'bg-primary-50 text-primary-700 font-semibold' : 'hover:bg-neutral-100'}`}>Profile Info</button>
            </li>
            <li>
              <button onClick={() => setActiveTab('orders')} className={`w-full text-left px-3 py-2 rounded ${activeTab==='orders' ? 'bg-primary-50 text-primary-700 font-semibold' : 'hover:bg-neutral-100'}`}>Orders</button>
            </li>
            <li>
              <button onClick={() => setActiveTab('wishlist')} className={`w-full text-left px-3 py-2 rounded ${activeTab==='wishlist' ? 'bg-primary-50 text-primary-700 font-semibold' : 'hover:bg-neutral-100'}`}>Wishlist</button>
            </li>
            <li>
              <button onClick={() => setActiveTab('addresses')} className={`w-full text-left px-3 py-2 rounded ${activeTab==='addresses' ? 'bg-primary-50 text-primary-700 font-semibold' : 'hover:bg-neutral-100'}`}>Addresses</button>
            </li>
          </ul>
        </nav>

        <main className="lg:col-span-3">
          {/* Profile Info */}
          {activeTab === 'profile' && (
            <section className="bg-white rounded-2xl p-6 shadow-sm">
              <h3 className="text-lg font-bold mb-4">Profile Info</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="label">First name</label>
                  <input className="field" value={profileForm.firstName} onChange={(e) => setProfileForm(s => ({...s, firstName: e.target.value}))} />
                </div>
                <div>
                  <label className="label">Last name</label>
                  <input className="field" value={profileForm.lastName} onChange={(e) => setProfileForm(s => ({...s, lastName: e.target.value}))} />
                </div>
                <div>
                  <label className="label">Email</label>
                  <input className="field" value={profileForm.email} onChange={(e) => setProfileForm(s => ({...s, email: e.target.value}))} />
                </div>
                <div>
                  <label className="label">Phone</label>
                  <input className="field" value={profileForm.phone} onChange={(e) => setProfileForm(s => ({...s, phone: e.target.value}))} />
                </div>
                <div className="md:col-span-2">
                  <label className="label">Default address</label>
                  <input className="field" value={profileForm.defaultAddress} onChange={(e) => setProfileForm(s => ({...s, defaultAddress: e.target.value}))} />
                </div>
              </div>

              <div className="mt-4 flex gap-3">
                <button className="btn-primary" onClick={saveProfile}>Save profile</button>
                <button className="btn-ghost" onClick={() => {
                  setProfileForm({
                    firstName: user?.firstName ?? '',
                    lastName: user?.lastName ?? '',
                    email: user?.email ?? '',
                    phone: user?.phone ?? '',
                    defaultAddress: user?.address ?? ''
                  });
                }}>Reset</button>
              </div>
            </section>
          )}

          {/* Orders */}
          {activeTab === 'orders' && (
            <section className="bg-white rounded-2xl p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold">Orders</h3>
                <div className="text-sm text-neutral-500">{ordersToShow.length} order(s)</div>
              </div>

              <div className="mt-4 space-y-3">
                {ordersToShow.map(o => (
                  <div key={o.id} className="border rounded-lg p-4 flex items-center justify-between">
                    <div>
                      <div className="font-semibold">{o.id}</div>
                      <div className="text-sm text-neutral-500">{new Date(o.createdAt || Date.now()).toLocaleDateString()}</div>
                      <div className="text-sm text-neutral-600 mt-2">{o.items?.map(it => it.title).join(', ')}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold">${(o.amounts?.total ?? o.amounts ?? 0).toFixed(2)}</div>
                      <div className="text-xs text-neutral-500 mt-1">{o.status ?? 'Processing'}</div>
                      <div className="mt-2 flex gap-2">
                        <Link to={`/orders/${o.id}`} className="btn-ghost text-xs">View</Link>
                        <Link to="/orders" className="btn-primary text-xs">Track</Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Wishlist */}
          {activeTab === 'wishlist' && (
            <section className="bg-white rounded-2xl p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold">Wishlist</h3>
                <div className="text-sm text-neutral-500">{wishlistItems.length} saved</div>
              </div>

              <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                {wishlistItems.map(w => (
                  <Link key={w.id} to={`/product/${w.id}`} className="border rounded-lg p-3 flex gap-3 hover:shadow-md transition">
                    <img src={w.image} alt={w.title} className="w-20 h-20 rounded object-cover" />
                    <div className="flex-1">
                      <div className="font-semibold">{w.title}</div>
                      <div className="text-sm text-neutral-500">by {w.vendor ?? 'artisan'}</div>
                      <div className="mt-2 font-semibold">${Number(w.price).toFixed(2)}</div>
                    </div>
                    <div className="self-start">
                      <button className="btn-ghost text-xs" onClick={(e) => {
                        e.preventDefault();
                        // remove from wishlist in storage
                        const next = wishlistIds.filter(id => id !== w.id);
                        storage.set('hh:wishlist', next);
                        window.location.reload();
                      }}>Remove</button>
                    </div>
                  </Link>
                ))}
              </div>

              {wishlistItems.length === 0 && <div className="mt-4 text-sm text-neutral-500">No saved items yet.</div>}
            </section>
          )}

          {/* Addresses */}
          {activeTab === 'addresses' && (
            <section className="bg-white rounded-2xl p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold">Saved Addresses</h3>
                <button className="btn-primary text-sm" onClick={() => setEditingAddr({})}>Add address</button>
              </div>

              <div className="mt-4 space-y-3">
                {addresses.map(a => (
                  <div key={a.id} className="border rounded-lg p-4 flex items-start justify-between">
                    <div>
                      <div className="font-semibold">{a.label} — {a.name}</div>
                      <div className="text-sm text-neutral-500 mt-1">{a.line}, {a.city} • {a.state} • {a.zip}</div>
                      <div className="text-xs text-neutral-400 mt-1">{a.phone}</div>
                    </div>
                    <div className="flex flex-col gap-2">
                      <button className="btn-ghost text-sm" onClick={() => setEditingAddr(a)}>Edit</button>
                      <button className="btn-ghost text-sm text-red-600" onClick={() => {
                        if (!confirm('Delete address?')) return;
                        deleteAddress(a.id);
                      }}>Delete</button>
                    </div>
                  </div>
                ))}

                {addresses.length === 0 && <div className="text-sm text-neutral-500">No saved addresses yet.</div>}

                {/* add / edit address inline */}
                {editingAddr && (
                  <div className="mt-4 border rounded-lg p-4 bg-neutral-50">
                    <h4 className="font-semibold text-sm mb-2">{editingAddr.id ? 'Edit address' : 'Add address'}</h4>
                    <AddressForm initial={editingAddr} onCancel={() => setEditingAddr(null)} onSave={(payload) => {
                      if (editingAddr.id) updateAddress(editingAddr.id, payload);
                      else addAddress(payload);
                      setEditingAddr(null);
                    }} />
                  </div>
                )}
              </div>
            </section>
          )}
        </main>
      </div>
    </div>
  );
}

/* small address form */
function AddressForm({ initial = {}, onCancel, onSave }) {
  const [form, setForm] = useState({
    label: initial.label ?? 'Home',
    name: initial.name ?? '',
    phone: initial.phone ?? '',
    line: initial.line ?? '',
    city: initial.city ?? '',
    state: initial.state ?? '',
    zip: initial.zip ?? '',
  });

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
      <div>
        <label className="label">Label</label>
        <input className="field" value={form.label} onChange={(e)=> setForm(s=> ({...s,label:e.target.value}))} />
      </div>
      <div>
        <label className="label">Name</label>
        <input className="field" value={form.name} onChange={(e)=> setForm(s=> ({...s,name:e.target.value}))} />
      </div>
      <div>
        <label className="label">Phone</label>
        <input className="field" value={form.phone} onChange={(e)=> setForm(s=> ({...s,phone:e.target.value}))} />
      </div>
      <div>
        <label className="label">ZIP</label>
        <input className="field" value={form.zip} onChange={(e)=> setForm(s=> ({...s,zip:e.target.value}))} />
      </div>

      <div className="md:col-span-2">
        <label className="label">Address</label>
        <input className="field" value={form.line} onChange={(e)=> setForm(s=> ({...s,line:e.target.value}))} />
      </div>
      <div>
        <label className="label">City</label>
        <input className="field" value={form.city} onChange={(e)=> setForm(s=> ({...s,city:e.target.value}))} />
      </div>
      <div>
        <label className="label">State / Region</label>
        <input className="field" value={form.state} onChange={(e)=> setForm(s=> ({...s,state:e.target.value}))} />
      </div>

      <div className="md:col-span-2 flex gap-3 justify-end mt-2">
        <button className="btn-ghost" onClick={onCancel}>Cancel</button>
        <button className="btn-primary" onClick={() => {
          // minimal validation
          if (!form.line || !form.name) return alert('Please fill name and address line');
          onSave({ ...form });
        }}>Save</button>
      </div>
    </div>
  );
}