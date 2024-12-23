import React from 'react'

const NotFoundPage = () => {
  return (
    <div className='h-screen dashboard-card-bg grid place-items-center'>
        <div className='text-center space-y-4'>
            <div className='text-[10rem] font-bold text-[#38f68f]'>404</div>
            <div className='text-xl text-white'>This page not exists</div>
        </div>
    </div>
  )
}

export default NotFoundPage