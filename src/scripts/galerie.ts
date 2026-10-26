// Masonry (rozdělení do sloupců podle poměru stran) + PhotoSwipe lightbox.
import PhotoSwipeLightbox from 'photoswipe/lightbox';
import 'photoswipe/style.css';

function layoutMasonry(grid: HTMLElement) {
  const items = [...grid.querySelectorAll<HTMLElement>('.masonry__item')].sort(
    (a, b) => Number(a.dataset.index) - Number(b.dataset.index),
  );
  const cols = Number(getComputedStyle(grid).getPropertyValue('--cols')) || 2;
  if (grid.dataset.cols === String(cols)) return;
  grid.dataset.cols = String(cols);

  const columns = Array.from({ length: cols }, () => {
    const col = document.createElement('div');
    col.className = 'masonry__col';
    return col;
  });
  const heights = new Array(cols).fill(0);
  for (const item of items) {
    // Do nejkratšího sloupce, takže pořadí čte zleva doprava.
    const i = heights.indexOf(Math.min(...heights));
    columns[i].append(item);
    heights[i] += Number(item.dataset.ratio) || 1;
  }
  grid.replaceChildren(...columns);
  grid.classList.add('is-laid-out');
}

let lightbox: PhotoSwipeLightbox | undefined;
let mqCleanup: (() => void) | undefined;

export function initGalerie() {
  const grids = document.querySelectorAll<HTMLElement>('[data-masonry]');
  grids.forEach((g) => layoutMasonry(g));

  mqCleanup?.();
  const mq = window.matchMedia('(min-width: 900px)');
  const onChange = () => grids.forEach((g) => layoutMasonry(g));
  mq.addEventListener('change', onChange);
  mqCleanup = () => mq.removeEventListener('change', onChange);

  lightbox?.destroy();
  const gallery = document.querySelector<HTMLElement>('[data-gallery]');
  if (!gallery) return;

  lightbox = new PhotoSwipeLightbox({
    pswpModule: () => import('photoswipe'),
    bgOpacity: 1,
    showHideAnimationType: 'fade',
    padding: { top: 24, bottom: 24, left: 16, right: 16 },
    arrowPrevTitle: 'Předchozí',
    arrowNextTitle: 'Další',
    closeTitle: 'Zavřít',
    zoomTitle: 'Přiblížit',
  });
  lightbox.init();
  gallery.addEventListener('click', onClick);
}

function onClick(e: MouseEvent) {
  const a = (e.target as HTMLElement).closest<HTMLAnchorElement>('a[data-pswp]');
  if (!a || !lightbox || e.metaKey || e.ctrlKey) return;
  e.preventDefault();
  const gallery = a.closest<HTMLElement>('[data-gallery]')!;
  // Pořadí v lightboxu podle data-index, ne podle DOM (sloupce mění pořadí).
  // Jen viditelné odkazy (plesy mají plátno i masonry, jedno je vždy skryté)
  const data = [...gallery.querySelectorAll<HTMLAnchorElement>('a[data-pswp]')]
    .filter((el) => el.offsetParent !== null)
    .sort((x, y) => Number(x.dataset.index) - Number(y.dataset.index))
    .map((el) => ({
      element: el,
      src: el.href,
      srcset: el.dataset.pswpSrcset,
      width: Number(el.dataset.pswpWidth),
      height: Number(el.dataset.pswpHeight),
      alt: el.querySelector('img')?.alt,
    }));
  lightbox.loadAndOpen(Number(a.dataset.index), data);
}
