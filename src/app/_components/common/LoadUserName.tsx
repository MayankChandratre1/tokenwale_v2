import { userName } from '@/utils/random'
import React from 'react'

const LoadUserName = ({qrUserId}:{
    qrUserId:string
}) => {
    
  return (
    <p className="uppercase">{userName(qrUserId)}</p>
  )
}

export default LoadUserName