"use client"
import React from 'react'
import Button from '@/app/ui/button/button'

import { Book } from '@/app/domain/Book'

interface CartItem extends Book {
  quantity: number
  selected: boolean
}

interface CartSummaryProps {
  cartItems: CartItem[]
  discount: number
  promoCode: string
  deliveryDate: string
  setPromoCode: (code: string) => void
  applyPromoCode: () => void
  isAuthenticated: boolean
  handleCheckout: () => void
  onRegisterClick: () => void
}

export default function CartSummary({
  cartItems,
  discount,
  promoCode,
  setPromoCode,
  applyPromoCode,
  isAuthenticated,
  handleCheckout,
  onRegisterClick,
  deliveryDate
}: CartSummaryProps) {
  const totalPrice = cartItems.reduce(
    (sum, item) =>
      item.selected ? sum + item.price * item.quantity : sum,
    0
  )

  return (
    <div className="cart-page__right">
      <h2 className="cart-page__summary-title">
        {cartItems.filter((item) => item.selected).length} товара
      </h2>
      <div className="cart-page__summary">
        <div className="cart-page__summary-row">
          <span>Цена товаров:</span>
          <span>{totalPrice.toFixed(2)} ₽</span>
        </div>
        <div className="cart-page__summary-row cart-page__total">
          <span>Итого без учета доставки:</span>
          <span>{(totalPrice - discount).toFixed(2)} ₽</span>
        </div>
      </div>
      {cartItems.length != 0 ? (isAuthenticated ? (
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
            onClick={onRegisterClick}
            text="Регистрация"
            icon={null}
            style={{}}
          />
        </div>
      )) : <span></span>}
      <div className="cart-page__delivery-info">
        <div>Доставка: Ростов-на-Дону, {deliveryDate}</div>
      </div>
    </div>
  )
}
