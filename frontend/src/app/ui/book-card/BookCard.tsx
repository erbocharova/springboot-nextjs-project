import React from 'react'
import './book-card.scss'

interface BookCardProps {
  id?: string
  title: string
  author: string
  price: number
  cover: string
  onAddToCart?: () => void
}

export const BookCard: React.FC<BookCardProps> = ({ id, title, author, price, cover, onAddToCart }) => {
  return (
    <div className="book-card">
      <img src={cover} alt={title} className="book-card__image" />
      <div className="book-card__info">
        <h3 className="book-card__title">{title}</h3>
        <p className="book-card__author">{author}</p>
        <p className="book-card__price">{price} ₽</p>
        <button className="book-card__button" onClick={onAddToCart}>
          В корзину
        </button>
      </div>
    </div>
  )
}
