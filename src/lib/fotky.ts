import type { ImageMetadata } from 'astro';

// Všechny fotky ze src/fotky/<složka>/, seřazené podle názvu souboru.
const soubory = import.meta.glob<ImageMetadata>('/src/fotky/**/*.{jpg,jpeg,png,webp,avif}', {
  eager: true,
  import: 'default',
});

export interface Foto {
  image: ImageMetadata;
  name: string;
}

export function fotky(slozka: string): Foto[] {
  const prefix = `/src/fotky/${slozka}/`;
  return Object.entries(soubory)
    .filter(([path]) => path.startsWith(prefix) && !path.slice(prefix.length).includes('/'))
    .sort(([a], [b]) => a.localeCompare(b, 'cs', { numeric: true }))
    .map(([path, image]) => ({ image, name: path.slice(prefix.length) }));
}

export function prvniFoto(slozka: string): ImageMetadata | undefined {
  return fotky(slozka)[0]?.image;
}

/** Šířky pro srcset; nikdy větší než originál. */
export function sirky(image: ImageMetadata, sirky = [480, 960, 1600, 2400]): number[] {
  const list = sirky.filter((w) => w < image.width);
  return [...list, Math.min(image.width, sirky[sirky.length - 1])];
}

/** Fotka podle cesty relativně k src/fotky, např. "plesy/01.jpg". */
export function foto(cesta: string): ImageMetadata | undefined {
  return soubory[`/src/fotky/${cesta}`];
}
