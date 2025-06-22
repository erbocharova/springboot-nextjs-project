import React from 'react'
import './book-card.scss'

interface BookCardProps {
  title: string
  author: string
  price: number
  cover: string
  onAddToCart?: () => void
  onClick?: () => void
  addedToCart: boolean
  onCheckout?: () => void
}

export const BookCard: React.FC<BookCardProps> = ({ title, author, price, cover, onAddToCart, onClick, addedToCart, onCheckout }) => {
  const handleAddToCart = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation()
    if (onAddToCart) {
      onAddToCart()
    }
  }

  const handleCheckout = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation()
    if (onCheckout) {
      onCheckout()
    }
  }

  return (
    <div className="book-card" onClick={onClick} style={{ cursor: onClick ? 'pointer' : 'default' }}>
      <img src={cover} alt={title} className="book-card__image" />
      <div className="book-card__info">
        <h3 className="book-card__title">{title}</h3>
        <p className="book-card__author">{author}</p>
        {!addedToCart ? (
          <div className="book-card__bottom-row">
            <div className="book-card__price-container">Цена: {price} ₽</div>
            {onAddToCart && (
              <button className="book-card__button" onClick={handleAddToCart}>
                В корзину
              </button>
            )}
          </div>
        ) : (
          <div className="book-card__bottom-row book-card__bottom-row--centered book-card__checkout-container">
            <button className="book-card__button book-card__button--checkout" onClick={handleCheckout}>
              Оформить
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
