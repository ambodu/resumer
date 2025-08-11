"use client";

import { useState, useMemo } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  FileText,
  Plus,
  Edit,
  Download,
  Trash2,
  Clock,
  User as UserIcon,
  Briefcase,
  Copy,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useResumeState, useResumeActions } from "@/lib/hooks";
import { format } from "date-fns";
import { zhCN, enUS } from "date-fns/locale";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { EmptyState } from "@/components/ui/empty-state";

interface UserDashboardProps {
  locale: string;
}

export function UserDashboard({ locale }: UserDashboardProps) {
  const router = useRouter();
  const { currentResume, savedResumes, lastSaved } = useResumeState();
  const { saveResume, deleteResume, duplicateResume, setCurrentResume } =
    useResumeActions();

  const [searchValue, setSearchValue] = useState("");

  const handleLoadResume = (resumeId: string) => {
    const resume = savedResumes.find((r) => r.id === resumeId);
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

  const filteredResumes = useMemo(() => {
    if (!searchValue) return savedResumes;

    return savedResumes.filter(
      (resume) =>
        resume.personalInfo?.fullName
          ?.toLowerCase()
          .includes(searchValue.toLowerCase()) ||
        resume.personalInfo?.email
          ?.toLowerCase()
          .includes(searchValue.toLowerCase())
    );
  }, [savedResumes, searchValue]);

  const dateLocale = locale === "zh" ? zhCN : enUS;
  const dateFormat =
    locale === "zh" ? "yyyy年MM月dd日 HH:mm" : "MMM dd, yyyy HH:mm";

  return (
    <div className="space-y-8">
      {/* Current Resume Section */}
      {currentResume && (
        <Card className="border-l-4 border-l-primary">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                  <FileText className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <CardTitle className="flex items-center gap-2">
                    当前简历
                    <Badge variant="default">编辑中</Badge>
                  </CardTitle>
                  <CardDescription>
                    {currentResume.personalInfo.fullName || "未命名简历"}
                  </CardDescription>
                </div>
              </div>
              <div className="flex gap-2">
                <Link href={`/${locale}/editor`}>
                  <Button variant="outline" size="sm">
                    <Edit className="mr-2 h-4 w-4" />
                    继续编辑
                  </Button>
                </Link>
                <Button onClick={saveResume} size="sm">
                  <Download className="mr-2 h-4 w-4" />
                  保存
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div className="flex items-center gap-2">
                <UserIcon className="h-4 w-4 text-muted-foreground" />
                <span>
                  姓名: {currentResume.personalInfo.fullName || "未填写"}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Briefcase className="h-4 w-4 text-muted-foreground" />
                <span>工作经历: {currentResume.experience.length} 项</span>
              </div>
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-muted-foreground" />
                <span>教育经历: {currentResume.education.length} 项</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span>技能: {currentResume.skills.length} 项</span>
              </div>
            </div>
            {lastSaved && (
              <div className="mt-4 pt-4 border-t text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  最后保存:{" "}
                  {format(new Date(lastSaved), dateFormat, {
                    locale: dateLocale,
                  })}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Quick Actions */}
      <div className="grid md:grid-cols-3 gap-6">
        <Card className="card-hover">
          <CardHeader className="text-center">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Plus className="h-8 w-8 text-primary" />
            </div>
            <CardTitle>创建新简历</CardTitle>
            <CardDescription>从头开始制作一份全新的简历</CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <Link href={`/${locale}/editor`}>
              <Button className="w-full">开始创建</Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="card-hover">
          <CardHeader className="text-center">
            <div className="w-16 h-16 bg-secondary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <FileText className="h-8 w-8 text-secondary-foreground" />
            </div>
            <CardTitle>选择模板</CardTitle>
            <CardDescription>从专业模板开始，快速创建简历</CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <Link href={`/${locale}/templates`}>
              <Button variant="outline" className="w-full">
                浏览模板
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="card-hover">
          <CardHeader className="text-center">
            <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Download className="h-8 w-8 text-accent-foreground" />
            </div>
            <CardTitle>导入简历</CardTitle>
            <CardDescription>上传现有简历文件进行编辑</CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <Button variant="outline" className="w-full" disabled>
              即将推出
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Saved Resumes */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold">已保存的简历</h2>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="搜索简历..."
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              className="px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 bg-background"
            />
          </div>
        </div>

        {filteredResumes.length === 0 ? (
          <EmptyState
            icon={FileText}
            title="还没有保存的简历"
            description="创建您的第一份简历，开始您的求职之旅"
            action={{
              label: "选择模板",
              onClick: () => (window.location.href = `/${locale}/templates`),
            }}
          />
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredResumes.map((resume) => (
              <Card key={resume.id} className="card-hover">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                        <FileText className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">
                          {resume.personalInfo.fullName || "未命名简历"}
                        </CardTitle>
                        <CardDescription>
                          {resume.personalInfo.email || "无邮箱"}
                        </CardDescription>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="grid grid-cols-3 gap-2 text-sm text-muted-foreground">
                      <div className="text-center">
                        <div className="font-medium text-foreground">
                          {resume.experience.length}
                        </div>
                        <div>工作经历</div>
                      </div>
                      <div className="text-center">
                        <div className="font-medium text-foreground">
                          {resume.education.length}
                        </div>
                        <div>教育经历</div>
                      </div>
                      <div className="text-center">
                        <div className="font-medium text-foreground">
                          {resume.skills.length}
                        </div>
                        <div>技能</div>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => resume.id && handleLoadResume(resume.id)}
                        className="flex-1"
                        disabled={!resume.id}
                      >
                        <Edit className="mr-2 h-4 w-4" />
                        编辑
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          resume.id && handleDuplicateResume(resume.id)
                        }
                        disabled={!resume.id}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                      <ConfirmDialog
                        title="删除简历"
                        description="确定要删除这份简历吗？此操作无法撤销。"
                        onConfirm={() =>
                          resume.id && handleDeleteResume(resume.id)
                        }
                        trigger={
                          <Button variant="outline" size="sm">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        }
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
