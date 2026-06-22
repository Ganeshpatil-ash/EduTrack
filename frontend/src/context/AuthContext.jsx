import React, { createContext, useState, useEffect, useContext, useCallback } from 'react';
import toast from 'react-hot-toast';
import api from '../api/axios';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('edutrack_user');
    const storedToken = localStorage.getItem('edutrack_token');
    if (storedUser && storedToken) setUser(JSON.parse(storedUser));
    setLoading(false);
  }, []);

  const persistSession = (data) => {
    const { token, ...userData } = data;
    localStorage.setItem('edutrack_token', token);
    localStorage.setItem('edutrack_user', JSON.stringify(userData));
    setUser(userData);
  };

  const login = useCallback(async (email, password) => {
    const { data } = await api.post('/auth/login', { email, password });
    persistSession(data.data);
    toast.success(`Welcome back, ${data.data.name.split(' ')[0]}`);
    return data.data;
  }, []);

  const register = useCallback(async (name, email, password) => {
    const { data } = await api.post('/auth/register', { name, email, password });
    persistSession(data.data);
    toast.success('Account created');
    return data.data;
  }, []);

  const updateUser = useCallback((data) => persistSession(data), []);

  const logout = useCallback(() => {
    localStorage.removeItem('edutrack_token');
    localStorage.removeItem('edutrack_user');
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, loading, isAuthenticated: !!user, login, register, logout, updateUser }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
};
