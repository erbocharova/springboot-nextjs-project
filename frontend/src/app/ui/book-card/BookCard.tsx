'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { loadCartItems, saveCartItems, CartItemsMap } from '@/app/api/cartStorage'
import './book-card.scss'

import { Book } from '@/app/domain/Book'

interface BookCardProps {
  book: Book
}

export const BookCard: React.FC<BookCardProps> = ({ book }) => {
  const router = useRouter()
  const [cartItems, setCartItems] = useState<CartItemsMap>({})

  // Инициализируем корзину из localStorage
  useEffect(() => {
    const stored = loadCartItems()
    setCartItems(stored)
  }, [])

  const isInCart = book.id in cartItems

  const handleAddToCart = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();

    const updatedCartItems = {
      ...cartItems,
      [book.id]: (cartItems[book.id] || 0) + 1,
    };
    
    setCartItems(updatedCartItems);
    saveCartItems(updatedCartItems);
  }

  const handleCardClick = () => {
    router.push(`/book/${book.id}`)
  }

  const handleCheckout = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation()
    router.push('/cart')
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
