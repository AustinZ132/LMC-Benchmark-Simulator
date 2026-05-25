import React, { createContext, useContext, useState, useCallback } from 'react';
import { zh } from '../utils/i18n/zh';
import { en } from '../utils/i18n/en';

const I18nContext = createContext();

const translations = { zh, en };

export function I18nProvider({ children }) {
  const [lang, setLang] = useState(() => {
    return localStorage.getItem('lmc-lang') || 'zh';
  });

  const t = useCallback((key) => {
    const keys = key.split('.');
    let value = translations[lang];
    
    for (const k of keys) {
      if (value && typeof value === 'object') {
        value = value[k];
      } else {
        return key;
      }
    }
    
    return value || key;
  }, [lang]);

  const toggleLang = useCallback(() => {
    const newLang = lang === 'zh' ? 'en' : 'zh';
    setLang(newLang);
    localStorage.setItem('lmc-lang', newLang);
  }, [lang]);

  return (
    <I18nContext.Provider value={{ lang, t, toggleLang }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error('useI18n must be used within an I18nProvider');
  }
  return context;
}
