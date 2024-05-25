import type { NavItemConfig } from '@/types/nav';
import { paths } from '@/paths';

export const navItems = [
  { key: 'overview', title: 'motherboard', href: paths.motherboard.overview, icon: 'chart-pie' },
  { key: 'customers', title: 'Customers', href: paths.motherboard.customers, icon: 'users' },
  { key: 'chatbot', title: 'chatbot', href: paths.motherboard.chatbot, icon: 'plugs-connected' },
  { key: 'settings', title: 'Settings', href: paths.motherboard.settings, icon: 'gear-six' },
  { key: 'account', title: 'Account', href: paths.motherboard.account, icon: 'user' },
  { key: 'error', title: 'Error', href: paths.errors.notFound, icon: 'x-square' },
] satisfies NavItemConfig[];
