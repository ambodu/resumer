"use client";

import { motion } from 'framer-motion';
import { PlusCircle, Trash2, Save, Sparkles, Wand2, Copy, User, Briefcase, GraduationCap, Code, FileText, Zap, Plus } from "lucide-react";
import { useResumeState, useResumeActions } from "@/lib/hooks";
// Cleaned up unused imports
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";

export function ResumeForm() {
  const { currentResume } = useResumeState();
  const {
    updatePersonalInfo,
    addExperience,
    updateExperience,
    removeExperience,
    addEducation,
    updateEducation,
    removeEducation,
    addSkill,
    updateSkill,
    removeSkill,
    saveResume,
  } = useResumeActions();

  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const generateSampleExperience = () => {
    const sampleExperience = {
      company: "科技有限公司",
      position: "前端开发工程师",
      startDate: "2022-01",
      endDate: "2024-01",
      description: "负责公司核心产品的前端开发，使用React和TypeScript构建用户界面，优化页面性能，提升用户体验。参与需求分析、技术方案设计和代码评审。"
    };
    
    addExperience();
    const newIndex = currentResume.experience.length;
    Object.entries(sampleExperience).forEach(([field, value]) => {
      updateExperience(newIndex, field, value);
    });
    
    toast({
      title: "示例经验已生成",
      description: "已添加一个示例工作经验",
    });
  };

  const generateSampleEducation = () => {
    const sampleEducation = {
      school: "清华大学",
      degree: "学士",
      field: "计算机科学与技术",
      graduationDate: "2022-06"
    };
    
    addEducation();
    const newIndex = currentResume.education.length;
    Object.entries(sampleEducation).forEach(([field, value]) => {
      updateEducation(newIndex, field, value);
    });
    
    toast({
      title: "示例教育经历已生成",
      description: "已添加一个示例教育背景",
    });
  };

  const generateSampleSkills = () => {
    const sampleSkills = ["React", "TypeScript", "Node.js", "Python", "Git", "Docker"];
    sampleSkills.forEach(skill => {
      addSkill();
      const newIndex = currentResume.skills.length;
      updateSkill(newIndex, skill);
    });
    
    toast({
      title: "示例技能已生成",
      description: "已添加常用技能示例",
    });
  };

  const copyExperience = (index: number) => {
    const exp = currentResume.experience[index];
    addExperience();
    const newIndex = currentResume.experience.length;
    Object.entries(exp).forEach(([field, value]) => {
      updateExperience(newIndex, field, value);
    });
    
    toast({
      title: "经验已复制",
      description: "已复制当前经验项",
    });
  };

  const copyEducation = (index: number) => {
    const edu = currentResume.education[index];
    addEducation();
    const newIndex = currentResume.education.length;
    Object.entries(edu).forEach(([field, value]) => {
      updateEducation(newIndex, field, value);
    });
    
    toast({
      title: "教育经历已复制",
      description: "已复制当前教育经历项",
    });
  };

  return (
    <div className="p-6 space-y-8">
      {/* Header */}
      <div className="border-b border-gray-200 pb-4">
        <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
          <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
            <FileText className="h-5 w-5 text-blue-600" />
          </div>
          简历编辑
        </h2>
        <p className="text-gray-600 mt-2">
          填写您的信息，实时预览简历效果
        </p>
      </div>
        
        {/* Personal Information Section */}
        <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <User className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">个人信息</h3>
                <p className="text-sm text-gray-600">填写您的基本信息和联系方式</p>
              </div>
            </div>
            <button
              onClick={() => {
                updatePersonalInfo("fullName", "张三");
                updatePersonalInfo("email", "zhangsan@example.com");
                updatePersonalInfo("phone", "+86 138 0000 0000");
                updatePersonalInfo("location", "北京市朝阳区");
                updatePersonalInfo("summary", "具有3年以上工作经验的专业人士，擅长团队协作和项目管理，致力于持续学习和技能提升。");
                toast({
                  title: "示例信息已生成",
                  description: "已添加示例个人信息",
                });
              }}
              className="flex items-center gap-2 px-3 py-2 text-sm text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
            >
              <Sparkles className="h-4 w-4" />
              快速生成
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                姓名 <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={currentResume.personalInfo.fullName}
                onChange={(e) => updatePersonalInfo("fullName", e.target.value)}
                placeholder="请输入您的姓名"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                disabled={isLoading}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                邮箱 <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                value={currentResume.personalInfo.email}
                onChange={(e) => updatePersonalInfo("email", e.target.value)}
                placeholder="your.email@example.com"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                disabled={isLoading}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                电话
              </label>
              <input
                type="tel"
                value={currentResume.personalInfo.phone}
                onChange={(e) => updatePersonalInfo("phone", e.target.value)}
                placeholder="+86 138 0000 0000"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                disabled={isLoading}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                所在地
              </label>
              <input
                type="text"
                value={currentResume.personalInfo.location}
                onChange={(e) => updatePersonalInfo("location", e.target.value)}
                placeholder="北京市朝阳区"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                 disabled={isLoading}
               />
             </div>
           </div>
           
           <div className="mt-4">
             <label className="block text-sm font-medium text-gray-700 mb-2">
               个人简介
             </label>
             <textarea
               value={currentResume.personalInfo.summary}
               onChange={(e) => updatePersonalInfo("summary", e.target.value)}
               placeholder="简要描述您的专业背景、技能和职业目标..."
               rows={4}
               className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
               disabled={isLoading}
             />
           </div>
         </div>
        
        {/* Work Experience Section */}
        <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <Briefcase className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">工作经验</h3>
                <p className="text-sm text-gray-600">添加您的工作经历和主要成就</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={generateSampleExperience}
                className="flex items-center gap-2 px-3 py-2 text-sm text-green-600 hover:bg-green-50 rounded-lg transition-colors"
              >
                <Sparkles className="h-4 w-4" />
                快速生成
              </button>
              <button
                onClick={addExperience}
                className="flex items-center gap-2 px-3 py-2 text-sm bg-green-600 text-white hover:bg-green-700 rounded-lg transition-colors"
              >
                <Plus className="h-4 w-4" />
                添加经验
              </button>
            </div>
          </div>
          
          <div className="space-y-4">
            {currentResume.experience.length === 0 ? (
              <div className="text-center py-12 text-gray-400 bg-white rounded-lg border-2 border-dashed border-gray-200">
                <Briefcase className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p className="text-lg mb-2">还没有添加工作经验</p>
                <p className="text-sm">点击上方按钮添加您的第一份工作经验</p>
              </div>
            ) : (
              currentResume.experience.map((experience, index) => (
                <div key={index} className="bg-white rounded-lg border border-gray-200 p-4">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-md font-medium text-gray-900 flex items-center gap-2">
                      <div className="w-6 h-6 bg-green-100 rounded flex items-center justify-center">
                        <Briefcase className="h-3 w-3 text-green-600" />
                      </div>
                      工作经验 {index + 1}
                    </h4>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => copyExperience(index)}
                        className="p-1 text-gray-400 hover:text-gray-600 rounded"
                        title="复制"
                      >
                        <Copy className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => removeExperience(index)}
                        className="p-1 text-gray-400 hover:text-red-600 rounded"
                        title="删除"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        公司名称 <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={experience.company}
                        onChange={(e) => updateExperience(index, "company", e.target.value)}
                        placeholder="公司名称"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                        disabled={isLoading}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        职位 <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={experience.position}
                        onChange={(e) => updateExperience(index, "position", e.target.value)}
                        placeholder="职位名称"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                        disabled={isLoading}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        开始时间
                      </label>
                      <input
                        type="text"
                        value={experience.startDate}
                        onChange={(e) => updateExperience(index, "startDate", e.target.value)}
                        placeholder="2023-01"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                        disabled={isLoading}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        结束时间
                      </label>
                      <input
                        type="text"
                        value={experience.endDate}
                        onChange={(e) => updateExperience(index, "endDate", e.target.value)}
                        placeholder="2024-01 或 至今"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                        disabled={isLoading}
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      工作描述
                    </label>
                    <textarea
                      value={experience.description}
                      onChange={(e) => updateExperience(index, "description", e.target.value)}
                      placeholder="• 负责产品功能设计和开发&#10;• 优化系统性能，提升用户体验&#10;• 协调跨部门合作，推进项目进度"
                      rows={4}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all resize-none"
                      disabled={isLoading}
                    />
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Education Section */}
        <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <GraduationCap className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">教育背景</h3>
                <p className="text-sm text-gray-600">添加您的教育经历和学术成就</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={generateSampleEducation}
                className="flex items-center gap-2 px-3 py-2 text-sm text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
              >
                <Sparkles className="h-4 w-4" />
                快速生成
              </button>
              <button
                onClick={addEducation}
                className="flex items-center gap-2 px-3 py-2 text-sm bg-purple-600 text-white hover:bg-purple-700 rounded-lg transition-colors"
              >
                <Plus className="h-4 w-4" />
                添加教育
              </button>
            </div>
          </div>
          
          <div className="space-y-4">
            {currentResume.education.length === 0 ? (
              <div className="text-center py-12 text-gray-400 bg-white rounded-lg border-2 border-dashed border-gray-200">
                <GraduationCap className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p className="text-lg mb-2">还没有添加教育背景</p>
                <p className="text-sm">点击上方按钮添加您的教育经历</p>
              </div>
            ) : (
              currentResume.education.map((education, index) => (
                <div key={index} className="bg-white rounded-lg border border-gray-200 p-4">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-md font-medium text-gray-900 flex items-center gap-2">
                      <div className="w-6 h-6 bg-purple-100 rounded flex items-center justify-center">
                        <GraduationCap className="h-3 w-3 text-purple-600" />
                      </div>
                      教育背景 {index + 1}
                    </h4>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => copyEducation(index)}
                        className="p-1 text-gray-400 hover:text-gray-600 rounded"
                        title="复制"
                      >
                        <Copy className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => removeEducation(index)}
                        className="p-1 text-gray-400 hover:text-red-600 rounded"
                        title="删除"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        学校名称 <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={education.school}
                        onChange={(e) => updateEducation(index, "school", e.target.value)}
                        placeholder="学校名称"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                        disabled={isLoading}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        学位
                      </label>
                      <input
                        type="text"
                        value={education.degree}
                        onChange={(e) => updateEducation(index, "degree", e.target.value)}
                        placeholder="如：学士、硕士、博士"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                        disabled={isLoading}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        专业
                      </label>
                      <input
                        type="text"
                        value={education.field}
                        onChange={(e) => updateEducation(index, "field", e.target.value)}
                        placeholder="专业名称"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                        disabled={isLoading}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        毕业日期
                      </label>
                      <input
                        type="text"
                        value={education.graduationDate}
                        onChange={(e) => updateEducation(index, "graduationDate", e.target.value)}
                        placeholder="2024-06"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                        disabled={isLoading}
                      />
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Skills Section */}
        <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                <Code className="h-5 w-5 text-orange-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">技能专长</h3>
                <p className="text-sm text-gray-600">展示您的专业技能和技术能力</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={generateSampleSkills}
                className="flex items-center gap-2 px-3 py-2 text-sm text-orange-600 hover:bg-orange-50 rounded-lg transition-colors"
              >
                <Sparkles className="h-4 w-4" />
                快速生成
              </button>
              <button
                onClick={addSkill}
                className="flex items-center gap-2 px-3 py-2 text-sm bg-orange-600 text-white hover:bg-orange-700 rounded-lg transition-colors"
              >
                <Plus className="h-4 w-4" />
                添加技能
              </button>
            </div>
          </div>
          
          <div className="space-y-4">
            {currentResume.skills.length === 0 ? (
              <div className="text-center py-12 text-gray-400 bg-white rounded-lg border-2 border-dashed border-gray-200">
                <Code className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p className="text-lg mb-2">还没有添加技能</p>
                <p className="text-sm">点击上方按钮添加您的专业技能</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {currentResume.skills.map((skill, index) => (
                  <div key={index} className="flex items-center gap-2 p-3 bg-white rounded-lg border border-gray-200">
                    <input
                      type="text"
                      value={skill}
                      onChange={(e) => updateSkill(index, e.target.value)}
                      placeholder="请输入技能名称"
                      className="flex-1 px-2 py-1 border-0 focus:ring-0 focus:outline-none text-sm"
                      disabled={isLoading}
                    />
                    <button
                      onClick={() => removeSkill(index)}
                      className="p-1 text-gray-400 hover:text-red-600 rounded"
                      disabled={isLoading}
                      title="删除"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-center pt-8">
          <button
            onClick={() => {
              saveResume();
              toast({
                title: "简历已保存",
                description: "您的简历已成功保存",
              });
            }}
            disabled={isLoading}
            className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isLoading ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <Save className="h-4 w-4" />
            )}
            {isLoading ? '保存中...' : '保存简历'}
          </button>
        </div>
      </div>
  );
}
