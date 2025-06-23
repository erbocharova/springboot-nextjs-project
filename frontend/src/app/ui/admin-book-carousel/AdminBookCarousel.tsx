'use client'

import React, { useState, useEffect } from 'react'
import { BookCard } from '../book-card/BookCard'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/navigation'
import './admin-book-carousel.scss'
import { searchBooks } from '../../api/books/searchBooks'
import { getBookById } from '../../api/books/getBookById'

interface Book {
  id: string
  name: string
  author: string
  price: number
  imageUrl: string
}

interface AdminBookCarouselProps {
  token: string
}

export const AdminBookCarousel: React.FC<AdminBookCarouselProps> = ({ token }) => {
  const [loadType, setLoadType] = useState<'genre' | 'manual'>('genre')
  const [genre, setGenre] = useState('')
  const [manualId, setManualId] = useState('')
  const [books, setBooks] = useState<Book[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [carouselName, setCarouselName] = useState('')
  const [carouselBooks, setCarouselBooks] = useState<Book[]>([])

  console.log('AdminBookCarousel token:', token)
  console.log('API base URL:', process.env.NEXT_PUBLIC_API_URL)

  const fetchBooksByGenre = async () => {
    setLoading(true)
    setError(null)
    try {
      console.log('Fetching books by genre:', genre)
      const data = await searchBooks(token, { categories: genre })
      console.log('Books fetched by genre:', data)
      setBooks(data)
    } catch (err) {
      console.error('Error fetching books by genre:', err)
      setError((err as Error).message)
    } finally {
      setLoading(false)
    }
  }

  const fetchBookById = async () => {
    setLoading(true)
    setError(null)
    try {
      console.log('Fetching book by ID:', manualId)
      const book = await getBookById(token, manualId)
      console.log('Book fetched by ID:', book)
      setBooks(book ? [book] : [])
    } catch (err) {
      console.error('Error fetching book by ID:', err)
      setError((err as Error).message)
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = () => {
    if (loadType === 'genre') {
      fetchBooksByGenre()
    } else {
      fetchBookById()
    }
  }

  const addBookToCarousel = (book: Book) => {
    if (!carouselBooks.find((b) => b.id === book.id)) {
      setCarouselBooks([...carouselBooks, book])
    }
  }

  const removeBookFromCarousel = (bookId: string) => {
    setCarouselBooks(carouselBooks.filter((b) => b.id !== bookId))
  }

  const handleSaveCarousel = () => {
    // Здесь должна быть логика сохранения карусели через API
    console.log('Сохраняем карусель:', {
      name: carouselName,
      loadType,
      genre,
      books: carouselBooks,
    })
    alert('Сохранение карусели пока не реализовано')
  }

  return (
    <div className="admin-book-carousel">
      <input
        type="text"
        placeholder="Название карусели"
        value={carouselName}
        onChange={(e) => setCarouselName(e.target.value)}
        className="carousel-name-input"
      />
      <div className="load-type-selector">
        <label>
          <input
            type="radio"
            value="genre"
            checked={loadType === 'genre'}
            onChange={() => setLoadType('genre')}
          />
          Загрузка по жанру
        </label>
        <label>
          <input
            type="radio"
            value="manual"
            checked={loadType === 'manual'}
            onChange={() => setLoadType('manual')}
          />
          Выбор книг вручную
        </label>
      </div>
      <div className="search-controls">
        {loadType === 'genre' ? (
          <input
            type="text"
            placeholder="Введите жанр"
            value={genre}
            onChange={(e) => setGenre(e.target.value)}
          />
        ) : (
          <input
            type="text"
            placeholder="Введите ID книги"
            value={manualId}
            onChange={(e) => setManualId(e.target.value)}
          />
        )}
        <button onClick={handleSearch}>Поиск</button>
      </div>
      {loading && <div className="loading">Загрузка...</div>}
      {error && <div className="error">Ошибка: {error}</div>}

      <div className="search-results">
        {books.map((book) => (
          <div key={book.id} className="search-result-item">
            <BookCard
              title={book.name}
              author={book.author}
              price={book.price}
              cover={book.imageUrl}
            />
            <button onClick={() => addBookToCarousel(book)}>Добавить</button>
          </div>
        ))}
      </div>

      <h3>Книги в карусели</h3>
      <div className="carousel-books">
        {carouselBooks.map((book) => (
          <div key={book.id} className="carousel-book-item">
            <BookCard
              title={book.name}
              author={book.author}
              price={book.price}
              cover={book.imageUrl}
            />
            <button onClick={() => removeBookFromCarousel(book.id)}>Удалить</button>
          </div>
        ))}
      </div>

      <button onClick={handleSaveCarousel} className="save-carousel-button">
        Сохранить карусель
      </button>
    </div>
  )
}
