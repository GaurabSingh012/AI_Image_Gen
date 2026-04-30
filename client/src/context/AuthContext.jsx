import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // Check if a user session exists in local storage on load
  useEffect(() => {
    const storedUser = localStorage.getItem('visionai_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const loginContext = (userData) => {
    setUser(userData);
    localStorage.setItem('visionai_user', JSON.stringify(userData));
  };

  const logoutContext = () => {
    setUser(null);
    localStorage.removeItem('visionai_user');
  };

  return (
    <AuthContext.Provider value={{ user, loginContext, logoutContext }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);