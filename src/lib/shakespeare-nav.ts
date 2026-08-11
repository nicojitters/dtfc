export interface ShakespeareNavItem {
  key: string;
  label: string;
  href: string;
}

export const SHAKESPEARE_NAV: ShakespeareNavItem[] = [
  { key: 'alternatives', label: 'Alternatives', href: '/shakespeare/alternatives/' },
  { key: 'scenes', label: 'Scenes', href: '/shakespeare/scenes/' },
  { key: 'themes', label: 'Themes', href: '/shakespeare/themes/' },
  { key: 'cuttings', label: 'Cuttings', href: '/shakespeare/cuttings/' },
  { key: 'soliloquies', label: 'Soliloquies', href: '/shakespeare/soliloquies/' },
  {
    key: 'childrens-shakespeare',
    label: "Children's",
    href: '/shakespeare/childrens-shakespeare/',
  },
  { key: 'colloquial', label: 'Colloquial', href: '/shakespeare/colloquial/' },
  { key: 'ask-shakespeare', label: 'Ask Shakespeare', href: '/shakespeare/ask-shakespeare/' },
  {
    key: 'honoring-our-guides',
    label: 'Honoring Our Guides',
    href: '/shakespeare/honoring-our-guides/',
  },
];
