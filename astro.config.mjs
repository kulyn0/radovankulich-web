// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// Dokud web běží v podsložce /novy/ na Endoře, musí sedět base.
// Až půjde nový web na kořen, změň base na '/' (a BASE v scripts/postbuild.mjs).
export default defineConfig({
  site: 'https://radovankulich.cz',
  base: '/novy/',
  trailingSlash: 'always',
  integrations: [sitemap({ filter: (page) => !page.includes('/stary-web/') })],
  image: {
    service: { entrypoint: 'astro/assets/services/sharp' },
  },
});
