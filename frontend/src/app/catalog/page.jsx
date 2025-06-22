'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { searchBooks } from '../api/books/searchBooks'
import { getAllBooks } from '../api/books/getAllBooks'
import { BookCard } from '../ui/book-card/BookCard'
import Filter from './Filter'
import styles from './catalog.module.scss'

const CatalogPage = () => {
  const [token, setToken] = useState('')
  const [books, setBooks] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const [filters, setFilters] = useState({
    name: '',
    author: '',
    category: '',
    minPrice: '',
    maxPrice: '',
    popular: false,
    inStock: false,
  })

  const [minPrice, setMinPrice] = useState(0)
  const [maxPrice, setMaxPrice] = useState(0)
  const [categories, setCategories] = useState([])

  const [sortOption, setSortOption] = useState('price')

  const fetchBooks = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const searchRequest = {}
      if (filters.name.trim()) searchRequest.name = filters.name.trim()
      if (filters.author.trim()) searchRequest.authors = filters.author.trim()
      if (filters.category.trim()) searchRequest.categories = filters.category.trim()
      if (filters.minPrice.trim()) searchRequest.minPrice = Number(filters.minPrice)
      if (filters.maxPrice.trim()) searchRequest.maxPrice = Number(filters.maxPrice)
      if (filters.popular) searchRequest.popular = true
      if (filters.inStock) searchRequest.inStock = true
      if (sortOption) searchRequest.sort = sortOption

      // Если фильтры пустые, загружаем все книги
      const noFilters =
        !searchRequest.name &&
        !searchRequest.authors &&
        (!searchRequest.categories || searchRequest.categories.length === 0) &&
        !searchRequest.minPrice &&
        !searchRequest.maxPrice &&
        !searchRequest.popular &&
        !searchRequest.inStock

      let data
      if (noFilters) {
        data = await getAllBooks(token)
        // Extract categories dynamically from data
        if (data.length > 0) {
          const cats = Array.from(new Set(data.map((book) => book.category)))
          setCategories(cats)
        }
      } else {
        data = await searchBooks(searchRequest)
      }
      setBooks(data)

      if (data.length > 0) {
        const prices = data.map((book) => book.price)
        setMinPrice(Math.min(...prices))
        setMaxPrice(Math.max(...prices))
      }
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [token, filters, sortOption])

  const handleApplyPriceFilter = () => {
    fetchBooks()
  }

  React.useEffect(() => {
    const debounceTimeout = setTimeout(() => {
      fetchBooks()
    }, 500)

    return () => clearTimeout(debounceTimeout)
  }, [filters, sortOption, fetchBooks])

  return (
    <section className={styles.catalog}>
      <h1 className={styles.title}>Каталог товаров</h1>
      <div className={styles.topBar}>
        <div className={styles.sortWrapper}>
          <label htmlFor="sortSelect" className={styles.sortLabel}>
            Сортировать по:
          </label>
          <select
            id="sortSelect"
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}
            className={styles.select}
            aria-label="Сортировка книг"
          >
            <option value="price">Цена</option>
            <option value="popularity">Популярность</option>
          </select>
        </div>
      </div>
      <div className={styles.contentWrapper}>
        <Filter
          minPrice={minPrice}
          maxPrice={maxPrice}
          categories={categories}
          selectedCategory={filters.category}
          setSelectedCategory={(category) => setFilters((prev) => ({ ...prev, category }))}
          minPriceFilter={filters.minPrice}
          maxPriceFilter={filters.maxPrice}
          setMinPriceFilter={(minPrice) => setFilters((prev) => ({ ...prev, minPrice }))}
          setMaxPriceFilter={(maxPrice) => setFilters((prev) => ({ ...prev, maxPrice }))}
          nameFilter={filters.name}
          setNameFilter={(name) => setFilters((prev) => ({ ...prev, name }))}
          authorFilter={filters.author}
          setAuthorFilter={(author) => setFilters((prev) => ({ ...prev, author }))}
          popularFilter={filters.popular}
          setPopularFilter={(popular) => setFilters((prev) => ({ ...prev, popular }))}
          inStockFilter={filters.inStock}
          setInStockFilter={(inStock) => setFilters((prev) => ({ ...prev, inStock }))}
          onApplyPriceFilter={handleApplyPriceFilter}
        />
        <section className={styles.booksGrid} aria-live="polite" aria-busy={loading}>
          {loading && <p>Загрузка...</p>}
          {error && <p className={styles.error}>Ошибка: {error}</p>}
          {!loading && !error && books.length === 0 && <p>Книги не найдены</p>}
          {!loading &&
            !error &&
            books.map((book) => (
              <BookCard
                key={book.id}
                id={book.id}
                title={book.name}
                author={book.author}
                price={book.price}
                cover={book.imageUrl}
                addedToCart={false}
                onAddToCart={() => {}}
                onClick={() => {}}
                onCheckout={() => {}}
              />
            ))}
        </section>
      </div>
    </section>
  )
}

export default CatalogPage
