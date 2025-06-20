'use client'
import { useState, useEffect } from 'react';
import { logout } from '@/app/api/logoutUser';
import Button from '@/app/ui/button/button';
import { BookCarousel } from '@/app/ui/book-carousel/BookCarousel';
import { AddBookNotification } from '@/app/ui/notifications/AddBookNotification';
import { getProfile, GetProfileResponse } from '@/app/api/getProfile';
import './page.scss';

export default function ProfilePage() {
  const [showAddBookNotification, setShowAddBookNotification] = useState(false);
  const [profileData, setProfileData] = useState<GetProfileResponse | null>(null);

  const handleBookAdded = () => {
    // Можно добавить логику обновления списка книг, если нужно
  };

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = document.cookie
          .split('; ')
          .find(row => row.startsWith('token='))
          ?.split('=')[1];
        if (!token) {
          alert('Токен не найден');
          return;
        }
        const data = await getProfile(token);
        setProfileData(data);
      } catch (error) {
        alert('Ошибка при получении профиля');
      }
    };
    fetchProfile();
  }, []);

  const handleGetProfile = async () => {
    try {
      const token = document.cookie
        .split('; ')
        .find(row => row.startsWith('token='))
        ?.split('=')[1];
      if (!token) {
        alert('Токен не найден');
        return;
      }
      const data = await getProfile(token);
      setProfileData(data);
      alert(`Профиль пользователя: ${JSON.stringify(data, null, 2)}`);
    } catch (error) {
      alert('Ошибка при получении профиля');
    }
  };

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
      <BookCarousel />
      {showAddBookNotification && (
        <AddBookNotification
          onClose={() => setShowAddBookNotification(false)}
          onBookAdded={handleBookAdded}
        />
      )}
    </div>
  );
}
