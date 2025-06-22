'use client'

import React, { useState, useEffect } from 'react'
import Accordion from '../ui/accordion/accordion'
import InputField from '../ui/input-field/InputField'
import { searchBooks } from '../api/books/searchBooks'
import { getAllBooks } from '../api/books/getAllBooks'
import { BookCard } from '../ui/book-card/BookCard'
import styles from './catalog.module.scss'

const Filter = ({
  minPrice,
  maxPrice,
  categories,
  selectedCategory,
  setSelectedCategory,
  minPriceFilter,
  maxPriceFilter,
  setMinPriceFilter,
  setMaxPriceFilter,
  nameFilter,
  setNameFilter,
  authorFilter,
  setAuthorFilter,
}) => {
  // Стиль для кнопки аккордеона с черным цветом текста
  const accordionButtonStyle = { color: 'black' };

  return (
    <div className={styles.filters}>
      <Accordion
        text="Название"
        className=""
        isAlwaysExpanded={false}
        icon={null}
        style={accordionButtonStyle}
        accordionBody={
          <InputField
            value={nameFilter}
            onChange={(e) => setNameFilter(e.target.value)}
            placeholder="Название книги"
          />
        }
      />
      <Accordion
        text="Автор"
        className=""
        isAlwaysExpanded={false}
        icon={null}
        style={accordionButtonStyle}
        accordionBody={
          <InputField
            value={authorFilter}
            onChange={(e) => setAuthorFilter(e.target.value)}
            placeholder="Автор книги"
          />
        }
      />
      <Accordion
        text="Категория"
        className=""
        isAlwaysExpanded={false}
        icon={null}
        style={accordionButtonStyle}
        accordionBody={
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className={styles.select}
          >
            <option value="">Все категории</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        }
      />
      <Accordion
        text="Цена от"
        className=""
        isAlwaysExpanded={false}
        icon={null}
        style={accordionButtonStyle}
        accordionBody={
          <InputField
            value={minPriceFilter}
            onChange={(e) => setMinPriceFilter(e.target.value)}
            placeholder={`Минимальная цена (${minPrice})`}
          />
        }
      />
      <Accordion
        text="Цена до"
        className=""
        isAlwaysExpanded={false}
        icon={null}
        style={accordionButtonStyle}
        accordionBody={
          <InputField
            value={maxPriceFilter}
            onChange={(e) => setMaxPriceFilter(e.target.value)}
            placeholder={`Максимальная цена (${maxPrice})`}
          />
        }
      />
    </div>
  )
}

const CatalogPage = () => {
  const [token, setToken] = useState('')
  const [books, setBooks] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const [nameFilter, setNameFilter] = useState('')
  const [authorFilter, setAuthorFilter] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [minPriceFilter, setMinPriceFilter] = useState('')
  const [maxPriceFilter, setMaxPriceFilter] = useState('')

  const [minPrice, setMinPrice] = useState(0)
  const [maxPrice, setMaxPrice] = useState(0)
  const [categories, setCategories] = useState([])

  const loadAllBooks = React.useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await getAllBooks(token)
      setBooks(data)

      if (data.length > 0) {
        const prices = data.map((book) => book.price)
        const cats = Array.from(new Set(data.map((book) => book.category)))

        setMinPrice(Math.min(...prices))
        setMaxPrice(Math.max(...prices))
        setCategories(cats)
      }
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [token])

  const fetchBooks = React.useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const searchRequest = {}
      if (nameFilter.trim()) searchRequest.name = nameFilter.trim()
      if (authorFilter.trim()) searchRequest.authors = authorFilter.trim()
      if (selectedCategory.trim()) searchRequest.categories = selectedCategory.trim()
      if (minPriceFilter.trim()) searchRequest.minPrice = Number(minPriceFilter)
      if (maxPriceFilter.trim()) searchRequest.maxPrice = Number(maxPriceFilter)

      // Если фильтры пустые, загружаем все книги
      const noFilters =
        !searchRequest.name &&
        !searchRequest.authors &&
        (!searchRequest.categories || searchRequest.categories.length === 0) &&
        !searchRequest.minPrice &&
        !searchRequest.maxPrice

      let data
      if (noFilters) {
        data = await getAllBooks()
      } else {
        data = await searchBooks(searchRequest)
      }
      setBooks(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [token, nameFilter, authorFilter, selectedCategory, minPriceFilter, maxPriceFilter])

  useEffect(() => {
      fetchBooks()
  }, [token, fetchBooks])


  return (
    <div className={styles.catalog}>
      <h1 className={styles.title}>Каталог товаров</h1>
      <div className={styles.filters}>
      </div>
      <Filter
        minPrice={minPrice}
        maxPrice={maxPrice}
        categories={categories}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        minPriceFilter={minPriceFilter}
        maxPriceFilter={maxPriceFilter}
        setMinPriceFilter={setMinPriceFilter}
        setMaxPriceFilter={setMaxPriceFilter}
        nameFilter={nameFilter}
        setNameFilter={setNameFilter}
        authorFilter={authorFilter}
        setAuthorFilter={setAuthorFilter}
      />
      <div className={styles.booksGrid}>
        {loading && <p>Загрузка...</p>}
        {error && <p className={styles.error}>Ошибка: {error}</p>}
        {!loading && !error && books.length === 0 && <p>Книги не найдены</p>}
        {!loading && !error && books.map((book) => (
          <BookCard
            key={book.id}
            id={book.id}
            title={book.name}
            author={book.author}
            price={book.price}
            cover={book.imageUrl}
          />
        ))}
      </div>
    </div>
  )
}

export default CatalogPage
