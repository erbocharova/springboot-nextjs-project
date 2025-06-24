"use client"
import React, { useEffect, useState } from 'react'
import { getBookById } from '@/app/api/books/getBookById'
import Button from '@/app/ui/button/button'
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
            oldPrice: data.old_price ? Number(data.old_price) : undefined,
            imageUrl: data.imageUrl,
            stockQuantity,
            quantity,
            selected: true,
          }
        })
      ).then((items) => setCartItems(items))
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

  // Подсчет итогов
  const totalPrice = cartItems.reduce(
    (sum, item) =>
      item.selected ? sum + item.price * item.quantity : sum,
    0
  )
  const totalOldPrice = cartItems.reduce(
    (sum, item) =>
      item.selected && item.oldPrice ? sum + item.oldPrice * item.quantity : sum,
    0)


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
              <div key={item.id} className="cart-page__item">
                <input
                  type="checkbox"
                  checked={item.selected}
                  onChange={() => toggleSelectItem(item.id)}
                />
                <img
                  src={item.imageUrl}
                  alt={item.name}
                  className="cart-page__item-image"
                />
                <div className="cart-page__item-info">
                  <div className="cart-page__item-title">{item.name}</div>
                  <div className="cart-page__item-author">{item.author}</div>
                </div>
                <div className="cart-page__item-quantity">
                  <Button onClick={() => changeQuantity(item.id, -1)} text="-" icon={null} className="" style={{}} />
                  <span>{item.quantity}</span>
                  {item.quantity < item.stockQuantity ? (
                    <Button
                      onClick={() => changeQuantity(item.id, 1)}
                      text="+"
                      icon={null}
                      className=""
                      style={{}}
                    />
                  ) : (
                    <Button
                      onClick={() => changeQuantity(item.id, 1)}
                      text="+"
                      icon={null}
                      className=""
                      style={{ display: 'none' }}
                    />
                  )}
                </div>
                <div className="cart-page__item-max-quantity">
                  Максимум доступно: {item.stockQuantity}
                </div>
                <div className="cart-page__item-prices">
                  {item.oldPrice && (
                    <span className="cart-page__item-old-price">
                      {item.oldPrice} ₽
                    </span>
                  )}
                  <span className="cart-page__item-price">
                    {item.quantity} × {item.price} ₽ = {item.quantity * item.price} ₽
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="cart-page__right">
          <h2 className="cart-page__summary-title">
            {cartItems.filter((item) => item.selected).length} товара
          </h2>
          <div className="cart-page__summary">
            <div className="cart-page__summary-row">
              <span>Цена товаров (без скидки):</span>
              <span>{totalOldPrice.toFixed(2)} ₽</span>
            </div>
            <div className="cart-page__summary-row">
              <span>Скидка на товары:</span>
              <span>0 ₽</span>
            </div>
            <div className="cart-page__summary-row">
              <span>Оплата балансом:</span>
              <span>0 ₽</span>
            </div>
            <div className="cart-page__summary-row cart-page__promo-code">
              <input
                type="text"
                placeholder="Промокод"
                value={promoCode}
                onChange={(e) => setPromoCode(e.target.value)}
              />
              <Button onClick={applyPromoCode} text="Применить" icon={null} className="" style={{}} />
            </div>
            <div className="cart-page__summary-row cart-page__total">
              <span>Итого без учета доставки:</span>
              <span>{(totalPrice - discount).toFixed(2)} ₽</span>
            </div>
          </div>
          {isAuthenticated ? (
            <Button
              className="cart-page__checkout-button"
              onClick={handleCheckout}
              text="К оформлению"
              icon={null}
              style={{}}
            />
          ) : (
            <div className="cart-page__not-authenticated">
              <p>Пожалуйста, зарегистрируйтесь, чтобы оформить заказ.</p>
              <Button
                className="cart-page__register-button"
                onClick={() => router.push('/auth/sign-in')}
                text="Регистрация"
                icon={null}
                style={{}}
              />
            </div>
          )}
          <div className="cart-page__delivery-info">
            <div>Доставка: Москва, 25 мая</div>
          </div>
        </div>
      </div>
    </div>
  )
}
