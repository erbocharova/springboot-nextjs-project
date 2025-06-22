import { BookCarousel } from './ui/book-carousel/BookCarousel'

export default function Home() {
  return (
    <section>
      <BookCarousel title="Популярное"/>
      <BookCarousel title="По Приколу"/>
    </section>
  )
}
