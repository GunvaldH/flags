'use client'
import Image from 'next/image'
import Link from 'next/link';
import AllTheFlags from './flagpage/page';

export default function Home() {
  return (
    <div className="bg-slate-50 text-black">
      <div> 
        
      <Link
          className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded'
          href='/quiz'
          key='Quiz'>{'Quiz'}
        </Link>
        <Link
          className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded'
          href='/flagpage'
          key='Alle flagg'>{'Alle flag'}
        </Link>
        </div>


    </div>
  )
}
