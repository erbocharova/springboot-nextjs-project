"use client"
import React from 'react'
import Button from '@/app/ui/button/button'

interface CartItem {
  id: string
  selected: boolean
  oldPrice?: number
  price: number
  quantity: number
}

interface CartSummaryProps {
  cartItems: CartItem[]
  totalOldPrice: number
  discount: number
  promoCode: string
  setPromoCode: (code: string) => void
  applyPromoCode: () => void
  isAuthenticated: boolean
  handleCheckout: () => void
  onRegisterClick: () => void
}

export default function CartSummary({
  cartItems,
  totalOldPrice,
  discount,
  promoCode,
  setPromoCode,
  applyPromoCode,
  isAuthenticated,
  handleCheckout,
  onRegisterClick,
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
          <span>Цена товаров (без скидки):</span>
          <span>{totalPrice.toFixed(2)} ₽</span>
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
            onClick={onRegisterClick}
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
  )
}
