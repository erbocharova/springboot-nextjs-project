'use client'

import React, { useEffect } from 'react'
import { getBookById } from '@/app/api/books/getBookById'
import { loadCartItems, CartItemsMap } from '@/app/api/cartStorage'

import { CartItem} from '@/app/domain/CartItem'

interface CartItemsLoaderProps {
  setCartItems: React.Dispatch<React.SetStateAction<CartItem[]>>
}

const CartItemsLoader: React.FC<CartItemsLoaderProps> = ({ setCartItems }) => {
  useEffect(() => {
    const loadItems = async () => {
      const cartItemsMap: CartItemsMap = loadCartItems()
      const token = localStorage.getItem('token') || ''
      const ids = Object.keys(cartItemsMap)
      if (ids.length > 0) {
        const items = await Promise.all(
          ids.map(async (id) => {
            const data = await getBookById(token, id)
            const stockQuantity = Number(data.quantity)
            const quantity = cartItemsMap[id]
            return {
              id: data.id,
              name: data.name,
              author: data.author,
              price: Number(data.price),
              oldPrice: data.old_price !== undefined && data.old_price !== null ? Number(data.old_price) : 0,
              imageUrl: data.imageUrl,
              stockQuantity,
              quantity,
              selected: true,
            }
          })
        )
        console.log('Loaded cart items:', items)
        setCartItems(items)
      }
    }
    loadItems()
  }, [setCartItems])

  return null
}

export default CartItemsLoader
