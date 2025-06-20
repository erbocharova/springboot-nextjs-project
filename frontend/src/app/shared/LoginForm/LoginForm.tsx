import { useState } from 'react';
import { loginUser } from '@/app/api/loginUser';
import Link from 'next/link';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import Button from '@/app/ui/button/button';
import './LoginForm.scss';

interface FormData {
  username: string;
  password: string;
}

interface FormErrors {
  username?: string;
  password?: string;
}

export function LoginForm() {
  const [formData, setFormData] = useState<FormData>({
    username: '',
    password: ''
  });

  const router = useRouter();
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.username.trim()) newErrors.username = 'Необходимо указать логин';
    if (!formData.password.trim()) newErrors.password = 'Необходимо указать пароль';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      //вызов функции из api/api.ts для авторизации
      const { token } = await loginUser(formData);
      Cookies.set('token', token, { expires: 1 });
      router.replace('/my-profile');
    } catch (error) {
      
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  function handleSignupClick() {
    router.replace('/auth/sign-up');
  };

  return (
    <div className="login">
      <div className="login__container">
        <h2 className="login__title">Вход</h2>

        <form className="login__form" onSubmit={handleSubmit}>
          {[
            { id: 'username', label: 'Логин', type: 'text', placeholder: ' ' },
            { id: 'password', label: 'Пароль', type: 'password', placeholder: ' ' }
          ].map(field => (
            <div key={field.id} className="login__form-group">
              <div className="login__input-container">
                <input
                  id={field.id}
                  name={field.id}
                  type={field.type}
                  value={formData[field.id as keyof FormData]}
                  onChange={handleChange}
                  placeholder={field.placeholder}
                  className={`login__input ${errors[field.id as keyof FormErrors] ? 'login__input--error' : ''}`}
                />
                <label htmlFor={field.id} className="login__label">
                  {field.label}*
                </label>
              </div>
              {errors[field.id as keyof FormErrors] && (
                <div className="login__error-message">
                  {errors[field.id as keyof FormErrors]}
                </div>
              )}
            </div>
          ))}

          <button
            type="submit"
            className="login__submit-button"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Вход...' : 'Войти'}
          </button>
        </form>
        <button
            onClick={handleSignupClick}
            className="login__signup-button"
          >
            Еще не зарегистрированы?
          </button>
      </div>
    </div>
  );
}

