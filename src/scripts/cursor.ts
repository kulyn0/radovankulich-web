// Kurzor: malá černá tečka; nad fotkou kruh 64 px s textem, k odkazům se „přilepí“
// (podle „Fluid Magnetic Cursor“ z 21st.dev, vanilla JS). Jen pro myš (pointer: fine).

let started = false;

export function initCursor() {
  const fine = window.matchMedia('(hover: hover) and (pointer: fine)');
  if (!fine.matches || started) return;
  started = true;

  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const el = document.createElement('div');
  el.className = 'cursor';
  el.setAttribute('aria-hidden', 'true');
  el.innerHTML = '<span class="cursor__label"></span>';
  const label = el.firstElementChild as HTMLElement;

  // Po view transition je <body> nové, kurzor je potřeba vrátit
  const mount = () => {
    if (!el.isConnected) document.body.append(el);
    document.documentElement.classList.add('has-cursor');
  };
  mount();
  document.addEventListener('astro:after-swap', mount);

  let x = -100;
  let y = -100;
  let cx = x;
  let cy = y;
  let target: HTMLElement | null = null;
  let visible = false;

  window.addEventListener(
    'pointermove',
    (e) => {
      if (e.pointerType !== 'mouse') return;
      x = e.clientX;
      y = e.clientY;
      if (!visible) {
        visible = true;
        cx = x;
        cy = y;
        el.classList.add('is-visible');
      }
    },
    { passive: true },
  );
  document.addEventListener('pointerleave', () => {
    visible = false;
    el.classList.remove('is-visible');
  });

  document.addEventListener('pointerover', (e) => {
    const t = e.target as HTMLElement;
    const photo = t.closest<HTMLElement>('[data-cursor]');
    const link = photo ? null : t.closest<HTMLElement>('a, button, [role="button"], input[type="range"]');
    target = link;
    el.classList.toggle('is-photo', !!photo);
    el.classList.toggle('is-link', !!link);
    label.textContent = photo?.dataset.cursor ?? '';
  });

  const tick = () => {
    let tx = x;
    let ty = y;
    // Magnet: tečka se přitahuje ke středu odkazu
    if (target?.isConnected) {
      const r = target.getBoundingClientRect();
      tx = x + (r.left + r.width / 2 - x) * 0.3;
      ty = y + (r.top + r.height / 2 - y) * 0.3;
    }
    const k = reduce ? 1 : 0.22;
    cx += (tx - cx) * k;
    cy += (ty - cy) * k;
    el.style.transform = `translate3d(${cx}px, ${cy}px, 0)`;
    requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
}
