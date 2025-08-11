import { UserDashboard } from "@/components/user-dashboard";
import { locales } from "@/lib/i18n";

interface UserPageProps {
  params: { locale: string };
}

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default function UserPage({ params: { locale } }: UserPageProps) {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-4 text-primary">我的简历</h1>
        <p className="text-muted-foreground text-lg">
          管理您的简历，追踪编辑进度，随时导出下载
        </p>
      </div>

      <UserDashboard locale={locale} />
    </div>
  );
}
