'use client'
import { useState, useEffect } from 'react';
import { logout } from '@/app/api/logoutUser';
import Button from '@/app/ui/button/button';
import { BookCarousel } from '@/app/ui/book-carousel/BookCarousel';
import { AdminBookCarousel } from '@/app/ui/admin-book-carousel/AdminBookCarousel';
import { AddBookNotification } from '@/app/ui/notifications/AddBookNotification';
import { getProfile, GetProfileResponse } from '@/app/api/getProfile';
import './page.scss';

export default function ProfilePage() {
  const [showAddBookNotification, setShowAddBookNotification] = useState(false);
  const [profileData, setProfileData] = useState<GetProfileResponse | null>(null);
  const [token, setToken] = useState<string>('');
  const [showAdminCarouselModal, setShowAdminCarouselModal] = useState(false);

  const handleBookAdded = () => {
    // Можно добавить логику обновления списка книг, если нужно
  };

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const tokenFromCookie = document.cookie
          .split('; ')
          .find(row => row.startsWith('token='))
          ?.split('=')[1];
        if (!tokenFromCookie) {
          alert('Токен не найден');
          return;
        }
        setToken(tokenFromCookie);
        const data = await getProfile(tokenFromCookie);
        setProfileData(data);
      } catch {
        alert('Ошибка при получении профиля');
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
        <Button onClick={() => setShowAdminCarouselModal(true)} text="Показать админскую карусель" icon={null} className={undefined} style={undefined} />
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
      {token && <BookCarousel token={token} />}
      {showAddBookNotification && (
        <AddBookNotification
          onClose={() => setShowAddBookNotification(false)}
          onBookAdded={handleBookAdded}
        />
      )}
      {showAdminCarouselModal && token && (
        <div className="modal-overlay" onClick={() => setShowAdminCarouselModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setShowAdminCarouselModal(false)}>×</button>
            <AdminBookCarousel token={token} />
          </div>
        </div>
      )}
    </div>
  );
}
