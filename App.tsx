import React, { useCallback, useEffect, useMemo, useState } from 'react';
import Step, { Option } from './components/Step';
import Results from './components/Results';
import { ICONS } from './constants';
import { Advice, Answers, Budget, Condition, Instrument, InstrumentType, Priority, SkillLevel, Space } from './types';
import { BUDGETS, buildAdvice, euro, fetchInventory } from './services/inventory';

type StepId = 'type' | 'space' | 'budget' | 'condition' | 'skill' | 'wishes';
const STEPS: StepId[] = ['type', 'space', 'budget', 'condition', 'skill', 'wishes'];
const MAX_WISHES = 3;

/** Laat de iframe op schumer.nl meegroeien en, bij een nieuwe stap, terugscrollen naar de keuzehulp. */
const post = (msg: Record<string, unknown>) => {
  try {
    if (window.parent && window.parent !== window) window.parent.postMessage({ source: 'schumer-keuzehulp', ...msg }, '*');
  } catch { /* niet ingebed */ }
};

const LABELS = {
  type: { acoustic: 'Piano', vleugel: 'Vleugel', digital: 'Digitale piano', unsure: 'Twijfel nog' },
  space: { small: 'Kleine ruimte', medium: 'Gemiddelde woonkamer', large: 'Ruime kamer', unsure: 'Nog onbekend' },
  condition: { new: 'Nieuw', used: 'Tweedehands', any: 'Geen voorkeur' },
  skill: { beginner: 'Beginner', intermediate: 'Gevorderd', advanced: 'Ver gevorderd', professional: 'Professioneel' },
  wishes: {
    warm_sound: 'Warme klank', bright_sound: 'Heldere klank', design: 'Uitstraling', compact: 'Compact formaat',
    value: 'Waardebehoud', silent: 'Stil spelen', top_brand: 'Topmerk',
  },
} as const;

const App: React.FC = () => {
  const [stepIndex, setStepIndex] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [answers, setAnswers] = useState<Answers>({ priorities: [] });
  const [inventory, setInventory] = useState<Instrument[]>([]);
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading');

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
    setShowResults(true);
    post({ type: 'scrollTop' });
  };
  const next = (from: number, a: Answers) => {
    if (a.instrumentType === 'digital') return finish();
    if (from >= STEPS.length - 1) return finish();
    goTo(from + 1);
  };

  const choose = <K extends keyof Answers>(key: K, value: Answers[K]) => {
    const updated = { ...answers, [key]: value };
    setAnswers(updated);
    // Korte pauze zodat de bezoeker de selectie ziet, daarna automatisch door.
    window.setTimeout(() => next(stepIndex, updated), 180);
  };

  const toggleWish = (id: Priority) => {
    setAnswers(prev => {
      const has = prev.priorities.includes(id);
      if (has) return { ...prev, priorities: prev.priorities.filter(p => p !== id) };
      if (prev.priorities.length >= MAX_WISHES) return prev;
      return { ...prev, priorities: [...prev.priorities, id] };
    });
  };

  const reset = () => {
    setAnswers({ priorities: [] });
    goTo(0);
  };

  // Aantallen uit de actuele voorraad, zodat de bezoeker direct ziet wat er beschikbaar is.
  const typeFilter = (i: Instrument) =>
    answers.instrumentType === 'acoustic' ? i.type === 'acoustic'
      : answers.instrumentType === 'vleugel' ? i.type === 'vleugel' : true;
  const count = (n: number) => (status === 'ready' ? (n ? `${n} op voorraad` : 'Nu niet op voorraad') : undefined);
  const from = (items: Instrument[]) =>
    status !== 'ready' ? undefined
      : items.length ? `${items.length} op voorraad, vanaf ${euro(Math.min(...items.map(i => i.price)))}` : 'Nu niet op voorraad';

  const pianos = inventory.filter(i => i.type === 'acoustic');
  const grands = inventory.filter(i => i.type === 'vleugel');
  const inType = inventory.filter(typeFilter);
  const inBudget = inType.filter(i => i.budget === answers.budget);

  const advice: Advice | null = useMemo(
    () => (showResults && status === 'ready' ? buildAdvice(answers, inventory) : null),
    [showResults, status, answers, inventory],
  );

  const step = STEPS[stepIndex];
  const isGrand = answers.instrumentType === 'vleugel';

  let content: React.ReactNode = null;
  if (!showResults) {
    if (step === 'type') {
      const opts: Option[] = [
        { id: 'acoustic', label: 'Piano', description: 'Staande piano. Compact, veelzijdig en geschikt voor vrijwel elke woonkamer.', meta: from(pianos), icon: <ICONS.AcousticPiano /> },
        { id: 'vleugel', label: 'Vleugel', description: 'Voller klank en een snellere aanslag. Vraagt meer ruimte.', meta: from(grands), icon: <ICONS.GrandPiano /> },
        { id: 'digital', label: 'Digitale piano', description: 'Volume regelbaar en geen stemmen nodig. Te vergelijken in onze showroom.', icon: <ICONS.Digital /> },
        { id: 'unsure', label: 'Ik twijfel nog', description: 'Wij adviseren u op basis van uw ruimte en budget.', icon: <ICONS.Question /> },
      ];
      content = <Step question="Welk instrument zoekt u?" hint="Beantwoord zes korte vragen. U ziet direct welke instrumenten uit onze actuele voorraad het best bij u passen." options={opts} selected={answers.instrumentType} onSelect={id => choose('instrumentType', id as InstrumentType)} />;
    } else if (step === 'space') {
      const opts: Option[] = [
        { id: 'small', label: 'Kleine ruimte', description: 'Bijvoorbeeld een appartement of studeerkamer.', icon: <ICONS.SpaceSmall /> },
        { id: 'medium', label: 'Gemiddelde woonkamer', icon: <ICONS.SpaceMedium /> },
        { id: 'large', label: 'Ruime woonkamer of muziekkamer', icon: <ICONS.SpaceLarge /> },
        { id: 'unsure', label: 'Weet ik nog niet', icon: <ICONS.Question /> },
      ];
      content = <Step question="Waar komt het instrument te staan?" hint={isGrand ? 'Een vleugel is 140 tot 290 cm lang en circa 150 cm breed. Reken ook op ruimte voor de kruk.' : 'Een staande piano is circa 150 cm breed en 60 cm diep. De hoogte varieert van ongeveer 110 tot 135 cm.'} options={opts} selected={answers.space} onSelect={id => choose('space', id as Space)} />;
    } else if (step === 'budget') {
      const icons = [<ICONS.Money1 />, <ICONS.Money2 />, <ICONS.Money3 />, <ICONS.Money4 />];
      const opts: Option[] = BUDGETS.map((b, n) => ({
        id: b.id, label: b.label, icon: icons[n], meta: count(inType.filter(i => i.budget === b.id).length),
      }));
      content = <Step question="Wat is uw budget?" hint="Een indicatie is genoeg. Wij tonen ook instrumenten die net iets goedkoper zijn." options={opts} selected={answers.budget} onSelect={id => choose('budget', id as Budget)} />;
    } else if (step === 'condition') {
      const opts: Option[] = [
        { id: 'new', label: 'Nieuw', icon: <ICONS.ConditionNew />, meta: count(inBudget.filter(i => i.condition === 'new').length) },
        { id: 'used', label: 'Tweedehands', description: 'Gecontroleerd en speelklaar gemaakt in onze eigen werkplaats.', icon: <ICONS.ConditionUsed />, meta: count(inBudget.filter(i => i.condition === 'used').length) },
        { id: 'any', label: 'Maakt niet uit', icon: <ICONS.Sparkle />, meta: count(inBudget.length) },
      ];
      content = <Step question="Nieuw of tweedehands?" options={opts} selected={answers.condition} onSelect={id => choose('condition', id as Condition)} />;
    } else if (step === 'skill') {
      const opts: Option[] = [
        { id: 'beginner', label: 'Beginner', description: 'Ik begin net of speel nog niet lang.', icon: <ICONS.SkillBeginner /> },
        { id: 'intermediate', label: 'Gevorderd', description: 'Ik speel al een aantal jaren.', icon: <ICONS.SkillIntermediate /> },
        { id: 'advanced', label: 'Ver gevorderd', description: 'Hoog niveau of conservatorium.', icon: <ICONS.SkillAdvanced /> },
        { id: 'professional', label: 'Professioneel', description: 'Ik speel beroepsmatig of geef les.', icon: <ICONS.SkillProfessional /> },
      ];
      content = <Step question="Wat is het speelniveau?" hint="Speelt u met meerdere personen? Kies dan het hoogste niveau." options={opts} selected={answers.skillLevel} onSelect={id => choose('skillLevel', id as SkillLevel)} />;
    } else if (step === 'wishes') {
      const opts: Option[] = [
        { id: 'warm_sound', label: 'Warme klank', description: 'Rond en vol, vooral in de bas.', icon: <ICONS.Warm /> },
        { id: 'bright_sound', label: 'Heldere klank', description: 'Direct en helder, goed hoorbaar.', icon: <ICONS.Bright /> },
        { id: 'silent', label: 'Stil kunnen spelen', description: 'Met een silent-systeem speelt u op een koptelefoon.', icon: <ICONS.Silent /> },
        { id: 'compact', label: 'Compact formaat', icon: <ICONS.Compact /> },
        { id: 'top_brand', label: 'Topmerk', icon: <ICONS.TopBrand /> },
        { id: 'value', label: 'Waardebehoud', icon: <ICONS.Value /> },
        { id: 'design', label: 'Uitstraling', description: 'Bijvoorbeeld wit of notenhout.', icon: <ICONS.Design /> },
      ];
      content = (
        <>
          <Step question="Wat vindt u belangrijk?" hint={`Kies maximaal ${MAX_WISHES}, of ga direct door als u geen voorkeur heeft.`} options={opts} selected={answers.priorities} onSelect={id => toggleWish(id as Priority)} multiSelect maxSelect={MAX_WISHES} />
          <div className="kh-row kh-row--end">
            <button type="button" className="kh-btn" onClick={finish}>
              {answers.priorities.length ? 'Toon mijn advies' : 'Geen voorkeur, toon mijn advies'}
            </button>
          </div>
        </>
      );
    }
  }

  const summary = showResults ? ([
    answers.instrumentType && { label: 'Instrument', value: LABELS.type[answers.instrumentType], step: 0 },
    answers.space && { label: 'Ruimte', value: LABELS.space[answers.space], step: 1 },
    answers.budget && { label: 'Budget', value: BUDGETS.find(b => b.id === answers.budget)!.label, step: 2 },
    answers.condition && { label: 'Staat', value: LABELS.condition[answers.condition], step: 3 },
    answers.skillLevel && { label: 'Niveau', value: LABELS.skill[answers.skillLevel], step: 4 },
    answers.instrumentType && answers.instrumentType !== 'digital' && {
      label: 'Wensen', value: answers.priorities.length ? answers.priorities.map(p => LABELS.wishes[p]).join(', ') : 'Geen voorkeur', step: 5,
    },
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
          ? <Results advice={advice} status={status} summary={summary} onEdit={goTo} onReset={reset} onRetry={load} />
          : content}

        {!showResults && stepIndex > 0 && (
          <div className="kh-nav">
            <button type="button" className="kh-textbtn kh-textbtn--back" onClick={() => goTo(stepIndex - 1)}>Vorige vraag</button>
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
