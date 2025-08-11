import { notFound } from "next/navigation";
import { locales } from "@/lib/i18n";

interface LocaleLayoutProps {
  children: React.ReactNode;
  params: { locale: string };
}

export default function LocaleLayout({
  children,
  params: { locale },
}: LocaleLayoutProps) {
  // 验证语言参数
  if (!locales.includes(locale as any)) {
    notFound();
  }

  return children;
}

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}
