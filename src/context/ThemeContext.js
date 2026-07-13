'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const [themeSettings, setThemeSettings] = useState(null);
  const [generalSettings, setGeneralSettings] = useState(null);
  const [headerSettings, setHeaderSettings] = useState(null);

  useEffect(() => {
    async function fetchTheme() {
      try {
        const res = await fetch('/api/settings');
        if (res.ok) {
          const data = await res.json();
          if (data.theme) {
            setThemeSettings(data.theme);
            setGeneralSettings(data.general);
            if (data.header) setHeaderSettings(data.header);
            
            // Inject CSS variables into document root
            const root = document.documentElement;
            if (data.theme.primaryColor) {
              root.style.setProperty('--color-primary', data.theme.primaryColor);
              // Calculate a darker shade for hover
              root.style.setProperty('--color-primary-hover', data.theme.primaryColor);
            }
            if (data.theme.secondaryColor) {
              root.style.setProperty('--color-secondary', data.theme.secondaryColor);
            }
            if (data.theme.fontSizeBase) {
              root.style.setProperty('--font-size-base', data.theme.fontSizeBase);
              document.body.style.fontSize = data.theme.fontSizeBase;
            }
            if (data.theme.buttonBgColor) {
              root.style.setProperty('--color-button-bg', data.theme.buttonBgColor);
            }
            if (data.theme.buttonTextColor) {
              root.style.setProperty('--color-button-text', data.theme.buttonTextColor);
            }
          }
        }
      } catch (err) {
        console.error("Failed to load theme settings", err);
      }
    }
    fetchTheme();
  }, []);

  return (
    <ThemeContext.Provider value={{ themeSettings, generalSettings, headerSettings }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
