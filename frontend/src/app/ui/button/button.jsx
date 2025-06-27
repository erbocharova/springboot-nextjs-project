import React from "react";
import "./button.scss";

const Button = ({ onClick, text, icon, className, style }) => {
  return (
    <button
      className={`custom-button ${className}`}
      onClick={onClick}
      style={style}
    >
      {text}
      {icon &&
        (typeof icon === "string" ? (
          <img src={icon} alt="" className="custom-button__icon" />
        ) : (
          <span
            className="custom-button__icon"
            dangerouslySetInnerHTML={{ __html: icon }}
          />
        ))}
    </button>
  );
};

export default Button;
