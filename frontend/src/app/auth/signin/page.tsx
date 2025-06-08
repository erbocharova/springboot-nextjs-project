'use client'
import { useState } from 'react';
import { loginUser } from '@/app/api/api';
import Link from 'next/link';
import Cookies from 'js-cookie';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      //вызов функции из api/api.ts для авторизации
      const res = await loginUser({ username, password });
      Cookies.set('token', res.data, { expires: 7 });
      window.location.href = '/my-profile';
    } catch (err) {
      alert('Неверные данные.');
    }
  }

  return (
    <div>
      <h1>Вход</h1>
      <form onSubmit={handleSubmit}>
        <input value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Логин" required />
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Пароль" required />
      <button type="submit">Войти</button>
      <Link href="/auth/signup">Нет аккаунта?</Link>
      </form>
    </div>
  );
}