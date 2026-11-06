export type Player = 'child' | 'starter' | 'experienced' | 'pro';
export type InstrumentType = 'acoustic' | 'vleugel' | 'unsure';
export type Space = 'small' | 'medium' | 'large';
export type Budget = '1-3k' | '3-7.5k' | '7.5-15k' | '15k+' | 'unknown';
export type Condition = 'new' | 'used' | 'any';
export type Priority = 'warm_sound' | 'bright_sound' | 'design' | 'compact' | 'value' | 'silent' | 'top_brand';

export interface Answers {
  player?: Player;
  instrumentType?: InstrumentType;
  space?: Space;
  budget?: Budget;
  condition?: Condition;
  priorities: Priority[];
}

export interface Instrument {
  id: number;
  name: string;
  brand: string;
  url: string;
  price: number;
  budget: Exclude<Budget, 'unknown'>;
  condition: 'new' | 'used';
  type: 'acoustic' | 'vleugel';
  silent: boolean;
  image: string | null;
  size: string | null;
  heightCm: number | null;
  lengthCm: number | null;
  finish: string | null;
  color: 'zwart' | 'wit' | 'notenhout' | null;
}

export interface Pick {
  instrument: Instrument;
  reasons: string[];
  overBudget: boolean;
  label?: string;
}

export interface Note {
  title: string;
  text: string;
  link?: string;
  linkLabel?: string;
}

export interface Advice {
  kind: 'products' | 'empty';
  title: string;
  intro: string;
  best?: Pick;
  alternatives: Pick[];
  notes: Note[];
  browse: { url: string; label: string }[];
}
