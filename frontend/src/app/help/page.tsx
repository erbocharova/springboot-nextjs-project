import { NextPage } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import './page.scss'; // Стили вынесены в отдельный файл

const HelpPage: NextPage = () => {
  const sections = [
    { id: 'ordering', title: 'Как сделать заказ',  content: 'Оформить заказ могут только зарегистрированные пользователи. Для оформления заказа добавьте товары в корзину и нажмите «К оформению». Выберите дату доставки и заполните форму, если получать книгу будет другой человек. Обращаем внимание, что после обработки заказа оператором дата доставки может измениться. Узнать актуальную информацию о заказе можно в личном кабинете. После доставки заказа статус заказа изменится «На прочтении» и будет оставаться таким в течение 2 недель, после чего книги необходимо вернуть в пункт сбора книг Book on Hook.'},
    { id: 'payment', title: 'Оплата',  content: 'Оплата заказа возможна наличными или картой при получении заказа.' },
    { id: 'delivery', title: 'Курьерская доставка',  content: 'Все заказы доставляются курьерской службой. Сроки доставки заказов могут меняться в зависимости от загруженности службы. После прочтения книги должны быть сданы в пункт сбора книг Book on Hook по адресу: г. Ростов-на-Дону, ул. Мильчакова, д. 8А.' },
    { id: 'support', title: 'Поддержка',  content: 'Узнать информацию о работе сервиса можно по телефону: +7(900)123-45-67.' }
  ];

  return (
      <div className="help-container">
        <h1 className="help-container__title">Помощь и поддержка</h1>
        
        <div className="help-container__sections">
          {sections.map((section) => (
            <section key={section.id} id={section.id} className="help-container__sections__section">
              <h2 className="help-container__sections__section__title">{section.title}</h2>
              <div className="help-container__sections__section__content">
                {section.content}
              </div>
            </section>
          ))}
        </div>
      </div>
  );
};

export default HelpPage;