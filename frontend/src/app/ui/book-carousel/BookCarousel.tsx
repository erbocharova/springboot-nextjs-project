'use client'

import React, { useEffect, useState, useRef } from 'react'
import { BookCard } from '../book-card/BookCard'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay, Navigation } from 'swiper/modules'
import { getAllBooks } from '../../api/books/getAllBooks'
import 'swiper/css'
import 'swiper/css/navigation'
import './book-carousel.scss'

interface Book {
  id: string
  name: string
  author: string
  price: number
  imageUrl: string
}

interface BookCarouselProps {
  title?: string
}

// Хук для определения мобильного устройства по ширине из CSS переменной
const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined') return

    const rootStyles = getComputedStyle(document.documentElement)
    const mobileMaxStr = rootStyles.getPropertyValue('--mobile-max').trim()
    const mobileMax = mobileMaxStr.endsWith('px')
      ? parseInt(mobileMaxStr.slice(0, -2))
      : parseInt(mobileMaxStr)

    const mediaQuery = window.matchMedia(`(max-width: ${mobileMax}px)`)

    const handler = (event: MediaQueryListEvent) => {
      setIsMobile(event.matches)
    }

    mediaQuery.addEventListener('change', handler)
    setIsMobile(mediaQuery.matches)

    return () => mediaQuery.removeEventListener('change', handler)
  }, [])

  return isMobile
}

export const BookCarousel: React.FC<BookCarouselProps> = ({ title }) => {

  const [books, setBooks] = useState<Book[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const isMobile = useIsMobile()
  const [cartItems, setCartItems] = useState<Set<string>>(new Set())

  // Загрузка списка книг
  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const data = await getAllBooks()
        setBooks(data)
      } catch (err) {
        setError((err as Error).message)
      } finally {
        setLoading(false)
      }
    }
    fetchBooks()
  }, [])

  useEffect(() => {
    const storedCart = localStorage.getItem('cartItems')
    if (storedCart) {
      setCartItems(new Set(JSON.parse(storedCart)))
    }
  }, [])


  if (loading) {
    return <div className="book-carousel__loading">Загрузка...</div>
  }

  if (error) {
    return <div className="book-carousel__error">Ошибка: {error}</div>
  }

  return (
    <div className="book-carousel" ref={containerRef}>
      {title && <h2 className="book-carousel__title">{title}</h2>}
      <div className="book-carousel__container">
      <Swiper
        modules={isMobile ? [Autoplay] : [Navigation]}
        navigation={{
          prevEl: '.swiper-button-prev',
          nextEl: '.swiper-button-next',
        }}
        className='swiper'

        spaceBetween={8}

        autoplay={isMobile ? { delay: 4000, disableOnInteraction: false } : undefined}
        loop={true}
        breakpoints={{
          320: { slidesPerView: 1 },
          480: { slidesPerView: 2 },
          640: { slidesPerView: 3 },
          768: { slidesPerView: 4 },
          1024: { slidesPerView: 5 },
          1280: { slidesPerView: 6 },
        }}
      >
        <div className="swiper-button-prev"></div>
        {books.map((book) => (
          <SwiperSlide key={book.id} style={{ minWidth: 180 }}>
            <BookCard
              book={book}
            />
          </SwiperSlide>
        ))}
        <div className="swiper-button-next"></div>
      </Swiper>
      </div>
    </div>
  )
}
