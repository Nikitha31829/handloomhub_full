import { Link } from 'react-router-dom';
export default function Artisans(){
  const artisans=[
    {id:1,name:'Priya Sharma',craft:'Banarasi weaving',place:'Varanasi',img:'/images/artisan-1.jpg'},
    {id:2,name:'Maya Textile Co.',craft:'Handloom cotton',place:'Coimbatore',img:'/images/artisan-2.jpg'},
    {id:3,name:'Indigo Crafts',craft:'Block printing',place:'Jaipur',img:'/images/artisan-3.jpg'},
  ];
  return (
    <div className='container-px py-10'>
      <h2 className='text-2xl font-extrabold mb-6'>Artisans</h2>
      <div className='grid sm:grid-cols-2 lg:grid-cols-3 gap-6'>
        {artisans.map(a=>(
          <Link to={`/artisan/${a.id}`} key={a.id} className='bg-white rounded-2xl shadow-soft p-5 hover:shadow-lg hover:-translate-y-0.5 transition'>
            <div className='h-40 rounded-xl overflow-hidden mb-4'><img className='w-full h-full object-cover' src={a.img} alt={a.name}/></div>
            <h3 className='font-bold text-lg'>{a.name}</h3>
            <p className='text-neutral-600'>{a.craft}</p>
            <p className='text-neutral-500 text-sm'>{a.place}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}