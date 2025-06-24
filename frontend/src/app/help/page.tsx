import { NextPage } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import './page.scss'; // Стили вынесены в отдельный файл

const HelpPage: NextPage = () => {
  const sections = [
    { id: 'ordering', title: 'Как сделать заказ' },
    { id: 'payment', title: 'Оплата' },
    { id: 'delivery', title: 'Курьерская доставка' },
    { id: 'support', title: 'Поддержка' },
    { id: 'terms', title: 'Пользовательское соглашение' }
  ];

  return (
      <div className="help-container">
        <h1 className="help-container__title">Помощь и поддержка</h1>
        
        <div className="help-container__sections">
          {sections.map((section) => (
            <section key={section.id} id={section.id} className="help-container__sections__section">
              <h2 className="help-container__sections__section__title">{section.title}</h2>
              <div className="help-container__sections__section__content">
                <p>Здесь будет текст раздела "{section.title}".</p>
                <p>Пример текста. Замените этот контент на актуальную информацию.</p>
              </div>
            </section>
          ))}
        </div>
      </div>
  );
};

export default HelpPage;