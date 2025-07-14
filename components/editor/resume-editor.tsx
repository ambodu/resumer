"use client";

import React, { useEffect, useState, useCallback, useRef } from "react";
import { ResumeForm } from "./resume-form";
import { ResumePreview } from "./resume-preview";
import { useResumeState, useResumeActions } from "@/lib/hooks";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Save,
  RotateCcw,
  RotateCw,
  AlertCircle,
  FileText,
  Download,
  Upload,
  Eye,
  Edit,
  CheckCircle,
  Sparkles,
  Zap,
  Brain,
  Wand2,
  Target,
} from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loading } from "@/components/ui/loading";
import { EmptyState } from "@/components/ui/empty-state";
import { useToast } from "@/components/ui/use-toast";
import { ResumeData } from "@/lib/types";
import { AIOptimizer } from "@/components/ai-optimizer";
import { AIGenerator } from "@/components/ai-generator";
import { ResumeScorer } from "@/components/resume-scorer";

export function ResumeEditor() {
  const { currentResume, isLoading, error, lastSaved } = useResumeState();
  const { saveResume, clearError, setCurrentResume } = useResumeActions();
  const [activeTab, setActiveTab] = useState<
    "edit" | "preview" | "optimize" | "generate" | "score"
  >("edit");
  const [autoSaveEnabled, setAutoSaveEnabled] = useState(true);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  // 简历上传和解析功能
  const handleFileUpload = useCallback(
    async (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (!file) return;

      if (!file.type.includes("pdf") && !file.type.includes("doc")) {
        toast({
          title: "文件格式不支持",
          description: "请上传 PDF 或 Word 文档",
          variant: "destructive",
        });
        return;
      }

      setIsUploading(true);
      try {
        // 模拟简历解析过程
        await new Promise((resolve) => setTimeout(resolve, 2000));

        // 生成示例解析数据
        const parsedResume: ResumeData = {
          personalInfo: {
            name: "张三",
            fullName: "张三",
            email: "zhangsan@example.com",
            phone: "138-0000-0000",
            location: "北京市",
            summary:
              "具有5年工作经验的软件工程师，专注于前端开发和用户体验设计。",
          },
          experience: [
            {
              company: "科技有限公司",
              position: "高级前端工程师",
              startDate: "2020-01",
              endDate: "2024-01",
              description:
                "负责公司主要产品的前端开发，使用React和TypeScript构建用户界面。",
            },
          ],
          education: [
            {
              school: "北京大学",
              degree: "计算机科学学士",
              field: "计算机科学与技术",
              graduationDate: "2020-06",
            },
          ],
          skills: ["JavaScript", "React", "TypeScript"],
        };

        // 保存到localStorage
        const savedResumes = JSON.parse(
          localStorage.getItem("uploadedResumes") || "[]"
        );
        const newResume = {
          id: Date.now().toString(),
          name: file.name.replace(/\.[^/.]+$/, ""),
          data: parsedResume,
          uploadedAt: new Date().toISOString(),
        };
        savedResumes.push(newResume);
        localStorage.setItem("uploadedResumes", JSON.stringify(savedResumes));

        // 更新当前简历
        setCurrentResume(parsedResume);

        toast({
          title: "简历上传成功",
          description: `已成功解析并导入简历：${file.name}`,
        });
      } catch (error) {
        toast({
          title: "上传失败",
          description: "简历解析过程中出现错误，请重试",
          variant: "destructive",
        });
      } finally {
        setIsUploading(false);
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
      }
    },
    [setCurrentResume, toast]
  );

  // Auto-save functionality
  const handleAutoSave = useCallback(async () => {
    if (autoSaveEnabled && hasUnsavedChanges && currentResume) {
      try {
        await saveResume();
        setHasUnsavedChanges(false);
        toast({
          title: "自动保存成功",
          description: "您的简历已自动保存",
        });
      } catch (error) {
        console.error("Auto-save failed:", error);
      }
    }
  }, [autoSaveEnabled, hasUnsavedChanges, currentResume, saveResume, toast]);

  // Auto-save every 30 seconds
  useEffect(() => {
    const interval = setInterval(handleAutoSave, 30000);
    return () => clearInterval(interval);
  }, [handleAutoSave]);

  useEffect(() => {
    if (error) {
      // Auto-clear error after 5 seconds
      const timer = setTimeout(() => {
        clearError();
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error, clearError]);

  // Show loading state
  if (isLoading && !currentResume) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Loading
          text="正在加载简历编辑器..."
          className="justify-center py-20"
        />
      </div>
    );
  }

  // Show empty state if no resume data
  if (!currentResume) {
    return (
      <div className="container mx-auto px-4 py-8">
        <EmptyState
          icon={FileText}
          title="开始创建您的简历"
          description="选择一个模板或从空白开始，创建您的专业简历"
          action={{
            label: "选择模板",
            onClick: () => (window.location.href = "/templates"),
          }}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* 隐藏滚动条的全局样式 */}
      <style jsx global>{`
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}</style>

      <div className="container mx-auto px-4 py-6">
        {/* Error Banner */}
        {error && (
          <Alert
            variant="destructive"
            className="mb-6 border-red-200 bg-red-50"
          >
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Modern Header */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-white/20 shadow-xl mb-6 p-6">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="flex-1">
              <div className="flex items-center gap-4 mb-3">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                  <Sparkles className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                    智能简历编辑器
                  </h1>
                  <p className="text-gray-600 text-sm">
                    AI驱动的专业简历创建平台
                  </p>
                </div>
                <div className="flex gap-2">
                  {hasUnsavedChanges && (
                    <Badge className="bg-orange-100 text-orange-700 border-orange-200">
                      <AlertCircle className="h-3 w-3 mr-1" />
                      未保存
                    </Badge>
                  )}
                  {autoSaveEnabled && (
                    <Badge className="bg-green-100 text-green-700 border-green-200">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      自动保存
                    </Badge>
                  )}
                </div>
              </div>
              {lastSaved && (
                <span className="text-sm text-gray-500 flex items-center gap-1">
                  <CheckCircle className="h-3 w-3" />
                  最后保存: {new Date(lastSaved).toLocaleTimeString()}
                </span>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-3 flex-wrap">
              {/* Upload Button */}
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={handleFileUpload}
                className="hidden"
              />
              <Button
                variant="outline"
                size="sm"
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
                className="border-blue-200 text-blue-700 hover:bg-blue-50"
              >
                {isUploading ? (
                  <Loading size="sm" className="mr-2" />
                ) : (
                  <Upload className="mr-2 h-4 w-4" />
                )}
                {isUploading ? "解析中..." : "上传简历"}
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={() => setAutoSaveEnabled(!autoSaveEnabled)}
                className="border-gray-200 text-gray-700 hover:bg-gray-50"
              >
                <Zap className="mr-2 h-4 w-4" />
                {autoSaveEnabled ? "关闭自动保存" : "开启自动保存"}
              </Button>

              <Button
                onClick={() => {
                  saveResume();
                  setHasUnsavedChanges(false);
                }}
                disabled={isLoading}
                size="sm"
                className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white border-0"
              >
                {isLoading ? (
                  <Loading size="sm" className="mr-2" />
                ) : (
                  <Save className="mr-2 h-4 w-4" />
                )}
                {isLoading ? "保存中..." : "保存简历"}
              </Button>

              <Button
                variant="outline"
                size="sm"
                disabled
                className="border-gray-200 text-gray-400"
              >
                <Download className="mr-2 h-4 w-4" />
                导出PDF
              </Button>
            </div>
          </div>
        </div>

        {/* Modern Mobile Tab Switcher */}
        <div className="lg:hidden mb-6">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-white/20 shadow-lg p-2">
            <div className="flex bg-gray-50 rounded-xl p-1">
              <button
                onClick={() => setActiveTab("edit")}
                className={`flex-1 py-3 px-4 rounded-lg text-sm font-medium transition-all duration-200 flex items-center justify-center gap-2 ${
                  activeTab === "edit"
                    ? "bg-white text-blue-600 shadow-md"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                <Edit className="h-4 w-4" />
                编辑
              </button>
              <button
                onClick={() => setActiveTab("preview")}
                className={`flex-1 py-3 px-4 rounded-lg text-sm font-medium transition-all duration-200 flex items-center justify-center gap-2 ${
                  activeTab === "preview"
                    ? "bg-white text-blue-600 shadow-md"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                <Eye className="h-4 w-4" />
                预览
              </button>
              <button
                onClick={() => setActiveTab("optimize")}
                className={`flex-1 py-3 px-4 rounded-lg text-sm font-medium transition-all duration-200 flex items-center justify-center gap-2 ${
                  activeTab === "optimize"
                    ? "bg-white text-blue-600 shadow-md"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                <Brain className="h-4 w-4" />
                AI优化
              </button>
              <button
                onClick={() => setActiveTab("generate")}
                className={`flex-1 py-3 px-4 rounded-lg text-sm font-medium transition-all duration-200 flex items-center justify-center gap-2 ${
                  activeTab === "generate"
                    ? "bg-white text-blue-600 shadow-md"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                <Wand2 className="h-4 w-4" />
                AI生成
              </button>
              <button
                onClick={() => setActiveTab("score")}
                className={`flex-1 py-3 px-4 rounded-lg text-sm font-medium transition-all duration-200 flex items-center justify-center gap-2 ${
                  activeTab === "score"
                    ? "bg-white text-blue-600 shadow-md"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                <Target className="h-4 w-4" />
                评分
              </button>
            </div>
          </div>
        </div>

        {/* Desktop Tab Switcher */}
        <div className="hidden lg:block mb-6">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-white/20 shadow-lg p-2">
            <div className="flex bg-gray-50 rounded-xl p-1 max-w-md">
              <button
                onClick={() => setActiveTab("edit")}
                className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all duration-200 flex items-center justify-center gap-2 ${
                  activeTab === "edit"
                    ? "bg-white text-blue-600 shadow-md"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                <Edit className="h-4 w-4" />
                编辑
              </button>
              <button
                onClick={() => setActiveTab("preview")}
                className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all duration-200 flex items-center justify-center gap-2 ${
                  activeTab === "preview"
                    ? "bg-white text-blue-600 shadow-md"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                <Eye className="h-4 w-4" />
                预览
              </button>
              <button
                onClick={() => setActiveTab("optimize")}
                className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all duration-200 flex items-center justify-center gap-2 ${
                  activeTab === "optimize"
                    ? "bg-white text-blue-600 shadow-md"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                <Brain className="h-4 w-4" />
                AI优化
              </button>
              <button
                onClick={() => setActiveTab("generate")}
                className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all duration-200 flex items-center justify-center gap-2 ${
                  activeTab === "generate"
                    ? "bg-white text-blue-600 shadow-md"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                <Wand2 className="h-4 w-4" />
                AI生成
              </button>
              <button
                onClick={() => setActiveTab("score")}
                className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all duration-200 flex items-center justify-center gap-2 ${
                  activeTab === "score"
                    ? "bg-white text-blue-600 shadow-md"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                <Target className="h-4 w-4" />
                评分
              </button>
            </div>
          </div>
        </div>

        {/* Modern Content Layout */}
        <div className="h-[calc(100vh-320px)]">
          {activeTab === "edit" && (
            <div className="flex flex-col lg:flex-row gap-6 h-full">
              {/* Edit Panel */}
              <div className="flex-1 flex flex-col">
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-white/20 shadow-xl h-full overflow-hidden">
                  <div className="h-full overflow-y-auto hide-scrollbar">
                    <ResumeForm />
                  </div>
                </div>
              </div>

              {/* Preview Panel - Desktop Only */}
              <div className="hidden lg:flex flex-1 flex-col">
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-white/20 shadow-xl h-full overflow-hidden sticky top-6">
                  <div className="h-full overflow-y-auto hide-scrollbar">
                    <ResumePreview />
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "preview" && (
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-white/20 shadow-xl h-full overflow-hidden">
              <div className="h-full overflow-y-auto hide-scrollbar">
                <ResumePreview />
              </div>
            </div>
          )}

          {activeTab === "optimize" && (
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-white/20 shadow-xl h-full overflow-hidden">
              <div className="h-full overflow-y-auto hide-scrollbar p-6">
                <AIOptimizer
                  resume={currentResume}
                  onApplySuggestion={(suggestion) => {
                    toast({
                      title: "建议已应用",
                      description: suggestion.title,
                    });
                    setHasUnsavedChanges(true);
                  }}
                />
              </div>
            </div>
          )}

          {activeTab === "generate" && (
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-white/20 shadow-xl h-full overflow-hidden">
              <div className="h-full overflow-y-auto hide-scrollbar p-6">
                <AIGenerator
                  onGenerated={(generatedContent) => {
                    setCurrentResume(generatedContent);
                    toast({
                      title: "内容已生成",
                      description: "AI已为您生成新的简历内容",
                    });
                    setHasUnsavedChanges(true);
                  }}
                />
              </div>
            </div>
          )}

          {activeTab === "score" && (
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-white/20 shadow-xl h-full overflow-hidden">
              <div className="h-full overflow-y-auto hide-scrollbar p-6">
                <ResumeScorer
                  resume={currentResume}
                  onScoreUpdate={(scoreReport) => {
                    toast({
                      title: "评分完成",
                      description: `简历评分：${scoreReport.totalScore}/100 (${scoreReport.grade})`,
                    });
                  }}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
