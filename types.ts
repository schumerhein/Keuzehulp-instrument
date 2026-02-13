
export type InstrumentType = 'acoustic' | 'vleugel' | 'digital' | 'unsure';
export type SkillLevel = 'beginner' | 'intermediate' | 'advanced' | 'professional';
export type Space = 'small' | 'medium' | 'large' | 'unsure';
export type Budget = '1-3k' | '3-7.5k' | '7.5-15k' | '15k+';
export type Condition = 'new' | 'used' | 'any';
export type Priority = 'warm_sound' | 'bright_sound' | 'design' | 'compact' | 'value' | 'silent' | 'top_brand';

export interface UserConfig {
  instrumentType: InstrumentType;
  skillLevel: SkillLevel;
  space: Space;
  budget: Budget;
  condition: Condition;
  priorities: Priority[];
}

export interface Recommendation {
  model: string;
  motivation: string;
  link: string;
  type: 'product' | 'category' | 'showroom';
  ctaText: string;
}

export interface GroundingSource {
  title: string;
  uri: string;
}

export interface ConfigResult {
  title: string;
  intro: string;
  recommendations: Recommendation[];
  showShowroomCTA: boolean;
  sources?: GroundingSource[];
}
