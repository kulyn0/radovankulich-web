// Stáhne aktuální web z FTP do _old/ jako zálohu.
// Spuštění: node --env-file=.env scripts/download-old.mjs
import { mkdirSync } from 'node:fs';
import { Client } from 'basic-ftp';

const { FTP_SERVER, FTP_USERNAME, FTP_PASSWORD } = process.env;
if (!FTP_SERVER || !FTP_USERNAME || !FTP_PASSWORD) {
  console.error('Chybí FTP_SERVER, FTP_USERNAME nebo FTP_PASSWORD v .env');
  process.exit(1);
}

const client = new Client();
try {
  await client.access({ host: FTP_SERVER, user: FTP_USERNAME, password: FTP_PASSWORD });

  const root = await client.list('/');
  console.log('Obsah kořene FTP:', root.map((f) => f.name).join(', '));

  // Endora mívá kořen webu v /public_html (starší hostingy /www nebo /web).
  const webRoot = ['public_html', 'www', 'web'].find((name) => root.some((f) => f.isDirectory && f.name === name));
  if (!webRoot) {
    console.error('Nenašel jsem složku www ani web. Uprav skript podle výpisu výše.');
    process.exit(1);
  }

  console.log(`Kořen webu: /${webRoot}, stahuji do _old/ ...`);
  mkdirSync('_old', { recursive: true });
  // Podsložku novy/ (nový web) do zálohy nebereme.
  for (const item of await client.list(`/${webRoot}`)) {
    if (item.name === 'novy') continue;
    const remote = `/${webRoot}/${item.name}`;
    if (item.isDirectory) {
      await client.downloadToDir(`_old/${item.name}`, remote);
    } else {
      await client.downloadTo(`_old/${item.name}`, remote);
    }
    console.log('  ', item.name);
  }
  console.log('Hotovo.');
} catch (err) {
  console.error('Chyba FTP:', err.message);
  process.exitCode = 1;
} finally {
  client.close();
}
