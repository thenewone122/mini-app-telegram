"use client"
import { useUser } from '@/context/context';
import React from 'react'

const page = () => {
  const { user } = useUser();
console.log(user.userId);
  return (
    <div>page</div>
  )
}

export default page