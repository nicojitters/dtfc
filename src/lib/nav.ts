export type NavKey =
  | 'community'
  | 'theatre-games'
  | 'shakespeare'
  | 'childrens-theatre'
  | 'legacy'
  | 'resource-center'
  | 'workshops';

export interface NavItem {
  key: NavKey;
  label: string;
  href: string;
  comingSoon?: boolean;
}

export const NAV_ITEMS: NavItem[] = [
  { key: 'community', label: 'Community', href: '/community/' },
  { key: 'theatre-games', label: 'Theatre Games', href: '/theatre-games/' },
  { key: 'shakespeare', label: 'Shakespeare', href: '/shakespeare/' },
  { key: 'childrens-theatre', label: "Children's Theatre", href: '/childrens-theatre/' },
  { key: 'legacy', label: 'Legacy', href: '/legacy/' },
  { key: 'resource-center', label: 'Players Resource Center', href: '/resource-center/' },
  { key: 'workshops', label: 'Workshops', href: '/workshops/', comingSoon: true },
];
