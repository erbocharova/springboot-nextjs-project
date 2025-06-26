"use client";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import styles from '../../styles/book.module.scss';
import { getBookById } from '@/app/api/books/getBookById';
import { useAuthStatus } from '@/app/hooks/useAuthStatus';
import { loadCartItems, saveCartItems, CartItemsMap } from '@/app/api/cartStorage'
import categoryMap from '@/app/catalog/categoryMap';
import { date } from 'yup';

// Функция для плавной прокрутки к разделу "Все характеристики"
const scrollToFullDetails = () => {
  const element = document.getElementById('full-details');
  if (element) {
    element.scrollIntoView({ behavior: 'smooth' });
  }
};

interface Book {
  id: string;
  name: string;
  author: string;
  description: string;
  imageUrl: string;
  price: number;
  quantity: number;
  maxQuantity: number;
  available: boolean;
  popular: boolean;
  category: string
}

export default function BookDetailsPage() {
  const router = useRouter()
  const { id } = useParams<{ id: string }>();
  const [book, setBook] = useState<Book | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [deliveryDate, setDeliveryDate] = useState('');
  const [cartItems, setCartItems] = useState<CartItemsMap>({});
  const { isAdmin } = useAuthStatus();

  useEffect(() => {
    const fetchBooks = async () => {
      if (id) {
        try {
          const foundBook = await getBookById(id);
          setBook(foundBook || null);
        } catch (err) {
        setError((err as Error).message)
      }
    }};

    const calculateDate = () => {
      const today = new Date();
      const deliveryDate = new Date(today);
      deliveryDate.setDate(today.getDate() + 2);
      
      setDeliveryDate(
        deliveryDate.toLocaleDateString('ru-RU', {
          weekday: 'long',
          day: 'numeric',
          month: 'long'
        })
      );
    };

    const stored = loadCartItems();
    setCartItems(stored);

    fetchBooks();
    calculateDate();
  }, []);

  const isInCart = book ? book.id in cartItems : false;

  const scrollToFullDescription = () => {
    const element = document.getElementById('full-description');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const getCategoryName = (categoryKey: string): string => {
    return categoryMap[categoryKey] || categoryKey;
  };

  const handleAddToCart = (book: Book) => {
    const updatedCartItems = {
          ...cartItems,
          [book.id]: (cartItems[book.id] || 0) + 1,
        };
        
        setCartItems(updatedCartItems);
        saveCartItems(updatedCartItems);
  };

  const handleCheckout = () => {
      router.push('/cart')
  };

  return (
    <main className={styles.container}>
      <div className="max-w-6xl mx-auto">
        <Link href="/" className={styles.backLink}>
          &larr; Назад к каталогу
        </Link>

        {book && (
          <h1 className={styles.title}>
            {book.name}: <span className="font-normal">{book.author}</span>
          </h1>
        )}

        {!id && (
          <div className={styles.errorMessage}>ID книги не указан</div>
        )}

        {!book && id && (
          <div className={styles.notFound}>
            <h2 className={styles.notFoundTitle}>Книга не найдена</h2>
            <p>Мы не смогли найти книгу с таким ID.</p>
          </div>
        )}

        {book && (
          <>
            {/* Карточка книги */}
            <div className={styles.bookGrid}>
              <div className={styles.bookCard}>
                <div className={styles.bookCover}>
                  <img src={book.imageUrl} alt={book.name} className="w-full h-auto object-contain" />
                </div>
                <div className={styles.bookInfo}>
                  <p className={styles.description}>{book.description}</p>
                  {/* Кнопка прокрутки без подчеркивания */}
                  <button onClick={scrollToFullDescription} className={styles.moreLinkNoUnderline}>
                    Полная аннотация
                  </button>
                  <div className={styles.detailsList}>
                    <p><strong>Автор:</strong> {book.author}</p>
                    <p><strong>Жанр:</strong> {getCategoryName(book.category)}</p>
                    {/* Ссылка без подчёркивания */}
                    <button onClick={scrollToFullDetails} className={styles.moreLinkNoUnderline}>
                      Все характеристики
                    </button>
                  </div>
                </div>
              </div>

              <div className={styles.priceCard}>
                <div className={styles.priceContainer}>
                  <div className="flex items-center space-x-2">
                    <span className={styles.price}>{book.price} ₽</span>
                  </div>
                </div>

                {!isInCart ? (
                <button onClick={() => handleAddToCart(book)} className={styles.addToCartButton} disabled={!book.available}>
                  {book.available ? "Добавить в корзину" : "Нет в наличии"}
                </button>)
                :
                (
                  <button onClick={() => handleCheckout()} className={styles.addToCartButton} disabled={!book.available}>
                    {book.available ? "Оформить" : "Нет в наличии"}
                  </button>
                )}
                <div className={styles.deliveryInfo}>
                  <p>Доставка в Ростов-на-Дону — {deliveryDate}</p>
                </div>
              </div>
            </div>

            {/* Полная аннотация внизу страницы */}
            <div id="full-description" className={styles.fullDescription}>
              <h2 className={styles.sectionTitle}>Полная аннотация:</h2>
              <div className={styles.bookInfo}>
                <p>{book.description}</p>
              </div>
              <div id="full-details" className="pt-4">
                <h3 className={styles.sectionTitle}>Все характеристики</h3>
                <ul className={styles.detailsList}>
                  <li><strong>Автор:</strong> {book.author}</li>
                  <li><strong>Категория/Жанр:</strong> {getCategoryName(book.category)}</li>
                  <li><strong>В наличии:</strong> {book.quantity} шт.</li>
                  {isAdmin && (
                    <li><strong>Всего:</strong> {book.maxQuantity} шт.</li>
                  )}
                </ul>
              </div>
            </div>
          </>
        )}
      </div>
    </main>
  );
}