import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../globals.css";

import { Navbar } from "@/components/navbar";
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, setRequestLocale } from 'next-intl/server';
import StoreProvider from "../StoreProvider";
import { Toaster } from "@/components/ui/toaster";
import { ErrorBoundary } from "@/components/ui/error-boundary";
import { I18nWrapper } from "@/components/providers/i18n-wrapper";
import { locales, Locale } from '@/lib/i18n';

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Resumer - 专业简历制作工具",
  description: "使用AI智能助手创建专业简历，多种模板选择，一键导出PDF",
};

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params: { locale }
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  // Enable static rendering
  setRequestLocale(locale);
  
  const messages = await getMessages();

  return (
    <html lang={locale}>
      <body className={inter.className}>
        <ErrorBoundary>
          <NextIntlClientProvider messages={messages}>
            <I18nWrapper locale={locale as Locale}>
              <StoreProvider>
                <div className="relative flex min-h-screen flex-col">
                  <Navbar />
                  <main className="flex-1">{children}</main>
                </div>
                <Toaster />
              </StoreProvider>
            </I18nWrapper>
          </NextIntlClientProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}