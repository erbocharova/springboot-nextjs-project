"use client"
import React, { useEffect, useState } from 'react'
import { getBookById } from '@/app/api/books/getBookById'
import CartItem from './CartItem'
import CartSummary from './CartSummary'
import { useRouter } from 'next/navigation'
import { useAuthStatus } from '@/app/hooks/useAuthStatus'
import { loadCartItems, saveCartItems, CartItemsMap } from '@/app/api/cartStorage'
import './cart.scss'

interface Book {
  id: string
  name: string
  author: string
  price: number
  oldPrice?: number
  imageUrl: string
  stockQuantity: number // складское количество
}

interface CartItem extends Book {
  quantity: number
  selected: boolean
}

export default function CartPage() {
  const { isAuthenticated } = useAuthStatus()
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [selectAll, setSelectAll] = useState(true)
  const [promoCode, setPromoCode] = useState('')
  const [discount, setDiscount] = useState(0)
  const router = useRouter()

  // Загрузка cartItems из localStorage и получение данных книг
  useEffect(() => {
    const cartItemsMap: CartItemsMap = loadCartItems()
    const token = localStorage.getItem('token') || ''
    const ids = Object.keys(cartItemsMap)
    if (ids.length > 0) {
      Promise.all(
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
      ).then((items) => {
        console.log('Loaded cart items:', items)
        setCartItems(items)
      })
    }
  }, [])

  // Сохраняем cartItems в localStorage при изменении
  useEffect(() => {
    const cartItemsMap: CartItemsMap = {}
    cartItems.forEach((item) => {
      cartItemsMap[item.id] = item.quantity
    })
    saveCartItems(cartItemsMap)
  }, [cartItems])

  // Обработка выбора всех
  const toggleSelectAll = () => {
    const newSelectAll = !selectAll
    setSelectAll(newSelectAll)
    setCartItems((items) =>
      items.map((item) => ({ ...item, selected: newSelectAll }))
    )
  }

  // Обработка выбора отдельной книги
  const toggleSelectItem = (id: string) => {
    setCartItems((items) =>
      items.map((item) =>
        item.id === id ? { ...item, selected: !item.selected } : item
      )
    )
  }

  // Изменение количества
  const changeQuantity = (id: string, delta: number) => {
    setCartItems((items) =>
      items.map((item) => {
        if (item.id === id) {
          const newQuantity = item.quantity + delta
          const maxQuantity = item.stockQuantity // складское количество
          console.log(`changeQuantity called for id=${id}, delta=${delta}, current quantity=${item.quantity}, maxQuantity=${maxQuantity}, newQuantity=${newQuantity}`)
          return {
            ...item,
            quantity: newQuantity > 0 ? (newQuantity <= maxQuantity ? newQuantity : maxQuantity) : 1,
          }
        }
        return item
      })
    )
  }


  const totalPrice = cartItems.reduce(
    (sum, item) =>
      item.selected ? sum + item.price * item.quantity : sum,
    0
  )

  // Обработка промокода (заглушка)
  const applyPromoCode = () => {
    // Пример: скидка 10% при промокоде "DISCOUNT10"
    if (promoCode === 'DISCOUNT10') {
      setDiscount(totalPrice * 0.1)
    } else {
      setDiscount(0)
    }
  }

  // Кнопка оформления
  const handleCheckout = () => {
    router.push('/checkout')
  }

  return (
    <div className="cart-page">
      <h1 className="cart-page__title">Корзина</h1>
      <div className="cart-page__container">
        <div className="cart-page__left">
          <label className="cart-page__select-all">
            <input
              type="checkbox"
              checked={selectAll}
              onChange={toggleSelectAll}
            />
            Выбрать все
          </label>
          <div className="cart-page__items">
            {cartItems.length === 0 && (
              <p className="cart-page__empty">Ваша корзина пуста.</p>
            )}
            {cartItems.map((item) => (
              <CartItem
                key={item.id}
                item={item}
                toggleSelectItem={toggleSelectItem}
                changeQuantity={changeQuantity}
              />
            ))}
          </div>
        </div>
        <CartSummary
          cartItems={cartItems}
          discount={discount}
          promoCode={promoCode}
          setPromoCode={setPromoCode}
          applyPromoCode={applyPromoCode}
          isAuthenticated={isAuthenticated}
          handleCheckout={handleCheckout}
          onRegisterClick={() => router.push('/auth/sign-in')}
        />
      </div>
    </div>
  )
}
