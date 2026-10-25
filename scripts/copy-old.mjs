// Zkopíruje zálohu starého webu (_old/) do dist/_old/, aby fungoval odkaz ze stránky /stary-web.
import { cpSync, existsSync } from 'node:fs';

if (existsSync('_old')) {
  cpSync('_old', 'dist/_old', { recursive: true, filter: (src) => !src.includes('__MACOSX') });
  console.log('Záloha _old/ zkopírována do dist/_old/');
} else {
  console.warn('Složka _old/ neexistuje, kopírování přeskočeno.');
}
