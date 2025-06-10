'use client'
import { useState } from 'react';
import { loginUser } from '@/app/api/api';
import Link from 'next/link';
import Cookies from 'js-cookie';
import Button from '@/app/ui/button/button';

import './page.scss';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      //вызов функции из api/api.ts для авторизации
      const res = await loginUser({ username, password });
      Cookies.set('token', res.data, { expires: 1 });
      window.location.href = '/my-profile';
    } catch (err) {
      alert('Неверные данные.');
    }
  }

  function handleSignupClick() {
    window.location.href = '/auth/signup';
  }

  return (
    <div className='signin'>
      <h2 className='signin__signature'>Вход</h2>
      <form className='signin__form'>
        <input className='signin__form__input' value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Логин" required={true} />
        <input className='signin__form__input' type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Пароль" required={true} />
        <Button onClick={handleSubmit} text='Войти' className='signin__form__submit-button' icon={undefined} style={undefined} />
        <Button onClick={handleSignupClick} text='Нет аккаунта?' className='signin__form__signup-button' icon={undefined} style={undefined} />
      </form>
    </div>
  );
}