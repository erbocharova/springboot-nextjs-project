import axios from 'axios';
import { useState } from 'react';
import { signupUser } from '@/app/api/signupUser';
import Link from 'next/link';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';
import './SignupForm.scss';

interface FormData {
  username: string;
  password: string;
  firstName: string;
  lastName: string;
  birthDate: string;
  telNumber: string;
  mail: string;
}

interface FormErrors {
  username?: string;
  password?: string;
  firstName?: string;
  lastName?: string;
  birthDate?: string;
  telNumber?: string;
  mail?: string;
}

export function SignupForm() {
  const [formData, setFormData] = useState<FormData>({
    username: '',
    password: '',
    firstName: '',
    lastName: '',
    birthDate: '',
    telNumber: '',
    mail: ''
  });

  const router = useRouter();
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    const phoneRegex = /^(\+7)[0-9]{10}$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const yearRegex = /^(19|20)\d{2}$/;

    if (!formData.username.trim()) newErrors.username = 'Необходимо указать логин';
    if (!formData.password.trim()) newErrors.password = 'Необходимо указать пароль';
    if (!formData.firstName.trim()) newErrors.firstName = 'Необходимо указать имя';
    if (!formData.lastName.trim()) newErrors.lastName = 'Необходимо указать фамилию';

    if (!formData.birthDate.trim()) {
      newErrors.birthDate = 'Необходимо указать дату рождения';
    } else {
      const birthYear = new Date(formData.birthDate).getFullYear();
      if (!yearRegex.test(birthYear.toString())) {
        newErrors.birthDate = 'Год рождения должен быть между 1900 и текущим годом';
      } else {
        const currentYear = new Date().getFullYear();
        if (birthYear > currentYear) {
          newErrors.birthDate = 'Год рождения не может быть в будущем';
        }
      }
    }

    if (!formData.telNumber.trim()) {
      newErrors.telNumber = 'Необходимо указать номер телефона';
    } else if (!phoneRegex.test(formData.telNumber)) {
      newErrors.telNumber = 'Неверный формат телефона. Пример: +79161234567';
    }
    if (!formData.mail.trim()) {
      newErrors.mail = 'Необходимо указать email';
    } else if (!emailRegex.test(formData.mail)) {
      newErrors.mail = 'Неверный формат email';
    }
    if (formData.password.length < 6) {
      newErrors.password = 'Пароль должен содержать минимум 6 символов';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      const { token } = await signupUser(formData);
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

  function handleSigninClick() {
    router.replace('/auth/sign-in');
  };

  return (
    <div className="registration">
      <div className="registration__container">
        <h2 className="registration__title">Регистрация</h2>

        <form className="registration__form" onSubmit={handleSubmit}>
          {[
            { id: 'username', label: 'Логин', type: 'text', placeholder: ' ' },
            { id: 'password', label: 'Пароль', type: 'password', placeholder: ' ' },
            { id: 'firstName', label: 'Имя', type: 'text', placeholder: ' ' },
            { id: 'lastName', label: 'Фамилия', type: 'text', placeholder: ' ' },
            { id: 'birthDate', label: 'Дата рождения', type: 'date', placeholder: ' ' },
            { id: 'telNumber', label: 'Номер телефона', type: 'tel', placeholder: ' ' },
            { id: 'mail', label: 'Электронная почта', type: 'email', placeholder: ' ' },
          ].map(field => (
            <div key={field.id} className="registration__form-group">
              <div className="registration__input-container">
                <input
                  id={field.id}
                  name={field.id}
                  type={field.type}
                  value={formData[field.id as keyof FormData]}
                  onChange={handleChange}
                  placeholder={field.placeholder}
                  className={`registration__input ${errors[field.id as keyof FormErrors] ? 'registration__input--error' : ''}`}
                />
                <label htmlFor={field.id} className="registration__label">
                  {field.label}*
                </label>
              </div>
              {errors[field.id as keyof FormErrors] && (
                <div className="registration__error-message">
                  {errors[field.id as keyof FormErrors]}
                </div>
              )}
            </div>
          ))}

          <button
            type="submit"
            className="registration__submit-button"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Регистрация...' : 'Зарегистрироваться'}
          </button>
        </form>
        <button
            onClick={handleSigninClick}
            className="registration__signin-button"
          >
            Уже есть аккаунт?
          </button>
      </div>
    </div>
  );
}

