"use client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { resumeTemplates } from "@/lib/templates";
import { ResumeData } from "@/lib/types";

interface TemplateSelectorProps {
  onSelectTemplate: (template: ResumeData) => void;
}

export function TemplateSelector({ onSelectTemplate }: TemplateSelectorProps) {
  const handleTemplateChange = (templateId: string) => {
    onSelectTemplate(resumeTemplates[templateId]);
  };

  return (
    <div className="flex items-center space-x-2">
      <Select onValueChange={handleTemplateChange} defaultValue="empty">
        <SelectTrigger className="w-[200px]">
          <SelectValue placeholder="Choose template" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="empty">空白模板</SelectItem>
          <SelectItem value="modern">现代设计师</SelectItem>
          <SelectItem value="software">软件工程师</SelectItem>
          <SelectItem value="marketing">市场营销</SelectItem>
          <SelectItem value="analyst">数据分析师</SelectItem>
          <SelectItem value="manager">项目经理</SelectItem>
          <SelectItem value="teacher">教师</SelectItem>
          <SelectItem value="doctor">医生</SelectItem>
          <SelectItem value="designer">平面设计师</SelectItem>
          <SelectItem value="sales">销售经理</SelectItem>
          <SelectItem value="finance">财务会计</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}