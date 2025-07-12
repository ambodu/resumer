"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import {
  Search,
  Filter,
  Star,
  Download,
  Eye,
  Heart,
  Share2,
  Briefcase,
  GraduationCap,
  Code,
  Palette,
  TrendingUp,
  Users,
  Award,
  Zap,
  Crown,
  CheckCircle,
  Clock,
  ThumbsUp
} from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { useAppDispatch } from '@/lib/hooks';
import { setCurrentResume } from '@/lib/store';
import { ResumeData } from '@/lib/types';

interface Template {
  id: string;
  name: string;
  description: string;
  category: string;
  industry: string[];
  level: 'entry' | 'mid' | 'senior' | 'executive';
  style: 'modern' | 'classic' | 'creative' | 'minimal' | 'professional';
  color: string;
  isPremium: boolean;
  rating: number;
  downloads: number;
  likes: number;
  tags: string[];
  preview: string;
  thumbnail: string;
  author: {
    name: string;
    avatar: string;
    verified: boolean;
  };
  createdAt: string;
  updatedAt: string;
  data: Partial<ResumeData>;
}

interface TemplateMarketProps {
  onTemplateSelect?: (template: Template) => void;
}

// 模拟模板数据
const MOCK_TEMPLATES: Template[] = [
  {
    id: '1',
    name: '现代简约',
    description: '简洁现代的设计风格，适合技术岗位',
    category: 'modern',
    industry: ['technology', 'software'],
    level: 'mid',
    style: 'modern',
    color: '#3B82F6',
    isPremium: false,
    rating: 4.8,
    downloads: 1250,
    likes: 89,
    tags: ['简洁', '现代', '技术'],
    preview: '/templates/modern-simple-preview.jpg',
    thumbnail: '/templates/modern-simple-thumb.jpg',
    author: {
      name: 'Design Studio',
      avatar: '/avatars/design-studio.jpg',
      verified: true
    },
    createdAt: '2024-01-15',
    updatedAt: '2024-01-20',
    data: {
      personalInfo: {
        fullName: '',
        email: '',
        phone: '',
        location: '',
        summary: ''
      }
    }
  },
  {
    id: '2',
    name: '创意设计师',
    description: '富有创意的设计，展现个人风格',
    category: 'creative',
    industry: ['design', 'marketing'],
    level: 'senior',
    style: 'creative',
    color: '#8B5CF6',
    isPremium: true,
    rating: 4.9,
    downloads: 890,
    likes: 156,
    tags: ['创意', '设计', '个性'],
    preview: '/templates/creative-designer-preview.jpg',
    thumbnail: '/templates/creative-designer-thumb.jpg',
    author: {
      name: 'Creative Pro',
      avatar: '/avatars/creative-pro.jpg',
      verified: true
    },
    createdAt: '2024-01-10',
    updatedAt: '2024-01-18',
    data: {
      personalInfo: {
        fullName: '',
        email: '',
        phone: '',
        location: '',
        summary: ''
      }
    }
  },
  {
    id: '3',
    name: '商务专业',
    description: '正式商务风格，适合管理岗位',
    category: 'professional',
    industry: ['business', 'finance'],
    level: 'executive',
    style: 'professional',
    color: '#059669',
    isPremium: false,
    rating: 4.7,
    downloads: 2100,
    likes: 203,
    tags: ['商务', '专业', '管理'],
    preview: '/templates/business-professional-preview.jpg',
    thumbnail: '/templates/business-professional-thumb.jpg',
    author: {
      name: 'Business Templates',
      avatar: '/avatars/business-templates.jpg',
      verified: true
    },
    createdAt: '2024-01-05',
    updatedAt: '2024-01-15',
    data: {
      personalInfo: {
        fullName: '',
        email: '',
        phone: '',
        location: '',
        summary: ''
      }
    }
  },
  {
    id: '4',
    name: '极简主义',
    description: '极简设计理念，突出内容本身',
    category: 'minimal',
    industry: ['technology', 'consulting'],
    level: 'entry',
    style: 'minimal',
    color: '#6B7280',
    isPremium: false,
    rating: 4.6,
    downloads: 1680,
    likes: 124,
    tags: ['极简', '清爽', '内容'],
    preview: '/templates/minimal-preview.jpg',
    thumbnail: '/templates/minimal-thumb.jpg',
    author: {
      name: 'Minimal Design',
      avatar: '/avatars/minimal-design.jpg',
      verified: false
    },
    createdAt: '2024-01-12',
    updatedAt: '2024-01-22',
    data: {
      personalInfo: {
        fullName: '',
        email: '',
        phone: '',
        location: '',
        summary: ''
      }
    }
  }
];

const CATEGORIES = [
  { value: 'all', label: '全部', icon: null },
  { value: 'modern', label: '现代', icon: Zap },
  { value: 'creative', label: '创意', icon: Palette },
  { value: 'professional', label: '专业', icon: Briefcase },
  { value: 'minimal', label: '极简', icon: Award }
];

const INDUSTRIES = [
  { value: 'all', label: '全部行业' },
  { value: 'technology', label: '科技' },
  { value: 'design', label: '设计' },
  { value: 'business', label: '商务' },
  { value: 'marketing', label: '营销' },
  { value: 'finance', label: '金融' },
  { value: 'consulting', label: '咨询' }
];

const LEVELS = [
  { value: 'all', label: '全部级别' },
  { value: 'entry', label: '初级' },
  { value: 'mid', label: '中级' },
  { value: 'senior', label: '高级' },
  { value: 'executive', label: '专家' }
];

const SORT_OPTIONS = [
  { value: 'popular', label: '最受欢迎' },
  { value: 'newest', label: '最新发布' },
  { value: 'rating', label: '评分最高' },
  { value: 'downloads', label: '下载最多' }
];

export function TemplateMarket({ onTemplateSelect }: TemplateMarketProps) {
  const dispatch = useAppDispatch();
  const { toast } = useToast();
  
  // 状态管理
  const [templates, setTemplates] = useState<Template[]>(MOCK_TEMPLATES);
  const [filteredTemplates, setFilteredTemplates] = useState<Template[]>(MOCK_TEMPLATES);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedIndustry, setSelectedIndustry] = useState('all');
  const [selectedLevel, setSelectedLevel] = useState('all');
  const [sortBy, setSortBy] = useState('popular');
  const [showPremiumOnly, setShowPremiumOnly] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [likedTemplates, setLikedTemplates] = useState<Set<string>>(new Set());
  
  // 过滤和排序模板
  useEffect(() => {
    let filtered = templates.filter(template => {
      const matchesSearch = template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           template.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           template.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
      
      const matchesCategory = selectedCategory === 'all' || template.category === selectedCategory;
      const matchesIndustry = selectedIndustry === 'all' || template.industry.includes(selectedIndustry);
      const matchesLevel = selectedLevel === 'all' || template.level === selectedLevel;
      const matchesPremium = !showPremiumOnly || template.isPremium;
      
      return matchesSearch && matchesCategory && matchesIndustry && matchesLevel && matchesPremium;
    });
    
    // 排序
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case 'rating':
          return b.rating - a.rating;
        case 'downloads':
          return b.downloads - a.downloads;
        case 'popular':
        default:
          return (b.downloads + b.likes * 10) - (a.downloads + a.likes * 10);
      }
    });
    
    setFilteredTemplates(filtered);
  }, [templates, searchQuery, selectedCategory, selectedIndustry, selectedLevel, sortBy, showPremiumOnly]);
  
  // 使用模板
  const useTemplate = (template: Template) => {
    dispatch(setCurrentResume(template.data as ResumeData));
    onTemplateSelect?.(template);
    
    // 更新下载数
    setTemplates(prev => prev.map(t => 
      t.id === template.id 
        ? { ...t, downloads: t.downloads + 1 }
        : t
    ));
    
    toast({
      title: "模板已应用",
      description: `"${template.name}" 模板已应用到编辑器中`
    });
  };
  
  // 点赞模板
  const toggleLike = (templateId: string) => {
    const isLiked = likedTemplates.has(templateId);
    
    if (isLiked) {
      setLikedTemplates(prev => {
        const newSet = new Set(prev);
        newSet.delete(templateId);
        return newSet;
      });
    } else {
      setLikedTemplates(prev => new Set([...prev, templateId]));
    }
    
    // 更新点赞数
    setTemplates(prev => prev.map(t => 
      t.id === templateId 
        ? { ...t, likes: isLiked ? t.likes - 1 : t.likes + 1 }
        : t
    ));
  };
  
  // 获取分类图标
  const getCategoryIcon = (category: string) => {
    const categoryData = CATEGORIES.find(c => c.value === category);
    return categoryData?.icon;
  };
  
  return (
    <div className="space-y-6">
      {/* 头部 */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center">
          <Award className="h-5 w-5 text-white" />
        </div>
        <div>
          <h2 className="text-2xl font-bold">模板市场</h2>
          <p className="text-muted-foreground">选择专业模板，快速创建简历</p>
        </div>
      </div>
      
      {/* 搜索和过滤 */}
      <Card>
        <CardContent className="p-6">
          <div className="space-y-4">
            {/* 搜索框 */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="搜索模板名称、描述或标签..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            
            {/* 过滤器 */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Select value={selectedIndustry} onValueChange={setSelectedIndustry}>
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
              
              <Select value={selectedLevel} onValueChange={setSelectedLevel}>
                <SelectTrigger>
                  <SelectValue placeholder="选择级别" />
                </SelectTrigger>
                <SelectContent>
                  {LEVELS.map((level) => (
                    <SelectItem key={level.value} value={level.value}>
                      {level.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger>
                  <SelectValue placeholder="排序方式" />
                </SelectTrigger>
                <SelectContent>
                  {SORT_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Button
                variant={showPremiumOnly ? "default" : "outline"}
                onClick={() => setShowPremiumOnly(!showPremiumOnly)}
                className="gap-2"
              >
                <Crown className="h-4 w-4" />
                {showPremiumOnly ? '显示全部' : '仅高级'}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* 分类标签 */}
      <Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
        <TabsList className="grid w-full grid-cols-5">
          {CATEGORIES.map((category) => {
            const Icon = category.icon;
            return (
              <TabsTrigger key={category.value} value={category.value} className="gap-2">
                {Icon && <Icon className="h-4 w-4" />}
                {category.label}
              </TabsTrigger>
            );
          })}
        </TabsList>
      </Tabs>
      
      {/* 模板网格 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTemplates.map((template) => {
          const CategoryIcon = getCategoryIcon(template.category);
          const isLiked = likedTemplates.has(template.id);
          
          return (
            <Card key={template.id} className="group hover:shadow-lg transition-all duration-200">
              <CardHeader className="p-0">
                <div className="relative">
                  {/* 模板缩略图 */}
                  <div 
                    className="w-full h-48 bg-gradient-to-br rounded-t-lg flex items-center justify-center text-white font-bold text-lg"
                    style={{ background: `linear-gradient(135deg, ${template.color}, ${template.color}80)` }}
                  >
                    {template.name}
                  </div>
                  
                  {/* 高级标识 */}
                  {template.isPremium && (
                    <Badge className="absolute top-2 right-2 bg-yellow-500 text-yellow-900">
                      <Crown className="h-3 w-3 mr-1" />
                      高级
                    </Badge>
                  )}
                  
                  {/* 悬停操作 */}
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 rounded-t-lg flex items-center justify-center gap-2">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button size="sm" variant="secondary">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-4xl">
                        <DialogHeader>
                          <DialogTitle>{template.name}</DialogTitle>
                          <DialogDescription>{template.description}</DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div 
                            className="w-full h-96 bg-gradient-to-br rounded-lg flex items-center justify-center text-white font-bold text-2xl"
                            style={{ background: `linear-gradient(135deg, ${template.color}, ${template.color}80)` }}
                          >
                            {template.name} 预览
                          </div>
                          <div className="flex justify-end gap-2">
                            <Button variant="outline" onClick={() => setSelectedTemplate(null)}>
                              关闭
                            </Button>
                            <Button onClick={() => useTemplate(template)}>
                              使用此模板
                            </Button>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                    
                    <Button 
                      size="sm" 
                      variant={isLiked ? "default" : "secondary"}
                      onClick={() => toggleLike(template.id)}
                    >
                      <Heart className={`h-4 w-4 ${isLiked ? 'fill-current' : ''}`} />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="p-4">
                <div className="space-y-3">
                  {/* 模板信息 */}
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="font-semibold">{template.name}</h3>
                      <div className="flex items-center gap-1">
                        {CategoryIcon && <CategoryIcon className="h-4 w-4 text-muted-foreground" />}
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {template.description}
                    </p>
                  </div>
                  
                  {/* 标签 */}
                  <div className="flex flex-wrap gap-1">
                    {template.tags.slice(0, 3).map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  
                  {/* 统计信息 */}
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1">
                        <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                        {template.rating}
                      </div>
                      <div className="flex items-center gap-1">
                        <Download className="h-3 w-3" />
                        {template.downloads}
                      </div>
                      <div className="flex items-center gap-1">
                        <Heart className="h-3 w-3" />
                        {template.likes}
                      </div>
                    </div>
                    
                    {/* 作者信息 */}
                    <div className="flex items-center gap-1">
                      <div className="w-5 h-5 bg-gray-300 rounded-full" />
                      <span className="text-xs">{template.author.name}</span>
                      {template.author.verified && (
                        <CheckCircle className="h-3 w-3 text-blue-500" />
                      )}
                    </div>
                  </div>
                  
                  {/* 操作按钮 */}
                  <div className="flex gap-2 pt-2">
                    <Button 
                      className="flex-1" 
                      onClick={() => useTemplate(template)}
                      disabled={template.isPremium}
                    >
                      {template.isPremium ? '需要高级版' : '使用模板'}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
      
      {/* 空状态 */}
      {filteredTemplates.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">未找到匹配的模板</h3>
            <p className="text-muted-foreground mb-4">
              尝试调整搜索条件或过滤器
            </p>
            <Button 
              variant="outline" 
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('all');
                setSelectedIndustry('all');
                setSelectedLevel('all');
                setShowPremiumOnly(false);
              }}
            >
              清除所有过滤器
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

export default TemplateMarket;