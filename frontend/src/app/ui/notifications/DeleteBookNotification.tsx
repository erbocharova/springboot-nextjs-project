'use client'
import React, { useState } from 'react';
import Button from '@/app/ui/button/button';
import { deleteBook } from '@/app/api/books/deleteBook';
import './DeleteBookNotification.scss';

interface DeleteBookNotificationProps {
  onClose: () => void;
  onBookDeleted: () => void;
}

export const DeleteBookNotification: React.FC<DeleteBookNotificationProps> = ({ onClose, onBookDeleted }) => {
    const [bookId, setBookId] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const target = e.target as HTMLInputElement;
        const { name, value, type } = target;

        setBookId(value);
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
        await deleteBook(bookId);
        onBookDeleted();
        onClose();
    } catch (error) {
        setError('Ошибка при удалении книги');
    } finally {
        setLoading(false);
    }
  };

  return (
    <div className="delete-book-notification">
      <div className="delete-book-notification__content">
        <h2>Удалить книгу по ID</h2>
        <span>После удаления восстановить данные о книге невозможно!</span>
        <form onSubmit={handleSubmit} className="delete-book-form">
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
          {error && <div className="delete-book-notification__error">{error}</div>}
          <div className="delete-book-notification__buttons">
          <Button text={loading ? 'Удаление...' : 'Удалить'} onClick={() => {}} icon={null} className={"delete-book-notification__buttons__delete"} style={undefined} />
          <Button text="Отмена" onClick={onClose} icon={null} className={undefined} style={undefined} />
          </div>
        </form>
      </div>
    </div>
  );
};