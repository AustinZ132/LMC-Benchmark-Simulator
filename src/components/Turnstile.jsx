import React, { useEffect, useRef, useState } from 'react';

const SITE_KEY = import.meta.env.VITE_TURNSTILE_SITE_KEY || '0x4AAAAAADWjfJGscLN86eM6';

export default function Turnstile({ onVerify, onError, action = 'access' }) {
  const containerRef = useRef(null);
  const widgetIdRef = useRef(null);
  const [isLoaded, setIsLoaded] = useState(() =>
    typeof window !== 'undefined' && Boolean(window.turnstile)
  );

  useEffect(() => {
    if (isLoaded) return undefined;

    const timer = window.setInterval(() => {
      if (window.turnstile) {
        setIsLoaded(true);
        window.clearInterval(timer);
      }
    }, 100);

    return () => window.clearInterval(timer);
  }, [isLoaded]);

  useEffect(() => {
    if (!isLoaded || !containerRef.current || !window.turnstile) return undefined;

    if (widgetIdRef.current !== null) {
      window.turnstile.remove(widgetIdRef.current);
      widgetIdRef.current = null;
    }

    widgetIdRef.current = window.turnstile.render(containerRef.current, {
      sitekey: SITE_KEY,
      action,
      theme: 'light',
      appearance: 'always',
      callback: (token) => onVerify?.(token),
      'error-callback': (error) => onError?.(error),
      'expired-callback': () => onVerify?.(null)
    });

    return () => {
      if (widgetIdRef.current !== null && window.turnstile) {
        window.turnstile.remove(widgetIdRef.current);
        widgetIdRef.current = null;
      }
    };
  }, [action, isLoaded, onError, onVerify]);

  return (
    <div className="turnstile-container">
      <div ref={containerRef} className="turnstile-widget" />
    </div>
  );
}
