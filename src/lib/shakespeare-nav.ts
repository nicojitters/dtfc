export interface ShakespeareNavItem {
  key: string;
  label: string;
  href: string;
}

export const SHAKESPEARE_NAV: ShakespeareNavItem[] = [
  { key: 'alternatives', label: 'Alternatives', href: '/shakespeare/alternatives/' },
  {
    key: 'honoring-our-guides',
    label: 'Honoring Our Guides',
    href: '/shakespeare/honoring-our-guides/',
  },
  { key: 'soliloquies', label: 'Soliloquies', href: '/shakespeare/soliloquies/' },
  { key: 'scenes', label: 'Scenes', href: '/shakespeare/scenes/' },
  { key: 'themes', label: 'Themes', href: '/shakespeare/themes/' },
  { key: 'cuttings', label: 'Cuttings', href: '/shakespeare/cuttings/' },
  {
    key: 'childrens-shakespeare',
    label: "Children’s Shakespeare",
    href: '/shakespeare/childrens-shakespeare/',
  },
  { key: 'colloquial', label: 'Colloquial', href: '/shakespeare/colloquial/' },
  { key: 'new-plays', label: 'New Plays', href: '/shakespeare/new-plays/' },
  { key: 'ask-shakespeare', label: 'Ask Shakespeare', href: '/shakespeare/ask-shakespeare/' },
];
