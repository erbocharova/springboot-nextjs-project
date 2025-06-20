"use client"
import React, { useEffect, useState } from "react";
import Button from "../ui/button/button";
import DynamicForm from "../DynamicForm";
import PaymentOptionButton from "./PaymentOptionButton";
import "./checkout.scss";

const CheckoutPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formType] = useState("order");
  const [formResult, setFormResult] = useState(null);

  const paymentOptions = [
    { value: "sbp", text: "Через СБП", description: "Оплатить через систему быстрых платежей сейчас" },
    { value: "card", text: "Картой на сайте", description: "Оплатить на сайте сейчас" },
    { value: "cash", text: "При получении", description: "Оплатить картой или наличными при получении в пункте выдачи" },
  ];

  useEffect(() => {
    let isMounted = true;
    const fetchProducts = async () => {
      try {
        const res = await fetch(process.env.NEXT_PUBLIC_PRODUCTS_URL || "http://localhost:8080/products");
        if (!res.ok) {
          throw new Error("Failed to fetch products");
        }
        const data = await res.json();
        if (isMounted) {
          setProducts(data);
          setLoading(false);
        }
      } catch (err) {
        if (isMounted) {
          setError(err.message);
          setLoading(false);
        }
      }
    };
    fetchProducts();
    return () => {
      isMounted = false;
    };
  }, []);

  const [formData, setFormData] = React.useState(null);
  const [isFormValid, setIsFormValid] = React.useState(false);

  const onSubmit = async (data) => {
    setFormData(data);
    setFormResult(null); // сброс результата при новом сабмите
  };

  const onValidChange = (valid) => {
    setIsFormValid(valid);
  };

  const handleSbpPayment = async () => {
    if (!isFormValid) {
      alert("Пожалуйста, заполните все обязательные поля корректно.");
      return;
    }
    if (formResult?.paymentMethod && formResult.paymentMethod !== "sbp") {
      alert("Пожалуйста, выберите способ оплаты через СБП.");
      return;
    }
    const orderPayload = { ...formData, paymentMethod: "sbp" };
    try {
      const response = await fetch(process.env.NEXT_PUBLIC_ORDER_URL || "http://localhost:8080/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderPayload),
      });
      if (!response.ok) throw new Error("Ошибка при создании заказа");
      const result = await response.json();
      console.log("Результат оплаты через СБП:", result);
      setFormResult({ success: true, message: "Заказ успешно создан", order: result });
    } catch (error) {
      console.error("Ошибка при оплате через СБП:", error);
      setFormResult({ success: false, message: error.message });
    }
  };

  return (
    <main className="checkout">
      <section className="checkout__form">
        <div className="checkout__notice">
          Уже регистрировались в Book on hook? <a href="#">Войдите в систему</a>, чтобы получить доступ к своим сохранённым данным. Товары в корзине и отложенные товары добавятся в ваш профиль.
        </div>

        <h1 className="checkout__title">Оформление заказа</h1>

        <div className="section section--delivery">
          <h2 className="section__header">Доставка</h2>
          <button className="btn btn--outline">+ Новый способ доставки</button>
          <p className="section__note">
            В выбранный регион <strong>Ростов-на-Дону</strong> — заказ доставят
            завтра или позднее.
          </p>
        </div>

        <div className="section section--recipient">
          <h2 className="section__header">Получатель</h2>
          <DynamicForm formType={formType} onSubmit={onSubmit} onValidChange={onValidChange} />
          {formResult && (
            <div className={formResult.success ? "success-message" : "error-message"}>
              {formResult.message}
            </div>
          )}
        </div>

        <div className="section section--payment">
          <h2 className="section__header">Оплата</h2>
          <div className="payment-options">
            {paymentOptions.map(({ value, text, description }) => (
              <PaymentOptionButton
                key={value}
                value={value}
                text={text}
                description={description}
                selected={formResult?.paymentMethod === value}
                onSelect={(val) => setFormResult((prev) => ({ ...prev, paymentMethod: val }))}
              />
            ))}
          </div>
        </div>
      </section>

      <aside className="checkout__summary">
        <h2 className="summary__title">{products.length} товар{products.length === 1 ? "" : "ов"}</h2>
        {loading ? (
          <p>Загрузка товаров...</p>
        ) : error ? (
          <p className="error">{error}</p>
        ) : products.length === 0 ? (
          <p>Нет товаров</p>
        ) : (
          products.map((product) => (
            <div key={product.id} className="product-card">
              <img
                src={product.image || "/default-product.png"}
                alt={product.name}
                className="product-card__img"
              />
              <div className="product-card__info">
                <p>
                  Цена товаров <span>{product.price} ₽</span>
                </p>
              </div>
            </div>
          ))
        )}
        <Button
          text="Оплатить через СБП"
          className="btn btn--primary btn--full"
          onClick={handleSbpPayment}
          disabled={!isFormValid || formResult?.paymentMethod !== "sbp"}
        />
        <label className="summary__confirm">
          <input
            type="checkbox"
            name="agree"
            checked={formResult?.agree ?? true}
            onChange={(e) => setFormResult((prev) => ({ ...prev, agree: e.target.checked }))}
          />
          <span>
            Я принимаю условия работы сайта и даю согласие на обработку данных
          </span>
        </label>
      </aside>
    </main>
  );
};

export default CheckoutPage;
