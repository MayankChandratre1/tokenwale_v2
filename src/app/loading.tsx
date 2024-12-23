import { Loader2 } from 'lucide-react'
import React from 'react'

const loading = () => {
  return (
    <div className='bg-[#2d2d2d] grid place-items-center min-h-screen'>
        <Loader2 color='#38f68f' className='animate-spin w-10 h-10' />
    </div>
  )
}

export default loading