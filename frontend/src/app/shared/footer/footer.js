"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import Accordion from "@/app/ui/accordion/accordion";

import "./footer.scss";

const feedback = [
    { title: '+7(900)123-45-67', ref: 'tel:89001234567', icon: '/icons/phone_icon.svg'},
    { title: 'book_on_hook@mail.ru', ref: 'mailto:book_on_hook@mail.ru', icon: '/icons/mail_icon.svg'},
    { title: '@book_on_hook_support', ref: 'https://t.me/book_on_hook_support', icon: '/icons/telegram_icon.svg'}
];

const helpList = [
    { id: 'ordering', title: 'Как сделать заказ' },
    { id: 'payment', title: 'Оплата' },
    { id: 'delivery', title: 'Курьерская доставка' },
    { id: 'support', title: 'Поддержка' }
  ];

const Footer = () => {
    const MOBILE_MAX_WIDTH = 768;
    const [isMobile, setIsMobile] = useState(false);

    const catalogButtonClick = () => {
        window.location.href = window.location.href;
    };

    const handleResize = () => {
        setIsMobile(window.innerWidth <= MOBILE_MAX_WIDTH);
    };

    useEffect(() => {
        handleResize();
        window.addEventListener("resize", handleResize);
        return () => {
            window.removeEventListener("resize", handleResize);
        };
    }, []);

    return (
        <footer className="footer">
            <div className="footer__links">

                <Accordion
                    className="footer__links__help"
                    isAlwaysExpanded={!isMobile}
                    text="Помощь"
                    icon="/icons/expand.svg"
                    accordionBody={
                        <ul className="footer__links__help__list">
                            {helpList.map((helpOption) => (
                                <li key={helpOption.id}>
                                    <Link href={`/help#${helpOption.id}`}>{helpOption.title}</Link>
                                </li>
                            ))}
                        </ul>
                    }
                />

                <Accordion
                    className="footer__links__feedback"
                    isAlwaysExpanded={!isMobile}
                    text="Обратная связь"
                    icon="/icons/expand.svg"
                    accordionBody={
                        <ul className="footer__links__feedback__list">
                            {feedback.map((item) => (
                                <li key={item.title}>
                                    <img src={item.icon}/>
                                    <Link href={item.ref}>{item.title}</Link>
                                </li>
                            ))}
                        </ul>
                    }
                />


            </div>

            <div className="footer__info">{new Date().getFullYear()} Book On Hook. Все права защищены.</div>
        </footer>
    );
};

export default Footer;
