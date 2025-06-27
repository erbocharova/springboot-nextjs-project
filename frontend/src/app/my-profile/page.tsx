'use client'
import { useState, useEffect } from 'react';
import { logout } from '@/app/api/logoutUser';
import Button from '@/app/ui/button/button';
import { AddBookNotification } from '@/app/ui/notifications/AddBookNotification';
import { UpdateBookNotification } from '@/app/ui/notifications/UpdateBookNotification';
import { DeleteBookNotification } from '@/app/ui/notifications/DeleteBookNotification';
import { getProfile, GetProfileResponse } from '@/app/api/getProfile';
import { getUserOrders } from '@/app/api/orders/getUserOrders';
import { getAllOrders } from '@/app/api/orders/getAllOrders';
import { MappedOrder } from '@/app/mappers/mappedOrder';
import { useRouter } from 'next/navigation';
import { useAuthStatus } from '../hooks/useAuthStatus';
import { mapOrderResponse } from '../mappers/mappers';
import OrderCard from './OrderCard';

import './page.scss';

export default function ProfilePage() {
  const [showAddBookNotification, setShowAddBookNotification] = useState(false);
  const [showUpdateBookNotification, setShowUpdateBookNotification] = useState(false);
  const [showDeleteBookNotification, setShowDeleteBookNotification] = useState(false);
  const [profileData, setProfileData] = useState<GetProfileResponse | null>(null);
  const [ordersData, setOrdersData] = useState<MappedOrder[]>([]);
  const router = useRouter();
  const [token, setToken] = useState<string>('');
  const { isAuthenticated, isLoading, isAdmin, username } = useAuthStatus();


  const handleBookAdded = () => {
    // Можно добавить логику обновления списка книг, если нужно
  };

  const handleBookUpdated = () => {

  };

  const handleBookDeleted = () => {

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
        router.replace('/auth/sign-in')
      }
    };
    fetchProfile();
  }, []);

  useEffect(() => {
    const fetchUserOrders = async () => {
      if (isAuthenticated && username) {
        try {
          const data = await getUserOrders(token, username);
          const mappedOrders = data.map(mapOrderResponse);
          setOrdersData(mappedOrders);
        } catch {
          console.log('Ошибка при получении заказов')
        }
      }
    };

    const fetchAllOrders = async () => {
      if (isAuthenticated && isAdmin) {
        try {
          const data = await getAllOrders(token);
          const mappedOrders = data.map(mapOrderResponse);
          setOrdersData(mappedOrders);
        } catch {
          console.log('Ошибка при получении заказов')
        }
      }
    };
    
    if (isAdmin) {
      fetchAllOrders();
    } else {
      fetchUserOrders();
    }
  }, [profileData])

  return (
    <main className='my-profile'>
      <div className='my-profile__personal'>
        <h2>О пользователе</h2>
        <div>
          {profileData && (
            <div className="my-profile__personal__content">
              <p><strong>Имя пользователя:</strong> {profileData.username} {isAdmin ? "(администратор)" : ""}</p>
              <p><strong>Имя:</strong> {profileData.firstName}</p>
              <p><strong>Фамилия:</strong> {profileData.lastName}</p>
              <p><strong>Дата рождения:</strong> {profileData.birthDate}</p>
              <p><strong>Телефон:</strong> {profileData.telNumber}</p>
              <p><strong>Email:</strong> {profileData.mail}</p>
            </div>
          )}

          {showAddBookNotification && (
            <AddBookNotification
              onClose={() => setShowAddBookNotification(false)}
              onBookAdded={handleBookAdded}
            />
          )}

          {showUpdateBookNotification && (
            <UpdateBookNotification
              onClose={() => setShowUpdateBookNotification(false)}
              onBookUpdated={handleBookUpdated}
            />
          )}
          {showDeleteBookNotification && (
            <DeleteBookNotification
              onClose={() => setShowDeleteBookNotification(false)}
              onBookDeleted={handleBookDeleted}
            />
          )}
        </div>
        {isAdmin ? 
        (<div className="my-profile__personal__buttons">
            <Button onClick={() => setShowAddBookNotification(true)} text="Добавить книгу" icon={null} className={undefined} style={undefined} />
            <Button onClick={() => setShowUpdateBookNotification(true)} text="Обновить книгу" icon={null} className={undefined} style={undefined} />
              <Button onClick={() => setShowDeleteBookNotification(true)} text="Удалить книгу" icon={null} className={undefined} style={undefined} />
            <Button onClick={() => logout()} text="Выйти" icon={null} className={undefined} style={undefined} />
          </div>)
          :
          (<div className="my-profile__personal__buttons">
            <Button onClick={() => logout()} text="Выйти" icon={null} className={undefined} style={undefined} />
          </div>)
          }
      </div>
      <div className='my-profile__orders'>
        <h2>{isAdmin ? "Все заказы" : "Ваши заказы"}</h2>

        {ordersData.length != 0 ? 
        (<div className='my-profile__orders__content'>
          {ordersData.map(order => (
            <OrderCard key={order.id} order={order} canBeChanged={isAdmin}/>
          ))}
        </div>)
        :
        (<div className='my-profile__orders__no-content'>
          Заказы не найдены
        </div>)}
      </div>
    </main>
  );
}
