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
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  Target,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Star,
  Award,
  BarChart3,
  PieChart,
  Activity,
  Zap,
  Eye,
  FileText,
  Users,
  Clock,
  Lightbulb,
  Download,
  RefreshCw,
  ArrowUp,
  ArrowDown,
  Minus,
} from "lucide-react";
import { useAppSelector } from "@/lib/hooks";
import { ResumeData } from "@/lib/types";
import { useToast } from "@/components/ui/use-toast";

interface ScoreCategory {
  name: string;
  score: number;
  maxScore: number;
  weight: number;
  issues: ScoreIssue[];
  suggestions: string[];
}

interface ScoreIssue {
  type: "error" | "warning" | "info";
  message: string;
  section: string;
  severity: "high" | "medium" | "low";
  fixable: boolean;
}

interface ScoreReport {
  totalScore: number;
  maxScore: number;
  grade: "A+" | "A" | "B+" | "B" | "C+" | "C" | "D" | "F";
  categories: ScoreCategory[];
  overallIssues: ScoreIssue[];
  strengths: string[];
  improvements: string[];
  atsCompatibility: number;
  readabilityScore: number;
  completenessScore: number;
  keywordDensity: number;
  estimatedViewTime: number;
  competitiveRanking: number;
}

interface ResumeScorerProps {
  resume?: ResumeData;
  onScoreUpdate?: (score: ScoreReport) => void;
}

export function ResumeScorer({ resume, onScoreUpdate }: ResumeScorerProps) {
  const currentResume = useAppSelector((state) => state.resume.currentResume);
  const { toast } = useToast();

  const [scoreReport, setScoreReport] = useState<ScoreReport | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState<string>("overview");
  const [showDetails, setShowDetails] = useState(false);

  const resumeData = resume || currentResume;

  // 分析简历
  const analyzeResume = React.useCallback(async () => {
    if (!resumeData) {
      toast({
        title: "无法分析",
        description: "请先创建或加载简历",
        variant: "destructive",
      });
      return;
    }

    setIsAnalyzing(true);
    setAnalysisProgress(0);

    try {
      // 模拟分析进度
      const progressInterval = setInterval(() => {
        setAnalysisProgress((prev) => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 15;
        });
      }, 300);

      // 模拟分析延迟
      await new Promise((resolve) => setTimeout(resolve, 2000));

      const report = generateScoreReport(resumeData);

      clearInterval(progressInterval);
      setAnalysisProgress(100);
      setScoreReport(report);
      onScoreUpdate?.(report);

      toast({
        title: "分析完成",
        description: `简历评分：${report.totalScore}/${report.maxScore} (${report.grade})`,
      });
    } catch (error) {
      toast({
        title: "分析失败",
        description: "简历分析过程中出现错误，请重试",
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
  }, [resumeData, onScoreUpdate, toast]);

  // 生成评分报告
  const generateScoreReport = (resume: ResumeData): ScoreReport => {
    const categories: ScoreCategory[] = [];
    const overallIssues: ScoreIssue[] = [];

    // 个人信息评分
    const personalInfoScore = analyzePersonalInfo(resume.personalInfo);
    categories.push(personalInfoScore);

    // 工作经验评分
    const experienceScore = analyzeExperience(resume.experience || []);
    categories.push(experienceScore);

    // 教育背景评分
    const educationScore = analyzeEducation(resume.education || []);
    categories.push(educationScore);

    // 技能评分
    const skillsScore = analyzeSkills(resume.skills || []);
    categories.push(skillsScore);

    // 注释掉项目经验评分，因为ResumeData中没有projects字段
    // const projectsScore = analyzeProjects(resume.projects || []);
    // categories.push(projectsScore);

    // 计算总分
    const totalScore = categories.reduce(
      (sum, cat) => sum + cat.score * cat.weight,
      0
    );
    const maxScore = categories.reduce(
      (sum, cat) => sum + cat.maxScore * cat.weight,
      0
    );
    const normalizedScore = Math.round((totalScore / maxScore) * 100);

    // 确定等级
    const grade = getGrade(normalizedScore);

    // 收集所有问题
    categories.forEach((cat) => {
      overallIssues.push(...cat.issues);
    });

    // 生成优势和改进建议
    const strengths = generateStrengths(resume, categories);
    const improvements = generateImprovements(overallIssues);

    return {
      totalScore: normalizedScore,
      maxScore: 100,
      grade,
      categories,
      overallIssues,
      strengths,
      improvements,
      atsCompatibility: calculateATSCompatibility(resume),
      readabilityScore: calculateReadabilityScore(resume),
      completenessScore: calculateCompletenessScore(resume),
      keywordDensity: calculateKeywordDensity(resume),
      estimatedViewTime: calculateViewTime(resume),
      competitiveRanking: Math.floor(Math.random() * 100) + 1, // 模拟排名
    };
  };

  // 分析个人信息
  const analyzePersonalInfo = (
    personalInfo: ResumeData["personalInfo"]
  ): ScoreCategory => {
    const issues: ScoreIssue[] = [];
    const suggestions: string[] = [];
    let score = 0;
    const maxScore = 20;

    // 检查必填字段
    if (!personalInfo.fullName?.trim()) {
      issues.push({
        type: "error",
        message: "缺少姓名",
        section: "个人信息",
        severity: "high",
        fixable: true,
      });
    } else {
      score += 5;
    }

    if (!personalInfo.email?.trim()) {
      issues.push({
        type: "error",
        message: "缺少邮箱地址",
        section: "个人信息",
        severity: "high",
        fixable: true,
      });
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(personalInfo.email)) {
      issues.push({
        type: "warning",
        message: "邮箱格式不正确",
        section: "个人信息",
        severity: "medium",
        fixable: true,
      });
      score += 2;
    } else {
      score += 5;
    }

    if (!personalInfo.phone?.trim()) {
      issues.push({
        type: "warning",
        message: "建议添加联系电话",
        section: "个人信息",
        severity: "medium",
        fixable: true,
      });
    } else {
      score += 3;
    }

    if (!personalInfo.location?.trim()) {
      issues.push({
        type: "info",
        message: "建议添加所在地信息",
        section: "个人信息",
        severity: "low",
        fixable: true,
      });
    } else {
      score += 2;
    }

    if (!personalInfo.summary?.trim()) {
      issues.push({
        type: "warning",
        message: "建议添加职业总结",
        section: "个人信息",
        severity: "medium",
        fixable: true,
      });
    } else if (personalInfo.summary.length < 50) {
      issues.push({
        type: "info",
        message: "职业总结过于简短，建议扩展",
        section: "个人信息",
        severity: "low",
        fixable: true,
      });
      score += 3;
    } else {
      score += 5;
    }

    // 生成建议
    if (score < maxScore * 0.8) {
      suggestions.push("完善个人信息，确保包含所有关键联系方式");
      suggestions.push("撰写简洁有力的职业总结，突出核心优势");
    }

    return {
      name: "个人信息",
      score,
      maxScore,
      weight: 0.2,
      issues,
      suggestions,
    };
  };

  // 分析工作经验
  const analyzeExperience = (experience: any[]): ScoreCategory => {
    const issues: ScoreIssue[] = [];
    const suggestions: string[] = [];
    let score = 0;
    const maxScore = 30;

    if (experience.length === 0) {
      issues.push({
        type: "error",
        message: "缺少工作经验",
        section: "工作经验",
        severity: "high",
        fixable: true,
      });
      suggestions.push("添加相关工作经验，包括实习和项目经历");
    } else {
      score += 10;

      experience.forEach((exp, index) => {
        if (!exp.company?.trim()) {
          issues.push({
            type: "error",
            message: `第${index + 1}个工作经验缺少公司名称`,
            section: "工作经验",
            severity: "high",
            fixable: true,
          });
        } else {
          score += 2;
        }

        if (!exp.position?.trim()) {
          issues.push({
            type: "error",
            message: `第${index + 1}个工作经验缺少职位名称`,
            section: "工作经验",
            severity: "high",
            fixable: true,
          });
        } else {
          score += 2;
        }

        if (!exp.description?.trim()) {
          issues.push({
            type: "warning",
            message: `第${index + 1}个工作经验缺少描述`,
            section: "工作经验",
            severity: "medium",
            fixable: true,
          });
        } else if (exp.description.length < 100) {
          issues.push({
            type: "info",
            message: `第${index + 1}个工作经验描述过于简短`,
            section: "工作经验",
            severity: "low",
            fixable: true,
          });
          score += 2;
        } else {
          score += 4;
        }
      });

      if (experience.length < 2) {
        suggestions.push("增加更多工作经验以展示职业发展轨迹");
      }
    }

    return {
      name: "工作经验",
      score: Math.min(score, maxScore),
      maxScore,
      weight: 0.4,
      issues,
      suggestions,
    };
  };

  // 分析教育背景
  const analyzeEducation = (education: any[]): ScoreCategory => {
    const issues: ScoreIssue[] = [];
    const suggestions: string[] = [];
    let score = 0;
    const maxScore = 15;

    if (education.length === 0) {
      issues.push({
        type: "warning",
        message: "缺少教育背景",
        section: "教育背景",
        severity: "medium",
        fixable: true,
      });
      suggestions.push("添加教育背景信息");
    } else {
      score += 8;

      education.forEach((edu, index) => {
        if (!edu.institution?.trim()) {
          issues.push({
            type: "error",
            message: `第${index + 1}个教育经历缺少学校名称`,
            section: "教育背景",
            severity: "high",
            fixable: true,
          });
        } else {
          score += 2;
        }

        if (!edu.degree?.trim()) {
          issues.push({
            type: "warning",
            message: `第${index + 1}个教育经历缺少学位信息`,
            section: "教育背景",
            severity: "medium",
            fixable: true,
          });
        } else {
          score += 2;
        }

        if (!edu.field?.trim()) {
          issues.push({
            type: "info",
            message: `第${index + 1}个教育经历建议添加专业信息`,
            section: "教育背景",
            severity: "low",
            fixable: true,
          });
        } else {
          score += 1;
        }
      });
    }

    return {
      name: "教育背景",
      score: Math.min(score, maxScore),
      maxScore,
      weight: 0.15,
      issues,
      suggestions,
    };
  };

  // 分析技能
  const analyzeSkills = (skills: any[]): ScoreCategory => {
    const issues: ScoreIssue[] = [];
    const suggestions: string[] = [];
    let score = 0;
    const maxScore = 20;

    if (skills.length === 0) {
      issues.push({
        type: "error",
        message: "缺少技能信息",
        section: "技能",
        severity: "high",
        fixable: true,
      });
      suggestions.push("添加相关技能，包括技术技能和软技能");
    } else {
      score += 10;

      if (skills.length < 5) {
        issues.push({
          type: "info",
          message: "技能数量较少，建议增加更多相关技能",
          section: "技能",
          severity: "low",
          fixable: true,
        });
        score += 5;
      } else if (skills.length > 15) {
        issues.push({
          type: "warning",
          message: "技能过多，建议精选最相关的技能",
          section: "技能",
          severity: "medium",
          fixable: true,
        });
        score += 8;
      } else {
        score += 10;
      }

      suggestions.push("确保技能与目标职位相关");
      suggestions.push("考虑添加技能熟练程度");
    }

    return {
      name: "技能",
      score: Math.min(score, maxScore),
      maxScore,
      weight: 0.15,
      issues,
      suggestions,
    };
  };

  // 分析项目经验
  const analyzeProjects = (projects: any[]): ScoreCategory => {
    const issues: ScoreIssue[] = [];
    const suggestions: string[] = [];
    let score = 0;
    const maxScore = 15;

    if (projects.length === 0) {
      issues.push({
        type: "info",
        message: "建议添加项目经验",
        section: "项目经验",
        severity: "low",
        fixable: true,
      });
      suggestions.push("添加相关项目经验以展示实际能力");
      score += 5; // 项目经验是可选的
    } else {
      score += 10;

      projects.forEach((project, index) => {
        if (!project.name?.trim()) {
          issues.push({
            type: "error",
            message: `第${index + 1}个项目缺少名称`,
            section: "项目经验",
            severity: "high",
            fixable: true,
          });
        } else {
          score += 1;
        }

        if (!project.description?.trim()) {
          issues.push({
            type: "warning",
            message: `第${index + 1}个项目缺少描述`,
            section: "项目经验",
            severity: "medium",
            fixable: true,
          });
        } else {
          score += 2;
        }
      });
    }

    return {
      name: "项目经验",
      score: Math.min(score, maxScore),
      maxScore,
      weight: 0.1,
      issues,
      suggestions,
    };
  };

  // 计算等级
  const getGrade = (score: number): ScoreReport["grade"] => {
    if (score >= 95) return "A+";
    if (score >= 90) return "A";
    if (score >= 85) return "B+";
    if (score >= 80) return "B";
    if (score >= 75) return "C+";
    if (score >= 70) return "C";
    if (score >= 60) return "D";
    return "F";
  };

  // 生成优势
  const generateStrengths = (
    resume: ResumeData,
    categories: ScoreCategory[]
  ): string[] => {
    const strengths: string[] = [];

    categories.forEach((cat) => {
      if (cat.score / cat.maxScore >= 0.8) {
        strengths.push(`${cat.name}信息完整且质量较高`);
      }
    });

    if (resume.experience && resume.experience.length >= 3) {
      strengths.push("工作经验丰富，展现良好的职业发展轨迹");
    }

    if (resume.skills && resume.skills.length >= 8) {
      strengths.push("技能覆盖面广，展现多元化能力");
    }

    if (
      resume.personalInfo.summary &&
      resume.personalInfo.summary.length > 100
    ) {
      strengths.push("职业总结详细，能够有效展示个人价值");
    }

    return strengths.length > 0 ? strengths : ["简历结构基本完整"];
  };

  // 生成改进建议
  const generateImprovements = (issues: ScoreIssue[]): string[] => {
    const improvements: string[] = [];

    const highSeverityIssues = issues.filter(
      (issue) => issue.severity === "high"
    );
    const mediumSeverityIssues = issues.filter(
      (issue) => issue.severity === "medium"
    );

    if (highSeverityIssues.length > 0) {
      improvements.push("优先解决高优先级问题，完善必填信息");
    }

    if (mediumSeverityIssues.length > 0) {
      improvements.push("改进中等优先级问题，提升简历质量");
    }

    improvements.push("使用具体数据和成果来量化工作成就");
    improvements.push("确保简历内容与目标职位高度匹配");
    improvements.push("保持简历格式一致性和专业性");

    return improvements;
  };

  // 计算ATS兼容性
  const calculateATSCompatibility = (resume: ResumeData): number => {
    let score = 0;

    // 检查关键字段
    if (resume.personalInfo.fullName) score += 20;
    if (resume.personalInfo.email) score += 20;
    if (resume.experience && resume.experience.length > 0) score += 30;
    if (resume.education && resume.education.length > 0) score += 15;
    if (resume.skills && resume.skills.length > 0) score += 15;

    return Math.min(score, 100);
  };

  // 计算可读性分数
  const calculateReadabilityScore = (resume: ResumeData): number => {
    let score = 80; // 基础分

    // 检查文本长度
    const totalText = [
      resume.personalInfo.summary || "",
      ...(resume.experience || []).map((exp) => exp.description || ""),
      // 注释掉projects引用，因为ResumeData中没有projects字段
      // ...(resume.projects || []).map(proj => proj.description || '')
    ].join(" ");

    if (totalText.length > 2000) score -= 10;
    if (totalText.length < 500) score -= 15;

    return Math.max(score, 0);
  };

  // 计算完整性分数
  const calculateCompletenessScore = (resume: ResumeData): number => {
    let score = 0;
    const sections = [
      resume.personalInfo.fullName,
      resume.personalInfo.email,
      resume.personalInfo.summary,
      resume.experience && resume.experience.length > 0,
      resume.education && resume.education.length > 0,
      resume.skills && resume.skills.length > 0,
    ];

    const completedSections = sections.filter(Boolean).length;
    score = (completedSections / sections.length) * 100;

    return Math.round(score);
  };

  // 计算关键词密度
  const calculateKeywordDensity = (resume: ResumeData): number => {
    // 模拟关键词密度计算
    return Math.floor(Math.random() * 30) + 10;
  };

  // 计算预估查看时间
  const calculateViewTime = (resume: ResumeData): number => {
    const totalText = [
      resume.personalInfo.summary || "",
      ...(resume.experience || []).map((exp) => exp.description || ""),
    ].join(" ");

    // 假设每分钟阅读200字
    const readingTime = Math.ceil(totalText.length / 200);
    return Math.max(readingTime, 1);
  };

  // 获取问题图标
  const getIssueIcon = (type: ScoreIssue["type"]) => {
    switch (type) {
      case "error":
        return <XCircle className="h-4 w-4 text-red-500" />;
      case "warning":
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case "info":
        return <Eye className="h-4 w-4 text-blue-500" />;
    }
  };

  // 获取等级颜色
  const getGradeColor = (grade: string) => {
    switch (grade) {
      case "A+":
      case "A":
        return "text-green-600";
      case "B+":
      case "B":
        return "text-blue-600";
      case "C+":
      case "C":
        return "text-yellow-600";
      case "D":
        return "text-orange-600";
      case "F":
        return "text-red-600";
      default:
        return "text-gray-600";
    }
  };

  // 自动分析
  useEffect(() => {
    if (resumeData && !scoreReport) {
      analyzeResume();
    }
  }, [resumeData, analyzeResume, scoreReport]);

  return (
    <div className="space-y-6">
      {/* 头部 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-blue-500 rounded-xl flex items-center justify-center">
            <Target className="h-5 w-5 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold">简历评分</h2>
            <p className="text-muted-foreground">
              全面分析简历质量，提供改进建议
            </p>
          </div>
        </div>

        <Button
          onClick={analyzeResume}
          disabled={isAnalyzing || !resumeData}
          className="gap-2"
        >
          {isAnalyzing ? (
            <RefreshCw className="h-4 w-4 animate-spin" />
          ) : (
            <BarChart3 className="h-4 w-4" />
          )}
          {isAnalyzing ? "分析中..." : "重新分析"}
        </Button>
      </div>

      {/* 分析进度 */}
      {isAnalyzing && (
        <Card>
          <CardContent className="p-6">
            <div className="text-center space-y-4">
              <Activity className="h-12 w-12 mx-auto text-primary animate-pulse" />
              <div>
                <h3 className="text-lg font-medium">正在分析简历...</h3>
                <p className="text-sm text-muted-foreground">
                  请稍候，正在进行全面质量评估
                </p>
              </div>
              <Progress value={analysisProgress} className="w-full" />
              <p className="text-xs text-muted-foreground">
                {analysisProgress}%
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* 评分结果 */}
      {scoreReport && (
        <div className="space-y-6">
          {/* 总体评分 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="h-5 w-5" />
                总体评分
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="text-center">
                  <div
                    className={`text-4xl font-bold ${getGradeColor(
                      scoreReport.grade
                    )}`}
                  >
                    {scoreReport.grade}
                  </div>
                  <div className="text-sm text-muted-foreground">等级</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold text-primary">
                    {scoreReport.totalScore}
                  </div>
                  <div className="text-sm text-muted-foreground">总分</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold text-green-600">
                    {scoreReport.atsCompatibility}%
                  </div>
                  <div className="text-sm text-muted-foreground">ATS兼容性</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold text-blue-600">
                    {scoreReport.completenessScore}%
                  </div>
                  <div className="text-sm text-muted-foreground">完整度</div>
                </div>
              </div>

              <Separator className="my-6" />

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">可读性评分</span>
                  <span className="font-medium">
                    {scoreReport.readabilityScore}/100
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">关键词密度</span>
                  <span className="font-medium">
                    {scoreReport.keywordDensity}%
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">预估查看时间</span>
                  <span className="font-medium">
                    {scoreReport.estimatedViewTime}分钟
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 详细分析 */}
          <Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview">概览</TabsTrigger>
              <TabsTrigger value="categories">分类评分</TabsTrigger>
              <TabsTrigger value="issues">问题列表</TabsTrigger>
              <TabsTrigger value="suggestions">改进建议</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <TrendingUp className="h-5 w-5 text-green-500" />
                      优势
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ScrollArea className="h-32">
                      <ul className="space-y-2">
                        {scoreReport.strengths.map((strength, index) => (
                          <li
                            key={index}
                            className="flex items-start gap-2 text-sm"
                          >
                            <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                            {strength}
                          </li>
                        ))}
                      </ul>
                    </ScrollArea>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Lightbulb className="h-5 w-5 text-blue-500" />
                      改进方向
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ScrollArea className="h-32">
                      <ul className="space-y-2">
                        {scoreReport.improvements.map((improvement, index) => (
                          <li
                            key={index}
                            className="flex items-start gap-2 text-sm"
                          >
                            <ArrowUp className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
                            {improvement}
                          </li>
                        ))}
                      </ul>
                    </ScrollArea>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="categories" className="space-y-4">
              <div className="grid grid-cols-1 gap-4">
                {scoreReport.categories.map((category) => (
                  <Card key={category.name}>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">
                          {category.name}
                        </CardTitle>
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-muted-foreground">
                            {category.score}/{category.maxScore}
                          </span>
                          <Badge
                            variant={
                              category.score / category.maxScore >= 0.8
                                ? "default"
                                : "secondary"
                            }
                          >
                            {Math.round(
                              (category.score / category.maxScore) * 100
                            )}
                            %
                          </Badge>
                        </div>
                      </div>
                      <Progress
                        value={(category.score / category.maxScore) * 100}
                        className="w-full"
                      />
                    </CardHeader>
                    {category.issues.length > 0 && (
                      <CardContent>
                        <div className="space-y-2">
                          {category.issues.slice(0, 3).map((issue, index) => (
                            <div
                              key={index}
                              className="flex items-start gap-2 text-sm"
                            >
                              {getIssueIcon(issue.type)}
                              <span>{issue.message}</span>
                            </div>
                          ))}
                          {category.issues.length > 3 && (
                            <p className="text-xs text-muted-foreground">
                              还有 {category.issues.length - 3} 个问题...
                            </p>
                          )}
                        </div>
                      </CardContent>
                    )}
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="issues" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>所有问题</CardTitle>
                  <CardDescription>
                    共发现 {scoreReport.overallIssues.length} 个问题
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-96">
                    <div className="space-y-3">
                      {scoreReport.overallIssues.map((issue, index) => (
                        <div
                          key={index}
                          className="flex items-start gap-3 p-3 rounded-lg border"
                        >
                          {getIssueIcon(issue.type)}
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-medium">
                                {issue.message}
                              </span>
                              <Badge variant="outline" className="text-xs">
                                {issue.section}
                              </Badge>
                              <Badge
                                variant={
                                  issue.severity === "high"
                                    ? "destructive"
                                    : issue.severity === "medium"
                                    ? "default"
                                    : "secondary"
                                }
                                className="text-xs"
                              >
                                {issue.severity === "high"
                                  ? "高"
                                  : issue.severity === "medium"
                                  ? "中"
                                  : "低"}
                              </Badge>
                            </div>
                            {issue.fixable && (
                              <p className="text-xs text-muted-foreground">
                                ✓ 可修复
                              </p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="suggestions" className="space-y-4">
              <div className="grid grid-cols-1 gap-4">
                {scoreReport.categories.map(
                  (category) =>
                    category.suggestions.length > 0 && (
                      <Card key={category.name}>
                        <CardHeader>
                          <CardTitle className="text-lg">
                            {category.name} - 改进建议
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <ul className="space-y-2">
                            {category.suggestions.map((suggestion, index) => (
                              <li
                                key={index}
                                className="flex items-start gap-2 text-sm"
                              >
                                <Lightbulb className="h-4 w-4 text-yellow-500 mt-0.5 flex-shrink-0" />
                                {suggestion}
                              </li>
                            ))}
                          </ul>
                        </CardContent>
                      </Card>
                    )
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      )}

      {/* 无简历状态 */}
      {!resumeData && (
        <Card>
          <CardContent className="p-12 text-center">
            <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">暂无简历数据</h3>
            <p className="text-muted-foreground mb-4">
              请先创建或加载简历，然后进行质量分析
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

export default ResumeScorer;
