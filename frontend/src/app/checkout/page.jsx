"use client"
import React, { useEffect, useState } from "react";
import Button from "../ui/button/button";
import DynamicForm from "../DynamicForm";
import PaymentOptionButton from "./PaymentOptionButton";
import "./checkout.scss";
import { getAllBooks } from "../api/books/getAllBooks";
import { useAuthStatus } from "../hooks/useAuthStatus";
import { getProfile } from "../api/getProfile";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { showAlert } from "../alerts";
import { loadCartItems } from '@/app/api/cartStorage';
import { createOrder, CreateOrderRequest } from "../api/orderController";

const CheckoutPage = () => {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuthStatus();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formType] = useState("order");
  const [formResult, setFormResult] = useState(null);
  const [userData, setUserData] = useState(null);

  const paymentOptions = [];

  useEffect(() => {
    const loadCartProducts = async () => {
      try {
        const cartItemsMap = loadCartItems();
        const ids = Object.keys(cartItemsMap);
        if (ids.length === 0) {
          setProducts([]);
          setLoading(false);
          return;
        }
        const allBooks = await getAllBooks(); // Получаем все книги
        const filteredBooks = allBooks.filter(book => ids.includes(book.id));
        setProducts(filteredBooks);
      } catch (err) {
        setError("Ошибка загрузки товаров из корзины");
      } finally {
        setLoading(false);
      }
    };
    loadCartProducts();
  }, []);

  useEffect(() => {
    const fetchUserData = async () => {
      if (!isAuthenticated) {
        setUserData(null);
        return;
      }
      try {
        const token = Cookies.get("token");
        if (!token) {
          setUserData(null);
          return;
        }
        const profile = await getProfile(token);
        console.log("User profile loaded:", profile);
        // Преобразуем данные профиля в формат, ожидаемый DynamicForm
        const initialData = {
          firstName: profile.firstName || '',
          lastName: profile.lastName || '',
          email: profile.mail || '',
          phone: profile.telNumber || '',
          birthDate: profile.birthDate || '',
          username: profile.username || '',
          address: profile.address || '',
          deliveryDate: profile.deliveryDate || '',
        };
        setUserData(initialData);
      } catch (err) {
        setError("Ошибка загрузки данных пользователя");
      }
    };
    fetchUserData();
  }, [isAuthenticated]);

  const [formData, setFormData] = React.useState(null);
  const [isFormValid, setIsFormValid] = React.useState(false);

  const onSubmit = async (data) => {
    setFormData(data);
    setFormResult(null); // сброс результата при новом сабмите
    await handleSbpPayment(data);
  };

  const onValidChange = (valid) => {
    setIsFormValid(valid);
  };

  const handleSbpPayment = async (data) => {
    if (!isFormValid) {
      alert("Пожалуйста, заполните все обязательные поля корректно.");
      return;
    }
  
    if (!data) {
      alert("Данные формы не заполнены.");
      return;
    }
    try {
      const token = Cookies.get("token");
      if (!token) {
        alert("Требуется авторизация.");
        router.push('/auth/sign-in');
        return;
      }
      const orderRequest = {
        username: data.username,
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        telNumber: data.phone,
        address: data.address,
        paymentType: "SBP",
        deliveryDate: data.deliveryDate,
        books: products.map(product => ({
          bookId: product.id,
          quantity: cartItemsMap[product.id] || 1,
        })),
      };
      await createOrder(orderRequest, token);
      showAlert("Заказ успешно создан", "success");
      router.push('/my-profile');
    } catch (error) {
      // Ошибки уже обработаны в createOrder
    }
  };



  const handlePayment = () => {
    switch (formResult?.paymentMethod) {
      case "sbp":
        handleSbpPayment();
        break;
      case "card":
        handleCardPayment();
        break;
      case "cash":
        handleCashPayment();
        break;
      default:
        alert("Пожалуйста, выберите способ оплаты.");
    }
  };

  const cartItemsMap = loadCartItems();
  const totalPrice = products.reduce((sum, product) => {
    const quantity = cartItemsMap[product.id] || 1;
    return sum + product.price * quantity;
  }, 0);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      showAlert("Пожалуйста, войдите в систему, чтобы оформить заказ.", "info");
      router.push('/auth/sign-in');
    }
  }, [isLoading, isAuthenticated, router]);

  if (isLoading) {
    return <p>Загрузка...</p>;
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <main className="checkout">
      <section className="checkout__form">
        <div className="checkout__notice">
          После создания заказа выбранная дата доставки может измениться. Узнать статус заказа можно в личном кабинете
        </div>

        <h1 className="checkout__title">Оформление заказа</h1>

        <div className="section section--delivery">
          <h2 className="section__header">Курьерская доставка</h2>
          <p className="section__note">
            В Ростов-на-Дону доставим через <strong>2 дня</strong> или позднее.
          </p>
        </div>

        <div className="section section--recipient">
          <h2 className="section__header">Получатель</h2>
          {console.log("Passing initialData to DynamicForm:", userData)}
          <DynamicForm
            key={userData ? JSON.stringify(userData) : 'empty'}
            formType={formType}
            onSubmit={onSubmit}
            onValidChange={onValidChange}
            initialData={userData || {}}
          />
          {formResult && (
            <div className={formResult.success ? "success-message" : "error-message"}>
              {formResult.message}
            </div>
          )}
          <div style={{ marginTop: "1rem" }}>
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
          <>
            <div className="product-covers-row">
              {products.map((product) => (
                <img
                  key={product.id}
                  src={product.imageUrl || "/default-product.png"}
                  alt={product.name}
                  className="product-cover"
                />
              ))}
            </div>
            {products.map((product) => (
              <div key={product.id} className="product-card">
            <div className="product-card__info">
              <p>
                Цена товара: <span>{product.price * (loadCartItems()[product.id] || 1)} ₽</span>
              </p>
            </div>
              </div>
            ))}
            <p className="summary__total">
              Итого: <span>{totalPrice} ₽</span>
            </p>
          </>
        )}
        {/* Убираем кнопку с onClick, так как форма теперь сама отправляется */}
        {/* <Button
          text="Оплатить через СБП"
          className="btn btn--primary btn--full"
          onClick={handleSbpPayment}
          disabled={!isFormValid || formResult?.paymentMethod !== "sbp"}
        /> */}
      </aside>
    </main>
  );
};

export default CheckoutPage;
