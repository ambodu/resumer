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
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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
  // Palette, // 临时移除
  TrendingUp,
  Users,
  Award,
  Zap,
  Crown,
  CheckCircle,
  Clock,
  ThumbsUp,
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useAppState } from "@/lib/app-hooks";
import { ResumeData } from "@/lib/types";

interface Template {
  id: string;
  name: string;
  description: string;
  category: string;
  industry: string[];
  level: "entry" | "mid" | "senior" | "executive";
  style: "modern" | "classic" | "creative" | "minimal" | "professional";
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
    id: "1",
    name: "现代简约",
    description: "简洁现代的设计风格，适合技术岗位",
    category: "modern",
    industry: ["technology", "software"],
    level: "mid",
    style: "modern",
    color: "#3B82F6",
    isPremium: false,
    rating: 4.8,
    downloads: 1250,
    likes: 89,
    tags: ["简约", "现代", "技术"],
    preview: "/templates/modern-simple-preview.jpg",
    thumbnail: "/templates/modern-simple-thumb.jpg",
    author: {
      name: "Design Studio",
      avatar: "/avatars/design-studio.jpg",
      verified: true,
    },
    createdAt: "2024-01-15",
    updatedAt: "2024-01-20",
    data: {
      personalInfo: {
        fullName: "",
        email: "",
        phone: "",
        location: "",
        summary: "",
      },
    },
  },
  {
    id: "2",
    name: "创意设计",
    description: "富有创意的设计，展现个人风格",
    category: "creative",
    industry: ["design", "marketing"],
    level: "senior",
    style: "creative",
    color: "#8B5CF6",
    isPremium: true,
    rating: 4.9,
    downloads: 890,
    likes: 156,
    tags: ["创意", "设计", "个性"],
    preview: "/templates/creative-designer-preview.jpg",
    thumbnail: "/templates/creative-designer-thumb.jpg",
    author: {
      name: "Creative Pro",
      avatar: "/avatars/creative-pro.jpg",
      verified: true,
    },
    createdAt: "2024-01-10",
    updatedAt: "2024-01-18",
    data: {
      personalInfo: {
        fullName: "",
        email: "",
        phone: "",
        location: "",
        summary: "",
      },
    },
  },
];

const CATEGORIES = [
  { value: "all", label: "全部", icon: null },
  { value: "modern", label: "现代", icon: Zap },
  { value: "creative", label: "创意", icon: Zap },
  { value: "professional", label: "专业", icon: Briefcase },
  { value: "minimal", label: "极简", icon: Award },
];

export function TemplateMarket({ onTemplateSelect }: TemplateMarketProps) {
  const { actions } = useAppState();
  const { toast } = useToast();

  // 状态管理
  const [templates, setTemplates] = useState<Template[]>(MOCK_TEMPLATES);
  const [filteredTemplates, setFilteredTemplates] =
    useState<Template[]>(MOCK_TEMPLATES);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  // 过滤模板
  useEffect(() => {
    let filtered = templates.filter((template) => {
      const matchesSearch =
        template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        template.description
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        template.tags.some((tag) =>
          tag.toLowerCase().includes(searchQuery.toLowerCase())
        );

      const matchesCategory =
        selectedCategory === "all" || template.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });

    setFilteredTemplates(filtered);
  }, [templates, searchQuery, selectedCategory]);

  // 使用模板
  const handleUseTemplate = React.useCallback(
    (template: Template) => {
      actions.setCurrentResume(template.data as ResumeData);
      onTemplateSelect?.(template);

      toast({
        title: "模板已应用",
        description: `"${template.name}" 模板已应用到编辑器中`,
      });
    },
    [actions, onTemplateSelect, toast]
  );

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
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="搜索模板..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="选择分类" />
          </SelectTrigger>
          <SelectContent>
            {CATEGORIES.map((category) => (
              <SelectItem key={category.value} value={category.value}>
                <div className="flex items-center gap-2">
                  {category.icon && <category.icon className="h-4 w-4" />}
                  {category.label}
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* 模板网格 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTemplates.map((template) => (
          <Card
            key={template.id}
            className="group hover:shadow-lg transition-shadow"
          >
            <CardHeader className="p-0">
              <div className="relative aspect-[3/4] bg-gray-100 rounded-t-lg overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-white rounded-lg shadow-sm flex items-center justify-center mx-auto mb-2">
                      <Award className="h-8 w-8 text-gray-400" />
                    </div>
                    <p className="text-sm text-gray-500">模板预览</p>
                  </div>
                </div>
                {template.isPremium && (
                  <Badge className="absolute top-2 right-2 bg-blue-500 text-white">
                    <Crown className="h-3 w-3 mr-1" />
                    Premium
                  </Badge>
                )}
              </div>
            </CardHeader>
            <CardContent className="p-4">
              <div className="space-y-3">
                <div>
                  <h3 className="font-semibold text-lg">{template.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    {template.description}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm font-medium">
                      {template.rating}
                    </span>
                  </div>
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <Download className="h-4 w-4" />
                    <span className="text-sm">{template.downloads}</span>
                  </div>
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <Heart className="h-4 w-4" />
                    <span className="text-sm">{template.likes}</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-1">
                  {template.tags.slice(0, 3).map((tag) => (
                    <Badge key={tag} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>

                <Button
                  onClick={() => handleUseTemplate(template)}
                  className="w-full"
                  variant={template.isPremium ? "default" : "outline"}
                >
                  {template.isPremium ? "升级使用" : "使用模板"}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredTemplates.length === 0 && (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-4">
            <Search className="h-8 w-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold mb-2">未找到匹配的模板</h3>
          <p className="text-muted-foreground">
            尝试调整搜索条件或浏览其他分类
          </p>
        </div>
      )}
    </div>
  );
}

export default TemplateMarket;
