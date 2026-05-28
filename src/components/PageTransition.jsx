import React, { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import gsap from 'gsap';

export default function PageTransition({ children }) {
  const location = useLocation();
  const containerRef = useRef(null);
  const isFirstRender = useRef(true);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      gsap.set(container, { opacity: 1, y: 0, scale: 1, clearProps: 'transform' });
      isFirstRender.current = false;
      return;
    }

    if (isFirstRender.current) {
      gsap.fromTo(container,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' }
      );
      isFirstRender.current = false;
      return;
    }

    const tl = gsap.timeline();

    tl.to(container, {
      opacity: 0,
      y: -20,
      scale: 0.98,
      duration: 0.25,
      ease: 'power2.in'
    });

    // Enter animation
    tl.fromTo(container,
      { opacity: 0, y: 30, scale: 0.98 },
      { opacity: 1, y: 0, scale: 1, duration: 0.4, ease: 'power3.out' }
    );

    return () => {
      tl.kill();
    };
  }, [location.pathname]);

  return (
    <div ref={containerRef} className="page-transition">
      {children}
    </div>
  );
}
