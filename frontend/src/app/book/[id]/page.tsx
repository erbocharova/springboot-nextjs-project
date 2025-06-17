"use client";
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import styles from '../../styles/book.module.scss';

// Функция для плавной прокрутки к разделу "Все характеристики"
const scrollToFullDetails = () => {
  const element = document.getElementById('full-details');
  if (element) {
    element.scrollIntoView({ behavior: 'smooth' });
  }
};

interface Book {
  id: number;
  title: string;
  author: string;
  cover: string;
  price: number;
}

export default function BookDetailsPage() {
  const params = useParams();
  const [book, setBook] = useState<Book | null>(null);

  const booksData: Book[] = [
    {
      id: 1,
      title: "Война и мир",
      author: "Лев Толстой",
      cover: "/war-and-peace.png",
      price: 999,
    },
    {
      id: 2,
      title: "Преступление и наказание",
      author: "Фёдор Достоевский",
      cover: "/images/crime-and-punishment.jpg",
      price: 799,
    },
    {
      id: 3,
      title: "Гарри Поттер и философский камень",
      author: "Дж. К. Роулинг",
      cover: "/images/harry-potter.jpg",
      price: 1299,
    },
    {
      id: 4,
      title: "1984",
      author: "Джордж Оруэлл",
      cover: "/images/1984.jpg",
      price: 699,
    },
  ];

  useEffect(() => {
    if (params?.id) {
      const bookId = parseInt(params.id as string, 10);
      const foundBook = booksData.find((b) => b.id === bookId);
      setBook(foundBook || null);
    }
  }, [params]);

  // Все функции get... — остаются без изменений

  function getPublisher(title: string): string {
    switch (title) {
      case "Война и мир": return "АСТ, 2023";
      case "Преступление и наказание": return "Эксмо, 2022";
      case "Гарри Поттер и филосферский камень": return "Росмэн, 2021";
      case "1984": return "Corpus, 2020";
      default: return "Неизвестное издательство";
    }
  }

  function getYear(title: string): string {
    switch (title) {
      case "Война и мир": return "2023";
      case "Преступление и наказание": return "2022";
      case "Гарри Поттер и филосферский камень": return "2021";
      case "1984": return "2020";
      default: return "—";
    }
  }

  function getPageCount(title: string): string {
    switch (title) {
      case "Война и мир": return "1232";
      case "Преступление и наказание": return "320";
      case "Гарри Поттер и филосферский камень": return "304";
      case "1984": return "352";
      default: return "—";
    }
  }

  function getGenre(title: string): string {
    switch (title) {
      case "Война и мир": return "Исторический роман";
      case "Преступление и наказание": return "Психологический роман";
      case "Гарри Поттер и филосферский камень": return "Фэнтези, Приключения";
      case "1984": return "Антиутопия, Политическая сатира";
      default: return "—";
    }
  }

  function getDescription(title: string): string {
    switch (title) {
      case "Война и мир":
        return "Эпический роман Льва Толстого «Война и мир» — одно из величайших произведений мировой литературы. Он охватывает период с 1805 по 1820 год и включает события Отечественной войны 1812 года. Через судьбы нескольких аристократических семей автор исследует темы любви, свободы, долга и предназначения человека. Главные герои — Пьер Безухов, Андрей Болконский и Наташа Ростова — проходят непростой путь самопознания и внутреннего развития. В произведении сочетаются философские размышления, исторические события и глубокая психологическая проработка персонажей. Особое внимание уделено противопоставлению личной жизни и исторического процесса. «Война и мир» не только литературное произведение, но и философское размышление о смысле истории и человеческой природе. Роман стал символом русской классики и оказала влияние на развитие мировой литературы. Каждый герой отражает определённый жизненный путь и взгляд на мир. Эта книга подходит как для глубокого прочтения, так и для многократного возвращения к ней.";

      case "Преступление и наказание":
        return "«Преступление и наказание» — один из самых известных романов Фёдора Достоевского, написанный в 1866 году. Сюжет рассказывает о бедном студенте Раскольникове, решившемся на убийство старухи-процентщицы ради денег. После совершённого преступления он сталкивается с мучительными терзаниями совести и начинает осознавать, что истинное наказание — это внутренний конфликт. В романе поднимается множество философских и моральных вопросов, в том числе проблема справедливости, добра и зла, гениальности и беззакония. Образ Свидригайлона и полицейского Порфирия Петровича дополняют сложную систему ценностей и взглядов. Протагонисту помогает его сестра Дуня и будущий друг Разумихин, но главную роль в его духовном возрождении играет Соня Мармеладова. В конечном итоге роман становится историей спасения через страдание и любовь к ближнему. Произведение написано в жанре психологического реализма и остаётся актуальным по сей день. «Преступление и наказание» раскрывает трагедию одиночества и борьбу за смысл жизни. Эта книга — обязательна к прочтению всем, кто интересуется внутренним миром человека.";

      case "Гарри Поттер и филосферский камень":
        return "«Гарри Поттер и философский камень» — первая книга легендарного цикла Джоан Роулинг о юном волшебнике Гарри Поттере. В день своего одиннадцатилетия он узнаёт, что является сиротой, чьи родители были убиты тёмным волшебником Волан-де-Мортом. Гарри зачисляют в школу магии Хогвартс, где он знакомится с новым миром, друзьями и опасностями. Вместе с Роном Уизли и Гермионой Грейнджер он раскрывает тайну философского камня, способного дать бессмертие. Книга полна волшебства, загадок, храбрости и настоящей дружбы. Она рассказывает о важности выбора, силе любви и преодолении страха. Этот роман стал началом одного из самых популярных литературных сериалов в мире, любимого как детьми, так и взрослыми. Каждый персонаж обладает уникальной харизмой и развитием. Книга закладывает основы целой вселенной, которая продолжает развиваться в книгах, фильмах и парках развлечений. «Философский камень» — отличный старт для погружения в магический мир.";


      case "1984":
        return "«1984» — знаменитый антиутопический роман Джорджа Оруэлла, опубликованный в 1949 году. Он описывает общество, находящееся под тотальным контролем государства, которое использует технологии наблюдения и пропаганду для подавления личности. Главный герой Уинстон Смит работает в Министерстве Истины, где фальсифицирует исторические документы, чтобы соответствовать текущей идеологической линии. Он начинает сомневаться в истине и вступает в тайную связь с женщиной по имени Джулия. В этом мире нет права на мысли, чувства или прошлое — всё контролируется Большим Братом. Через образы и символы Оруэлл предостерегает от опасностей тоталитаризма, цензуры и манипуляций общественным сознанием. «1984» остаётся актуальным и сегодня как предостережение о возможном будущем. Роман показывает, как легко можно лишить человека свободы, если он перестаёт задавать вопросы. Оруэлл мастерски создаёт атмосферу страха и безысходности. Эта книга — важное напоминание о цене свободы и необходимости бдительности.";

      default:
        return "Гарри Поттер и философский камень» — первая книга в легендарной серии Дж. К. Роулинг, которая открывает дверь в удивительный мир магии и приключений.Главный герой — одиннадцатилетний Гарри Поттер, сирота, который живёт у родственников, не подозревая о своём истинном происхождении.Он узнаёт, что является волшебником, и получает приглашение учиться в школу магии Хогвартс — одно из самых загадочных мест на Земле.Там он знакомится с новыми друзьями — Роном Уизли и Гермионой Грейнджер — и вместе они раскрывают тайну философского камня.Философский камень — это уникальный артефакт, способный дать бессмертие, и его охраняет сам алхимик Николас Фламель.Злоумышленник пытается завладеть камнем, и только храбрость и дружба помогут юным волшебникам остановить его.Книга наполнена волшебными существами, тайнами старинного замка и невероятными испытаниями, которые проходит Гарри.Это история о том, как мальчик находит себя, понимает свою силу и узнаёт, что значит быть частью чего-то большего.Мир Хогвартса, летающие метлы, говорящие шляпы и магические заклинания создают неповторимую атмосферу чуда и волшебства.";
    }
  }


  // Прокрутка к полной аннотации
  const scrollToFullDescription = () => {
    const element = document.getElementById('full-description');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <main className={styles.container}>
      <div className="max-w-6xl mx-auto">
        <Link href="/" className={styles.backLink}>
          &larr; Назад к каталогу
        </Link>

        {book && (
          <h1 className={styles.title}>
            {book.title}: <span className="font-normal">{book.author}</span>
          </h1>
        )}

        {!params?.id && (
          <div className={styles.errorMessage}>ID книги не указан</div>
        )}

        {!book && params?.id && (
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
                  <img src={book.cover} alt={book.title} className="w-full h-auto object-contain" />
                </div>
                <div className={styles.bookInfo}>
                  <div className={styles.rating}>⭐️ 4.3 (2 оценки) • 4 отзыва</div>
                  <p className={styles.description}>{getDescription(book.title)}</p>
                  {/* Кнопка прокрутки без подчеркивания */}
                  <button onClick={scrollToFullDescription} className={styles.moreLinkNoUnderline}>
                    Полная аннотация
                  </button>
                  <div className={styles.detailsList}>
                    <p><strong>Автор:</strong> {book.author}</p>
                    <p><strong>Издательство:</strong> {getPublisher(book.title)}</p>
                    <p><strong>Жанр:</strong> {getGenre(book.title)}</p>
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
                    <span className={styles.price}>{Math.floor(book.price * 0.5)} ₽</span>
                    <span className={styles.oldPrice}>{book.price} ₽</span>
                  </div>
                  <span className={styles.discountBadge}>Скидка 50%</span>
                </div>
                <AddToCartButton book={book} />
                <div className={styles.deliveryInfo}>
                  <p>Ростов-на-Дону — доставим 28 мая</p>
                </div>
              </div>
            </div>

            {/* Полная аннотация внизу страницы */}
            <div id="full-description" className={styles.fullDescription}>
              <h2 className={styles.sectionTitle}>Полная аннотация:</h2>
              <div className={styles.bookInfo}>
                <p>{getDescription(book.title)}</p>
              </div>
              <div id="full-details" className="pt-4">
                <h3 className={styles.sectionTitle}>Все характеристики</h3>
                <ul className={styles.detailsList}>
                  <li><strong>Автор:</strong> {book.author}</li>
                  <li><strong>Издательство:</strong> {getPublisher(book.title)}</li>
                  <li><strong>Год издания:</strong> {getYear(book.title)}</li>
                  <li><strong>Страниц:</strong> {getPageCount(book.title)}</li>
                  <li><strong>ISBN:</strong> 978-3-16-148410-0</li>
                  <li><strong>Формат:</strong> 145 x 215 мм</li>
                  <li><strong>Переплёт:</strong> Твёрдый</li>
                  <li><strong>Жанр:</strong> {getGenre(book.title)}</li>
                </ul>
              </div>
            </div>
          </>
        )}
      </div>
    </main>
  );
}

function AddToCartButton({ book }: { book: Book }) {
  const handleAddToCart = () => {
    const discountedPrice = Math.floor(book.price * 0.5);
    alert(`1 шт. "${book.title}" на сумму ${discountedPrice} ₽ добавлено в корзину`);
  };
  return (
    <button onClick={handleAddToCart} className={styles.addToCartButton}>
      Перейти в корзину
    </button>
  );
}