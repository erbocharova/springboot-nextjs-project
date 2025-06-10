'use client'
import { useState } from 'react';
import { signupUser } from '@/app/api/api';
import Link from 'next/link';
import Cookies from 'js-cookie';

export default function SignupPage() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');


async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      //вызов функции из api/api.ts для регистрации пользователя
      const res = await signupUser({ username, password, firstName, lastName, birthDate });
      Cookies.set('token', res.data.token, { expires: 1 });
      window.location.href = '/my-profile';
    } catch (err) {
      alert('Ошибка при регистрации.');
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <input type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} placeholder="Имя" />
      <input type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} placeholder="Фамилия" />
      <input type="date" value={birthDate} onChange={(e) => setBirthDate(e.target.value)} placeholder="Дата рождения" />
      <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Логин" />
      <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Пароль" />
      <button type="submit">Зарегистрироваться</button>
      <Link href="/auth/signin">Уже зарегистрированы?</Link>
    </form>
  );
}