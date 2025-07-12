import { createSharedPathnamesNavigation } from 'next-intl/navigation';

export const locales = ['zh', 'en'] as const;
export type Locale = (typeof locales)[number];

export const { Link, redirect, usePathname, useRouter } = createSharedPathnamesNavigation({ locales });

export const defaultLocale: Locale = 'zh';

export function getLocaleFromPathname(pathname: string): Locale {
  const segments = pathname.split('/');
  const potentialLocale = segments[1];
  
  if (locales.includes(potentialLocale as Locale)) {
    return potentialLocale as Locale;
  }
  
  return defaultLocale;
}

export function removeLocaleFromPathname(pathname: string): string {
  const segments = pathname.split('/');
  const potentialLocale = segments[1];
  
  if (locales.includes(potentialLocale as Locale)) {
    return '/' + segments.slice(2).join('/');
  }
  
  return pathname;
}