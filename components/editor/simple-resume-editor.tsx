"use client";

import React, { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import {
  Save,
  Download,
  Plus,
  Trash2,
  User,
  Briefcase,
  GraduationCap,
  Code,
} from "lucide-react";
import { useAppState } from "@/lib/app-hooks";
import { pdfGenerator } from "@/lib/pdf-generator";

export function SimpleResumeEditor() {
  const { currentResume, actions, hasUnsavedChanges, isSaving } = useAppState();
  const [activeSection, setActiveSection] = useState("personal");

  const handleSave = useCallback(async () => {
    if (!currentResume) return;
    try {
      await actions.saveResume("当前简历");
      toast.success("保存成功");
    } catch (error) {
      toast.error("保存失败");
    }
  }, [currentResume, actions]);

  const handleDownload = useCallback(async () => {
    if (!currentResume) {
      toast.error("没有简历数据可导出");
      return;
    }
    
    try {
      // 使用新的pdfmake生成器直接从数据生成PDF
      await pdfGenerator.generatePDFFromData(
        currentResume,
        `${currentResume.personalInfo?.name || "简历"}.pdf`
      );
      toast.success("PDF下载成功");
    } catch (error) {
      console.error("PDF生成失败:", error);
      toast.error("PDF生成失败，请重试");
    }
  }, [currentResume]);

  if (!currentResume) {
    return <div className="p-8 text-center">加载中...</div>;
  }

  const sections = [
    { id: "personal", label: "个人信息", icon: User },
    { id: "experience", label: "工作经历", icon: Briefcase },
    { id: "education", label: "教育背景", icon: GraduationCap },
    { id: "skills", label: "技能", icon: Code },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full">
      {/* 编辑区域 */}
      <div className="space-y-6">
        {/* 头部工具栏 */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>简历编辑器</CardTitle>
              <div className="flex gap-2">
                <Button
                  onClick={handleSave}
                  disabled={!hasUnsavedChanges || isSaving}
                  size="sm"
                >
                  <Save className="h-4 w-4 mr-2" />
                  {isSaving ? "保存中..." : "保存"}
                </Button>
                <Button onClick={handleDownload} variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  下载PDF
                </Button>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* 导航标签 */}
        <div className="flex gap-2 overflow-x-auto">
          {sections.map((section) => {
            const IconComponent = section.icon;
            return (
              <Button
                key={section.id}
                variant={activeSection === section.id ? "default" : "outline"}
                onClick={() => setActiveSection(section.id)}
                className="flex-shrink-0"
                size="sm"
              >
                <IconComponent className="h-4 w-4 mr-2" />
                {section.label}
              </Button>
            );
          })}
        </div>

        {/* 编辑表单 */}
        <Card>
          <CardContent className="p-6">
            {activeSection === "personal" && (
              <PersonalInfoEditor
                data={currentResume.personalInfo}
                onChange={(data) => actions.updatePersonalInfo(data)}
              />
            )}
            {activeSection === "experience" && (
              <ExperienceEditor
                data={currentResume.experience}
                onChange={(data) => actions.updateExperience(data)}
              />
            )}
            {activeSection === "education" && (
              <EducationEditor
                data={currentResume.education}
                onChange={(data) => actions.updateEducation(data)}
              />
            )}
            {activeSection === "skills" && (
              <SkillsEditor
                data={currentResume.skills}
                onChange={(data) => actions.updateSkills(data)}
              />
            )}
          </CardContent>
        </Card>
      </div>

      {/* 预览区域 */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h3 className="text-lg font-semibold mb-4">预览</h3>
        <div id="resume-preview" className="space-y-6">
          <ResumePreview data={currentResume} />
        </div>
      </div>
    </div>
  );
}

// 个人信息编辑器
function PersonalInfoEditor({ data, onChange }: any) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">个人信息</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="name">姓名</Label>
          <Input
            id="name"
            value={data.name || ""}
            onChange={(e) => onChange({ ...data, name: e.target.value })}
          />
        </div>
        <div>
          <Label htmlFor="email">邮箱</Label>
          <Input
            id="email"
            type="email"
            value={data.email || ""}
            onChange={(e) => onChange({ ...data, email: e.target.value })}
          />
        </div>
        <div>
          <Label htmlFor="phone">电话</Label>
          <Input
            id="phone"
            value={data.phone || ""}
            onChange={(e) => onChange({ ...data, phone: e.target.value })}
          />
        </div>
        <div>
          <Label htmlFor="location">地址</Label>
          <Input
            id="location"
            value={data.location || ""}
            onChange={(e) => onChange({ ...data, location: e.target.value })}
          />
        </div>
      </div>
      <div>
        <Label htmlFor="summary">个人简介</Label>
        <Textarea
          id="summary"
          value={data.summary || ""}
          onChange={(e) => onChange({ ...data, summary: e.target.value })}
          rows={4}
        />
      </div>
    </div>
  );
}

// 工作经历编辑器
function ExperienceEditor({ data, onChange }: any) {
  const addExperience = () => {
    const newExp = {
      id: Date.now().toString(),
      company: "",
      position: "",
      startDate: "",
      endDate: "",
      description: "",
    };
    onChange([...(data || []), newExp]);
  };

  const updateExperience = (index: number, field: string, value: string) => {
    const updated = [...(data || [])];
    updated[index] = { ...updated[index], [field]: value };
    onChange(updated);
  };

  const removeExperience = (index: number) => {
    const updated = [...(data || [])];
    updated.splice(index, 1);
    onChange(updated);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">工作经历</h3>
        <Button onClick={addExperience} size="sm">
          <Plus className="h-4 w-4 mr-2" />
          添加
        </Button>
      </div>
      {(data || []).map((exp: any, index: number) => (
        <Card key={exp.id || index}>
          <CardContent className="p-4">
            <div className="flex justify-between items-start mb-4">
              <h4 className="font-medium">工作经历 {index + 1}</h4>
              <Button
                onClick={() => removeExperience(index)}
                variant="ghost"
                size="sm"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>公司名称</Label>
                <Input
                  value={exp.company || ""}
                  onChange={(e) =>
                    updateExperience(index, "company", e.target.value)
                  }
                />
              </div>
              <div>
                <Label>职位</Label>
                <Input
                  value={exp.position || ""}
                  onChange={(e) =>
                    updateExperience(index, "position", e.target.value)
                  }
                />
              </div>
              <div>
                <Label>开始时间</Label>
                <Input
                  type="date"
                  value={exp.startDate || ""}
                  onChange={(e) =>
                    updateExperience(index, "startDate", e.target.value)
                  }
                />
              </div>
              <div>
                <Label>结束时间</Label>
                <Input
                  type="date"
                  value={exp.endDate || ""}
                  onChange={(e) =>
                    updateExperience(index, "endDate", e.target.value)
                  }
                />
              </div>
            </div>
            <div className="mt-4">
              <Label>工作描述</Label>
              <Textarea
                value={exp.description || ""}
                onChange={(e) =>
                  updateExperience(index, "description", e.target.value)
                }
                rows={3}
              />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

// 教育背景编辑器
function EducationEditor({ data, onChange }: any) {
  const addEducation = () => {
    const newEdu = {
      id: Date.now().toString(),
      school: "",
      degree: "",
      major: "",
      startDate: "",
      endDate: "",
    };
    onChange([...(data || []), newEdu]);
  };

  const updateEducation = (index: number, field: string, value: string) => {
    const updated = [...(data || [])];
    updated[index] = { ...updated[index], [field]: value };
    onChange(updated);
  };

  const removeEducation = (index: number) => {
    const updated = [...(data || [])];
    updated.splice(index, 1);
    onChange(updated);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">教育背景</h3>
        <Button onClick={addEducation} size="sm">
          <Plus className="h-4 w-4 mr-2" />
          添加
        </Button>
      </div>
      {(data || []).map((edu: any, index: number) => (
        <Card key={edu.id || index}>
          <CardContent className="p-4">
            <div className="flex justify-between items-start mb-4">
              <h4 className="font-medium">教育经历 {index + 1}</h4>
              <Button
                onClick={() => removeEducation(index)}
                variant="ghost"
                size="sm"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>学校名称</Label>
                <Input
                  value={edu.school || ""}
                  onChange={(e) =>
                    updateEducation(index, "school", e.target.value)
                  }
                />
              </div>
              <div>
                <Label>学位</Label>
                <Input
                  value={edu.degree || ""}
                  onChange={(e) =>
                    updateEducation(index, "degree", e.target.value)
                  }
                />
              </div>
              <div>
                <Label>专业</Label>
                <Input
                  value={edu.major || ""}
                  onChange={(e) =>
                    updateEducation(index, "major", e.target.value)
                  }
                />
              </div>
              <div>
                <Label>毕业时间</Label>
                <Input
                  type="date"
                  value={edu.endDate || ""}
                  onChange={(e) =>
                    updateEducation(index, "endDate", e.target.value)
                  }
                />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

// 技能编辑器
function SkillsEditor({ data, onChange }: any) {
  const [newSkill, setNewSkill] = useState("");

  const addSkill = () => {
    if (!newSkill.trim()) return;
    const skills = [...(data || []), newSkill.trim()];
    onChange(skills);
    setNewSkill("");
  };

  const removeSkill = (index: number) => {
    const skills = [...(data || [])];
    skills.splice(index, 1);
    onChange(skills);
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">技能</h3>
      <div className="flex gap-2">
        <Input
          value={newSkill}
          onChange={(e) => setNewSkill(e.target.value)}
          placeholder="输入技能名称"
          onKeyPress={(e) => e.key === "Enter" && addSkill()}
        />
        <Button onClick={addSkill} size="sm">
          <Plus className="h-4 w-4" />
        </Button>
      </div>
      <div className="flex flex-wrap gap-2">
        {(data || []).map((skill: string, index: number) => (
          <Badge key={index} variant="secondary" className="flex items-center gap-1">
            {skill}
            <button
              onClick={() => removeSkill(index)}
              className="ml-1 hover:text-red-500"
            >
              <Trash2 className="h-3 w-3" />
            </button>
          </Badge>
        ))}
      </div>
    </div>
  );
}

// 简历预览组件
function ResumePreview({ data }: any) {
  return (
    <div className="space-y-6">
      {/* 个人信息 */}
      <div className="text-center border-b pb-4">
        <h1 className="text-2xl font-bold">{data.personalInfo?.name || "姓名"}</h1>
        <div className="text-gray-600 mt-2 space-y-1">
          {data.personalInfo?.email && <div>{data.personalInfo.email}</div>}
          {data.personalInfo?.phone && <div>{data.personalInfo.phone}</div>}
          {data.personalInfo?.location && <div>{data.personalInfo.location}</div>}
        </div>
        {data.personalInfo?.summary && (
          <p className="mt-4 text-gray-700">{data.personalInfo.summary}</p>
        )}
      </div>

      {/* 工作经历 */}
      {data.experience?.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold mb-3">工作经历</h2>
          <div className="space-y-4">
            {data.experience.map((exp: any, index: number) => (
              <div key={index} className="border-l-2 border-blue-500 pl-4">
                <h3 className="font-medium">{exp.position}</h3>
                <div className="text-blue-600">{exp.company}</div>
                <div className="text-sm text-gray-500">
                  {exp.startDate} - {exp.endDate || "至今"}
                </div>
                {exp.description && (
                  <p className="mt-2 text-gray-700">{exp.description}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 教育背景 */}
      {data.education?.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold mb-3">教育背景</h2>
          <div className="space-y-3">
            {data.education.map((edu: any, index: number) => (
              <div key={index} className="border-l-2 border-green-500 pl-4">
                <h3 className="font-medium">{edu.school}</h3>
                <div className="text-green-600">{edu.degree} - {edu.major}</div>
                <div className="text-sm text-gray-500">{edu.endDate}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 技能 */}
      {data.skills?.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold mb-3">技能</h2>
          <div className="flex flex-wrap gap-2">
            {data.skills.map((skill: string, index: number) => (
              <Badge key={index} variant="outline">
                {skill}
              </Badge>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}