import React, { useState, useCallback } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import PageTransition from './components/PageTransition';
import Turnstile from './components/Turnstile';
import HomePage from './pages/HomePage';
import EditorPage from './pages/EditorPage';
import BenchmarkPage from './pages/BenchmarkPage';
import { I18nProvider } from './context/I18nContext';
import { BenchmarkProvider } from './context/BenchmarkContext';
import { Shield, Cpu } from 'lucide-react';

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

function VerifyScreen({ onVerify }) {
  return (
    <div className="verify-screen">
      <div className="verify-card">
        <div className="verify-logo">
          <Cpu size={48} />
        </div>
        <h1 className="verify-title">LMC Benchmark Tool</h1>
        <p className="verify-desc">Please verify to continue</p>
        <div className="verify-turnstile">
          <Turnstile onVerify={onVerify} action="access" />
        </div>
        <div className="verify-footer">
          <Shield size={14} />
          <span>Protected by Cloudflare Turnstile</span>
        </div>
      </div>
    </div>
  );
}

function AppContent() {
  const [isVerified, setIsVerified] = useState(false);

  const handleVerify = useCallback((token) => {
    if (token) {
      setIsVerified(true);
    }
  }, []);

  if (!isVerified) {
    return <VerifyScreen onVerify={handleVerify} />;
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
