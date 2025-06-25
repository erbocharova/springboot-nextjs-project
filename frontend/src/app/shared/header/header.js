"use client";
import React, { useState } from "react";
import Link from "next/link";
import Logo from "@/app/shared/logo/logo";
import Button from "@/app/ui/button/button";
import Search from "@/app/shared/search/search";
import NotificationPopup from "@/app/shared/notification-popup/NotificationPopup";
import { useAuthStatus } from "@/app/hooks/useAuthStatus";

import "./header.scss";
import { title } from "process";

const helpList = [
  ];

const navCategories = [
  { ref: 'catalog', title: 'Каталог'},
  { ref: 'help#payment', title: 'Оплата' },
  { ref: 'help#delivery', title: 'Доставка' },
  { ref: 'help#support', title: 'Поддержка' }
];

const Header = () => {
  const [isNotificationOpen, setNotificationOpen] = useState(false);
  const { isAuthenticated } = useAuthStatus();

  const findButtonClick = () => {
    window.location.href = window.location.href;
  };

  const toggleNotification = () => {
    setNotificationOpen(!isNotificationOpen);
  };

  const closeNotification = () => {
    setNotificationOpen(false);
  };

  return (
    <header className="header">
      <div className="header-main">
        <div className="header-left">
          <Logo />
                 
        </div>



        <div className="header-right">
          <div className="notification-wrapper" style={{ position: "relative" }}>
            <Button
              className="icon-button"
              icon="/icons/notification.svg"
              title="Уведомления"
              onClick={toggleNotification}
            />
            <NotificationPopup visible={isNotificationOpen} onClose={closeNotification} />
          </div>
          {isAuthenticated ?
          <Link href="/my-profile" passHref>
            <Button
              className="icon-button"
              icon="/icons/profile.svg"
              title="Мой кабинет"
            />
          </Link>
          :
          <Link href="/auth/sign-in" passHref>
            <Button
              className="icon-button"
              icon="/icons/profile.svg"
              title="Вход"
            />
          </Link>
          }
          <Link href="/cart" passHref>
            <Button
              className="icon-button cart-button"
              icon="/icons/cart-icon.svg"
              title="Корзина"
            >
              <span className="cart-badge">0</span>
            </Button>
          </Link>
        </div>
      </div>

      <nav className="header-nav-categories">
        <ul>
          {navCategories.map((category) => (
            <li key={category.ref}>
              <Link href={`/${category.ref}`}>{category.title}</Link>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
};

export default Header;
