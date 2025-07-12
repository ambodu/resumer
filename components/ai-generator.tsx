"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Wand2,
  Sparkles,
  User,
  Briefcase,
  GraduationCap,
  Settings,
  CheckCircle,
  AlertCircle,
  Lightbulb,
  Download,
  RefreshCw,
  Plus,
  X
} from 'lucide-react';
import { GenerationConfig, GenerationResult, AIResumeGenerator } from '@/lib/ai-generator';
import { ResumeData } from '@/lib/types';
import { useAppDispatch } from '@/lib/hooks';
import { setCurrentResume } from '@/lib/store';
import { useToast } from '@/components/ui/use-toast';

interface AIGeneratorProps {
  onGenerated?: (resume: ResumeData) => void;
  initialPersonalInfo?: Partial<ResumeData['personalInfo']>;
}

const INDUSTRIES = [
  { value: 'software', label: '软件开发' },
  { value: 'marketing', label: '市场营销' },
  { value: 'design', label: '设计' }
];

const POSITIONS = {
  software: [
    { value: 'frontend', label: '前端工程师' },
    { value: 'backend', label: '后端工程师' },
    { value: 'fullstack', label: '全栈工程师' }
  ],
  marketing: [
    { value: 'digital-marketing', label: '数字营销专员' },
    { value: 'content-marketing', label: '内容营销专员' }
  ],
  design: [
    { value: 'ui-designer', label: 'UI设计师' },
    { value: 'ux-designer', label: 'UX设计师' }
  ]
};

const EXPERIENCE_LEVELS = [
  { value: 'entry', label: '初级 (1-2年)' },
  { value: 'mid', label: '中级 (3-5年)' },
  { value: 'senior', label: '高级 (5-8年)' },
  { value: 'executive', label: '专家 (8年以上)' }
];

const TONES = [
  { value: 'professional', label: '专业正式' },
  { value: 'creative', label: '创意活泼' },
  { value: 'technical', label: '技术详细' },
  { value: 'friendly', label: '友好亲和' }
];

const LENGTHS = [
  { value: 'concise', label: '简洁版' },
  { value: 'detailed', label: '详细版' },
  { value: 'comprehensive', label: '完整版' }
];

export function AIGenerator({ onGenerated, initialPersonalInfo }: AIGeneratorProps) {
  const dispatch = useAppDispatch();
  const { toast } = useToast();
  const aiGenerator = AIResumeGenerator.getInstance();
  
  // 表单状态
  const [config, setConfig] = useState<GenerationConfig>({
    industry: '',
    position: '',
    experience: 'mid',
    skills: [],
    tone: 'professional',
    length: 'detailed'
  });
  
  // 个人信息
  const [personalInfo, setPersonalInfo] = useState({
    fullName: initialPersonalInfo?.fullName || '',
    email: initialPersonalInfo?.email || '',
    phone: initialPersonalInfo?.phone || '',
    location: initialPersonalInfo?.location || '',
    summary: initialPersonalInfo?.summary || ''
  });
  
  // 技能输入
  const [skillInput, setSkillInput] = useState('');
  
  // 生成状态
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationProgress, setGenerationProgress] = useState(0);
  const [result, setResult] = useState<GenerationResult | null>(null);
  const [currentStep, setCurrentStep] = useState(1);
  
  // 推荐技能
  const [recommendedSkills, setRecommendedSkills] = useState<string[]>([]);
  
  // 获取可用职位
  const getAvailablePositions = () => {
    if (!config.industry) return [];
    return POSITIONS[config.industry as keyof typeof POSITIONS] || [];
  };
  
  // 添加技能
  const addSkill = (skill: string) => {
    if (skill.trim() && !config.skills.includes(skill.trim())) {
      setConfig(prev => ({
        ...prev,
        skills: [...prev.skills, skill.trim()]
      }));
    }
    setSkillInput('');
  };
  
  // 移除技能
  const removeSkill = (skill: string) => {
    setConfig(prev => ({
      ...prev,
      skills: prev.skills.filter(s => s !== skill)
    }));
  };
  
  // 添加推荐技能
  const addRecommendedSkill = (skill: string) => {
    addSkill(skill);
  };
  
  // 生成简历
  const generateResume = async () => {
    // 验证必填配置
    if (!config.industry || !config.position) {
      toast({
        title: "请完善配置",
        description: "请选择行业和职位",
        variant: "destructive"
      });
      return;
    }
    
    // 验证个人信息
    if (!personalInfo.fullName?.trim()) {
      toast({
        title: "请填写姓名",
        description: "姓名是生成简历的必要信息",
        variant: "destructive"
      });
      return;
    }
    
    setIsGenerating(true);
    setGenerationProgress(0);
    setResult(null); // 清除之前的结果
    
    let progressInterval: NodeJS.Timeout | null = null;
    
    try {
      // 模拟进度更新
      progressInterval = setInterval(() => {
        setGenerationProgress(prev => {
          if (prev >= 90) {
            if (progressInterval) clearInterval(progressInterval);
            return 90;
          }
          return prev + Math.random() * 15 + 5; // 更自然的进度增长
        });
      }, 300);
      
      // 验证AI生成器可用性
      if (!aiGenerator || typeof aiGenerator.generateResume !== 'function') {
        throw new Error('AI生成器服务不可用');
      }
      
      const generationResult = await aiGenerator.generateResume(config, personalInfo);
      
      // 验证生成结果
      if (!generationResult || !generationResult.resume) {
        throw new Error('生成结果无效');
      }
      
      if (typeof generationResult.score !== 'number' || generationResult.score < 0 || generationResult.score > 100) {
        throw new Error('生成结果评分异常');
      }
      
      if (progressInterval) {
        clearInterval(progressInterval);
        progressInterval = null;
      }
      
      setGenerationProgress(100);
      setResult(generationResult);
      setCurrentStep(3);
      
      toast({
        title: "生成成功",
        description: `AI已为您生成专业简历，评分：${generationResult.score}/100`
      });
      
    } catch (error) {
      console.error('简历生成失败:', error);
      
      if (progressInterval) {
        clearInterval(progressInterval);
      }
      
      const errorMessage = error instanceof Error ? error.message : '未知错误';
      
      toast({
        title: "生成失败",
        description: `简历生成过程中出现错误：${errorMessage}。请检查配置信息或稍后重试。`,
        variant: "destructive"
      });
      
      // 重置进度
      setGenerationProgress(0);
      
    } finally {
      setIsGenerating(false);
    }
  };
  
  // 应用生成的简历
  const applyGeneratedResume = () => {
    if (!result || !result.resume) {
      toast({
        title: "应用失败",
        description: "没有可应用的简历数据",
        variant: "destructive"
      });
      return;
    }
    
    try {
      // 验证简历数据完整性
      if (!result.resume.personalInfo) {
        throw new Error('简历缺少个人信息');
      }
      
      dispatch(setCurrentResume(result.resume));
      onGenerated?.(result.resume);
      
      toast({
        title: "简历已应用",
        description: "AI生成的简历已应用到编辑器中"
      });
      
    } catch (error) {
      console.error('应用简历失败:', error);
      
      toast({
        title: "应用失败",
        description: "应用简历时出现错误，请重试",
        variant: "destructive"
      });
    }
  };
  
  // 重新生成
  const regenerate = () => {
    try {
      setResult(null);
      setGenerationProgress(0);
      setCurrentStep(2);
      
      // 延迟一下再开始生成，给用户更好的体验
      setTimeout(() => {
        generateResume();
      }, 100);
      
    } catch (error) {
      console.error('重新生成失败:', error);
      
      toast({
        title: "重新生成失败",
        description: "重新生成过程中出现错误，请重试",
        variant: "destructive"
      });
    }
  };
  
  // 获取推荐技能
  useEffect(() => {
    if (config.industry && config.position) {
      const skills = aiGenerator.getRecommendedSkills(config.industry, config.position);
      setRecommendedSkills(skills.filter(skill => !config.skills.includes(skill)));
    }
  }, [config.industry, config.position, config.skills]);
  
  return (
    <div className="space-y-6">
      {/* 头部 */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
          <Wand2 className="h-5 w-5 text-white" />
        </div>
        <div>
          <h2 className="text-2xl font-bold">AI 简历生成器</h2>
          <p className="text-muted-foreground">让AI为您创建专业简历</p>
        </div>
      </div>
      
      {/* 步骤指示器 */}
      <div className="flex items-center justify-center space-x-4">
        {[1, 2, 3].map((step) => (
          <div key={step} className="flex items-center">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
              currentStep >= step
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted text-muted-foreground'
            }`}>
              {currentStep > step ? <CheckCircle className="h-4 w-4" /> : step}
            </div>
            {step < 3 && (
              <div className={`w-12 h-0.5 mx-2 ${
                currentStep > step ? 'bg-primary' : 'bg-muted'
              }`} />
            )}
          </div>
        ))}
      </div>
      
      {/* 步骤1: 个人信息 */}
      {currentStep === 1 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              个人信息
            </CardTitle>
            <CardDescription>
              填写您的基本信息（可选，后续可以修改）
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="fullName">姓名</Label>
                <Input
                  id="fullName"
                  value={personalInfo.fullName}
                  onChange={(e) => setPersonalInfo(prev => ({ ...prev, fullName: e.target.value }))}
                  placeholder="请输入您的姓名"
                />
              </div>
              <div>
                <Label htmlFor="email">邮箱</Label>
                <Input
                  id="email"
                  type="email"
                  value={personalInfo.email}
                  onChange={(e) => setPersonalInfo(prev => ({ ...prev, email: e.target.value }))}
                  placeholder="your.email@example.com"
                />
              </div>
              <div>
                <Label htmlFor="phone">电话</Label>
                <Input
                  id="phone"
                  value={personalInfo.phone}
                  onChange={(e) => setPersonalInfo(prev => ({ ...prev, phone: e.target.value }))}
                  placeholder="138-0000-0000"
                />
              </div>
              <div>
                <Label htmlFor="location">所在地</Label>
                <Input
                  id="location"
                  value={personalInfo.location}
                  onChange={(e) => setPersonalInfo(prev => ({ ...prev, location: e.target.value }))}
                  placeholder="北京市"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="summary">职业总结（可选）</Label>
              <Textarea
                id="summary"
                value={personalInfo.summary}
                onChange={(e) => setPersonalInfo(prev => ({ ...prev, summary: e.target.value }))}
                placeholder="简要描述您的职业背景和优势..."
                rows={3}
              />
            </div>
            <div className="flex justify-end">
              <Button onClick={() => setCurrentStep(2)}>
                下一步
                <Briefcase className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
      
      {/* 步骤2: 职业配置 */}
      {currentStep === 2 && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Briefcase className="h-5 w-5" />
                职业配置
              </CardTitle>
              <CardDescription>
                选择您的目标行业和职位
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>目标行业</Label>
                  <Select value={config.industry} onValueChange={(value) => {
                    setConfig(prev => ({ ...prev, industry: value, position: '' }));
                  }}>
                    <SelectTrigger>
                      <SelectValue placeholder="选择行业" />
                    </SelectTrigger>
                    <SelectContent>
                      {INDUSTRIES.map((industry) => (
                        <SelectItem key={industry.value} value={industry.value}>
                          {industry.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>目标职位</Label>
                  <Select 
                    value={config.position} 
                    onValueChange={(value) => setConfig(prev => ({ ...prev, position: value }))}
                    disabled={!config.industry}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="选择职位" />
                    </SelectTrigger>
                    <SelectContent>
                      {getAvailablePositions().map((position) => (
                        <SelectItem key={position.value} value={position.value}>
                          {position.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>经验水平</Label>
                  <Select value={config.experience} onValueChange={(value: 'entry' | 'mid' | 'senior' | 'executive') => setConfig(prev => ({ ...prev, experience: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {EXPERIENCE_LEVELS.map((level) => (
                        <SelectItem key={level.value} value={level.value}>
                          {level.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>语调风格</Label>
                  <Select value={config.tone} onValueChange={(value: 'professional' | 'creative' | 'technical' | 'friendly') => setConfig(prev => ({ ...prev, tone: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {TONES.map((tone) => (
                        <SelectItem key={tone.value} value={tone.value}>
                          {tone.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div>
                <Label>简历长度</Label>
                <Select value={config.length} onValueChange={(value: 'concise' | 'detailed' | 'comprehensive') => setConfig(prev => ({ ...prev, length: value }))}>
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {LENGTHS.map((length) => (
                      <SelectItem key={length.value} value={length.value}>
                        {length.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                技能配置
              </CardTitle>
              <CardDescription>
                添加您掌握的技能
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input
                  value={skillInput}
                  onChange={(e) => setSkillInput(e.target.value)}
                  placeholder="输入技能名称"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      addSkill(skillInput);
                    }
                  }}
                />
                <Button onClick={() => addSkill(skillInput)} disabled={!skillInput.trim()}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              
              {config.skills.length > 0 && (
                <div>
                  <Label>已添加技能</Label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {config.skills.map((skill) => (
                      <Badge key={skill} variant="secondary" className="gap-1">
                        {skill}
                        <X 
                          className="h-3 w-3 cursor-pointer" 
                          onClick={() => removeSkill(skill)}
                        />
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
              
              {recommendedSkills.length > 0 && (
                <div>
                  <Label>推荐技能</Label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {recommendedSkills.slice(0, 8).map((skill) => (
                      <Badge 
                        key={skill} 
                        variant="outline" 
                        className="cursor-pointer hover:bg-primary hover:text-primary-foreground"
                        onClick={() => addRecommendedSkill(skill)}
                      >
                        <Plus className="h-3 w-3 mr-1" />
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
          
          <div className="flex justify-between">
            <Button variant="outline" onClick={() => setCurrentStep(1)}>
              上一步
            </Button>
            <Button 
              onClick={generateResume}
              disabled={!config.industry || !config.position || isGenerating}
              className="gap-2"
            >
              {isGenerating ? (
                <RefreshCw className="h-4 w-4 animate-spin" />
              ) : (
                <Sparkles className="h-4 w-4" />
              )}
              {isGenerating ? '生成中...' : '生成简历'}
            </Button>
          </div>
        </div>
      )}
      
      {/* 生成进度 */}
      {isGenerating && (
        <Card>
          <CardContent className="p-6">
            <div className="text-center space-y-4">
              <Sparkles className="h-12 w-12 mx-auto text-primary animate-pulse" />
              <div>
                <h3 className="text-lg font-medium">AI 正在为您生成简历...</h3>
                <p className="text-sm text-muted-foreground">请稍候，这可能需要几秒钟</p>
              </div>
              <Progress value={generationProgress} className="w-full" />
              <p className="text-xs text-muted-foreground">{generationProgress}%</p>
            </div>
          </CardContent>
        </Card>
      )}
      
      {/* 步骤3: 生成结果 */}
      {currentStep === 3 && result && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-500" />
                生成完成
              </CardTitle>
              <CardDescription>
                AI已为您生成专业简历
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary">{result.score}</div>
                  <div className="text-sm text-muted-foreground">质量评分</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600">{result.keywords.length}</div>
                  <div className="text-sm text-muted-foreground">关键词</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600">{result.suggestions.length}</div>
                  <div className="text-sm text-muted-foreground">优化建议</div>
                </div>
              </div>
              
              <div className="flex gap-3">
                <Button onClick={applyGeneratedResume} className="flex-1">
                  <CheckCircle className="mr-2 h-4 w-4" />
                  应用到编辑器
                </Button>
                <Button variant="outline" onClick={regenerate}>
                  <RefreshCw className="mr-2 h-4 w-4" />
                  重新生成
                </Button>
              </div>
            </CardContent>
          </Card>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lightbulb className="h-5 w-5" />
                  优化建议
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-48">
                  <ul className="space-y-2">
                    {result.suggestions.map((suggestion, index) => (
                      <li key={index} className="flex items-start gap-2 text-sm">
                        <AlertCircle className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
                        {suggestion}
                      </li>
                    ))}
                  </ul>
                </ScrollArea>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  关键词
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-48">
                  <div className="flex flex-wrap gap-2">
                    {result.keywords.map((keyword, index) => (
                      <Badge key={index} variant="secondary">
                        {keyword}
                      </Badge>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}

export default AIGenerator;