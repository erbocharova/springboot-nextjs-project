'use client'
import React, { useState } from 'react';
import Button from '@/app/ui/button/button';
import { createBook, CreateBookPayload } from '@/app/api/books/createBook';
import './add-book-notification.scss';

interface AddBookNotificationProps {
  onClose: () => void;
  onBookAdded: () => void;
}

export const AddBookNotification: React.FC<AddBookNotificationProps> = ({ onClose, onBookAdded }) => {
  const [formData, setFormData] = useState<CreateBookPayload>({
    id: '',
    name: '',
    author: '',
    description: '',
    imageUrl: '',
    price: 0,
    quantity: 0,
    available: true,
    popular: false,
    category: '',
  });

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const target = e.target as HTMLInputElement;
    const { name, value, type } = target;
    const checked = target.checked;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await createBook(formData);
      onBookAdded();
      onClose();
    } catch (error) {
      setError('Ошибка при добавлении книги');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-book-notification">
      <div className="add-book-notification__content">
        <h2>Добавить новую книгу</h2>
        <form onSubmit={handleSubmit} className="add-book-form">
          {[
            { label: 'ID книги', name: 'id', type: 'text', required: true },
            { label: 'Название', name: 'name', type: 'text', required: true },
            { label: 'Автор', name: 'author', type: 'text', required: true },
            { label: 'Описание', name: 'description', type: 'textarea', required: true },
            { label: 'Цена', name: 'price', type: 'number', step: '0.01', required: true },
            { label: 'Количество', name: 'quantity', type: 'number', required: true },
            { label: 'Доступна', name: 'available', type: 'checkbox' },
            { label: 'Популярна', name: 'popular', type: 'checkbox' },
            { label: 'Категория', name: 'category', type: 'text', required: true },
          ].map(({ label, name, type, required, step }) => (
            <label key={name}>
              {label}
              {type === 'textarea' ? (
                <textarea
                  name={name}
                  value={formData[name as keyof typeof formData] as string}
                  onChange={handleChange}
                  required={required}
                />
              ) : (
                <input
                  type={type}
                  name={name}
                  value={type === 'checkbox' ? undefined : (formData[name as keyof typeof formData] as string | number)}
                  checked={type === 'checkbox' ? (formData[name as keyof typeof formData] as boolean) : undefined}
                  onChange={handleChange}
                  step={step}
                  required={required}
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
              required
            />
          </label>
          {error && <div className="add-book-notification__error">{error}</div>}
          <div className="add-book-notification__buttons">
          <Button text={loading ? 'Добавление...' : 'Добавить'} onClick={() => {}} icon={null} className={undefined} style={undefined} />
          <Button text="Отмена" onClick={onClose} icon={null} className={undefined} style={undefined} />
          </div>
        </form>
      </div>
    </div>
  );
};
