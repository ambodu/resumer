"use client";

import { useState, useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { FileText, Plus, Edit, Download, Trash2, Clock, User as UserIcon, Briefcase, Copy } from "lucide-react";
import Link from "next/link";
import { useRouter, useParams } from "next/navigation";
import { useResumeState, useResumeActions } from "@/lib/hooks";
import { format } from "date-fns";
import { zhCN, enUS } from "date-fns/locale";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { EmptyState } from "@/components/ui/empty-state";
import { useTranslations } from 'next-intl';

export default function UserPage() {
  const t = useTranslations('user');
  const router = useRouter();
  const params = useParams();
  const locale = params.locale as string;
  const { currentResume, savedResumes, lastSaved } = useResumeState();
  const { saveResume, deleteResume, duplicateResume, setCurrentResume } = useResumeActions();
  
  // Search and filter state
  const [searchValue, setSearchValue] = useState("");
  const [filters, setFilters] = useState([
    { key: "hasExperience", label: t('filters.hasExperience'), active: false },
    { key: "hasEducation", label: t('filters.hasEducation'), active: false },
    { key: "hasSkills", label: t('filters.hasSkills'), active: false },
    { key: "recentlyModified", label: t('filters.recentlyModified'), active: false },
  ]);

  const handleLoadResume = (resumeId: string) => {
    const resume = savedResumes.find(r => r.id === resumeId);
    if (resume) {
      setCurrentResume(resume);
      router.push(`/${locale}/editor`);
    }
  };

  const handleDeleteResume = (resumeId: string) => {
    deleteResume(resumeId);
  };

  const handleDuplicateResume = (resumeId: string) => {
    duplicateResume(resumeId);
  };

  const handleFilterToggle = (key: string) => {
    setFilters(prev => prev.map(f => 
      f.key === key ? { ...f, active: !f.active } : f
    ));
  };

  const handleClearFilters = () => {
    setFilters(prev => prev.map(f => ({ ...f, active: false })));
  };

  const getResumeStats = (resume: any) => {
    return {
      experience: resume.experience?.length || 0,
      education: resume.education?.length || 0,
      skills: resume.skills?.length || 0
    };
  };

  // Filtered resumes
  const filteredResumes = useMemo(() => {
    let filtered = savedResumes;

    // Apply search filter
    if (searchValue) {
      filtered = filtered.filter(resume => 
        resume.personalInfo?.fullName?.toLowerCase().includes(searchValue.toLowerCase()) ||
        resume.personalInfo?.email?.toLowerCase().includes(searchValue.toLowerCase())
      );
    }

    // Apply other filters
    const activeFilters = filters.filter(f => f.active);
    if (activeFilters.length > 0) {
      filtered = filtered.filter(resume => {
        return activeFilters.every(filter => {
          switch (filter.key) {
            case "hasExperience":
              return resume.experience && resume.experience.length > 0;
            case "hasEducation":
              return resume.education && resume.education.length > 0;
            case "hasSkills":
              return resume.skills && resume.skills.length > 0;
            case "recentlyModified":
              // Consider resumes modified in the last 7 days as recent
              const sevenDaysAgo = new Date();
              sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
              return lastSaved && new Date(lastSaved) > sevenDaysAgo;
            default:
              return true;
          }
        });
      });
    }

    return filtered;
  }, [savedResumes, searchValue, filters, lastSaved]);

  const dateLocale = locale === 'zh' ? zhCN : enUS;
  const dateFormat = locale === 'zh' ? "yyyy年MM月dd日 HH:mm" : "MMM dd, yyyy HH:mm";

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          {t('title')}
        </h1>
        <p className="text-gray-600 text-lg">
          {t('subtitle')}
        </p>
      </div>

      {/* Current Resume Section */}
      {currentResume && (
        <Card className="mb-8 border-l-4 border-l-blue-500">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <FileText className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <CardTitle className="flex items-center gap-2">
                    {t('currentResume.title')}
                    <Badge variant="default" className="bg-blue-600">
                      {t('currentResume.editing')}
                    </Badge>
                  </CardTitle>
                  <CardDescription>
                    {currentResume.personalInfo.fullName || t('currentResume.unnamed')}
                  </CardDescription>
                </div>
              </div>
              <div className="flex gap-2">
                <Link href={`/${locale}/editor`}>
                  <Button variant="outline" size="sm">
                    <Edit className="mr-2 h-4 w-4" />
                    {t('actions.continueEdit')}
                  </Button>
                </Link>
                <Button onClick={saveResume} size="sm">
                  <Download className="mr-2 h-4 w-4" />
                  {t('actions.save')}
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div className="flex items-center gap-2">
                <UserIcon className="h-4 w-4 text-gray-500" />
                <span>{t('stats.name')}: {currentResume.personalInfo.fullName || t('stats.notFilled')}</span>
              </div>
              <div className="flex items-center gap-2">
                <Briefcase className="h-4 w-4 text-gray-500" />
                <span>{t('stats.experience')}: {currentResume.experience.length} {t('stats.items')}</span>
              </div>
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-gray-500" />
                <span>{t('stats.education')}: {currentResume.education.length} {t('stats.items')}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-gray-500" />
                <span>{t('stats.skills')}: {currentResume.skills.length} {t('stats.items')}</span>
              </div>
            </div>
            {lastSaved && (
              <div className="mt-4 pt-4 border-t text-sm text-gray-500">
                <div className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {t('lastSaved')}: {format(new Date(lastSaved), dateFormat, { locale: dateLocale })}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Quick Actions */}
      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <Card className="hover:shadow-lg transition-shadow duration-200">
          <CardHeader className="text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                <Plus className="h-6 w-6 text-blue-600" />
            </div>
            <CardTitle className="text-lg">{t('quickActions.create.title')}</CardTitle>
            <CardDescription>{t('quickActions.create.description')}</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href={`/${locale}/editor`}>
              <Button className="w-full">
                {t('quickActions.create.action')}
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow duration-200">
          <CardHeader className="text-center">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                <FileText className="h-6 w-6 text-purple-600" />
            </div>
            <CardTitle className="text-lg">{t('quickActions.template.title')}</CardTitle>
            <CardDescription>{t('quickActions.template.description')}</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href={`/${locale}/templates`}>
              <Button variant="outline" className="w-full">
                {t('quickActions.template.action')}
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow duration-200">
          <CardHeader className="text-center">
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                <Download className="h-6 w-6 text-orange-600" />
            </div>
            <CardTitle className="text-lg">{t('quickActions.import.title')}</CardTitle>
            <CardDescription>{t('quickActions.import.description')}</CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" className="w-full" disabled>
              {t('quickActions.import.action')}
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Saved Resumes */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">{t('savedResumes.title')}</h2>
          <Badge variant="outline">
            {savedResumes.length} {t('savedResumes.count')}
          </Badge>
        </div>

        {/* Search and Filter */}
        {savedResumes.length > 0 && (
          <div className="mb-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <input
                  type="text"
                  placeholder={t('search.placeholder')}
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div className="flex gap-2 flex-wrap">
                {filters.map((filter) => (
                  <Button
                    key={filter.key}
                    variant={filter.active ? "default" : "outline"}
                    size="sm"
                    onClick={() => handleFilterToggle(filter.key)}
                  >
                    {filter.label}
                  </Button>
                ))}
                {filters.some(f => f.active) && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleClearFilters}
                  >
                    {t('search.clearFilters')}
                  </Button>
                )}
              </div>
            </div>
          </div>
        )}

        {savedResumes.length === 0 ? (
          <EmptyState
            icon={FileText}
            title={t('empty.noResumes.title')}
            description={t('empty.noResumes.description')}
            action={{
              label: t('empty.noResumes.action'),
              onClick: () => window.location.href = `/${locale}/templates`
            }}
          />
        ) : filteredResumes.length === 0 ? (
          <EmptyState
            icon={FileText}
            title={t('empty.noResults.title')}
            description={t('empty.noResults.description')}
            action={{
              label: t('empty.noResults.action'),
              onClick: () => {
                setSearchValue("");
                handleClearFilters();
              }
            }}
          />
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredResumes.map((resume, index) => {
              const stats = getResumeStats(resume);
              return (
                <Card key={index} className="hover:shadow-lg transition-shadow duration-200">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                       <div className="flex-1">
                         <CardTitle className="line-clamp-1">
                           {resume.personalInfo?.fullName || `${t('resumeCard.defaultName')} ${index + 1}`}
                         </CardTitle>
                         <CardDescription className="line-clamp-2">
                           {resume.personalInfo?.email || t('resumeCard.noEmail')}
                         </CardDescription>
                       </div>
                       <div className="flex gap-1">
                         <Button 
                           variant="ghost" 
                           size="icon"
                           onClick={() => handleDuplicateResume(resume.id || index.toString())}
                           className="text-blue-500 hover:text-blue-700"
                         >
                           <Copy className="h-4 w-4" />
                         </Button>
                         <ConfirmDialog
                           trigger={
                             <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-700">
                               <Trash2 className="h-4 w-4" />
                             </Button>
                           }
                           title={t('confirmDelete.title')}
                           description={t('confirmDelete.description', { name: resume.personalInfo?.fullName || `${t('resumeCard.defaultName')} ${index + 1}` })}
                           confirmText={t('confirmDelete.confirm')}
                           cancelText={t('confirmDelete.cancel')}
                           variant="destructive"
                           icon={Trash2}
                           onConfirm={() => handleDeleteResume(resume.id || index.toString())}
                         />
                       </div>
                     </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex gap-2 text-xs">
                        <Badge variant="secondary">{stats.experience} {t('resumeCard.experience')}</Badge>
                        <Badge variant="secondary">{stats.education} {t('resumeCard.education')}</Badge>
                        <Badge variant="secondary">{stats.skills} {t('resumeCard.skills')}</Badge>
                      </div>
                      
                      <Separator />
                      
                      <div className="flex gap-2">
                        <Button 
                          size="sm" 
                          className="flex-1"
                          onClick={() => handleLoadResume(index.toString())}
                        >
                          <Edit className="mr-2 h-3 w-3" />
                          {t('actions.edit')}
                        </Button>
                        <Button size="sm" variant="outline">
                          <Download className="mr-2 h-3 w-3" />
                          {t('actions.download')}
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}