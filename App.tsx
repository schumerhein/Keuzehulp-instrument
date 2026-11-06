import React, { useCallback, useEffect, useMemo, useState } from 'react';
import Step, { Option } from './components/Step';
import Results from './components/Results';
import { ICONS } from './constants';
import { Advice, Answers, Budget, Condition, Instrument, InstrumentType, Player, Priority, Space } from './types';
import { BUDGETS, buildAdvice, euro, fetchInventory, lowestPrice } from './services/inventory';

type StepId = 'player' | 'type' | 'space' | 'budget' | 'condition' | 'wishes';
const STEPS: StepId[] = ['player', 'type', 'space', 'budget', 'condition', 'wishes'];
const MAX_WISHES = 3;

/** Laat de iframe op schumer.nl meegroeien en, bij een nieuwe stap, terugscrollen naar de keuzehulp. */
const post = (msg: Record<string, unknown>) => {
  try {
    if (window.parent && window.parent !== window) window.parent.postMessage({ source: 'schumer-keuzehulp', ...msg }, '*');
  } catch { /* niet ingebed */ }
};

const LABELS = {
  player: { child: 'Een kind', starter: 'Beginner of herstarter', experienced: 'Ervaren', pro: 'Hoog niveau' },
  type: { acoustic: 'Piano', vleugel: 'Vleugel', unsure: 'Help mij kiezen' },
  space: { small: 'Appartement of buren dichtbij', medium: 'Gemiddelde woonkamer', large: 'Ruime kamer' },
  condition: { new: 'Nieuw', used: 'Tweedehands', any: 'Geen voorkeur' },
  wishes: {
    silent: 'Stil spelen', warm_sound: 'Warme klank', bright_sound: 'Heldere klank', top_brand: 'Topmerk',
    value: 'Waardebehoud', compact: 'Zo compact mogelijk', design: 'Opvallende uitvoering',
  },
} as const;

const App: React.FC = () => {
  const [stepIndex, setStepIndex] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [answers, setAnswers] = useState<Answers>({ priorities: [] });
  const [inventory, setInventory] = useState<Instrument[]>([]);
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading');
  // Wijzigt de bezoeker één antwoord vanaf de adviespagina, dan gaat hij daarna direct terug naar het advies.
  const [editing, setEditing] = useState(false);

  const load = useCallback(() => {
    setStatus('loading');
    fetchInventory()
      .then(items => { setInventory(items); setStatus('ready'); })
      .catch(err => { console.error(err); setStatus('error'); });
  }, []);

  useEffect(() => { load(); }, [load]);

  // Hoogte doorgeven aan de pagina waarin de keuzehulp staat.
  useEffect(() => {
    const el = document.getElementById('root');
    if (!el) return;
    const send = () => post({ type: 'height', height: Math.ceil(el.getBoundingClientRect().height) + 2 });
    send();
    const ro = new ResizeObserver(send);
    ro.observe(el);
    window.addEventListener('load', send);
    return () => { ro.disconnect(); window.removeEventListener('load', send); };
  }, []);

  const goTo = (i: number) => {
    setShowResults(false);
    setStepIndex(i);
    post({ type: 'scrollTop' });
  };
  const finish = () => {
    setEditing(false);
    setShowResults(true);
    post({ type: 'scrollTop' });
  };

  const choose = <K extends keyof Answers>(key: K, value: Answers[K]) => {
    setAnswers(prev => ({ ...prev, [key]: value }));
    // Korte pauze zodat de bezoeker de selectie ziet, daarna automatisch door.
    const from = stepIndex;
    window.setTimeout(() => (editing || from >= STEPS.length - 1 ? finish() : goTo(from + 1)), 180);
  };

  const toggleWish = (id: Priority) => {
    setAnswers(prev => {
      const has = prev.priorities.includes(id);
      if (has) return { ...prev, priorities: prev.priorities.filter(p => p !== id) };
      if (prev.priorities.length >= MAX_WISHES) return prev;
      return { ...prev, priorities: [...prev.priorities, id] };
    });
  };

  const edit = (i: number) => {
    setEditing(true);
    goTo(i);
  };

  const reset = () => {
    setEditing(false);
    setAnswers({ priorities: [] });
    goTo(0);
  };

  // Aantallen uit de actuele voorraad, zodat de bezoeker direct ziet wat er beschikbaar is.
  const ready = status === 'ready';
  const inType = inventory.filter(i =>
    answers.instrumentType === 'acoustic' ? i.type === 'acoustic'
      : answers.instrumentType === 'vleugel' ? i.type === 'vleugel' : true);
  const inBudget = answers.budget && answers.budget !== 'unknown' ? inType.filter(i => i.budget === answers.budget) : inType;
  const count = (n: number) => (ready ? (n ? `${n} op voorraad` : 'Nu niet op voorraad') : undefined);
  const fromText = (t: 'acoustic' | 'vleugel') => {
    if (!ready) return undefined;
    const n = inventory.filter(i => i.type === t).length;
    const low = lowestPrice(inventory, t);
    return n && low ? `${n} op voorraad, vanaf ${euro(low)}` : 'Nu niet op voorraad';
  };

  const advice: Advice | null = useMemo(
    () => (showResults && ready ? buildAdvice(answers, inventory) : null),
    [showResults, ready, answers, inventory],
  );

  const step = STEPS[stepIndex];
  const isGrand = answers.instrumentType === 'vleugel';
  const lowPiano = lowestPrice(inventory, 'acoustic');
  const lowGrand = lowestPrice(inventory, 'vleugel');

  let content: React.ReactNode = null;
  if (!showResults) {
    if (step === 'player') {
      const opts: Option[] = [
        { id: 'child', label: 'Voor een kind', description: 'Dat net begint of al les heeft.', icon: <ICONS.SkillBeginner /> },
        { id: 'starter', label: 'Voor mezelf: ik begin of pak het weer op', description: 'Na een tijd niet gespeeld te hebben, of helemaal nieuw.', icon: <ICONS.SkillIntermediate /> },
        { id: 'experienced', label: 'Voor mezelf: ik speel al jaren', description: 'Ik zoek een instrument dat met mij meegroeit.', icon: <ICONS.SkillAdvanced /> },
        { id: 'pro', label: 'Op hoog niveau', description: 'Conservatorium, lesgeven of optreden.', icon: <ICONS.SkillProfessional /> },
      ];
      content = <Step question="Voor wie is het instrument?" hint="Zes korte vragen, daarna ziet u direct welke instrumenten uit onze actuele voorraad het best bij u passen. Spelen er meerdere mensen? Kies dan wie het meest speelt." options={opts} selected={answers.player} onSelect={id => choose('player', id as Player)} />;
    } else if (step === 'type') {
      const opts: Option[] = [
        { id: 'acoustic', label: 'Een piano', description: 'Staande piano. Neemt weinig ruimte in en past in vrijwel elk interieur.', meta: fromText('acoustic'), icon: <ICONS.AcousticPiano /> },
        { id: 'vleugel', label: 'Een vleugel', description: 'Voller klank en een snellere aanslag. Vraagt meer ruimte en budget.', meta: fromText('vleugel'), icon: <ICONS.GrandPiano /> },
        { id: 'unsure', label: 'Help mij kiezen', description: 'Wij adviseren op basis van uw ruimte en budget.', icon: <ICONS.Question /> },
      ];
      content = <Step question="Piano of vleugel?" options={opts} selected={answers.instrumentType} onSelect={id => choose('instrumentType', id as InstrumentType)} />;
    } else if (step === 'space') {
      const opts: Option[] = [
        { id: 'small', label: 'In een appartement of met buren dichtbij', description: 'Formaat en geluid tellen hier extra mee.', icon: <ICONS.SpaceSmall /> },
        { id: 'medium', label: 'In een gemiddelde woonkamer', icon: <ICONS.SpaceMedium /> },
        { id: 'large', label: 'In een ruime woonkamer of muziekkamer', icon: <ICONS.SpaceLarge /> },
      ];
      content = <Step question="Waar komt het instrument te staan?" hint={isGrand ? 'Een vleugel is 140 tot 290 cm lang en circa 150 cm breed. Reken ook op ruimte voor de kruk.' : 'Een staande piano is circa 150 cm breed en 60 cm diep. Een vleugel vraagt al snel 1,5 bij 2 meter.'} options={opts} selected={answers.space} onSelect={id => choose('space', id as Space)} />;
    } else if (step === 'budget') {
      const icons = [<ICONS.Money1 />, <ICONS.Money2 />, <ICONS.Money3 />, <ICONS.Money4 />];
      const opts: Option[] = [
        ...BUDGETS.map((b, n) => ({ id: b.id, label: b.label, icon: icons[n], meta: count(inType.filter(i => i.budget === b.id).length) })),
        { id: 'unknown', label: 'Weet ik nog niet', description: 'Wij tonen de beste prijs-kwaliteitverhouding voor uw situatie.', icon: <ICONS.Question /> },
      ];
      const hint = ready && lowPiano
        ? `Een goede piano is bij ons op voorraad vanaf ${euro(lowPiano)}${lowGrand ? `, een vleugel vanaf ${euro(lowGrand)}` : ''}.`
        : 'Een indicatie is genoeg.';
      content = <Step question="Wat wilt u ongeveer uitgeven?" hint={hint} options={opts} selected={answers.budget} onSelect={id => choose('budget', id as Budget)} />;
    } else if (step === 'condition') {
      const opts: Option[] = [
        { id: 'used', label: 'Tweedehands', description: 'Gecontroleerd en speelklaar gemaakt in onze eigen werkplaats. Vaak meer kwaliteit voor uw budget.', icon: <ICONS.ConditionUsed />, meta: count(inBudget.filter(i => i.condition === 'used').length) },
        { id: 'new', label: 'Nieuw', icon: <ICONS.ConditionNew />, meta: count(inBudget.filter(i => i.condition === 'new').length) },
        { id: 'any', label: 'Maakt niet uit', description: 'Wij kijken naar de beste match.', icon: <ICONS.Sparkle />, meta: count(inBudget.length) },
      ];
      content = <Step question="Nieuw of tweedehands?" options={opts} selected={answers.condition} onSelect={id => choose('condition', id as Condition)} />;
    } else if (step === 'wishes') {
      const silent: Option = { id: 'silent', label: 'Ook stil kunnen spelen', description: 'Met een silent-systeem speelt u op een koptelefoon.', icon: <ICONS.Silent /> };
      const rest: Option[] = [
        { id: 'warm_sound', label: 'Een warme, ronde klank', icon: <ICONS.Warm /> },
        { id: 'bright_sound', label: 'Een heldere, directe klank', icon: <ICONS.Bright /> },
        { id: 'top_brand', label: 'Een topmerk', icon: <ICONS.TopBrand /> },
        { id: 'value', label: 'Goed waardebehoud', icon: <ICONS.Value /> },
        { id: 'compact', label: 'Zo compact mogelijk', icon: <ICONS.Compact /> },
        { id: 'design', label: 'Een opvallende uitvoering', description: 'Bijvoorbeeld wit of notenhout.', icon: <ICONS.Design /> },
      ];
      const opts = answers.space === 'small' ? [silent, ...rest] : [...rest.slice(0, 2), silent, ...rest.slice(2)];
      content = (
        <>
          <Step question="Wat vindt u nog meer belangrijk?" hint={`Kies maximaal ${MAX_WISHES}. Geen voorkeur? Ga dan direct door.`} options={opts} selected={answers.priorities} onSelect={id => toggleWish(id as Priority)} multiSelect maxSelect={MAX_WISHES} />
          <div className="kh-row kh-row--end">
            <button type="button" className="kh-btn" onClick={finish}>
              {editing ? 'Advies bijwerken' : answers.priorities.length ? 'Toon mijn advies' : 'Geen voorkeur, toon mijn advies'}
            </button>
          </div>
        </>
      );
    }
  }

  const budgetLabel = answers.budget === 'unknown' ? 'Nog onbekend' : BUDGETS.find(b => b.id === answers.budget)?.label;
  const summary = showResults ? ([
    answers.player && { label: 'Speler', value: LABELS.player[answers.player], step: 0 },
    answers.instrumentType && { label: 'Instrument', value: LABELS.type[answers.instrumentType], step: 1 },
    answers.space && { label: 'Ruimte', value: LABELS.space[answers.space], step: 2 },
    budgetLabel && { label: 'Budget', value: budgetLabel, step: 3 },
    answers.condition && { label: 'Staat', value: LABELS.condition[answers.condition], step: 4 },
    { label: 'Wensen', value: answers.priorities.length ? answers.priorities.map(p => LABELS.wishes[p]).join(', ') : 'Geen voorkeur', step: 5 },
  ].filter(Boolean) as { label: string; value: string; step: number }[]) : [];

  const progress = showResults ? 100 : Math.round((stepIndex / STEPS.length) * 100);

  return (
    <div className="kh">
      <header className="kh-head">
        <div className="kh-head__row">
          <span className="kh-label kh-label--flush">Keuzehulp</span>
          {!showResults && <span className="kh-count" aria-live="polite">Vraag {stepIndex + 1} van {STEPS.length}</span>}
        </div>
        <div className="kh-progress" role="progressbar" aria-label="Voortgang" aria-valuemin={0} aria-valuemax={100} aria-valuenow={progress}>
          <span style={{ width: `${Math.max(progress, 4)}%` }} />
        </div>
      </header>

      <main className="kh-main">
        {showResults
          ? <Results advice={advice} status={status} summary={summary} onEdit={edit} onReset={reset} onRetry={load} />
          : content}

        {!showResults && (editing || stepIndex > 0) && (
          <div className="kh-nav">
            {editing
              ? <button type="button" className="kh-textbtn kh-textbtn--back" onClick={finish}>Terug naar mijn advies</button>
              : <button type="button" className="kh-textbtn kh-textbtn--back" onClick={() => goTo(stepIndex - 1)}>Vorige vraag</button>}
          </div>
        )}
      </main>

      <footer className="kh-foot">
        <ul>
          <li>Familiebedrijf sinds 1921</li>
          <li>Eigen werkplaats en technici</li>
          <li>Persoonlijk advies in Hengelo</li>
        </ul>
      </footer>
    </div>
  );
};

export default App;
