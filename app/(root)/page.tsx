'use client'
import Navbar from '@/components/Navbar'
import { useRouter } from 'next/navigation'
import React from 'react'

const LandingPage = () => {
  const router = useRouter();
  return (
    <div>
      <Navbar/>
      <div className='flex min-h-screen flex-1 flex-col pt-22 px-6'>
      LandingPage
      <button className='bg-blue-500 text-white px-4 py-2 rounded-md cursor-pointer' onClick={() => router.push('/home')}>
        to main page
      </button>
      </div>
      </div>
  )
}

export default LandingPage