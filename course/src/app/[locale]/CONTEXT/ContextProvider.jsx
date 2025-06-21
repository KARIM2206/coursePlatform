'use client';
import { createContext, useEffect, useState, useCallback } from 'react';

export const Context = createContext();

const ContextProvider = ({ children }) => {
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [refresh, setRefresh] = useState(false);

  // Memoize fetchUser to prevent unnecessary recreations
  const fetchUser = useCallback(async () => {
    if (!token) {
      setUser(null);
      return;
    }
    
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch('http://localhost:5000/api/auth/user', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        handleLogout();
        throw new Error('Failed to fetch user');
      }

      const data = await res.json();
      setUser(data.user);
      console.log('User after refresh:', data.user);
    } catch (err) {
      console.error('Fetch error:', err.message);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, [token]); // Add token as dependency

  // Load token from localStorage on mount
  useEffect(() => {
    const storedToken = localStorage.getItem('login-token');
    if (storedToken) {
      setToken(storedToken);
    }
  }, []);

  // Fetch user when token changes
  useEffect(() => {
    if (token) {
      fetchUser();
    }
  }, [token, fetchUser, refresh]);

  const updateToken = (newToken) => {
    if (newToken) {
      localStorage.setItem('login-token', newToken);
      setToken(newToken);
    } else {
      handleLogout();
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('login-token');
    setToken(null);
    setUser(null);
    setError(null);
    setRefresh(false);
  };

  return (
    <Context.Provider
      value={{
        token,
        setToken: updateToken,
        user,
        setUser,
        isLoading,
        error,
        logout: handleLogout,
        refresh,
        setRefresh,
        fetchUser,
      }}
    >
      {children}
    </Context.Provider>
  );
};

export default ContextProvider;