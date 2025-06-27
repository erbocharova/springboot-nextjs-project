import { BookCarousel } from './ui/book-carousel/BookCarousel'
import './page.scss'

export default function Home() {
  return (
    <section className='home-content'>
      <BookCarousel title="Популярное"/>
      <BookCarousel title="Вы смотрели"/>
    </section>
  )
}
