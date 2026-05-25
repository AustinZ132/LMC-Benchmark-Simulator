import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import EditorPage from './pages/EditorPage';
import BenchmarkPage from './pages/BenchmarkPage';
import { I18nProvider } from './context/I18nContext';
import { BenchmarkProvider } from './context/BenchmarkContext';

function App() {
  return (
    <I18nProvider>
      <BenchmarkProvider>
        <Router>
          <div className="app">
            <Navbar />
            <main className="main-content">
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/editor" element={<EditorPage />} />
                <Route path="/benchmark" element={<BenchmarkPage />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </Router>
      </BenchmarkProvider>
    </I18nProvider>
  );
}

export default App;
