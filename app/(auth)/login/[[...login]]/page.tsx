import Logo from '@/components/Logo'
import SignIn from '@/components/SignIn'
import React from 'react'

const Login = () => {
  return (
    <main className='flex h-screen w-full justify-center items-center'>
      <div className='flex flex-col items-center gap-4 w-4/5 sm:w-1/2 md:w-1/3 xl:w-1/4 border-gray-300/20 border backdrop-blur-2xl p-8 rounded-xl shadow-md'>
      <Logo />
      <h1 className='text-2xl font-bold text-center'>
        Login to your account
      </h1>
      <SignIn />
      </div>
    </main>
  )
}

export default Login