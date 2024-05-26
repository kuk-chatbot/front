import type { NavItemConfig } from '@/types/nav';
import { paths } from '@/paths';

export const navItems = [
  { key: 'overview', title: 'motherboard', href: paths.motherboard.overview, icon: 'chart-pie' },
  { key: 'summary', title: 'summary', href: paths.motherboard.summary, icon: 'users' },
  { key: 'account', title: 'Account', href: paths.motherboard.account, icon: 'user' },
] satisfies NavItemConfig[];
