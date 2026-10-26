// Video dlaždice: smyčka se spouští jen ve viewportu, klik ji „roztáhne“ do přehrávače (FLIP).

let loopObserver: IntersectionObserver | undefined;

export function initVideo() {
  loopObserver?.disconnect();
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  loopObserver = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      const v = entry.target as HTMLVideoElement;
      if (entry.isIntersecting && !reduce) {
        if (!v.src) v.src = v.dataset.src!;
        v.play().catch(() => {});
      } else {
        v.pause();
      }
    }
  });
  document.querySelectorAll<HTMLVideoElement>('[data-loop]').forEach((v) => loopObserver!.observe(v));

  document.querySelectorAll<HTMLElement>('[data-video-tile]').forEach((tile) => {
    const open = tile.querySelector<HTMLButtonElement>('[data-video-open]')!;
    const dialog = tile.querySelector<HTMLDialogElement>('[data-video-dialog]')!;
    const frame = tile.querySelector<HTMLElement>('[data-video-frame]')!;
    const player = tile.querySelector<HTMLVideoElement>('[data-player]');

    // Transformace, která cílový rámeček „posadí“ na místo dlaždice
    const flipFrom = () => {
      const a = open.getBoundingClientRect();
      const b = frame.getBoundingClientRect();
      return `translate(${a.left - b.left}px, ${a.top - b.top}px) scale(${a.width / b.width}, ${a.height / b.height})`;
    };

    const animate = (from: string, to: string) =>
      reduce
        ? Promise.resolve()
        : frame.animate([{ transform: from }, { transform: to }], {
            duration: 450,
            easing: 'cubic-bezier(0.22, 1, 0.36, 1)',
          }).finished;

    open.addEventListener('click', async () => {
      dialog.showModal();
      requestAnimationFrame(() => dialog.classList.add('is-open'));
      await animate(flipFrom(), 'none');
      player?.play().catch(() => {});
    });

    const close = async () => {
      player?.pause();
      dialog.classList.remove('is-open');
      await animate('none', flipFrom());
      dialog.close();
    };

    tile.querySelector('[data-video-close]')!.addEventListener('click', close);
    dialog.addEventListener('cancel', (e) => {
      e.preventDefault();
      close();
    });
    dialog.addEventListener('click', (e) => {
      if (e.target === dialog) close();
    });
  });
}
