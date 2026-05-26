import React, { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import gsap from 'gsap';

export default function PageTransition({ children }) {
  const location = useLocation();
  const containerRef = useRef(null);
  const prevLocation = useRef(location.pathname);

  useEffect(() => {
    if (prevLocation.current !== location.pathname) {
      // Page changed, animate transition
      const container = containerRef.current;
      if (!container) return;

      // Exit animation
      gsap.to(container, {
        opacity: 0,
        y: 20,
        duration: 0.2,
        ease: 'power2.in',
        onComplete: () => {
          // Enter animation
          gsap.fromTo(container, 
            { opacity: 0, y: -20 },
            { 
              opacity: 1, 
              y: 0, 
              duration: 0.4, 
              ease: 'power3.out' 
            }
          );
        }
      });

      prevLocation.current = location.pathname;
    }
  }, [location.pathname]);

  return (
    <div ref={containerRef} className="page-transition">
      {children}
    </div>
  );
}
