export interface LegacyNavItem {
  key: string;
  label: string;
  href: string;
}

export const LEGACY_NAV: LegacyNavItem[] = [
  { key: 'history', label: 'History', href: '/legacy/history/' },
  { key: 'founders', label: 'Founders', href: '/legacy/founders/' },
  { key: 'timeline', label: 'Timeline', href: '/legacy/timeline/' },
  { key: 'essays', label: 'Essays', href: '/legacy/essays/' },
  { key: 'honoring-our-guides', label: 'Honoring Our Guides', href: '/legacy/honoring-our-guides/' },
];
