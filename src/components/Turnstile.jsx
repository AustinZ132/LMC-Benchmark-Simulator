import React, { useEffect, useRef, useState } from 'react';

const SITE_KEY = '0x4AAAAAADWjfJGscLN86eM6';

export default function Turnstile({ onVerify, onError, action = 'submit' }) {
  const containerRef = useRef(null);
  const [widgetId, setWidgetId] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Check if turnstile is loaded
    const checkTurnstile = setInterval(() => {
      if (window.turnstile) {
        setIsLoaded(true);
        clearInterval(checkTurnstile);
      }
    }, 100);

    return () => clearInterval(checkTurnstile);
  }, []);

  useEffect(() => {
    if (!isLoaded || !containerRef.current) return;

    // Clean up previous widget
    if (widgetId !== null) {
      window.turnstile.remove(widgetId);
    }

    // Render new widget
    const id = window.turnstile.render(containerRef.current, {
      sitekey: SITE_KEY,
      action: action,
      callback: (token) => {
        if (onVerify) {
          onVerify(token);
        }
      },
      'error-callback': (error) => {
        if (onError) {
          onError(error);
        }
      },
      'expired-callback': () => {
        if (onVerify) {
          onVerify(null);
        }
      },
    });

    setWidgetId(id);

    return () => {
      if (id !== null && window.turnstile) {
        window.turnstile.remove(id);
      }
    };
  }, [isLoaded, action, onVerify, onError]);

  return (
    <div className="turnstile-container">
      <div ref={containerRef} className="turnstile-widget"></div>
    </div>
  );
}
