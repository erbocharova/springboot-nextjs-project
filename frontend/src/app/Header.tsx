import Link from 'next/link'

export function Header() {
  return (
    <header className="flex items-center justify-between py-6 border-b border-gray-200 dark:border-gray-700">
      <Link href="/" className="text-2xl font-bold text-indigo-600">
        Библиотека книг
      </Link>

      <nav className="flex items-center space-x-4">
        <Link 
          href="/" 
          className="text-gray-700 hover:text-indigo-600 dark:text-gray-300 dark:hover:text-indigo-400"
        >
          Каталог
        </Link>
        <Link 
          href="/cart" 
          className="text-gray-700 hover:text-indigo-600 dark:text-gray-300 dark:hover:text-indigo-400"
        >
          Корзина
        </Link>
      </nav>
    </header>
  )
}