"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import {
  Save,
  Download,
  Upload,
  Settings,
  FileText,
  Loader2,
  Plus,
  Trash2,
  Edit,
  Eye,
  Copy,
  RotateCcw,
} from "lucide-react";
import { Loading } from "@/components/ui/loading";
import { EmptyState } from "@/components/ui/empty-state";
import { TemplateSelector } from "@/components/templates/template-selector";
import { SimpleResumeEditor } from "./simple-resume-editor";
import { useAppState, useAutoSave, useTemplateManager } from "@/lib/app-hooks";
import { pdfGenerator } from "@/lib/pdf-generator";

interface ResumeEditorProps {
  resumeId?: string;
  onSave?: (data: any) => void;
}

export function ResumeEditor({ resumeId, onSave }: ResumeEditorProps) {
  const { isLoading, error, actions } = useAppState();
  const [showTemplateSelector, setShowTemplateSelector] = useState(false);

  // 启用自动保存
  useAutoSave();

  // 从resumeId加载数据
  useEffect(() => {
    if (resumeId) {
      actions.loadResume(resumeId);
    }
  }, [resumeId, actions]);

  const handleTemplateSelect = useCallback(
    (templateId: string) => {
      actions.selectTemplate(templateId);
      setShowTemplateSelector(false);
    },
    [actions]
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">正在加载简历编辑器...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center max-w-md">
          <div className="text-red-500 mb-4">
            <svg
              className="w-16 h-16 mx-auto"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 15.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            加载失败
          </h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <Button onClick={() => actions.clearError()}>重试</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* 顶部工具栏 */}
      <div className="bg-white border-b border-gray-200 px-6 py-3">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-semibold text-gray-900">简历编辑器</h1>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowTemplateSelector(true)}
          >
            <FileText className="w-4 h-4 mr-2" />
            选择模板
          </Button>
        </div>
      </div>

      {/* 主要内容区域 */}
      <div className="flex-1 flex overflow-hidden">
        <SimpleResumeEditor />
      </div>

      {/* 模板选择器 */}
      {showTemplateSelector && (
        <TemplateSelector
          onSelect={handleTemplateSelect}
          onClose={() => setShowTemplateSelector(false)}
        />
      )}
    </div>
  );
}
