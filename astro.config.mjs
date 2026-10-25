// @ts-check
import { defineConfig } from 'astro/config';

// Dokud web běží v podsložce /novy/ na Endoře, musí sedět base.
// Až půjde nový web na kořen, změň base na '/'.
export default defineConfig({
  site: 'https://radovankulich.cz',
  base: '/novy/',
  image: {
    service: { entrypoint: 'astro/assets/services/sharp' },
  },
});
