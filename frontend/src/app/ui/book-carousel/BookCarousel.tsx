'use client'

import React, { useEffect, useState } from 'react'
import { BookCard } from '../book-card/BookCard'
import './book-carousel.scss'

interface Book {
  id: string
  name: string
  author: string
  price: number
  imageUrl: string
}

export const BookCarousel: React.FC = () => {
  const [books, setBooks] = useState<Book[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await fetch('http://localhost:8080/api/books/all')
        if (!response.ok) {
          throw new Error('Ошибка при загрузке книг')
        }
        const data = await response.json()
        setBooks(data)
      } catch (err) {
        setError((err as Error).message)
      } finally {
        setLoading(false)
      }
    }
    fetchBooks()
  }, [])

  if (loading) {
    return <div className="book-carousel__loading">Загрузка...</div>
  }

  if (error) {
    return <div className="book-carousel__error">Ошибка: {error}</div>
  }

  return (
    <div className="book-carousel">
      {books.map((book) => (
        <BookCard
          key={book.id}
          title={book.name}
          author={book.author}
          price={book.price}
          cover={book.imageUrl}
        />
      ))}
    </div>
  )
}
