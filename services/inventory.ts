import { Advice, Answers, Budget, Instrument, Note, Pick } from '../types';

export const INVENTORY_URL = 'https://www.schumer.nl/wp-json/schumer/v1/keuzehulp-instrumenten';
export const SITE = 'https://www.schumer.nl';

type PriceBudget = Exclude<Budget, 'unknown'>;

export const BUDGETS: { id: PriceBudget; min: number; max: number; label: string }[] = [
  { id: '1-3k', min: 0, max: 3000, label: 'Tot € 3.000' },
  { id: '3-7.5k', min: 3000, max: 7500, label: '€ 3.000 tot € 7.500' },
  { id: '7.5-15k', min: 7500, max: 15000, label: '€ 7.500 tot € 15.000' },
  { id: '15k+', min: 15000, max: Infinity, label: 'Vanaf € 15.000' },
];

const BRANDS = [
  'Steinway & Sons', 'Bösendorfer', 'C. Bechstein', 'Blüthner', 'Grotrian-Steinweg', 'Schimmel', 'Sauter',
  'Seiler', 'Feurich', 'Petrof', 'Ibach', 'Yamaha', 'Kawai', 'Boston', 'Ritmüller', 'Eterna', 'Schumer',
  'Wilh. Steinberg', 'W. Hoffmann', 'George Steck', 'Römhildt', 'Rameau', 'Rippen', 'Urk & Sons',
];

const TOP_BRANDS = ['Steinway & Sons', 'Bösendorfer', 'C. Bechstein', 'Blüthner', 'Grotrian-Steinweg', 'Sauter', 'Schimmel', 'Seiler', 'Feurich'];
const WARM_BRANDS = ['Blüthner', 'Bösendorfer', 'Grotrian-Steinweg', 'C. Bechstein', 'Schimmel', 'Sauter', 'Seiler', 'Petrof'];
const BRIGHT_BRANDS = ['Yamaha', 'Kawai', 'Boston', 'Steinway & Sons'];
const VALUE_BRANDS = ['Steinway & Sons', 'Bösendorfer', 'C. Bechstein', 'Blüthner', 'Grotrian-Steinweg', 'Yamaha', 'Schimmel', 'Sauter', 'Seiler'];
const RELIABLE_BRANDS = ['Yamaha', 'Kawai', 'Petrof', 'Schimmel', 'Seiler', 'Grotrian-Steinweg', 'Ibach', 'Sauter', 'Feurich'];

export const euro = (n: number) =>
  new Intl.NumberFormat('nl-NL', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(n);

export const budgetOf = (price: number): PriceBudget =>
  (BUDGETS.find(b => price >= b.min && price < b.max) || BUDGETS[BUDGETS.length - 1]).id;

const brandOf = (name: string): string => {
  const n = name.toLowerCase();
  const hit = BRANDS.find(b => n.startsWith(b.toLowerCase()) || n.startsWith(b.toLowerCase().split(' ')[0] + ' '))
    || BRANDS.find(b => n.includes(b.toLowerCase()));
  return hit || name.split(' ')[0];
};

const colorOf = (kleur: unknown, finish: unknown): Instrument['color'] => {
  if (kleur === 'wit' || kleur === 'notenhout' || kleur === 'zwart') return kleur;
  const f = String(finish || '').toLowerCase();
  if (f.includes('wit')) return 'wit';
  if (f.includes('noten')) return 'notenhout';
  if (f.includes('zwart')) return 'zwart';
  return null;
};

/** Haalt de actuele voorraad op. Er is bewust geen vaste lijst als terugval:
 *  een verkocht of offline gehaald instrument mag nooit in het advies verschijnen. */
export const fetchInventory = async (): Promise<Instrument[]> => {
  const res = await fetch(INVENTORY_URL, { headers: { Accept: 'application/json' } });
  if (!res.ok) throw new Error(`Voorraad ophalen mislukt (${res.status})`);
  const data = await res.json();
  const list: any[] = Array.isArray(data?.instrumenten) ? data.instrumenten : [];
  return list
    .filter(i => i && i.naam && i.url && typeof i.prijs === 'number' && i.prijs > 0)
    .map(i => ({
      id: i.id,
      name: String(i.naam).replace(/(\d)cm\b/, '$1 cm'),
      brand: brandOf(String(i.naam)),
      url: i.url,
      price: i.prijs,
      budget: budgetOf(i.prijs),
      condition: i.conditie === 'new' ? 'new' : 'used',
      type: i.type === 'vleugel' ? 'vleugel' : 'acoustic',
      silent: !!i.silent,
      image: i.afbeelding || null,
      size: i.maat || null,
      heightCm: typeof i.hoogte_cm === 'number' ? i.hoogte_cm : null,
      lengthCm: typeof i.lengte_cm === 'number' ? i.lengte_cm : null,
      finish: i.uitvoering || null,
      color: colorOf(i.kleur, i.uitvoering),
    }));
};

export const typeLabel = (t: 'acoustic' | 'vleugel', plural = false) =>
  t === 'vleugel' ? (plural ? 'vleugels' : 'vleugel') : (plural ? "piano's" : 'piano');

export const lowestPrice = (items: Instrument[], t: 'acoustic' | 'vleugel') => {
  const p = items.filter(i => i.type === t).map(i => i.price);
  return p.length ? Math.min(...p) : null;
};

export const specLine = (i: Instrument) => {
  const parts: string[] = [i.condition === 'new' ? 'Nieuw' : 'Tweedehands'];
  if (i.type === 'vleugel' && i.lengthCm) parts.push(`${i.lengthCm} cm lang`);
  if (i.type === 'acoustic' && i.heightCm) parts.push(`${i.heightCm} cm hoog`);
  if (i.finish) parts.push(i.finish.charAt(0).toUpperCase() + i.finish.slice(1).toLowerCase());
  return parts.join(' · ');
};

const serious = (a: Answers) => a.player === 'experienced' || a.player === 'pro';
const learner = (a: Answers) => a.player === 'child' || a.player === 'starter';

/** Welk type adviseren we als de bezoeker hulp wil bij de keuze tussen piano en vleugel? */
const preferredType = (a: Answers): 'acoustic' | 'vleugel' => {
  if (a.space === 'small') return 'acoustic';
  if (a.budget === '1-3k' || a.budget === '3-7.5k') return 'acoustic';
  if (a.budget === 'unknown') return a.space === 'large' && serious(a) ? 'vleugel' : 'acoustic';
  if (a.space === 'large') return 'vleugel';
  if (a.space === 'medium' && a.budget === '15k+' && serious(a)) return 'vleugel';
  return 'acoustic';
};

interface Scored { instrument: Instrument; score: number; reasons: { w: number; text: string }[]; overBudget: boolean }

const score = (i: Instrument, a: Answers): Scored | null => {
  const reasons: { w: number; text: string }[] = [];
  let s = 0;
  let overBudget = false;
  const wants = (p: string) => a.priorities.includes(p as any);
  const b = BUDGETS.find(x => x.id === a.budget);

  // Budget: binnen bereik is het beste; iets goedkoper is prima; hooguit 15% erboven als alternatief.
  if (b) {
    if (i.price >= b.min && i.price < b.max) {
      s += 40;
      reasons.push({ w: 40, text: 'Past binnen uw budget' });
    } else if (i.price < b.min) {
      const gap = (b.min - i.price) / Math.max(b.min, 1);
      s += Math.max(5, 30 - gap * 60);
      reasons.push({ w: 20, text: 'Onder uw budget, zodat er ruimte overblijft' });
    } else if (i.price <= b.max * 1.15) {
      s += 6;
      overBudget = true;
    } else {
      return null;
    }
  } else {
    // Geen budget gekozen: let op prijs en kwaliteit in verhouding tot de speler.
    s += 25;
    if (learner(a)) { if (i.price > 15000) return null; if (i.price > 9000) s -= 15; }
    if (a.player === 'experienced' && i.price > 25000) s -= 10;
    if (VALUE_BRANDS.includes(i.brand) || RELIABLE_BRANDS.includes(i.brand)) s += 6;
  }

  // Nieuw of tweedehands
  if (a.condition && a.condition !== 'any') {
    if (i.condition === a.condition) {
      s += 15;
      reasons.push({ w: 15, text: i.condition === 'new' ? 'Nieuw instrument, zoals u wenst' : 'Tweedehands en speelklaar gemaakt in onze eigen werkplaats' });
    } else {
      s -= 12;
    }
  } else if (i.condition === 'used') {
    reasons.push({ w: 4, text: 'Gecontroleerd en speelklaar gemaakt in onze eigen werkplaats' });
  }

  // Ruimte
  if (i.type === 'vleugel' && i.lengthCm) {
    if (a.space === 'small') { s += i.lengthCm <= 170 ? 10 : -15; if (i.lengthCm <= 170 && !(wants('compact') && i.lengthCm <= 165)) reasons.push({ w: 10, text: `Compacte vleugel van ${i.lengthCm} cm, geschikt voor een kleinere kamer` }); }
    if (a.space === 'medium' && i.lengthCm <= 195) { s += 6; reasons.push({ w: 6, text: `Met ${i.lengthCm} cm lengte goed te plaatsen in een gemiddelde woonkamer` }); }
    if (a.space === 'large' && i.lengthCm >= 180) { s += 8; reasons.push({ w: 8, text: `Met ${i.lengthCm} cm lengte komt de klank tot zijn recht in een ruime kamer` }); }
  }
  if (i.type === 'acoustic' && i.heightCm && a.space === 'small' && i.heightCm <= 121) {
    s += 8;
    if (!(wants('compact') && i.heightCm <= 118)) reasons.push({ w: 8, text: `Met ${i.heightCm} cm hoogte past hij goed in een kleinere ruimte` });
  }

  // Wensen
  if (wants('silent')) {
    if (i.silent) { s += 30; reasons.push({ w: 30, text: 'Silent-systeem: speel ook stil met een koptelefoon' }); } else s -= 6;
  }
  if (wants('compact')) {
    if (i.type === 'acoustic' && i.heightCm && i.heightCm <= 118) { s += 14; reasons.push({ w: 14, text: `Compact formaat: ${i.heightCm} cm hoog` }); }
    if (i.type === 'vleugel' && i.lengthCm && i.lengthCm <= 165) { s += 14; reasons.push({ w: 14, text: `Compacte vleugel: ${i.lengthCm} cm lang` }); }
  }
  if (wants('top_brand') && TOP_BRANDS.includes(i.brand)) { s += 20; reasons.push({ w: 20, text: `${i.brand} behoort tot de gerenommeerde merken` }); }
  if (wants('warm_sound') && WARM_BRANDS.includes(i.brand)) { s += 12; reasons.push({ w: 12, text: `${i.brand} staat bekend om een warme, ronde klank` }); }
  if (wants('bright_sound') && BRIGHT_BRANDS.includes(i.brand)) { s += 12; reasons.push({ w: 12, text: `${i.brand} staat bekend om een heldere, directe klank` }); }
  if (wants('value') && VALUE_BRANDS.includes(i.brand)) { s += 10; reasons.push({ w: 10, text: `${i.brand} houdt zijn waarde goed vast` }); }
  if (wants('design')) {
    if (i.color === 'wit' || i.color === 'notenhout') { s += 10; reasons.push({ w: 10, text: `Opvallende uitvoering in ${i.color === 'wit' ? 'wit' : 'notenhout'}` }); }
    else if (i.finish && /hoogglans/i.test(i.finish)) { s += 4; reasons.push({ w: 4, text: `Tijdloze uitstraling in ${i.finish.toLowerCase()}` }); }
  }

  // Wie gaat er spelen?
  if (learner(a)) {
    if (RELIABLE_BRANDS.includes(i.brand) && i.price <= 9000) {
      s += 8;
      reasons.push({ w: 9, text: a.player === 'child'
        ? `${i.brand} is een betrouwbaar merk met een gelijkmatige aanslag: fijn om op te leren`
        : `${i.brand} is een betrouwbaar merk om mee te beginnen of weer op te starten` });
    }
    if (i.price > 12000) s -= 6;
  }
  if (a.player === 'experienced') {
    if (TOP_BRANDS.includes(i.brand)) { s += 6; if (!wants('top_brand')) reasons.push({ w: 9, text: `${i.brand} is een gerenommeerd merk dat met uw spel meegroeit` }); }
    if (i.type === 'acoustic' && i.heightCm && i.heightCm >= 120) { s += 4; reasons.push({ w: 6, text: `Grotere kast (${i.heightCm} cm): voller klank en meer dynamiek` }); }
    if (i.type === 'vleugel' && i.lengthCm && i.lengthCm >= 170) s += 4;
  }
  if (a.player === 'pro') {
    if (TOP_BRANDS.includes(i.brand)) { s += 10; if (!wants('top_brand')) reasons.push({ w: 9, text: `${i.brand} is een gerenommeerd merk dat ook op hoog niveau voldoet` }); }
    if (i.type === 'acoustic' && i.heightCm && i.heightCm >= 120) { s += 6; reasons.push({ w: 7, text: `Grotere kast (${i.heightCm} cm): voller klank en meer dynamiek` }); }
    if (i.type === 'vleugel' && i.lengthCm && i.lengthCm >= 180) { s += 6; if (a.space !== 'large') reasons.push({ w: 7, text: `Met ${i.lengthCm} cm lengte veel klankvolume en een nauwkeurige aanslag` }); }
  }

  return { instrument: i, score: s, reasons, overBudget };
};

const toPick = (x: Scored, label?: string): Pick => {
  const reasons = [...x.reasons].sort((a, b) => b.w - a.w).map(r => r.text);
  return { instrument: x.instrument, reasons: reasons.slice(0, 4), overBudget: x.overBudget, label };
};

const mid = (a: Answers) => {
  const b = BUDGETS.find(x => x.id === a.budget);
  if (!b) return learner(a) ? 5000 : 9000;
  return b.max === Infinity ? b.min * 1.5 : (b.min + b.max) / 2;
};

const rank = (items: Instrument[], a: Answers) =>
  items
    .map(i => score(i, a))
    .filter((x): x is Scored => !!x)
    .sort((p, q) => q.score - p.score || Math.abs(p.instrument.price - mid(a)) - Math.abs(q.instrument.price - mid(a)));

const PLAYER_TEXT: Record<string, string> = {
  child: 'Voor een kind dat piano leert',
  starter: 'Voor wie begint of het spelen weer oppakt',
  experienced: 'Voor een ervaren pianist',
  pro: 'Voor spel op hoog niveau',
};
const SPACE_TEXT: Record<string, string> = {
  small: 'in een appartement of met buren dichtbij',
  medium: 'in een gemiddelde woonkamer',
  large: 'in een ruime kamer',
};

const KB = {
  vs: { link: `${SITE}/kennisbank/vleugel-vs-piano/`, linkLabel: 'Lees de verschillen tussen piano en vleugel' },
  pianoPrice: { link: `${SITE}/kennisbank/wat-kost-een-piano/`, linkLabel: 'Lees wat een piano kost' },
  grandPrice: { link: `${SITE}/kennisbank/wat-kost-een-vleugel/`, linkLabel: 'Lees wat een vleugel kost' },
  apartment: { link: `${SITE}/kennisbank/piano-in-appartement/`, linkLabel: 'Lees meer over een piano in een appartement' },
};

export const buildAdvice = (a: Answers, items: Instrument[]): Advice => {
  const browseAll = [
    { url: `${SITE}/pianos/`, label: "Bekijk alle piano's" },
    { url: `${SITE}/vleugels/`, label: 'Bekijk alle vleugels' },
  ];
  const notes: Note[] = [];
  const helpChoose = a.instrumentType === 'unsure' || !a.instrumentType;
  let type: 'acoustic' | 'vleugel' = helpChoose ? preferredType(a) : (a.instrumentType as 'acoustic' | 'vleugel');
  let ranked = rank(items.filter(i => i.type === type), a);

  // Vleugel gezocht, maar niets binnen bereik: eerlijk zeggen en passende piano's tonen.
  if (!ranked.length && type === 'vleugel') {
    const from = lowestPrice(items, 'vleugel');
    const pianos = rank(items.filter(i => i.type === 'acoustic'), a);
    if (pianos.length) {
      notes.push({
        title: 'Binnen dit budget adviseren wij een piano',
        text: `Een goede vleugel is bij ons op voorraad vanaf ${from ? euro(from) : 'circa € 6.500'}. Binnen uw budget haalt u met een staande piano de meeste kwaliteit in huis.`,
        ...KB.grandPrice,
      });
      type = 'acoustic';
      ranked = pianos;
    }
  }

  const browse = type === 'vleugel' ? [browseAll[1], browseAll[0]] : browseAll;

  if (!ranked.length) {
    return {
      kind: 'empty',
      title: 'Wij adviseren u graag persoonlijk',
      intro: `Op dit moment hebben wij geen ${typeLabel(type)} op voorraad die goed past bij deze combinatie van wensen. Ons aanbod wisselt regelmatig. Neem contact op, dan zoeken wij met u mee of laten wij u weten wanneer er een passend instrument binnenkomt.`,
      alternatives: [],
      notes,
      browse,
    };
  }

  const best = toPick(ranked[0], 'Beste match');
  let alternatives: Pick[] = ranked.slice(1, 3).map(x => toPick(x, 'Alternatief'));

  if (helpChoose) {
    const other: 'acoustic' | 'vleugel' = type === 'vleugel' ? 'acoustic' : 'vleugel';
    const otherBest = rank(items.filter(i => i.type === other), a)[0];
    if (otherBest && !(other === 'vleugel' && a.space === 'small')) {
      alternatives = [alternatives[0], toPick(otherBest, `Ter vergelijking: een ${typeLabel(other)}`)].filter(Boolean) as Pick[];
    }
    notes.unshift(type === 'vleugel'
      ? {
          title: 'Ons advies: een vleugel',
          text: 'Met uw ruimte en budget komt een vleugel goed tot zijn recht. Een vleugel klinkt voller, de aanslag herhaalt sneller en hij is een blikvanger in de kamer. Reken op minimaal 1,5 bij 2 meter vloer, plus ruimte voor de kruk.',
          ...KB.vs,
        }
      : {
          title: 'Ons advies: een piano',
          text: a.space === 'small'
            ? 'Een staande piano neemt weinig vloerruimte in, circa 150 bij 60 cm, en past daarmee goed in een kleinere woning. Een vleugel vraagt al snel 1,5 bij 2 meter vloer, plus ruimte voor de kruk.'
            : 'Binnen uw situatie biedt een goede staande piano de meeste kwaliteit voor uw geld. Een vleugel klinkt voller, maar vraagt ook duidelijk meer ruimte en budget.',
          ...KB.vs,
        });
  }

  if (a.budget === 'unknown') {
    const p = lowestPrice(items, 'acoustic');
    const v = lowestPrice(items, 'vleugel');
    notes.push({
      title: 'Wat kost een goed instrument?',
      text: `Een goede piano is bij ons op voorraad vanaf ${p ? euro(p) : 'circa € 2.300'}${v ? `, een vleugel vanaf ${euro(v)}` : ''}. Hieronder ziet u de instrumenten met de beste verhouding tussen prijs en kwaliteit voor uw situatie.`,
      ...(type === 'vleugel' ? KB.grandPrice : KB.pianoPrice),
    });
  }

  if (a.space === 'small' && !a.priorities.includes('silent')) {
    notes.push({
      title: 'Tip voor appartementen',
      text: 'Met een silent-systeem speelt u op elk moment van de dag stil met een koptelefoon, en klinkt de piano gewoon akoestisch als dat uitkomt.',
      ...KB.apartment,
    });
  }

  const b = BUDGETS.find(x => x.id === a.budget);
  const ctx = [
    a.space ? SPACE_TEXT[a.space] : '',
    b ? `met een budget ${b.label.startsWith('Tot') || b.label.startsWith('Vanaf') ? b.label.toLowerCase() : `van ${b.label}`}` : '',
  ].filter(Boolean).join(' en ');
  const who = PLAYER_TEXT[a.player || ''] || 'Voor uw situatie';
  const intro = `${who}${ctx ? `, ${ctx},` : ''} passen deze ${typeLabel(type, true)} uit onze actuele voorraad het best. U kunt ze proefspelen in onze showroom in Hengelo.`;

  return { kind: 'products', title: 'Onze beste match voor u', intro, best, alternatives, notes, browse };
};
