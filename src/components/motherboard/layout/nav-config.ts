import type { NavItemConfig } from '@/types/nav';

export const personalNavItems: NavItemConfig[] = [
  { key: 'chatbot', title: 'Chatbot', href: '/motherboard', icon: 'plugs-connected' },
  { key: 'summary', title: 'Summary', href: '/motherboard/summary', icon: 'chart-pie' },
  { key: 'account', title: 'Account', href: '/motherboard/account', icon: 'user' },
];

export const enterpriseNavItems: NavItemConfig[] = [
  { key: 'motherboard', title: 'Dashboard', href: '/motherboard', icon: 'gear-six' },
  { key: 'summary', title: 'Summary', href: '/motherboard/summary', icon: 'chart-pie' },
  { key: 'account', title: 'Account', href: '/motherboard/account', icon: 'user' },
];