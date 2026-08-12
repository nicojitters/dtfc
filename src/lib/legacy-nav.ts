export interface LegacyNavItem {
  key: string;
  label: string;
  href: string;
}

export const LEGACY_NAV: LegacyNavItem[] = [
  { key: 'honoring-our-guides', label: 'Honoring Our Guides', href: '/legacy/honoring-our-guides/' },
  { key: 'history', label: 'History', href: '/legacy/history/' },
  { key: 'founders', label: 'Founders', href: '/legacy/founders/' },
  { key: 'timeline', label: 'Timeline', href: '/legacy/timeline/' },
  { key: 'research', label: 'Research', href: '/legacy/research/' },
  { key: 'essays', label: 'Essays', href: '/legacy/essays/' },
  // Future: 'All That Came After: Theatres and Careers' — vision spec Doc #11, content deferred.
];
