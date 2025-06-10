"use client";
import React, { useState } from "react";
import Link from "next/link";
import Logo from "@/app/shared/logo/logo";
import Button from "@/app/ui/button/button";
import Search from "@/app/shared/search/search";
import NotificationPopup from "@/app/shared/notification-popup/NotificationPopup";
import { useAuthStatus } from "@/app/hooks/useAuthStatus";

import "./header.scss";

const navCategories = [
  "Книги",
  "Иностранные",
  "Главное",
  "Школа",
  "Канцтовары",
  "Игрушки",
  "Еще",
  "Клуб",
  "Ростов-на-Дону — доставка",
];

const Header = () => {
  const [isNotificationOpen, setNotificationOpen] = useState(false);
  const { isLoggedIn } = useAuthStatus();

  const catalogButtonClick = () => {
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

        <div className="header-center">
          <Search
            className="header-search-form"
            inputType="text"
            id="searchInput"
            placeholder="Поиск по Лабиринту"
            onClick={catalogButtonClick}
            icon="/icons/find.svg"
          />
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
            <Link href="/my-profile" passHref>
              <Button
                className="icon-button"
                icon="/icons/profile.svg"
                title="Мой Лабиринт"
              />
          </Link>
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
            <li key={category}>
              <Link href="#">{category}</Link>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
};

export default Header;
