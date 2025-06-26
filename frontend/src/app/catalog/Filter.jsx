'use client'

import React from 'react'
import Accordion from '../ui/accordion/accordion'
import InputField from '../ui/input-field/InputField'
import './catalog.scss'
import categoryMap from './categoryMap'

const accordionButtonStyle = { color: 'black' }

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
  const filtersConfig = [
    {
      key: 'name',
      text: 'Название',
      body: (
        <InputField
          value={nameFilter}
          onChange={(e) => setNameFilter(e.target.value)}
          placeholder="Название книги"
          aria-label="Поиск по названию книги"
        />
      ),
    },
    {
      key: 'author',
      text: 'Автор',
      body: (
        <InputField
          value={authorFilter}
          onChange={(e) => setAuthorFilter(e.target.value)}
          placeholder="Автор книги"
          aria-label="Поиск по автору книги"
        />
      ),
    },
    {
      key: 'category',
      text: 'Категория',
      body: (
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="select"
          aria-label="Выбор категории"
        >
          <option key={'all'} value={''}>Все</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {categoryMap[cat] || cat}
            </option>
          ))}
        </select>
      ),
    },
    {
      key: 'popular',
      text: 'Популярное',
      body: (
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
      ),
    },
    {
      key: 'inStock',
      text: 'В наличии',
      body: (
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
      ),
    },
    {
      key: 'price',
      text: 'Цена',
      body: (
        <div className="priceFilter">
          <InputField
            value={minPriceFilter}
            onChange={(e) => setMinPriceFilter(e.target.value)}
            placeholder={`Мин. (${minPrice})`}
            aria-label="Минимальная цена"
            type="number"
            min={0}
          />
          <InputField
            value={maxPriceFilter}
            onChange={(e) => setMaxPriceFilter(e.target.value)}
            placeholder={`Макс. (${maxPrice})`}
            aria-label="Максимальная цена"
            type="number"
            min={0}
          />
          <button
            className="applyButton"
            onClick={onApplyPriceFilter}
            aria-label="Применить фильтр по цене"
          >
            Применить
          </button>
        </div>
      ),
    },
  ]

  return (
    <aside className="filters" aria-label="Фильтры каталога">
      {filtersConfig.map(({ key, text, body }) => (
        <Accordion
          key={key}
          text={text}
          isAlwaysExpanded={true}
          icon={null}
          style={accordionButtonStyle}
          accordionBody={body}
        />
      ))}
    </aside>
  )
}

export default Filter
