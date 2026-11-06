import React, { useEffect, useRef } from 'react';

export interface Option {
  id: string;
  label: string;
  description?: string;
  meta?: string;
  icon?: React.ReactNode;
  disabled?: boolean;
}

interface StepProps {
  question: string;
  hint?: string;
  options: Option[];
  selected: string | string[] | undefined;
  onSelect: (id: string) => void;
  multiSelect?: boolean;
  maxSelect?: number;
}

const Check = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2.5">
    <path d="M5 12.5l4.5 4.5L19 7.5" strokeLinecap="square" />
  </svg>
);

const Step: React.FC<StepProps> = ({ question, hint, options, selected, onSelect, multiSelect = false, maxSelect }) => {
  const headingRef = useRef<HTMLHeadingElement>(null);
  const isSelected = (id: string) => (Array.isArray(selected) ? selected.includes(id) : selected === id);
  const atMax = multiSelect && Array.isArray(selected) && !!maxSelect && selected.length >= maxSelect;

  useEffect(() => {
    headingRef.current?.focus({ preventScroll: true });
  }, [question]);

  return (
    <fieldset className="kh-step kh-fade">
      <legend className="kh-visually-hidden">{question}</legend>
      <h2 className="kh-question" ref={headingRef} tabIndex={-1}>{question}</h2>
      {hint && <p className="kh-hint">{hint}</p>}
      <div className={`kh-options${options.length > 4 ? ' kh-options--many' : ''}`}>
        {options.map(o => {
          const sel = isSelected(o.id);
          const disabled = o.disabled || (atMax && !sel);
          return (
            <button
              key={o.id}
              type="button"
              className={`kh-option${sel ? ' is-selected' : ''}`}
              aria-pressed={sel}
              disabled={disabled}
              onClick={() => onSelect(o.id)}
            >
              {o.icon && <span className="kh-option__icon" aria-hidden="true">{o.icon}</span>}
              <span className="kh-option__text">
                <span className="kh-option__label">{o.label}</span>
                {o.description && <span className="kh-option__desc">{o.description}</span>}
                {o.meta && <span className="kh-option__meta">{o.meta}</span>}
              </span>
              <span className={`kh-option__mark${multiSelect ? ' is-box' : ''}`} aria-hidden="true">
                {sel && <Check />}
              </span>
            </button>
          );
        })}
      </div>
    </fieldset>
  );
};

export default Step;
