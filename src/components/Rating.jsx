export default function Rating({ value, reviews }){
  return (<div className='flex items-center gap-1 text-sm'><span>⭐</span><span className='font-semibold'>{value.toFixed(1)}</span><span className='text-neutral-500'>({reviews} reviews)</span></div>);
}