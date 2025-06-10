'use client'
import Cookies from 'js-cookie';
import { useAuthStatus } from '@/app/hooks/useAuthStatus';
import { useState, useEffect } from 'react';
import { getProfile, logout } from '@/app/api/api';
import Button from '@/app/ui/button/button';

export default function ProfilePage() {
  const [userInfo, setUserInfo] = useState(null);
  const isLoggedIn = useAuthStatus();

  useEffect(() => {

    if (isLoggedIn) {
      const token = Cookies.get('token');
      if (!token) {
        console.error('Токен не найден');
        window.location.href = '/auth/signin';
        return;
      }

      //вызов функции из api/api.ts для получения данных авторизованного пользователя
      getProfile(token)
        .then((res) => setUserInfo(res.data))
        .catch((err) => {
          window.location.href = '/auth/signin';
        });
    }
    else {
      window.location.href = '/auth/signin';
    }
  }, []);

  return (
    <div>
      <h1>Профиль</h1>
      {userInfo ? (
        <pre>{JSON.stringify(userInfo, null, 2)}</pre>
      ) : (
        <span>Загрузка...</span>
      )}

      <button onClick={() => logout()}>Выйти</button>
    </div>
  );
}