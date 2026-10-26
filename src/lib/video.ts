import { existsSync } from 'node:fs';
import { join } from 'node:path';
import type { ImageMetadata } from 'astro';
import data from '../content/video.json';
import { foto } from './fotky';

export interface Video {
  title: string;
  year: number;
  type: string;
  /** Cesta v public/, např. "video/showreel.mp4" */
  src: string;
  poster: ImageMetadata | undefined;
  /** Soubor v public/ opravdu existuje (jinak se zobrazí jen poster). */
  ready: boolean;
}

export const videa: Video[] = data.map((v) => ({
  ...v,
  poster: foto(v.poster),
  ready: existsSync(join(process.cwd(), 'public', v.src)),
}));
