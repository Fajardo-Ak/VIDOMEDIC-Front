import React, { createContext, useContext, useEffect, useState } from "react";

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [temaOscuro, setTemaOscuro] = useState(() => localStorage.getItem('darkTheme') === 'true');
  const [tamanoFuente, setTamanoFuente] = useState(() => parseInt(localStorage.getItem('fontSize')) || 2);

  useEffect(() => {
    const sizes = ['text-base', 'text-lg', 'text-xl'];
    document.documentElement.classList.remove(...sizes);
    document.documentElement.classList.add(sizes[tamanoFuente - 1]);
    localStorage.setItem('fontSize', tamanoFuente);

    if (temaOscuro) {
      document.documentElement.classList.add('dark');
      document.documentElement.style.setProperty('color-scheme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      document.documentElement.style.setProperty('color-scheme', 'light');
    }
    localStorage.setItem('darkTheme', temaOscuro);
  }, [temaOscuro, tamanoFuente]);

  return (
    <ThemeContext.Provider value={{ temaOscuro, setTemaOscuro, tamanoFuente, setTamanoFuente }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
