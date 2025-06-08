"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import Accordion from "@/app/ui/accordion/accordion";

import "./footer.scss";

const categories = [
    "Книги",
    "Иностранные",
    "Школа",
    "Канцтовары",
    "Игрушки"
];

const helpList = [
    "Как сделать заказ",
    "Оплата",
    "Курьерская доставка",
    "Поддержка",
    "Пользовательское соглашение"
]

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
                    className="footer__links__categories"
                    isAlwaysExpanded={!isMobile}
                    text="Каталог"
                    icon="/icons/expand.svg"
                    accordionBody={
                        <ul className="footer__links__categories__list">
                            {categories.map((category) => (
                                <li key={category}>
                                    <Link href="#">{category}</Link>
                                </li>
                            ))}
                        </ul>
                    }
                />

                <Accordion
                    className="footer__links__help"
                    isAlwaysExpanded={!isMobile}
                    text="Помощь"
                    icon="/icons/expand.svg"
                    accordionBody={
                        <ul className="footer__links__help__list">
                            {helpList.map((helpOption) => (
                                <li key={helpOption}>
                                    <Link href="#">{helpOption}</Link>
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
