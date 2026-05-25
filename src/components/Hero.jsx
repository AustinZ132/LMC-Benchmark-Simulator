import React from 'react';
import { useI18n } from '../context/I18nContext';

export default function Hero() {
  const { t } = useI18n();

  return (
    <section className="hero-section">
      <div className="hero-content">
        <h1 className="hero-title">{t('app.title')}</h1>
        <p className="hero-subtitle">{t('app.subtitle')}</p>
      </div>
    </section>
  );
}
