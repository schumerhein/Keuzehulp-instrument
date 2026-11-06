export type InstrumentType = 'acoustic' | 'vleugel' | 'digital' | 'unsure';
export type SkillLevel = 'beginner' | 'intermediate' | 'advanced' | 'professional';
export type Space = 'small' | 'medium' | 'large' | 'unsure';
export type Budget = '1-3k' | '3-7.5k' | '7.5-15k' | '15k+';
export type Condition = 'new' | 'used' | 'any';
export type Priority = 'warm_sound' | 'bright_sound' | 'design' | 'compact' | 'value' | 'silent' | 'top_brand';

export interface Answers {
  instrumentType?: InstrumentType;
  space?: Space;
  budget?: Budget;
  condition?: Condition;
  skillLevel?: SkillLevel;
  priorities: Priority[];
}

export interface Instrument {
  id: number;
  name: string;
  brand: string;
  url: string;
  price: number;
  budget: Budget;
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

export interface Advice {
  kind: 'products' | 'digital' | 'empty';
  title: string;
  intro: string;
  best?: Pick;
  alternatives: Pick[];
  typeAdvice?: { title: string; text: string; link: string; linkLabel: string };
  browse: { url: string; label: string }[];
}
