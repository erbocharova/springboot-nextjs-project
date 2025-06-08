export default function Home() {
  return (
    <section className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {/* Карточка книги */}
      <BookCard
        title="Война и мир"
        author="Лев Толстой"
        price={999}
        cover="https://via.placeholder.com/300x400?text= Война+и+мир"
      />
      <BookCard
        title="Преступление и наказание"
        author="Фёдор Достоевский"
        price={799}
        cover="https://via.placeholder.com/300x400?text= Преступление+и+наказание"
      />
      <BookCard
        title="Гарри Поттер и философский камень"
        author="Дж. К. Роулинг"
        price={1299}
        cover="https://via.placeholder.com/300x400?text= Гарри+Поттер"
      />
      <BookCard
        title="1984"
        author="Джордж Оруэлл"
        price={699}
        cover="https://via.placeholder.com/300x400?text=1984 "
      />
    </section>
  )
}

// Компонент карточки книги
function BookCard({ title, author, price, cover }: {
  title: string
  author: string
  price: number
  cover: string
}) {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden transition-transform hover:scale-105">
      <img src={cover} alt={title} className="w-full h-64 object-cover" />
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-700">
  {title}
</h3>
<p className="text-sm text-gray-500 dark:text-gray-400">{author}</p>
<p className="mt-2 font-bold text-indigo-600 dark:text-indigo-400">
  {price} ₽
</p>
        <button className="mt-4 w-full bg-indigo-600 text-white py-2 px-4 rounded hover:bg-indigo-700">
          В корзину
        </button>
      </div>
    </div>
  )
}