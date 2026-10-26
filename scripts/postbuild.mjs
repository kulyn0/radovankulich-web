// Po buildu: zkopíruje zálohu starého webu a vygeneruje .htaccess a robots.txt.
import { cpSync, existsSync, readdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

// Musí odpovídat base v astro.config.mjs.
const BASE = '/novy/';
const SITE = 'https://radovankulich.cz';

// Astro přibalí i originály importovaných fotek; nikde se nepoužívají, takže je smažeme.
function htmlFiles(dir) {
  return readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
    const p = join(dir, e.name);
    if (e.isDirectory()) return p === 'dist/_old' ? [] : htmlFiles(p);
    return /\.(html|css|xml)$/.test(e.name) ? [p] : [];
  });
}
const referenced = htmlFiles('dist').map((f) => readFileSync(f, 'utf8')).join('\n');
let removed = 0;
for (const f of readdirSync('dist/_astro')) {
  if (/^[^_]+\.[\w-]{8}\.(jpe?g|png|webp|avif)$/i.test(f) && !referenced.includes(f)) {
    rmSync(join('dist/_astro', f));
    removed++;
  }
}
console.log(`Smazáno ${removed} nepoužitých originálů fotek`);

// Záloha starého webu, aby fungoval odkaz ze stránky /stary-web
if (existsSync('_old')) {
  cpSync('_old', 'dist/_old', { recursive: true, filter: (src) => !src.includes('__MACOSX') });
  console.log('Záloha _old/ zkopírována do dist/_old/');
} else {
  console.warn('Složka _old/ neexistuje, kopírování přeskočeno.');
}

// 301 ze starých .html adres (Endora = Apache)
const redirects = {
  'svatby.html': 'svatby/',
  'spolecenske.html': 'plesy/',
  'sport.html': 'sport/',
  'festivaly.html': 'festivaly/',
  'komercni.html': 'komercni/',
  'skolni.html': 'skolni/',
  'cestovani.html': 'cestovani/',
};

const rules = Object.entries(redirects)
  .map(([from, to]) => `RewriteRule ^${from.replace('.', '\\.')}$ ${BASE}${to} [R=301,L]`)
  .join('\n');

writeFileSync(
  'dist/.htaccess',
  `# Vygenerováno scripts/postbuild.mjs
Options -Indexes
ErrorDocument 404 ${BASE}404.html

<IfModule mod_rewrite.c>
RewriteEngine On
RewriteBase ${BASE}
# index.html jen při přímém požadavku, ne při interním DirectoryIndex (jinak smyčka)
RewriteCond %{THE_REQUEST} \\s/+(.*/)?index\\.html[\\s?]
RewriteRule ^index\\.html$ ${BASE} [R=301,L]
${rules}
</IfModule>

<IfModule mod_expires.c>
ExpiresActive On
ExpiresByType image/avif "access plus 1 year"
ExpiresByType image/webp "access plus 1 year"
ExpiresByType image/jpeg "access plus 1 year"
ExpiresByType font/woff2 "access plus 1 year"
ExpiresByType text/css "access plus 1 year"
ExpiresByType application/javascript "access plus 1 year"
ExpiresByType text/javascript "access plus 1 year"
ExpiresByType video/mp4 "access plus 1 month"
ExpiresByType text/html "access plus 0 seconds"
</IfModule>

<IfModule mod_deflate.c>
AddOutputFilterByType DEFLATE text/html text/css application/javascript text/javascript image/svg+xml application/xml
</IfModule>
`,
);

// TODO: až poběží na kořeni, povolit indexaci (teď je web v /novy/ skrytý).
writeFileSync(
  'dist/robots.txt',
  BASE === '/'
    ? `User-agent: *\nAllow: /\n\nSitemap: ${SITE}/sitemap-index.xml\n`
    : `User-agent: *\nDisallow: /\n`,
);
console.log('Vygenerován .htaccess a robots.txt');
