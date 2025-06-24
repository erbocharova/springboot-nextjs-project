"use client"
import React from 'react'
import Button from '@/app/ui/button/button'

interface CartItemProps {
  item: {
    id: string
    name: string
    author: string
    price: number
    oldPrice?: number
    imageUrl: string
    stockQuantity: number
    quantity: number
    selected: boolean
  }
  toggleSelectItem: (id: string) => void
  changeQuantity: (id: string, delta: number) => void
}

export default function CartItem({ item, toggleSelectItem, changeQuantity }: CartItemProps) {
  return (
    <div className="cart-page__item">
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
      <div className="cart-page__item-quantity-wrapper">
        <div className="cart-page__item-quantity">
          <Button
            onClick={() => changeQuantity(item.id, -1)}
            text="-"
            icon={null}
            className=""
            style={{}}
          />
          <span>{item.quantity}</span>
          <Button
            onClick={() => changeQuantity(item.id, 1)}
            text="+"
            icon={null}
            className=""
            style={{}}
          />
        </div>
        <div className="cart-page__item-max-quantity">
          максимум доступно: {item.stockQuantity}
        </div>
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
  )
}
