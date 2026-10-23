'use client';

import { useEffect, useState } from 'react';

const STORAGE_KEY = 'cookie-consent';
const LEARN_MORE_URL = 'https://www.cookiesandyou.com/';
const REMEMBER_MS = 365 * 24 * 60 * 60 * 1000; // ask again after 12 months

/**
 * Cookie consent card (site theme: navy + brand orange).
 * - Appears only after the preloader has finished (landing page is visible).
 * - Slides up from the bottom of the screen.
 * - On "Got it!" it slides back down and is remembered for 12 months.
 */
export default function CookieConsent() {
  const [mounted, setMounted] = useState(false); // in the DOM
  const [visible, setVisible] = useState(false); // slid up

  useEffect(() => {
    try {
      const saved = Number(localStorage.getItem(STORAGE_KEY));
      if (saved && Date.now() - saved < REMEMBER_MS) return;
    } catch {
      /* storage blocked: still show the card */
    }

    let showTimer: ReturnType<typeof setTimeout> | undefined;
    const show = () => {
      setMounted(true);
      // wait a tick so the slide-up transition actually plays
      showTimer = setTimeout(() => setVisible(true), 50);
    };

    // wait until the preloader element is gone from the page
    const check = setInterval(() => {
      if (!document.querySelector('.nv-preloader')) {
        clearInterval(check);
        show();
      }
    }, 200);

    return () => {
      clearInterval(check);
      if (showTimer) clearTimeout(showTimer);
    };
  }, []);

  const accept = () => {
    try {
      localStorage.setItem(STORAGE_KEY, String(Date.now()));
    } catch {
      /* ignore */
    }
    setVisible(false); // slide down
    setTimeout(() => setMounted(false), 500); // remove after animation
  };

  if (!mounted) return null;

  return (
    <div
      role="dialog"
      aria-label="Cookie consent"
      className={`fixed inset-x-0 bottom-0 z-[10000] px-4 pb-4 transition-all duration-500 ease-out sm:pb-6 ${
        visible ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'
      }`}
    >
      <div className="mx-auto flex max-w-4xl flex-col gap-5 rounded-2xl border border-white/10 bg-navy-800/95 p-5 shadow-premium backdrop-blur-md sm:flex-row sm:items-center sm:gap-6 sm:p-6">
        {/* icon */}
        <div className="hidden h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-brand-100 text-brand sm:flex">
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M12 2a10 10 0 1 0 10 10 4 4 0 0 1-5-5 4 4 0 0 1-5-5Z" />
            <path d="M8.5 8.5v.01M16 15.5v.01M12 12v.01M11 17v.01M7 14v.01" />
          </svg>
        </div>

        {/* text */}
        <div className="flex-1">
          <p className="text-sm font-semibold text-white">We value your privacy</p>
          <p className="mt-1 text-sm leading-relaxed text-white/70">
            This website uses cookies to ensure you get the best experience on our website.
          </p>
        </div>

        {/* actions */}
        <div className="flex shrink-0 items-center gap-3">
          <a
            href={LEARN_MORE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-outline flex-1 sm:flex-none"
          >
            Learn more
          </a>
          <button type="button" onClick={accept} className="btn btn-primary flex-1 sm:flex-none">
            Got it!
          </button>
        </div>
      </div>
    </div>
  );
}