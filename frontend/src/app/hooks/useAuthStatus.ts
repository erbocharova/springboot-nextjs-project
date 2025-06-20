//хук состояния аутентификации, можно импортировать и юзать в любой части приложения
'use client';
import { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode';

interface AuthData {
  isAuthenticated: boolean;
  isLoading: boolean;
  role?: string;
  username?: string;
}

export const  useAuthStatus = (): AuthData => {
  const [auth, setAuth] = useState<AuthData>({
    isAuthenticated: false,
    isLoading: true
  });

  useEffect(() => {
    const checkAuth = () => {
      try {
        const token = Cookies.get('token');
        
        if (!token) {
          setAuth({ ...auth, isLoading: false });
          return;
        }

        const decoded = jwtDecode<{ sub: string; role: string }>(token);
        setAuth({
          username: decoded.sub,
          role: decoded.role,
          isAuthenticated: true,
          isLoading: false
        });
      } catch (error) {
        console.error('Auth error:', error);
        setAuth({
          isAuthenticated: false,
          isLoading: false
        });
      }
    };

    checkAuth();
  }, []);

  return auth;
};

