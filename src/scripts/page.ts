import { initCursor } from './cursor';

// Společná inicializace stránky; volá se při každém astro:page-load (i po view transition).

let revealObserver: IntersectionObserver | undefined;

function initReveal() {
  revealObserver?.disconnect();
  const items = document.querySelectorAll<HTMLElement>('[data-reveal]:not(.is-visible)');
  if (!items.length) return;

  revealObserver = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        entry.target.classList.add('is-visible');
        revealObserver?.unobserve(entry.target);
      }
    },
    { rootMargin: '0px 0px -8% 0px', threshold: 0.05 },
  );
  items.forEach((el) => revealObserver!.observe(el));
}

let onScroll: (() => void) | undefined;

function initHeader() {
  if (onScroll) window.removeEventListener('scroll', onScroll);
  const root = document.documentElement;
  let ticking = false;
  onScroll = () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      root.classList.toggle('is-scrolled', window.scrollY > 40);
      ticking = false;
    });
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

export function initPage() {
  initHeader();
  initReveal();
  initCursor();
}
