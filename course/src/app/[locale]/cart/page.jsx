'use client'
import React, { use } from 'react'
import Cart from '../components/Cart'

const page = ({params}) => {
    const {locale} =use(params)

  return (
  <Cart />
  )
}

export default page
