'use client'
import React, { useState } from 'react';
import Button from '@/app/ui/button/button';
import { updateBook, UpdateBookPayload } from '@/app/api/books/updateBook';
import './add-book-notification.scss';

interface UpdateBookNotificationProps {
  onClose: () => void;
  onBookUpdated: () => void;
}

export const UpdateBookNotification: React.FC<UpdateBookNotificationProps> = ({ onClose, onBookUpdated }) => {
    const [bookId, setBookId] = useState('');
    const [formData, setFormData] = useState<UpdateBookPayload>({
    name: '',
    author: '',
    description: '',
    imageUrl: '',
    price: undefined,
    quantity: undefined,
    available: undefined,
    popular: undefined,
    category: '',
  });

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const target = e.target as HTMLInputElement;
    const { name, value, type } = target;
    const checked = target.checked;

    if (name === 'id') {
      setBookId(value);
    } else {
        setFormData((prev) => ({
            ...prev,
        [name]: type === 'checkbox' ? checked : type === 'number' ? Number(value) : value,
        }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!bookId) {
      setError('ID книги обязателен');
      return;
    }

    setLoading(true);
    setError(null);

    try {
        const payload = Object.fromEntries(
        Object.entries(formData).filter(([_, value]) => 
          value !== undefined && 
          value !== '' && 
          !(typeof value === 'number' && isNaN(value))
        )
      );

        await updateBook(bookId, payload);
        onBookUpdated();
        onClose();
    } catch (error) {
        setError('Ошибка при обновлении книги');
    } finally {
        setLoading(false);
    }
  };

  return (
    <div className="add-book-notification">
      <div className="add-book-notification__content">
        <h2>Обновить книгу по ID</h2>
        <span>Заполните только те поля, которые надо обновить</span>
        <form onSubmit={handleSubmit} className="add-book-form">
            <label>
            ID книги
            <input
              type="text"
              name="id"
              value={bookId}
              onChange={handleChange}
              required
            />
          </label>
          {[
            { label: 'Название', name: 'name', type: 'text' },
            { label: 'Автор', name: 'author', type: 'text' },
            { label: 'Описание', name: 'description', type: 'textarea' },
            { label: 'Цена', name: 'price', type: 'number', step: '0.01' },
            { label: 'Количество', name: 'quantity', type: 'number' },
            { label: 'Доступна', name: 'available', type: 'checkbox' },
            { label: 'Популярна', name: 'popular', type: 'checkbox' },
            { label: 'Категория', name: 'category', type: 'text' },
          ].map(({ label, name, type, step }) => (
            <label key={name}>
              {label}
              {type === 'textarea' ? (
                <textarea
                  name={name}
                  value={formData[name as keyof typeof formData] as string || ''}
                  onChange={handleChange}
                />
              ) : (
                <input
                  type={type}
                  name={name}
                  value={type === 'checkbox' ? undefined : (formData[name as keyof typeof formData] as string | number | undefined) || ''}
                  checked={type === 'checkbox' ? (formData[name as keyof typeof formData] as boolean | undefined) || false : undefined}
                  onChange={handleChange}
                  step={step}
                />
              )}
            </label>
          ))}
          
          <label className="custom-file-upload">
            {formData.imageUrl ? 'Изображение выбрано' : 'Выбрать изображение'}
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files ? e.target.files[0] : null;
                if (file) {
                  const reader = new FileReader();
                  reader.onloadend = () => {
                    setFormData((prev) => ({
                      ...prev,
                      imageUrl: reader.result as string,
                    }));
                  };
                  reader.readAsDataURL(file);
                }
              }}
            />
          </label>
          
          {error && <div className="add-book-notification__error">{error}</div>}
          <div className="add-book-notification__buttons">
          <Button text={loading ? 'Обновление...' : 'Обновить'} onClick={() => {}} icon={null} className={undefined} style={undefined} />
          <Button text="Отмена" onClick={onClose} icon={null} className={undefined} style={undefined} />
          </div>
        </form>
      </div>
    </div>
  );
};