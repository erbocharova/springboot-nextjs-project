'use client'

import React, { useEffect, useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { BookCard } from '../book-card/BookCard'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay, Navigation } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/navigation'
import './book-carousel.scss'
import { getAllBooks } from '../../api/books/getAllBooks'

interface Book {
  id: string
  name: string
  author: string
  price: number
  imageUrl: string
}

interface BookCarouselProps {
  token: string
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

export const BookCarousel: React.FC<BookCarouselProps> = ({ token, title }) => {
  const router = useRouter()
  const [books, setBooks] = useState<Book[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const isMobile = useIsMobile()
  const [cartItems, setCartItems] = useState<Set<string>>(new Set())

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const data = await getAllBooks(token)
        setBooks(data)
      } catch (err) {
        setError((err as Error).message)
      } finally {
        setLoading(false)
      }
    }
    fetchBooks()
  }, [token])

  useEffect(() => {
    // Инициализация cartItems из localStorage
    const storedCart = localStorage.getItem('cartItems')
    if (storedCart) {
      setCartItems(new Set(JSON.parse(storedCart)))
    }
  }, [])

  const handleAddToCart = (bookId: string) => {
    const newCart = new Set(cartItems)
    newCart.add(bookId)
    setCartItems(newCart)
    localStorage.setItem('cartItems', JSON.stringify(Array.from(newCart)))
  }

  const handleCheckout = () => {
    router.push('/checkout')
  }

  const handleCardClick = (bookId: string) => {
    router.push(`/book/${bookId}`)
  }

  if (loading) {
    return <div className="book-carousel__loading">Загрузка...</div>
  }

  if (error) {
    return <div className="book-carousel__error">Ошибка: {error}</div>
  }

  return (
    <div className="book-carousel-container">
      {title && <h2 className="book-carousel__title">{title}</h2>}
      <div className="book-carousel" ref={containerRef}>
        <Swiper
          modules={isMobile ? [Autoplay] : [Navigation]}
          spaceBetween={8}
          navigation={!isMobile}
          autoplay={isMobile ? { delay: 4000, disableOnInteraction: false } : undefined}
          loop={true}
          breakpoints={{
            320: {
              slidesPerView: 1,
              spaceBetween: 8,
            },
            480: {
              slidesPerView: 2,
              spaceBetween: 8,
            },
            640: {
              slidesPerView: 3,
              spaceBetween: 8,
            },
            768: {
              slidesPerView: 4,
              spaceBetween: 8,
            },
            1024: {
              slidesPerView: 5,
              spaceBetween: 8,
            },
            1280: {
              slidesPerView: 5,
              spaceBetween: 8,
            },
          }}
        >
          {books.map((book) => (
            <SwiperSlide key={book.id} style={{ minWidth: 180 }}>
              <BookCard
                title={book.name}
                author={book.author}
                price={book.price}
                cover={book.imageUrl}
                onAddToCart={
                  cartItems.has(book.id)
                    ? undefined
                    : () => handleAddToCart(book.id)
                }
                onClick={() => handleCardClick(book.id)}
                addedToCart={cartItems.has(book.id)}
                onCheckout={() => handleCheckout()}
              />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  )
}
