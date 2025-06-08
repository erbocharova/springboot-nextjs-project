//хук состояния аутентификации, можно импортировать и юзать в любой части приложения
import { useEffect, useState } from 'react';
import Cookies from 'js-cookie';

  export function useAuthStatus() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const accessToken = Cookies.get('token');
    if (accessToken) {
      setIsAuthenticated(true);
    }
  }, []);

  return { isAuthenticated };
}