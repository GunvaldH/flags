'use client'
import Image from 'next/image'
import Link from 'next/link';
import AllTheFlags from './flagpage/page';

export default function Home() {
  return (
    <div className=" text-black">
      <div className="mx-auto w-80 flex flex-col justify-items-center items-center"> 
        
      <Link
          className='bg-blue-500 hover:bg-blue-700 text-white font-bold m-4 py-2 px-4 rounded'
          href='/quiz'
          key='Quiz'>{'Quiz'}
        </Link>
        <Link
          className='bg-blue-500 hover:bg-blue-700 text-white font-bold m-4 py-2 px-4 rounded'
          href='/search'
          key='Søk'>{'Søk flagg'}
        </Link>
        <Link
          className='bg-blue-500 hover:bg-blue-700 text-white font-bold m-4 py-2 px-4 rounded'
          href='/flagpage'
          key='Alle flagg'>{'Alle flagg'}
        </Link>
        <Link
          className='bg-blue-500 hover:bg-blue-700 text-white font-bold m-4 py-2 px-4 rounded'
          href='/flagpageusa'
          key='Amerikanske stater'>{'Amerikanske flagg'}
        </Link>
        </div>


    </div>
  )
}
