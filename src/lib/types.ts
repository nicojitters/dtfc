export const COMPETENCIES = [
  'physical-expression',
  'vocal-expression',
  'context-awareness',
  'risk-assessment',
  'resilience',
] as const;
export type Competency = (typeof COMPETENCIES)[number];

export const COHESIONS = ['low', 'medium', 'high'] as const;
export type Cohesion = (typeof COHESIONS)[number];

export const STRUCTURES = ['individual', 'group'] as const;
export type Structure = (typeof STRUCTURES)[number];

export const COMPETENCY_LABELS: Record<Competency, string> = {
  'physical-expression': 'Physical Expression',
  'vocal-expression': 'Vocal Expression',
  'context-awareness': 'Context Awareness',
  'risk-assessment': 'Risk Assessment & Management',
  resilience: 'Resilience',
};

export const COMPETENCY_SUBSETS: Record<Competency, string[]> = {
  'physical-expression': ['Entry', 'Movement', 'Mime', 'Rhythm'],
  'vocal-expression': ['Expression', 'Articulation', 'Finding a Voice', 'Storytelling'],
  'context-awareness': [],
  'risk-assessment': [],
  resilience: [],
};
