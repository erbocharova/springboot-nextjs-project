"use client";
import Link from "next/link";


export default function Home() {
  return (
    <section className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {/* Карточка книги с ID */}
      <BookCard
        id={1}
        title="Война и мир"
        author="Лев Толстой"
        price={999}
        cover="https://via.placeholder.com/300x400?text=Война+и+мир"
      />
      <BookCard
        id={2}
        title="Преступление и наказание"
        author="Фёдор Достоевский"
        price={799}
        cover="https://via.placeholder.com/300x400?text=Преступление+и+наказание"
      />
      <BookCard
        id={3}
        title="Гарри Поттер и философский камень"
        author="Дж. К. Роулинг"
        price={1299}
        cover="https://via.placeholder.com/300x400?text=Гарри+Поттер"
      />
      <BookCard
        id={4}
        title="1984"
        author="Джордж Оруэлл"
        price={699}
        cover="https://via.placeholder.com/300x400?text=1984"
      />
    </section>
  );
}

// Обновлённый компонент BookCard
function BookCard({ id, title, author, price, cover }: {
  id: number;
  title: string;
  author: string;
  price: number;
  cover: string;
}) {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden transition-transform hover:scale-105">
      {/* Обёртка для кликабельной области (кроме кнопки) */}
      <Link href={`/book/${id}`} className="block">
        <img src={cover} alt={title} className="w-full h-64 object-cover" />
        <div className="p-4">
          <h3 className="text-lg font-semibold text-gray-700">{title}</h3>
          <p className="text-sm text-gray-500">{author}</p>
          <p className="mt-2 font-bold text-indigo-600">{price} ₽</p>
        </div>
      </Link>

      {/* Кнопка "В корзину" (остаётся отдельно) */}
      <div className="p-4 pt-0">
        <button
          onClick={(e) => {
            e.stopPropagation(); // Предотвращает срабатывание Link
            alert(`Книга "${title}" добавлена в корзину!`);
          }}
          className="w-full bg-indigo-600 text-white py-2 px-4 rounded hover:bg-indigo-700"
        >
          В корзину
        </button>
      </div>
    </div>
  );
}