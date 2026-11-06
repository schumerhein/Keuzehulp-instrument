import React, { useEffect, useRef } from 'react';
import { Advice, Pick } from '../types';
import { SITE, euro, specLine } from '../services/inventory';

interface ResultsProps {
  advice: Advice | null;
  status: 'loading' | 'ready' | 'error';
  summary: { label: string; value: string; step: number }[];
  onEdit: (step: number) => void;
  onReset: () => void;
  onRetry: () => void;
}

const Tick = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2.5">
    <path d="M5 12.5l4.5 4.5L19 7.5" strokeLinecap="square" />
  </svg>
);

const Card: React.FC<{ pick: Pick; featured?: boolean }> = ({ pick, featured }) => {
  const i = pick.instrument;
  return (
    <article className={`kh-card${featured ? ' kh-card--featured' : ''}`}>
      <a className="kh-card__media" href={i.url} target="_top" tabIndex={-1} aria-hidden="true">
        {i.image
          ? <img src={i.image} alt="" loading="lazy" decoding="async" />
          : <span className="kh-card__noimg">Schumer</span>}
      </a>
      <div className="kh-card__body">
        {pick.label && <span className="kh-label">{pick.label}</span>}
        <h3 className="kh-card__title"><a href={i.url} target="_top">{i.name}</a></h3>
        <p className="kh-card__price">
          {euro(i.price)}
          {pick.overBudget && <span className="kh-tag">Iets boven budget</span>}
        </p>
        <p className="kh-card__spec">{specLine(i)}</p>
        {pick.reasons.length > 0 && (
          <>
            {featured && <p className="kh-card__why">Waarom dit instrument</p>}
            <ul className="kh-reasons">
              {pick.reasons.slice(0, featured ? 4 : 2).map((r, n) => (
                <li key={n}><Tick />{r}</li>
              ))}
            </ul>
          </>
        )}
        <div className="kh-card__actions">
          <a className={`kh-btn${featured ? '' : ' kh-btn--line'}`} href={i.url} target="_top">Bekijk dit instrument</a>
          {featured && <a className="kh-link" href={`${SITE}/contact/?afspraak`} target="_top">Plan een proefspeelafspraak</a>}
        </div>
      </div>
    </article>
  );
};

const Showroom: React.FC = () => (
  <section className="kh-band" aria-labelledby="kh-showroom">
    <span className="kh-label kh-label--light">Showroom Hengelo</span>
    <h3 id="kh-showroom">Hoor en voel het verschil</h3>
    <p>Een instrument kiest u met uw oren en uw handen. Speel de instrumenten naast elkaar en laat u adviseren door onze specialisten. U bent ook zonder afspraak welkom.</p>
    <div className="kh-band__actions">
      <a className="kh-btn kh-btn--light" href={`${SITE}/contact/?afspraak`} target="_top">Maak een afspraak</a>
      <a className="kh-band__tel" href="tel:0742455490">Of bel 074 245 54 90</a>
    </div>
    <p className="kh-band__hours">Pasmaatweg 10, 7556 PH Hengelo. Dinsdag tot en met vrijdag 10.00 tot 18.00 uur, zaterdag 10.00 tot 17.00 uur.</p>
  </section>
);

const Results: React.FC<ResultsProps> = ({ advice, status, summary, onEdit, onReset, onRetry }) => {
  const headingRef = useRef<HTMLHeadingElement>(null);
  useEffect(() => {
    if (status !== 'loading') headingRef.current?.focus({ preventScroll: true });
  }, [status]);

  if (status === 'loading' || (status === 'ready' && !advice)) {
    return (
      <div className="kh-loading" role="status" aria-live="polite">
        <span className="kh-spinner" aria-hidden="true" />
        <p>Wij zoeken de best passende instrumenten uit onze voorraad...</p>
      </div>
    );
  }

  if (status === 'error' || !advice) {
    return (
      <div className="kh-results kh-fade">
        <span className="kh-label">Uw advies</span>
        <h2 className="kh-question" ref={headingRef} tabIndex={-1}>Het advies kon niet worden geladen</h2>
        <p className="kh-lead">Onze actuele voorraad is op dit moment niet bereikbaar. Probeer het opnieuw, of laat u persoonlijk adviseren.</p>
        <div className="kh-row">
          <button type="button" className="kh-btn" onClick={onRetry}>Opnieuw proberen</button>
        </div>
        <Showroom />
      </div>
    );
  }

  return (
    <div className="kh-results kh-fade">
      <span className="kh-label">Uw advies</span>
      <h2 className="kh-question" ref={headingRef} tabIndex={-1}>{advice.title}</h2>
      <p className="kh-lead">{advice.intro}</p>

      {summary.length > 0 && (
        <ul className="kh-summary" aria-label="Uw antwoorden">
          {summary.map(s => (
            <li key={s.label}>
              <button type="button" onClick={() => onEdit(s.step)} aria-label={`${s.label}: ${s.value}. Wijzigen`}>
                <span className="kh-summary__k">{s.label}</span>
                <span className="kh-summary__v">{s.value}</span>
                <span className="kh-summary__edit" aria-hidden="true">Wijzig</span>
              </button>
            </li>
          ))}
        </ul>
      )}

      {advice.notes.map(n => (
        <aside className="kh-note" key={n.title}>
          <p className="kh-note__title">{n.title}</p>
          <p>{n.text}</p>
          {n.link && <a className="kh-link" href={n.link} target="_top">{n.linkLabel}</a>}
        </aside>
      ))}

      {advice.best && <Card pick={advice.best} featured />}

      {advice.alternatives.length > 0 && (
        <>
          <h3 className="kh-subhead">Ook interessant voor u</h3>
          <div className="kh-alts">
            {advice.alternatives.map(p => <Card key={p.instrument.id} pick={p} />)}
          </div>
        </>
      )}

      <div className="kh-browse">
        {advice.browse.map(b => (
          <a key={b.url} className="kh-link" href={b.url} target="_top">{b.label}</a>
        ))}
      </div>

      <Showroom />

      <div className="kh-restart">
        <button type="button" className="kh-textbtn" onClick={onReset}>Opnieuw beginnen</button>
      </div>
    </div>
  );
};

export default Results;
