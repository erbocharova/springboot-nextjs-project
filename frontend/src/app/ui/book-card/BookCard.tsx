import React from 'react'
import './book-card.scss'

interface BookCardProps {
  id?: string
  title: string
  author: string
  price: number
  cover: string
  onAddToCart?: () => void
  onClick?: () => void
}

export const BookCard: React.FC<BookCardProps> = ({ id, title, author, price, cover, onAddToCart, onClick }) => {
  return (
    <div className="book-card" onClick={onClick} style={{ cursor: onClick ? 'pointer' : 'default' }}>
      <img src={cover} alt={title} className="book-card__image" />
      <div className="book-card__info">
        <h3 className="book-card__title">{title}</h3>
        <p className="book-card__author">{author}</p>
        <p className="book-card__price">{price} ₽</p>
        {onAddToCart && (
          <button className="book-card__button" onClick={(e) => { e.stopPropagation(); onAddToCart(); }}>
            В корзину
          </button>
        )}
      </div>
    </div>
  )
}
