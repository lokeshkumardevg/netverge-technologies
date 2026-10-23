'use client';

import { useEffect, useRef, useState, type ReactNode } from 'react';

type Props = {
  children: ReactNode;
  className?: string;
  delay?: number; // ms
  direction?: 'up' | 'left' | 'right' | 'none';
};

export default function Reveal({
  children,
  className = '',
  delay = 0,
  direction = 'up',
}: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    let io: IntersectionObserver | undefined;
    let mo: MutationObserver | undefined;

    const startObserving = () => {
      io = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setVisible(true);
            io?.disconnect(); // animate only once
          }
        },
        { threshold: 0.15, rootMargin: '0px 0px -60px 0px' }
      );
      io.observe(el);
    };

    // Wait for the preloader to finish (<html class="nv-loaded">) before animating
    const root = document.documentElement;
    if (root.classList.contains('nv-loaded')) {
      startObserving();
    } else {
      mo = new MutationObserver(() => {
        if (root.classList.contains('nv-loaded')) {
          mo?.disconnect();
          startObserving();
        }
      });
      mo.observe(root, { attributes: true, attributeFilter: ['class'] });
    }

    return () => {
      io?.disconnect();
      mo?.disconnect();
    };
  }, []);

  const hidden =
    direction === 'up'
      ? 'translate-y-10'
      : direction === 'left'
      ? '-translate-x-10'
      : direction === 'right'
      ? 'translate-x-10'
      : '';

  return (
    <div
      ref={ref}
      style={{ transitionDelay: `${delay}ms` }}
      className={`transition-all duration-700 ease-out motion-reduce:transition-none ${
        visible
          ? 'opacity-100 translate-x-0 translate-y-0'
          : `opacity-0 ${hidden} motion-reduce:opacity-100 motion-reduce:translate-x-0 motion-reduce:translate-y-0`
      } ${className}`}
    >
      {children}
    </div>
  );
}
