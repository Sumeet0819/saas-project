'use client';

import React, { useEffect } from 'react';
import { useAppSelector } from '../../store/hooks';

export default function ThemeProvider({ children }: { children: React.ReactNode }) {
  const { theme, colorTheme } = useAppSelector((state) => state.ui);

  useEffect(() => {
    const root = document.documentElement;
    
    // Apply dark/light mode
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }

    // Apply color theme
    root.setAttribute('data-theme', colorTheme);
    
  }, [theme, colorTheme]);

  return <>{children}</>;
}
