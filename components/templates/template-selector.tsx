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
          <SelectItem value="empty" className="dark:text-zinc-100">Empty Template</SelectItem>
          <SelectItem value="software" className="dark:text-zinc-100">Software Engineer</SelectItem>
          <SelectItem value="marketing" className="dark:text-zinc-100">Marketing Professional</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}