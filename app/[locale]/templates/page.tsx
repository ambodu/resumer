import { TemplateCard } from "@/components/templates/template-card";
import { resumeTemplates } from "@/lib/templates";
import { templateMetadata, templateCategories } from "@/lib/template-metadata";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { locales } from "@/lib/i18n";
import { FileText, Users, Briefcase, Sparkles } from "lucide-react";

interface TemplatesPageProps {
  params: { locale: string };
}

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default function TemplatesPage({
  params: { locale },
}: TemplatesPageProps) {
  const allTemplates = Object.entries(resumeTemplates);

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold mb-4 text-gradient">专业简历模板</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          选择适合您行业和职位的专业简历模板，让您的简历脱颖而出
        </p>
      </div>

      {/* Templates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        {allTemplates.map(([key, template]) => {
          return (
            <TemplateCard key={key} templateId={key} template={template} />
          );
        })}
      </div>

      {/* Features Section */}
      <div className="mt-16">
        <Card className="glass-effect border-0 shadow-lg">
          <CardHeader className="text-center">
            <CardTitle className="flex items-center justify-center gap-2 text-2xl">
              <Sparkles className="h-6 w-6 text-primary" />
              模板特色
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center group">
                <div className="bg-gradient-to-br from-blue-500/20 to-blue-600/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 smooth-transition">
                  <FileText className="h-8 w-8 text-blue-500" />
                </div>
                <h3 className="font-semibold mb-2 text-lg">专业设计</h3>
                <p className="text-muted-foreground">
                  由专业设计师精心制作，符合现代招聘标准
                </p>
              </div>
              <div className="text-center group">
                <div className="bg-gradient-to-br from-purple-500/20 to-purple-600/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 smooth-transition">
                  <Sparkles className="h-8 w-8 text-purple-500" />
                </div>
                <h3 className="font-semibold mb-2 text-lg">智能优化</h3>
                <p className="text-muted-foreground">
                  AI智能建议，帮助您优化简历内容和格式
                </p>
              </div>
              <div className="text-center group">
                <div className="bg-gradient-to-br from-indigo-500/20 to-indigo-600/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 smooth-transition">
                  <Users className="h-8 w-8 text-indigo-500" />
                </div>
                <h3 className="font-semibold mb-2 text-lg">行业适配</h3>
                <p className="text-muted-foreground">
                  针对不同行业和职位定制的专业模板
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
