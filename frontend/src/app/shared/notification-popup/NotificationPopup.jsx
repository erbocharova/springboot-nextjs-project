"use client";
import React, { useEffect, useRef } from "react";
import "./NotificationPopup.scss";

const NotificationPopup = ({ visible, onClose }) => {
  const popupRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (popupRef.current && !popupRef.current.contains(event.target)) {
        onClose();
      }
    };

    if (visible) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [visible, onClose]);

  if (!visible) return null;

  return (
    <div
      className="notification-popup notification-popup--right"
      ref={popupRef}
      style={{ top: "48px" }}
    >
      <div className="notification-popup__arrow notification-popup__arrow--right" />
      <button className="notification-popup__close" onClick={onClose} aria-label="Close notification popup">
        ×
      </button>
      <div className="notification-popup__content">
        <p>У вас пока нет сообщений!</p>
      </div>
    </div>
  );
};

export default NotificationPopup;
