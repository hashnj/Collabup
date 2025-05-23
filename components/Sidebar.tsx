'use client'
import { sidebarLinks } from '@/constants'
import { cn } from '@/lib/utils';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation'
import React from 'react'

const Sidebar = () => {
  const pathname = usePathname();
  return (
    <section className='sticky left-0 top-0 h-screen border-r border-neutral-300 dark:border-neutral-600 w-fit flex-col justify-between bg-neutral-100 dark:bg-neutral-950 p-6 pt-28 max-sm:hidden lg:w-[264px] text-white'>
      <div className='flex flex-col flex-1 gap-6'>
        {sidebarLinks.map((link) =>{
          const isActive= pathname === link.route || pathname && pathname.startsWith(`${link.route}/`);
        return (
          <Link 
            href ={link.route} 
            key={link.label}
            className={cn('flex items-center gap-4 p-4 rounded-lg justify-start', {'bg-blue-500':isActive})}>
          <Image 
          src={link.imgURL}
          alt={link.label}
          width={24}
          height={24}
          />
          <p className='text-lg font-semibold max-lg:hidden'>{link.label}
          </p>
          </Link>
        )
        })}
      </div>

    </section>
    )
}

export default Sidebar