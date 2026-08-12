export interface CommunityNavItem {
  key: string;
  label: string;
  href: string;
}

export const COMMUNITY_NAV: CommunityNavItem[] = [
  { key: 'about', label: 'About', href: '/community/about/' },
  { key: 'how-were-organized', label: 'How We&rsquo;re Organized', href: '/community/how-were-organized/' },
  { key: 'membership', label: 'Membership', href: '/community/membership/' },
  { key: 'donate', label: 'Donate', href: '/community/donate/' },
  { key: 'newsletters', label: 'Newsletters', href: '/community/newsletters/' },
  { key: 'companion-theatres', label: 'Companion Theatres', href: '/community/companion-theatres/' },
  { key: 'testimonials', label: 'Testimonials', href: '/community/testimonials/' },
];
