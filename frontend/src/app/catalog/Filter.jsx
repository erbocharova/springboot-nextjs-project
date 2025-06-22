'use client'

import React from 'react'
import Accordion from '../ui/accordion/accordion'
import InputField from '../ui/input-field/InputField'
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
  popularFilter,
  setPopularFilter,
  inStockFilter,
  setInStockFilter,
  onApplyPriceFilter,
}) => {
  const accordionButtonStyle = { color: 'black' }

  return (
    <aside className={styles.filters} aria-label="Фильтры каталога">
      <Accordion
        text="Название"
        isAlwaysExpanded={true}
        icon={null}
        style={accordionButtonStyle}
        accordionBody={
          <InputField
            value={nameFilter}
            onChange={(e) => setNameFilter(e.target.value)}
            placeholder="Название книги"
            aria-label="Поиск по названию книги"
          />
        }
      />
      <Accordion
        text="Автор"
        isAlwaysExpanded={true}
        icon={null}
        style={accordionButtonStyle}
        accordionBody={
          <InputField
            value={authorFilter}
            onChange={(e) => setAuthorFilter(e.target.value)}
            placeholder="Автор книги"
            aria-label="Поиск по автору книги"
          />
        }
      />
      <Accordion
        text="Категория"
        isAlwaysExpanded={true}
        icon={null}
        style={accordionButtonStyle}
        accordionBody={
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className={styles.select}
            aria-label="Выбор категории"
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
        text="Популярное"
        isAlwaysExpanded={true}
        icon={null}
        style={accordionButtonStyle}
        accordionBody={
          <label>
            <input
              type="checkbox"
              checked={popularFilter}
              onChange={(e) => setPopularFilter(e.target.checked)}
              aria-checked={popularFilter}
              aria-label="Фильтр популярных книг"
            />
            Популярное
          </label>
        }
      />
      <Accordion
        text="В наличии"
        isAlwaysExpanded={true}
        icon={null}
        style={accordionButtonStyle}
        accordionBody={
          <label>
            <input
              type="checkbox"
              checked={inStockFilter}
              onChange={(e) => setInStockFilter(e.target.checked)}
              aria-checked={inStockFilter}
              aria-label="Фильтр книг в наличии"
            />
            В наличии
          </label>
        }
      />
      <Accordion
        text="Цена"
        isAlwaysExpanded={true}
        icon={null}
        style={accordionButtonStyle}
        accordionBody={
          <div className={styles.priceFilter}>
            <InputField
              value={minPriceFilter}
              onChange={(e) => setMinPriceFilter(e.target.value)}
              placeholder={`Минимальная цена (${minPrice})`}
              aria-label="Минимальная цена"
              type="number"
              min={0}
            />
            <InputField
              value={maxPriceFilter}
              onChange={(e) => setMaxPriceFilter(e.target.value)}
              placeholder={`Максимальная цена (${maxPrice})`}
              aria-label="Максимальная цена"
              type="number"
              min={0}
            />
            <button
              className={styles.applyButton}
              onClick={onApplyPriceFilter}
              aria-label="Применить фильтр по цене"
            >
              Применить
            </button>
          </div>
        }
      />
    </aside>
  )
}

export default Filter
