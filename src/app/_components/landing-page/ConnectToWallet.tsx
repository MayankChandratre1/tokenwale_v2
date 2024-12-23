"use client";
import { cn } from '@/lib/utils';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React from 'react';

export const ConnectToWallet = () => {
  const router = useRouter();
  return (
    <section className='w-full relative md:h-[70vh] h-[50vh] flex flex-col items-center '>
      <Image
        className={cn('absolute left-0 -top-16 w-[22%] lg:w-[16%]')}
        src="/backgrounds/connect-coin-1.png"
        width={1000}
        height={1000}
        alt="Connect Coin 1"
      />
      <div className='md:h-[476px] h-[276px] bg-[#38F68F] w-full flex justify-center items-center flex-col'>
        <p className='uppercase z-96 text-[24px] lg:text-[64px] w-11/12 min-[600px]:w-1/2 md:w-2/3 text-center font-[700] text-[#19231E]' style={{
          zIndex:999
        }}>
          Want to play and earn without any cash?
        </p>
        <button
          onClick={() => { router.push('/auth/new-wallet'); }}
          className='text-white font-semibold tracking-[0.2em] text-[14px] md:text-[16px] bg-black p-2 md:p-4 mt-4 hover:bg-gray-800 transition-colors duration-200'
        >
          Connect to Wallet
        </button>
      </div>
      <Image
        className='w-full relative md:-mt-20 -mt-8'
        src="/backgrounds/bottom-vector-hero.png"
        alt="Bottom Vector"
        width={1000}
        height={1000} 
      />
      <Image
        className='absolute -right-0 sm:right-0 mt-44 sm:mt-32 w-[20%] md:w-[20%] lg:w-[16%]'
        src="/backgrounds/connect-coin-2.png"
        alt="Connect Coin 2"
        width={1000}
        height={1000}
      />
    </section>
  );
};
