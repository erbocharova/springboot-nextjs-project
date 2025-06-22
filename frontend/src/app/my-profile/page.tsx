'use client'
import { useState, useEffect } from 'react';
import { logout } from '@/app/api/logoutUser';
import Button from '@/app/ui/button/button';

import { getProfile, GetProfileResponse } from '@/app/api/getProfile';
import './page.scss';

export default function ProfilePage() {
  const [, setShowAddBookNotification] = useState(false);
  const [profileData, setProfileData] = useState<GetProfileResponse | null>(null);



  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const tokenFromCookie = document.cookie
          .split('; ')
          .find(row => row.startsWith('token='))
          ?.split('=')[1];
        if (!tokenFromCookie) {
          alert('Токен не найден');
          window.location.href = '/auth/sign-in';
          return;
        }
        const data = await getProfile(tokenFromCookie);
        setProfileData(data);
      } catch {
        alert('Ошибка при получении профиля');
        window.location.href = '/auth/sign-in';
      }
    };
    fetchProfile();
  }, []);

  return (
    <div>
      <h1>Профиль пользователя</h1>
      <div className="my-profile-buttons">
        <Button onClick={() => logout()} text="Выйти" icon={null} className={undefined} style={undefined} />
        <Button onClick={() => setShowAddBookNotification(true)} text="Добавить книгу" icon={null} className={undefined} style={undefined} />
      </div>
      {profileData && (
        <div className="my-profile-content">
          <p><strong>Имя пользователя:</strong> {profileData.username}</p>
          <p><strong>Имя:</strong> {profileData.firstName}</p>
          <p><strong>Фамилия:</strong> {profileData.lastName}</p>
          <p><strong>Дата рождения:</strong> {profileData.birthDate}</p>
          <p><strong>Телефон:</strong> {profileData.telNumber}</p>
          <p><strong>Email:</strong> {profileData.mail}</p>
          <p><strong>Роль:</strong> {profileData.role}</p>
        </div>
      )}

    </div>
  );
}
