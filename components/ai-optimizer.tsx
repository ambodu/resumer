"use client";

import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  Brain,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Lightbulb,
  Target,
  FileText,
  Award,
  Zap,
  Download,
  RefreshCw,
} from "lucide-react";
import {
  aiOptimizer,
  OptimizationAnalysis,
  OptimizationSuggestion,
} from "@/lib/ai-optimizer";
import { ResumeData } from "@/lib/types";
import { useAppSelector } from "@/lib/hooks";
import { useToast } from "@/components/ui/use-toast";

interface AIOptimizerProps {
  resume?: ResumeData;
  targetIndustry?: string;
  onApplySuggestion?: (suggestion: OptimizationSuggestion) => void;
}

const severityConfig = {
  critical: {
    color: "destructive" as const,
    icon: XCircle,
    label: "严重",
    bgColor: "bg-red-50 dark:bg-red-950/20",
    borderColor: "border-red-200 dark:border-red-800",
  },
  high: {
    color: "destructive" as const,
    icon: AlertTriangle,
    label: "重要",
    bgColor: "bg-orange-50 dark:bg-orange-950/20",
    borderColor: "border-orange-200 dark:border-orange-800",
  },
  medium: {
    color: "secondary" as const,
    icon: AlertTriangle,
    label: "中等",
    bgColor: "bg-yellow-50 dark:bg-yellow-950/20",
    borderColor: "border-yellow-200 dark:border-yellow-800",
  },
  low: {
    color: "outline" as const,
    icon: Lightbulb,
    label: "建议",
    bgColor: "bg-blue-50 dark:bg-blue-950/20",
    borderColor: "border-blue-200 dark:border-blue-800",
  },
};

const typeConfig = {
  content: { icon: FileText, label: "内容" },
  structure: { icon: Target, label: "结构" },
  format: { icon: Award, label: "格式" },
  keyword: { icon: Zap, label: "关键词" },
  achievement: { icon: TrendingUp, label: "成就" },
};

export function AIOptimizer({
  resume,
  targetIndustry,
  onApplySuggestion,
}: AIOptimizerProps) {
  const currentResume =
    useAppSelector((state) => state.resume.currentResume) || resume;
  const [analysis, setAnalysis] = useState<OptimizationAnalysis | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [selectedSuggestion, setSelectedSuggestion] =
    useState<OptimizationSuggestion | null>(null);
  const [appliedSuggestions, setAppliedSuggestions] = useState<Set<string>>(
    new Set()
  );
  const { toast } = useToast();

  // 执行分析
  const runAnalysis = React.useCallback(async () => {
    if (!currentResume) {
      toast({
        title: "无法分析",
        description: "请先创建或加载简历",
        variant: "destructive",
      });
      return;
    }

    setIsAnalyzing(true);
    setAnalysis(null); // 清除之前的分析结果

    try {
      // 验证简历数据完整性
      if (!currentResume.personalInfo) {
        throw new Error("简历缺少个人信息");
      }

      // 模拟异步分析过程
      await new Promise((resolve) => setTimeout(resolve, 1500));

      const result = aiOptimizer.analyzeResume(currentResume, targetIndustry);

      if (!result || typeof result.score !== "number") {
        throw new Error("分析结果格式错误");
      }

      setAnalysis(result);

      toast({
        title: "分析完成",
        description: `简历评分：${result.score}/100，发现 ${result.suggestions.length} 条优化建议`,
      });
    } catch (error) {
      console.error("分析失败:", error);

      const errorMessage = error instanceof Error ? error.message : "未知错误";

      toast({
        title: "分析失败",
        description: `分析过程中出现错误：${errorMessage}。请检查简历数据或稍后重试。`,
        variant: "destructive",
      });

      // 设置默认的错误状态
      setAnalysis({
        score: 0,
        suggestions: [],
        strengths: [],
        weaknesses: ["分析失败，请重试"],
        keywords: { missing: [], present: [], recommended: [] },
        readability: { score: 0, issues: ["无法分析"] },
        atsCompatibility: { score: 0, issues: ["无法分析"] },
      });
    } finally {
      setIsAnalyzing(false);
    }
  }, [currentResume, targetIndustry]);

  // 应用建议
  const applySuggestion = (suggestion: OptimizationSuggestion) => {
    try {
      if (!suggestion || !suggestion.id) {
        throw new Error("建议数据无效");
      }

      setAppliedSuggestions(
        (prev) => new Set([...Array.from(prev), suggestion.id])
      );
      onApplySuggestion?.(suggestion);

      toast({
        title: "建议已应用",
        description: `已应用建议：${suggestion.title}`,
      });
    } catch (error) {
      console.error("应用建议失败:", error);

      toast({
        title: "应用失败",
        description: "应用建议时出现错误，请重试",
        variant: "destructive",
      });
    }
  };

  // 导出报告
  const exportReport = () => {
    if (!analysis) {
      toast({
        title: "无法导出",
        description: "请先完成简历分析",
        variant: "destructive",
      });
      return;
    }

    try {
      const report = aiOptimizer.generateOptimizationReport(analysis);

      if (!report || typeof report !== "string") {
        throw new Error("报告生成失败");
      }

      const blob = new Blob([report], { type: "text/markdown" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `简历优化报告_${new Date().toLocaleDateString()}.md`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast({
        title: "导出成功",
        description: "简历优化报告已下载到本地",
      });
    } catch (error) {
      console.error("导出失败:", error);

      toast({
        title: "导出失败",
        description: "报告导出过程中出现错误，请重试",
        variant: "destructive",
      });
    }
  };

  // 获取分数颜色
  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600 dark:text-green-400";
    if (score >= 60) return "text-yellow-600 dark:text-yellow-400";
    return "text-red-600 dark:text-red-400";
  };

  // 获取分数描述
  const getScoreDescription = (score: number) => {
    if (score >= 90) return "优秀";
    if (score >= 80) return "良好";
    if (score >= 70) return "中等";
    if (score >= 60) return "及格";
    return "需要改进";
  };

  useEffect(() => {
    if (currentResume) {
      runAnalysis();
    }
  }, [currentResume, targetIndustry, runAnalysis]);

  if (!currentResume) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center h-64">
          <div className="text-center">
            <Brain className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <p className="text-muted-foreground">请先创建或加载简历</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* 头部操作区 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Brain className="h-6 w-6 text-primary" />
          <h2 className="text-2xl font-bold">AI 简历优化</h2>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={runAnalysis}
            disabled={isAnalyzing}
            className="gap-2"
          >
            <RefreshCw
              className={`h-4 w-4 ${isAnalyzing ? "animate-spin" : ""}`}
            />
            {isAnalyzing ? "分析中..." : "重新分析"}
          </Button>
          {analysis && (
            <Button onClick={exportReport} className="gap-2">
              <Download className="h-4 w-4" />
              导出报告
            </Button>
          )}
        </div>
      </div>

      {isAnalyzing && (
        <Card>
          <CardContent className="flex items-center justify-center h-32">
            <div className="text-center">
              <RefreshCw className="h-8 w-8 mx-auto mb-2 animate-spin text-primary" />
              <p className="text-sm text-muted-foreground">
                AI 正在分析您的简历...
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {analysis && (
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">总览</TabsTrigger>
            <TabsTrigger value="suggestions">建议</TabsTrigger>
            <TabsTrigger value="keywords">关键词</TabsTrigger>
            <TabsTrigger value="details">详细分析</TabsTrigger>
          </TabsList>

          {/* 总览标签页 */}
          <TabsContent value="overview" className="space-y-4">
            {/* 总体评分 */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="h-5 w-5" />
                  总体评分
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <div
                      className={`text-4xl font-bold ${getScoreColor(
                        analysis.score
                      )}`}
                    >
                      {analysis.score}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {getScoreDescription(analysis.score)}
                    </div>
                  </div>
                  <div className="text-right">
                    <Progress value={analysis.score} className="w-32 mb-2" />
                    <div className="text-xs text-muted-foreground">
                      满分 100
                    </div>
                  </div>
                </div>

                {analysis.score < 80 && (
                  <Alert>
                    <Lightbulb className="h-4 w-4" />
                    <AlertDescription>
                      您的简历还有提升空间！查看下方建议来优化您的简历。
                    </AlertDescription>
                  </Alert>
                )}
              </CardContent>
            </Card>

            {/* 优势与不足 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-green-600 dark:text-green-400">
                    <CheckCircle className="h-5 w-5" />
                    优势
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-32">
                    {analysis.strengths.length > 0 ? (
                      <ul className="space-y-1">
                        {analysis.strengths.map((strength, index) => (
                          <li
                            key={index}
                            className="flex items-center gap-2 text-sm"
                          >
                            <CheckCircle className="h-3 w-3 text-green-500" />
                            {strength}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-sm text-muted-foreground">
                        暂无明显优势
                      </p>
                    )}
                  </ScrollArea>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-red-600 dark:text-red-400">
                    <XCircle className="h-5 w-5" />
                    待改进
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-32">
                    {analysis.weaknesses.length > 0 ? (
                      <ul className="space-y-1">
                        {analysis.weaknesses.map((weakness, index) => (
                          <li
                            key={index}
                            className="flex items-center gap-2 text-sm"
                          >
                            <XCircle className="h-3 w-3 text-red-500" />
                            {weakness}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-sm text-muted-foreground">
                        暂无明显不足
                      </p>
                    )}
                  </ScrollArea>
                </CardContent>
              </Card>
            </div>

            {/* 快速统计 */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-red-600 dark:text-red-400">
                    {
                      analysis.suggestions.filter(
                        (s) => s.severity === "critical"
                      ).length
                    }
                  </div>
                  <div className="text-xs text-muted-foreground">严重问题</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                    {
                      analysis.suggestions.filter((s) => s.severity === "high")
                        .length
                    }
                  </div>
                  <div className="text-xs text-muted-foreground">重要问题</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
                    {
                      analysis.suggestions.filter(
                        (s) => s.severity === "medium"
                      ).length
                    }
                  </div>
                  <div className="text-xs text-muted-foreground">中等问题</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                    {
                      analysis.suggestions.filter((s) => s.severity === "low")
                        .length
                    }
                  </div>
                  <div className="text-xs text-muted-foreground">优化建议</div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* 建议标签页 */}
          <TabsContent value="suggestions" className="space-y-4">
            <ScrollArea className="h-96">
              {analysis.suggestions.length > 0 ? (
                <div className="space-y-4">
                  {analysis.suggestions.map((suggestion) => {
                    const config = severityConfig[suggestion.severity];
                    const typeInfo = typeConfig[suggestion.type];
                    const Icon = config.icon;
                    const TypeIcon = typeInfo.icon;
                    const isApplied = appliedSuggestions.has(suggestion.id);

                    return (
                      <Card
                        key={suggestion.id}
                        className={`${config.bgColor} ${
                          config.borderColor
                        } border-l-4 cursor-pointer transition-all hover:shadow-md ${
                          selectedSuggestion?.id === suggestion.id
                            ? "ring-2 ring-primary"
                            : ""
                        }`}
                        onClick={() => setSelectedSuggestion(suggestion)}
                      >
                        <CardHeader className="pb-3">
                          <div className="flex items-start justify-between">
                            <div className="flex items-start gap-3">
                              <Icon className="h-5 w-5 mt-0.5 flex-shrink-0" />
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                  <CardTitle className="text-base">
                                    {suggestion.title}
                                  </CardTitle>
                                  <Badge
                                    variant={config.color}
                                    className="text-xs"
                                  >
                                    {config.label}
                                  </Badge>
                                  <Badge
                                    variant="outline"
                                    className="text-xs gap-1"
                                  >
                                    <TypeIcon className="h-3 w-3" />
                                    {typeInfo.label}
                                  </Badge>
                                </div>
                                <CardDescription className="text-sm">
                                  {suggestion.section} •{" "}
                                  {suggestion.description}
                                </CardDescription>
                              </div>
                            </div>
                            {!isApplied && (
                              <Button
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  applySuggestion(suggestion);
                                }}
                                className="ml-2"
                              >
                                应用
                              </Button>
                            )}
                            {isApplied && (
                              <Badge variant="secondary" className="ml-2">
                                已应用
                              </Badge>
                            )}
                          </div>
                        </CardHeader>
                        <CardContent className="pt-0">
                          <div className="space-y-2">
                            <div>
                              <span className="text-sm font-medium">
                                建议：
                              </span>
                              <span className="text-sm text-muted-foreground ml-1">
                                {suggestion.suggestion}
                              </span>
                            </div>
                            {suggestion.example && (
                              <div>
                                <span className="text-sm font-medium">
                                  示例：
                                </span>
                                <div className="text-sm text-muted-foreground ml-1 bg-muted/50 p-2 rounded mt-1">
                                  {suggestion.example}
                                </div>
                              </div>
                            )}
                            <div>
                              <span className="text-sm font-medium">
                                影响：
                              </span>
                              <span className="text-sm text-muted-foreground ml-1">
                                {suggestion.impact}
                              </span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-8">
                  <CheckCircle className="h-12 w-12 mx-auto mb-4 text-green-500" />
                  <p className="text-lg font-medium">恭喜！</p>
                  <p className="text-muted-foreground">
                    您的简历没有明显的优化建议
                  </p>
                </div>
              )}
            </ScrollArea>
          </TabsContent>

          {/* 关键词标签页 */}
          <TabsContent value="keywords" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-green-600 dark:text-green-400">
                    已包含关键词
                  </CardTitle>
                  <CardDescription>简历中已包含的相关关键词</CardDescription>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-32">
                    <div className="flex flex-wrap gap-1">
                      {analysis.keywords.present.map((keyword, index) => (
                        <Badge
                          key={index}
                          variant="secondary"
                          className="text-xs"
                        >
                          {keyword}
                        </Badge>
                      ))}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-red-600 dark:text-red-400">
                    缺失关键词
                  </CardTitle>
                  <CardDescription>建议添加的行业关键词</CardDescription>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-32">
                    <div className="flex flex-wrap gap-1">
                      {analysis.keywords.missing
                        .slice(0, 10)
                        .map((keyword, index) => (
                          <Badge
                            key={index}
                            variant="outline"
                            className="text-xs"
                          >
                            {keyword}
                          </Badge>
                        ))}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-blue-600 dark:text-blue-400">
                    推荐关键词
                  </CardTitle>
                  <CardDescription>优先考虑添加的关键词</CardDescription>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-32">
                    <div className="flex flex-wrap gap-1">
                      {analysis.keywords.recommended.map((keyword, index) => (
                        <Badge
                          key={index}
                          variant="default"
                          className="text-xs"
                        >
                          {keyword}
                        </Badge>
                      ))}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* 详细分析标签页 */}
          <TabsContent value="details" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle>可读性分析</CardTitle>
                  <CardDescription>简历的可读性和结构评估</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">可读性评分</span>
                      <span
                        className={`font-bold ${getScoreColor(
                          analysis.readability.score
                        )}`}
                      >
                        {analysis.readability.score}/100
                      </span>
                    </div>
                    <Progress value={analysis.readability.score} />
                    {analysis.readability.issues.length > 0 && (
                      <div>
                        <span className="text-sm font-medium">问题：</span>
                        <ul className="text-sm text-muted-foreground mt-1 space-y-1">
                          {analysis.readability.issues.map((issue, index) => (
                            <li key={index} className="flex items-start gap-2">
                              <span className="text-red-500 mt-0.5">•</span>
                              {issue}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>ATS 兼容性</CardTitle>
                  <CardDescription>申请跟踪系统兼容性评估</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">兼容性评分</span>
                      <span
                        className={`font-bold ${getScoreColor(
                          analysis.atsCompatibility.score
                        )}`}
                      >
                        {analysis.atsCompatibility.score}/100
                      </span>
                    </div>
                    <Progress value={analysis.atsCompatibility.score} />
                    {analysis.atsCompatibility.issues.length > 0 && (
                      <div>
                        <span className="text-sm font-medium">问题：</span>
                        <ul className="text-sm text-muted-foreground mt-1 space-y-1">
                          {analysis.atsCompatibility.issues.map(
                            (issue, index) => (
                              <li
                                key={index}
                                className="flex items-start gap-2"
                              >
                                <span className="text-red-500 mt-0.5">•</span>
                                {issue}
                              </li>
                            )
                          )}
                        </ul>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
}

export default AIOptimizer;
