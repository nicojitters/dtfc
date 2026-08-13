/**
 * Site-wide ICON registry — maps concept id to icon asset and PRC slug.
 *
 * `iconFlagged: true` marks the six site-wide concepts the vision spec §4
 * declares "ICON-flagged" (Warmup, Continuous Assessment, Magic Toolbox,
 * Theatre Games, Cohesion, Competency). Other entries render inline icons
 * on their PRC detail pages but are not surfaced with the ICON badge on
 * cards or in Concept popovers.
 *
 * `iconPath()` in src/lib/icons.ts consults this registry first, then
 * falls back to <id>.svg, then to placeholder.svg. All artwork currently
 * ships as a placeholder.svg clone under public/icons/; Desirae swaps
 * files without touching this registry.
 */
export type IconRegistryEntry = {
  file: string;
  prcSlug: string;
  iconFlagged: boolean;
};

export const ICON_REGISTRY = {
  archetypes:             { file: 'archetypes.svg',            prcSlug: 'archetypes',             iconFlagged: false },
  casting:                { file: 'casting.svg',                prcSlug: 'casting',                iconFlagged: false },
  cohesion:               { file: 'cohesion.svg',               prcSlug: 'cohesion',               iconFlagged: true  },
  competency:             { file: 'competency.svg',             prcSlug: 'competency',             iconFlagged: true  },
  'continuous-assessment': { file: 'continuous-assessment.svg', prcSlug: 'continuous-assessment', iconFlagged: true  },
  creativity:             { file: 'creativity.svg',             prcSlug: 'creativity',             iconFlagged: false },
  'developmental-theatre': { file: 'developmental-theatre.svg', prcSlug: 'developmental-theatre', iconFlagged: false },
  facilitation:           { file: 'facilitation.svg',           prcSlug: 'facilitation',           iconFlagged: false },
  'fearless-creativity':  { file: 'fearless-creativity.svg',    prcSlug: 'fearless-creativity',   iconFlagged: false },
  icons:                  { file: 'icons.svg',                  prcSlug: 'icons',                  iconFlagged: false },
  'language-oral-tradition': { file: 'language-oral-tradition.svg', prcSlug: 'language-oral-tradition', iconFlagged: false },
  'language-sparse-resonant': { file: 'language-sparse-resonant.svg', prcSlug: 'language-sparse-resonant', iconFlagged: false },
  'magic-toolbox':        { file: 'magic-toolbox.svg',          prcSlug: 'magic-toolbox',          iconFlagged: true  },
  players:                { file: 'players.svg',                prcSlug: 'players',                iconFlagged: false },
  plot:                   { file: 'plot.svg',                   prcSlug: 'plot',                   iconFlagged: false },
  repetition:             { file: 'repetition.svg',             prcSlug: 'repetition',             iconFlagged: false },
  resilience:             { file: 'resilience.svg',             prcSlug: 'resilience',             iconFlagged: false },
  stage:                  { file: 'stage.svg',                  prcSlug: 'stage',                  iconFlagged: false },
  'theatre-games':        { file: 'theatre-games.svg',          prcSlug: 'theatre-games',          iconFlagged: true  },
  'vocal-expression':     { file: 'vocal-expression.svg',       prcSlug: 'vocal-expression',       iconFlagged: false },
  warmup:                 { file: 'warmup.svg',                 prcSlug: 'warmup',                 iconFlagged: true  },
} as const satisfies Record<string, IconRegistryEntry>;
