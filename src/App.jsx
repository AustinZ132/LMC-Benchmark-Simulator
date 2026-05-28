import React, { useCallback, useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import PageTransition from './components/PageTransition';
import Turnstile from './components/Turnstile';
import HomePage from './pages/HomePage';
import EditorPage from './pages/EditorPage';
import BenchmarkPage from './pages/BenchmarkPage';
import { I18nProvider } from './context/I18nContext';
import { useI18n } from './context/I18nContext';
import { BenchmarkProvider } from './context/BenchmarkContext';
import { Cpu, ShieldCheck } from 'lucide-react';

function AnimatedRoutes() {
  const location = useLocation();
  
  return (
    <PageTransition key={location.pathname}>
      <Routes location={location}>
        <Route path="/" element={<HomePage />} />
        <Route path="/editor" element={<EditorPage />} />
        <Route path="/benchmark" element={<BenchmarkPage />} />
      </Routes>
    </PageTransition>
  );
}

async function verifyTurnstileToken(token) {
  if (!token) return false;

  try {
    const response = await fetch('/api/turnstile', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token })
    });
    const result = await response.json();

    if (result.success) return true;

    const strictMode = import.meta.env.VITE_TURNSTILE_STRICT === 'true';
    if (result.configurationRequired && !strictMode) {
      return true;
    }

    return false;
  } catch (error) {
    return import.meta.env.VITE_TURNSTILE_STRICT !== 'true';
  }
}

function VerifyScreen({ onVerified }) {
  const { t } = useI18n();
  const [isChecking, setIsChecking] = useState(false);
  const [error, setError] = useState('');

  const handleVerify = useCallback(async (token) => {
    if (!token) {
      setError(t('security.expired'));
      return;
    }

    setIsChecking(true);
    setError('');
    const verified = await verifyTurnstileToken(token);
    setIsChecking(false);

    if (verified) {
      onVerified();
      return;
    }

    setError(t('security.failed'));
  }, [onVerified, t]);

  const handleError = useCallback(() => {
    setIsChecking(false);
    setError(t('security.failed'));
  }, [t]);

  return (
    <main className="verify-screen">
      <div className="verify-card">
        <div className="verify-logo">
          <Cpu size={36} />
        </div>
        <h1 className="verify-title">{t('security.title')}</h1>
        <p className="verify-desc">{t('security.description')}</p>
        <Turnstile onVerify={handleVerify} onError={handleError} action="access" />
        {isChecking && <p className="verify-status">{t('security.checking')}</p>}
        {error && <p className="verify-error">{error}</p>}
        <div className="verify-footer">
          <ShieldCheck size={14} />
          <span>{t('security.footer')}</span>
        </div>
      </div>
    </main>
  );
}

function AppContent() {
  const [isVerified, setIsVerified] = useState(() => {
    try {
      if (typeof window === 'undefined') return false;
      return window.sessionStorage.getItem('lmc-turnstile-verified') === 'true';
    } catch (error) {
      return false;
    }
  });

  const handleVerified = useCallback(() => {
    try {
      if (typeof window === 'undefined') return;
      window.sessionStorage.setItem('lmc-turnstile-verified', 'true');
    } catch (error) {
      // Session storage is optional; verification still succeeds for this render.
    }
    setIsVerified(true);
  }, []);

  useEffect(() => {
    if (!isVerified) return;
    document.documentElement.dataset.verified = 'true';
  }, [isVerified]);

  if (!isVerified) {
    return <VerifyScreen onVerified={handleVerified} />;
  }

  return (
    <Router>
      <div className="app">
        <Navbar />
        <main className="main-content">
          <AnimatedRoutes />
        </main>
        <Footer />
      </div>
    </Router>
  );
}

function App() {
  return (
    <I18nProvider>
      <BenchmarkProvider>
        <AppContent />
      </BenchmarkProvider>
    </I18nProvider>
  );
}

export default App;
