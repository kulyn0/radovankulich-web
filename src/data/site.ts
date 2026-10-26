export const kontakt = {
  jmeno: 'Radovan Kulich',
  email: 'info@radovankulich.cz',
  telefon: '+420 735 060 415',
  telefonHref: 'tel:+420735060415',
  instagram: '@kulynraw',
  instagramUrl: 'https://www.instagram.com/kulynraw/',
  ico: '22065296',
  sidlo: 'Prostějov',
  zonerama: 'https://eu.zonerama.com/kulynraw/1188103',
};

export interface Kategorie {
  slug: string;
  nazev: string;
  slovo: string;
  popis: string;
  /** Stará URL, ze které vede 301 přesměrování. */
  stareUrl: string;
}

// Pořadí odpovídá výpisu na úvodu i navigaci předchozí/další.
export const kategorie: Kategorie[] = [
  {
    slug: 'svatby',
    nazev: 'Svatby',
    slovo: 'Příběhy',
    popis: 'Emoce, momenty a příběhy lásky.',
    stareUrl: 'svatby.html',
  },
  {
    slug: 'plesy',
    nazev: 'Plesy & akce',
    slovo: 'Atmosféra',
    popis: 'Plesy, věnečky, oslavy. Snažím se vystihnout atmosféru a klíčové momenty.',
    stareUrl: 'spolecenske.html',
  },
  {
    slug: 'sport',
    nazev: 'Sport',
    slovo: 'Dynamika',
    popis: 'Dynamika, energie a výkon.',
    stareUrl: 'sport.html',
  },
  {
    slug: 'festivaly',
    nazev: 'Festivaly',
    slovo: 'Energie',
    popis: 'Hudba, emoce a atmosféra. Zachycuji jejich pravou energii.',
    stareUrl: 'festivaly.html',
  },
  {
    slug: 'komercni',
    nazev: 'Komerční',
    slovo: 'Produkty',
    popis: 'Produkty, reklamy, business portréty.',
    stareUrl: 'komercni.html',
  },
  {
    slug: 'skolni',
    nazev: 'Školní',
    slovo: 'Portréty',
    popis: 'Třídy, tabla, maturitní portréty a další.',
    stareUrl: 'skolni.html',
  },
  {
    slug: 'cestovani',
    nazev: 'Cestování',
    slovo: 'Svět',
    popis: 'Objevování světa mým objektivem.',
    stareUrl: 'cestovani.html',
  },
];

/** Odkaz s ohledem na base (web teď běží v /novy/). */
export function url(path = ''): string {
  const base = import.meta.env.BASE_URL.replace(/\/$/, '');
  return `${base}/${path.replace(/^\//, '')}`;
}

export interface PolozkaCeniku {
  polozka: string;
  cena: string;
}

// TODO: doplnit ceník plesů (položka + cena) – ceny nevymýšlet, dodá Radovan.
export const cenikPlesy: PolozkaCeniku[] = [];
