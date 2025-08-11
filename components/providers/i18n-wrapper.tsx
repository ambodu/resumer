"use client";

import React from "react";
import { Locale } from "@/lib/i18n";

interface I18nWrapperProps {
  children: React.ReactNode;
  locale: Locale;
}

export function I18nWrapper({ children, locale }: I18nWrapperProps) {
  return <div data-locale={locale}>{children}</div>;
}

export default I18nWrapper;
