"use client";

import { TemplateCard } from "@/components/templates/template-card";
import { resumeTemplates } from "@/lib/templates";
import { templateMetadata, templateCategories } from "@/lib/template-metadata";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useTranslations } from 'next-intl';

import { FileText, Users, Briefcase, Palette, Sparkles, Filter } from "lucide-react";
import { useState, useMemo } from "react";

export default function TemplatesPage() {
  const t = useTranslations('templates');
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");

  const filteredTemplates = useMemo(() => {
    return Object.entries(resumeTemplates).filter(([key]) => {
      const metadata = templateMetadata[key as keyof typeof templateMetadata];
      if (!metadata) return false;

      const matchesCategory = selectedCategory === "all" || metadata.category === selectedCategory;
      const matchesSearch = searchQuery === "" || 
        metadata.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        metadata.description.toLowerCase().includes(searchQuery.toLowerCase());

      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold mb-4 text-gradient">
          {t('title')}
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          {t('subtitle')}
        </p>
      </div>

      {/* Search and Filter */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="flex-1 max-w-md">
            <div className="relative">
              <input
                type="text"
                placeholder={t('searchPlaceholder')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2 pl-10 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 bg-background"
              />
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            </div>
          </div>
          <div className="flex gap-2 flex-wrap">
            <Button
              variant={selectedCategory === "all" ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory("all")}
              className="smooth-transition"
            >
              {t('categories.all')}
            </Button>
            {templateCategories.slice(1).map((category) => (
              <Button
                key={category.key}
                variant={selectedCategory === category.key ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category.key)}
                className="smooth-transition"
              >
                {t(`categories.${category.key}`)}
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* Templates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        {filteredTemplates.map(([key, template]) => {
          return (
            <TemplateCard
              key={key}
              templateId={key}
              template={template}
            />
          );
        })}
      </div>

      {/* No Results */}
      {filteredTemplates.length === 0 && (
        <div className="text-center py-12">
          <FileText className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">{t('noResults.title')}</h3>
          <p className="text-muted-foreground">{t('noResults.description')}</p>
        </div>
      )}

      {/* Features Section */}
      <div className="mt-16">
        <Card className="glass-effect border-0 shadow-lg">
          <CardHeader className="text-center">
            <CardTitle className="flex items-center justify-center gap-2 text-2xl">
              <Sparkles className="h-6 w-6 text-primary" />
              {t('features.title')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center group">
                <div className="bg-gradient-to-br from-blue-500/20 to-blue-600/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 smooth-transition">
                  <Palette className="h-8 w-8 text-blue-500" />
                </div>
                <h3 className="font-semibold mb-2 text-lg">{t('features.professional.title')}</h3>
                <p className="text-muted-foreground">
                  {t('features.professional.description')}
                </p>
              </div>
              <div className="text-center group">
                <div className="bg-gradient-to-br from-purple-500/20 to-purple-600/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 smooth-transition">
                  <Sparkles className="h-8 w-8 text-purple-500" />
                </div>
                <h3 className="font-semibold mb-2 text-lg">{t('features.smart.title')}</h3>
                <p className="text-muted-foreground">
                  {t('features.smart.description')}
                </p>
              </div>
              <div className="text-center group">
                <div className="bg-gradient-to-br from-indigo-500/20 to-indigo-600/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 smooth-transition">
                  <Users className="h-8 w-8 text-indigo-500" />
                </div>
                <h3 className="font-semibold mb-2 text-lg">{t('features.industry.title')}</h3>
                <p className="text-muted-foreground">
                  {t('features.industry.description')}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}