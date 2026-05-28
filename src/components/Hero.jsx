import React, { useCallback, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useI18n } from '../context/I18nContext';
import { ArrowRight, BarChart3, Cpu, Terminal } from 'lucide-react';
import gsap from 'gsap';

export default function Hero() {
  const { t } = useI18n();
  const sectionRef = useRef(null);

  useEffect(() => {
    if (!sectionRef.current) return undefined;

    const mm = gsap.matchMedia();
    mm.add('(prefers-reduced-motion: reduce)', () => {
      const ctx = gsap.context(() => {
        gsap.set('[data-hero-animate], .ambient-line, .ambient-node, .ambient-scan', {
          autoAlpha: 1,
          clearProps: 'transform'
        });
      }, sectionRef);

      return () => ctx.revert();
    });

    mm.add('(prefers-reduced-motion: no-preference)', () => {
      const ctx = gsap.context(() => {
        gsap.set('.ambient-line', { scaleX: 0, transformOrigin: 'left center' });
        gsap.set('.ambient-node', { autoAlpha: 0, scale: 0.82 });

        gsap.timeline({ defaults: { ease: 'power3.out' } })
          .fromTo('[data-hero-animate]', {
            autoAlpha: 0,
            y: 28
          }, {
            autoAlpha: 1,
            y: 0,
            duration: 0.72,
            stagger: 0.08
          }, 0)
          .to('.ambient-line', {
            scaleX: 1,
            duration: 1.15,
            stagger: 0.08,
            ease: 'power3.inOut'
          }, 0.08)
          .to('.ambient-node', {
            autoAlpha: 1,
            scale: 1,
            duration: 0.5,
            stagger: { amount: 0.35, from: 'center' }
          }, 0.26);

        gsap.to('.ambient-scan', {
          xPercent: 130,
          duration: 5.8,
          repeat: -1,
          ease: 'none'
        });

        gsap.to('.ambient-node', {
          scale: 1.08,
          duration: 1.8,
          repeat: -1,
          yoyo: true,
          stagger: { each: 0.28, from: 'center' },
          ease: 'sine.inOut'
        });
      }, sectionRef);

      return () => ctx.revert();
    });

    return () => mm.revert();
  }, []);

  const handleCardMove = useCallback((event) => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const card = event.currentTarget;
    const rect = card.getBoundingClientRect();
    const relativeX = (event.clientX - rect.left) / rect.width;
    const relativeY = (event.clientY - rect.top) / rect.height;
    const rotateY = (relativeX - 0.5) * 7;
    const rotateX = (0.5 - relativeY) * 5;

    card.style.setProperty('--spotlight-x', `${relativeX * 100}%`);
    card.style.setProperty('--spotlight-y', `${relativeY * 100}%`);

    gsap.to(card, {
      rotationX: rotateX,
      rotationY: rotateY,
      y: -4,
      transformPerspective: 900,
      duration: 0.35,
      ease: 'power3.out',
      overwrite: 'auto'
    });
  }, []);

  const handleCardLeave = useCallback((event) => {
    const card = event.currentTarget;
    card.style.removeProperty('--spotlight-x');
    card.style.removeProperty('--spotlight-y');
    gsap.to(card, {
      rotationX: 0,
      rotationY: 0,
      y: 0,
      duration: 0.5,
      ease: 'power3.out',
      overwrite: 'auto'
    });
  }, []);

  const menuItems = [
    {
      icon: <Terminal size={24} />,
      title: t('hero.simulatorTitle'),
      description: t('hero.simulatorDesc'),
      link: '/editor'
    },
    {
      icon: <BarChart3 size={24} />,
      title: t('hero.benchmarkTitle'),
      description: t('hero.benchmarkDesc'),
      link: '/benchmark'
    }
  ];

  return (
    <section ref={sectionRef} className="hero-section">
      <div className="hero-ambient" aria-hidden="true">
        <div className="ambient-grid" />
        <div className="ambient-scan" />
        <span className="ambient-line ambient-line-a" />
        <span className="ambient-line ambient-line-b" />
        <span className="ambient-line ambient-line-c" />
        <span className="ambient-line ambient-line-d" />
        <span className="ambient-line ambient-line-e" />
        <span className="ambient-node ambient-node-a" />
        <span className="ambient-node ambient-node-b" />
        <span className="ambient-node ambient-node-c" />
        <span className="ambient-node ambient-node-d" />
      </div>
      <div className="hero-content">
        <div data-hero-animate className="hero-badge">
          <Cpu size={14} />
          <span>{t('hero.badge')}</span>
        </div>

        <h1 data-hero-animate className="hero-title">{t('hero.title')}</h1>

        <p data-hero-animate className="hero-subtitle">{t('hero.subtitle')}</p>

        <div data-hero-animate className="menu-grid">
          {menuItems.map((item) => (
            <Link
              key={item.link}
              to={item.link}
              className="menu-card"
              onMouseMove={handleCardMove}
              onMouseLeave={handleCardLeave}
            >
              <div className="menu-icon">{item.icon}</div>
              <div className="menu-info">
                <h3 className="menu-title">{item.title}</h3>
                <p className="menu-desc">{item.description}</p>
              </div>
              <div className="menu-arrow">
                <ArrowRight size={18} />
              </div>
            </Link>
          ))}
        </div>

        <div data-hero-animate className="hero-tags">
          <span className="tag-item">Fetch-Execute</span>
          <span className="tag-dot">/</span>
          <span className="tag-item">von Neumann</span>
          <span className="tag-dot">/</span>
          <span className="tag-item">Memory Access</span>
        </div>
      </div>
    </section>
  );
}
