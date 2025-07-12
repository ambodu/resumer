"use client";

import React from 'react';
import { I18nProvider } from '@/components/i18n/i18n-provider';
import { Locale } from '@/lib/i18n';

interface I18nWrapperProps {
  children: React.ReactNode;
  locale: Locale;
}

export function I18nWrapper({ children, locale }: I18nWrapperProps) {
  return (
    <I18nProvider initialLocale={locale}>
      {children}
    </I18nProvider>
  );
}

export default I18nWrapper;