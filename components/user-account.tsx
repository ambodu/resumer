"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import {
  User,
  Settings,
  FileText,
  Download,
  Upload,
  Trash2,
  Edit,
  Save,
  Camera,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Briefcase,
  GraduationCap,
  Award,
  Star,
  Crown,
  Shield,
  Eye,
  EyeOff,
  LogOut,
  Plus,
  X,
  Check,
  AlertCircle,
  Clock,
  TrendingUp
} from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { useAppSelector, useAppDispatch } from '@/lib/hooks';
import { ResumeData } from '@/lib/types';

interface UserProfile {
  id: string;
  email: string;
  fullName: string;
  avatar?: string;
  phone?: string;
  location?: string;
  bio?: string;
  profession?: string;
  company?: string;
  website?: string;
  linkedIn?: string;
  github?: string;
  isPremium: boolean;
  memberSince: string;
  lastLogin: string;
  resumeCount: number;
  downloadCount: number;
  preferences: {
    theme: 'light' | 'dark' | 'auto';
    language: 'zh' | 'en';
    emailNotifications: boolean;
    autoSave: boolean;
    publicProfile: boolean;
  };
}

interface SavedResume {
  id: string;
  name: string;
  lastModified: string;
  size: number;
  isPublic: boolean;
  downloadCount: number;
  viewCount: number;
  tags: string[];
  thumbnail?: string;
  data: ResumeData;
}

interface UserAccountProps {
  onProfileUpdate?: (profile: UserProfile) => void;
  onResumeSelect?: (resume: SavedResume) => void;
}

// 模拟用户数据
const MOCK_USER: UserProfile = {
  id: '1',
  email: 'user@example.com',
  fullName: '张三',
  avatar: '/avatars/user.jpg',
  phone: '138-0000-0000',
  location: '北京市',
  bio: '资深前端工程师，专注于React和TypeScript开发',
  profession: '前端工程师',
  company: '科技有限公司',
  website: 'https://example.com',
  linkedIn: 'https://linkedin.com/in/zhangsan',
  github: 'https://github.com/zhangsan',
  isPremium: true,
  memberSince: '2023-01-15',
  lastLogin: '2024-01-25',
  resumeCount: 5,
  downloadCount: 23,
  preferences: {
    theme: 'auto',
    language: 'zh',
    emailNotifications: true,
    autoSave: true,
    publicProfile: false
  }
};

// 模拟保存的简历
const MOCK_RESUMES: SavedResume[] = [
  {
    id: '1',
    name: '前端工程师简历',
    lastModified: '2024-01-25',
    size: 1024,
    isPublic: false,
    downloadCount: 12,
    viewCount: 45,
    tags: ['前端', 'React', 'TypeScript'],
    data: {} as ResumeData
  },
  {
    id: '2',
    name: '全栈开发简历',
    lastModified: '2024-01-20',
    size: 1536,
    isPublic: true,
    downloadCount: 8,
    viewCount: 32,
    tags: ['全栈', 'Node.js', 'MongoDB'],
    data: {} as ResumeData
  },
  {
    id: '3',
    name: '项目经理简历',
    lastModified: '2024-01-18',
    size: 896,
    isPublic: false,
    downloadCount: 3,
    viewCount: 15,
    tags: ['管理', '项目', 'Agile'],
    data: {} as ResumeData
  }
];

export function UserAccount({ onProfileUpdate, onResumeSelect }: UserAccountProps) {
  const { toast } = useToast();
  
  // 状态管理
  const [user, setUser] = useState<UserProfile>(MOCK_USER);
  const [savedResumes, setSavedResumes] = useState<SavedResume[]>(MOCK_RESUMES);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState<Partial<UserProfile>>(user);
  const [showPassword, setShowPassword] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');
  const [selectedResume, setSelectedResume] = useState<SavedResume | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  // 更新个人资料
  const updateProfile = async () => {
    setIsLoading(true);
    
    try {
      // 模拟API调用
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const updatedUser = { ...user, ...editForm };
      setUser(updatedUser);
      setIsEditing(false);
      onProfileUpdate?.(updatedUser);
      
      toast({
        title: "个人资料已更新",
        description: "您的个人资料已成功保存"
      });
    } catch (error) {
      toast({
        title: "更新失败",
        description: "个人资料更新失败，请重试",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  // 删除简历
  const deleteResume = async (resumeId: string) => {
    try {
      setSavedResumes(prev => prev.filter(resume => resume.id !== resumeId));
      
      toast({
        title: "简历已删除",
        description: "简历已从您的账户中删除"
      });
    } catch (error) {
      toast({
        title: "删除失败",
        description: "简历删除失败，请重试",
        variant: "destructive"
      });
    }
  };
  
  // 切换简历公开状态
  const toggleResumePublic = async (resumeId: string) => {
    setSavedResumes(prev => prev.map(resume => 
      resume.id === resumeId 
        ? { ...resume, isPublic: !resume.isPublic }
        : resume
    ));
    
    toast({
      title: "设置已更新",
      description: "简历公开状态已更新"
    });
  };
  
  // 导出简历
  const exportResume = async (resume: SavedResume) => {
    try {
      // 模拟导出
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // 更新下载计数
      setSavedResumes(prev => prev.map(r => 
        r.id === resume.id 
          ? { ...r, downloadCount: r.downloadCount + 1 }
          : r
      ));
      
      toast({
        title: "导出成功",
        description: `"${resume.name}" 已导出为PDF`
      });
    } catch (error) {
      toast({
        title: "导出失败",
        description: "简历导出失败，请重试",
        variant: "destructive"
      });
    }
  };
  
  // 格式化文件大小
  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };
  
  // 格式化日期
  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('zh-CN');
  };
  
  return (
    <div className="space-y-6">
      {/* 头部 */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-blue-500 rounded-xl flex items-center justify-center">
          <User className="h-5 w-5 text-white" />
        </div>
        <div>
          <h2 className="text-2xl font-bold">我的账户</h2>
          <p className="text-muted-foreground">管理个人资料和简历</p>
        </div>
      </div>
      
      {/* 用户信息卡片 */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <Avatar className="w-16 h-16">
              <AvatarImage src={user.avatar} alt={user.fullName} />
              <AvatarFallback>{user.fullName.charAt(0)}</AvatarFallback>
            </Avatar>
            
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="text-xl font-semibold">{user.fullName}</h3>
                {user.isPremium && (
                  <Badge className="bg-yellow-500 text-yellow-900">
                    <Crown className="h-3 w-3 mr-1" />
                    高级会员
                  </Badge>
                )}
              </div>
              <p className="text-muted-foreground mb-2">{user.profession} @ {user.company}</p>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Mail className="h-4 w-4" />
                  {user.email}
                </div>
                <div className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  {user.location}
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  加入于 {formatDate(user.memberSince)}
                </div>
              </div>
            </div>
            
            <div className="text-right">
              <div className="grid grid-cols-2 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-primary">{user.resumeCount}</div>
                  <div className="text-xs text-muted-foreground">简历数量</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-green-600">{user.downloadCount}</div>
                  <div className="text-xs text-muted-foreground">下载次数</div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* 主要内容 */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="profile">个人资料</TabsTrigger>
          <TabsTrigger value="resumes">我的简历</TabsTrigger>
          <TabsTrigger value="settings">账户设置</TabsTrigger>
          <TabsTrigger value="stats">统计数据</TabsTrigger>
        </TabsList>
        
        {/* 个人资料 */}
        <TabsContent value="profile" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>个人信息</CardTitle>
                  <CardDescription>管理您的个人资料信息</CardDescription>
                </div>
                <Button 
                  variant={isEditing ? "default" : "outline"}
                  onClick={() => {
                    if (isEditing) {
                      updateProfile();
                    } else {
                      setIsEditing(true);
                      setEditForm(user);
                    }
                  }}
                  disabled={isLoading}
                  className="gap-2"
                >
                  {isEditing ? (
                    <>
                      <Save className="h-4 w-4" />
                      {isLoading ? '保存中...' : '保存'}
                    </>
                  ) : (
                    <>
                      <Edit className="h-4 w-4" />
                      编辑
                    </>
                  )}
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="fullName">姓名</Label>
                  <Input
                    id="fullName"
                    value={isEditing ? editForm.fullName || '' : user.fullName}
                    onChange={(e) => setEditForm(prev => ({ ...prev, fullName: e.target.value }))}
                    disabled={!isEditing}
                  />
                </div>
                <div>
                  <Label htmlFor="email">邮箱</Label>
                  <Input
                    id="email"
                    type="email"
                    value={isEditing ? editForm.email || '' : user.email}
                    onChange={(e) => setEditForm(prev => ({ ...prev, email: e.target.value }))}
                    disabled={!isEditing}
                  />
                </div>
                <div>
                  <Label htmlFor="phone">电话</Label>
                  <Input
                    id="phone"
                    value={isEditing ? editForm.phone || '' : user.phone || ''}
                    onChange={(e) => setEditForm(prev => ({ ...prev, phone: e.target.value }))}
                    disabled={!isEditing}
                  />
                </div>
                <div>
                  <Label htmlFor="location">所在地</Label>
                  <Input
                    id="location"
                    value={isEditing ? editForm.location || '' : user.location || ''}
                    onChange={(e) => setEditForm(prev => ({ ...prev, location: e.target.value }))}
                    disabled={!isEditing}
                  />
                </div>
                <div>
                  <Label htmlFor="profession">职业</Label>
                  <Input
                    id="profession"
                    value={isEditing ? editForm.profession || '' : user.profession || ''}
                    onChange={(e) => setEditForm(prev => ({ ...prev, profession: e.target.value }))}
                    disabled={!isEditing}
                  />
                </div>
                <div>
                  <Label htmlFor="company">公司</Label>
                  <Input
                    id="company"
                    value={isEditing ? editForm.company || '' : user.company || ''}
                    onChange={(e) => setEditForm(prev => ({ ...prev, company: e.target.value }))}
                    disabled={!isEditing}
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="bio">个人简介</Label>
                <Textarea
                  id="bio"
                  value={isEditing ? editForm.bio || '' : user.bio || ''}
                  onChange={(e) => setEditForm(prev => ({ ...prev, bio: e.target.value }))}
                  disabled={!isEditing}
                  rows={3}
                  placeholder="简要介绍您的职业背景和专长..."
                />
              </div>
              
              <Separator />
              
              <div className="space-y-4">
                <h4 className="font-medium">社交链接</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="website">个人网站</Label>
                    <Input
                      id="website"
                      value={isEditing ? editForm.website || '' : user.website || ''}
                      onChange={(e) => setEditForm(prev => ({ ...prev, website: e.target.value }))}
                      disabled={!isEditing}
                      placeholder="https://example.com"
                    />
                  </div>
                  <div>
                    <Label htmlFor="linkedIn">LinkedIn</Label>
                    <Input
                      id="linkedIn"
                      value={isEditing ? editForm.linkedIn || '' : user.linkedIn || ''}
                      onChange={(e) => setEditForm(prev => ({ ...prev, linkedIn: e.target.value }))}
                      disabled={!isEditing}
                      placeholder="https://linkedin.com/in/username"
                    />
                  </div>
                  <div>
                    <Label htmlFor="github">GitHub</Label>
                    <Input
                      id="github"
                      value={isEditing ? editForm.github || '' : user.github || ''}
                      onChange={(e) => setEditForm(prev => ({ ...prev, github: e.target.value }))}
                      disabled={!isEditing}
                      placeholder="https://github.com/username"
                    />
                  </div>
                </div>
              </div>
              
              {isEditing && (
                <div className="flex gap-2 pt-4">
                  <Button onClick={updateProfile} disabled={isLoading}>
                    保存更改
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      setIsEditing(false);
                      setEditForm(user);
                    }}
                    disabled={isLoading}
                  >
                    取消
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* 我的简历 */}
        <TabsContent value="resumes" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>我的简历</CardTitle>
                  <CardDescription>管理您保存的简历</CardDescription>
                </div>
                <Button className="gap-2">
                  <Plus className="h-4 w-4" />
                  新建简历
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {savedResumes.map((resume) => (
                  <Card key={resume.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center text-white font-bold">
                            {resume.name.charAt(0)}
                          </div>
                          <div>
                            <h4 className="font-medium">{resume.name}</h4>
                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                              <span>修改于 {formatDate(resume.lastModified)}</span>
                              <span>{formatFileSize(resume.size)}</span>
                              <div className="flex items-center gap-1">
                                <Eye className="h-3 w-3" />
                                {resume.viewCount}
                              </div>
                              <div className="flex items-center gap-1">
                                <Download className="h-3 w-3" />
                                {resume.downloadCount}
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <div className="flex flex-wrap gap-1">
                            {resume.tags.slice(0, 3).map((tag) => (
                              <Badge key={tag} variant="secondary" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                          
                          <Badge variant={resume.isPublic ? "default" : "outline"}>
                            {resume.isPublic ? '公开' : '私有'}
                          </Badge>
                          
                          <div className="flex gap-1">
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => onResumeSelect?.(resume)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => exportResume(resume)}
                            >
                              <Download className="h-4 w-4" />
                            </Button>
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => toggleResumePublic(resume.id)}
                            >
                              {resume.isPublic ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </Button>
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => deleteResume(resume.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
                
                {savedResumes.length === 0 && (
                  <div className="text-center py-12">
                    <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-medium mb-2">暂无保存的简历</h3>
                    <p className="text-muted-foreground mb-4">
                      开始创建您的第一份简历
                    </p>
                    <Button>
                      <Plus className="h-4 w-4 mr-2" />
                      新建简历
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* 账户设置 */}
        <TabsContent value="settings" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>偏好设置</CardTitle>
              <CardDescription>自定义您的使用体验</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>邮件通知</Label>
                    <p className="text-sm text-muted-foreground">接收重要更新和提醒</p>
                  </div>
                  <Button 
                    variant={user.preferences.emailNotifications ? "default" : "outline"}
                    size="sm"
                    onClick={() => {
                      const newPrefs = {
                        ...user.preferences,
                        emailNotifications: !user.preferences.emailNotifications
                      };
                      setUser(prev => ({ ...prev, preferences: newPrefs }));
                    }}
                  >
                    {user.preferences.emailNotifications ? '已开启' : '已关闭'}
                  </Button>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label>自动保存</Label>
                    <p className="text-sm text-muted-foreground">编辑时自动保存简历</p>
                  </div>
                  <Button 
                    variant={user.preferences.autoSave ? "default" : "outline"}
                    size="sm"
                    onClick={() => {
                      const newPrefs = {
                        ...user.preferences,
                        autoSave: !user.preferences.autoSave
                      };
                      setUser(prev => ({ ...prev, preferences: newPrefs }));
                    }}
                  >
                    {user.preferences.autoSave ? '已开启' : '已关闭'}
                  </Button>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label>公开个人资料</Label>
                    <p className="text-sm text-muted-foreground">允许其他用户查看您的资料</p>
                  </div>
                  <Button 
                    variant={user.preferences.publicProfile ? "default" : "outline"}
                    size="sm"
                    onClick={() => {
                      const newPrefs = {
                        ...user.preferences,
                        publicProfile: !user.preferences.publicProfile
                      };
                      setUser(prev => ({ ...prev, preferences: newPrefs }));
                    }}
                  >
                    {user.preferences.publicProfile ? '公开' : '私有'}
                  </Button>
                </div>
              </div>
              
              <Separator />
              
              <div className="space-y-4">
                <h4 className="font-medium text-red-600">危险操作</h4>
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    以下操作不可逆，请谨慎操作
                  </AlertDescription>
                </Alert>
                
                <div className="flex gap-2">
                  <Button variant="destructive" size="sm">
                    <Trash2 className="h-4 w-4 mr-2" />
                    删除所有简历
                  </Button>
                  <Button variant="destructive" size="sm">
                    <LogOut className="h-4 w-4 mr-2" />
                    注销账户
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* 统计数据 */}
        <TabsContent value="stats" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  简历统计
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">总数量</span>
                    <span className="font-medium">{user.resumeCount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">公开简历</span>
                    <span className="font-medium">{savedResumes.filter(r => r.isPublic).length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">私有简历</span>
                    <span className="font-medium">{savedResumes.filter(r => !r.isPublic).length}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  下载统计
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">总下载量</span>
                    <span className="font-medium">{user.downloadCount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">本月下载</span>
                    <span className="font-medium">8</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">平均评分</span>
                    <span className="font-medium flex items-center gap-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      4.8
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  活动统计
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">最后登录</span>
                    <span className="font-medium">{formatDate(user.lastLogin)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">会员时长</span>
                    <span className="font-medium">1年2个月</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">会员等级</span>
                    <span className="font-medium flex items-center gap-1">
                      {user.isPremium ? (
                        <>
                          <Crown className="h-4 w-4 text-yellow-500" />
                          高级会员
                        </>
                      ) : (
                        '普通会员'
                      )}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default UserAccount;