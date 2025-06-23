// src/components/book-card/BookCard.tsx
'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import './book-card.scss'

interface Book {
  id: string
  name: string
  author: string
  price: number
  imageUrl: string
}

interface BookCardProps {
  book: Book
}

export const BookCard: React.FC<BookCardProps> = ({ book }) => {
  const router = useRouter()
  const [cartItems, setCartItems] = useState<Set<string>>(new Set())

  // Инициализируем корзину из localStorage
  useEffect(() => {
    const stored = localStorage.getItem('cartItems')
    if (stored) {
      setCartItems(new Set(JSON.parse(stored)))
    }
  }, [])

  const isInCart = cartItems.has(book.id)

  const handleAddToCart = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation()
    const next = new Set(cartItems)
    next.add(book.id)
    setCartItems(next)
    localStorage.setItem('cartItems', JSON.stringify(Array.from(next)))
  }

  const handleCardClick = () => {
    router.push(`/book/${book.id}`)
  }

  const handleCheckout = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation()
    router.push('/checkout')
  }

  return (
    <div
      className="book-card"
      onClick={handleCardClick}
      style={{ cursor: 'pointer' }}
    >
      <img src={book.imageUrl} alt={book.name} className="book-card__image" />
      <div className="book-card__info">
        <h3 className="book-card__title">{book.name}</h3>
        <p className="book-card__author">{book.author}</p>

        {!isInCart ? (
          <div className="book-card__bottom-row">
            <div className="book-card__price-container">{book.price} ₽</div>
            <button
              className="book-card__button"
              onClick={handleAddToCart}
            >
              В корзину
            </button>
          </div>
        ) : (
          <div className="book-card__bottom-row book-card__bottom-row--centered book-card__checkout-container">
            <button
              className="book-card__button book-card__button--checkout"
              onClick={handleCheckout}
            >
              Оформить
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
