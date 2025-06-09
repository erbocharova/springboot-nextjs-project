import React from "react";

export default function PaymentOptionButton({ value, text, description, selected, onSelect }) {
  return (
    <div
      className={`payment-option ${selected ? "payment-option--selected" : ""}`}
      onClick={() => onSelect(value)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => { if (e.key === "Enter") onSelect(value); }}
    >
      <div className="payment-option__title">{text}</div>
      <div className="payment-option__description">{description}</div>
    </div>
  );
}
