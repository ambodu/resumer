"use client";

import { ResumeData } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useRouter } from "next/navigation";
import { useParams } from "next/navigation";
import { useResumeActions } from "@/lib/hooks";
import { FileText, User, Briefcase, GraduationCap, Clock, Star, ArrowRight } from "lucide-react";
import { templateMetadata } from "@/lib/template-metadata";
import { cn } from "@/lib/utils";

interface TemplateCardProps {
  template: ResumeData;
  templateId: string;
}

export function TemplateCard({ template, templateId }: TemplateCardProps) {
  const router = useRouter();
  const params = useParams();
  const locale = params.locale as string;
  const { setCurrentResume } = useResumeActions();
  const metadata = templateMetadata[templateId];

  const handleUseTemplate = () => {
    setCurrentResume(template);
    router.push(`/${locale}/editor`);
  };

  if (!metadata) {
    return null;
  }

  const IconComponent = metadata.icon;
  const difficultyColors = {
    beginner: 'bg-green-100 text-green-800',
    intermediate: 'bg-yellow-100 text-yellow-800',
    advanced: 'bg-red-100 text-red-800'
  };

  return (
    <Card className="group h-full flex flex-col card-hover border-0 shadow-md bg-gradient-to-br from-white to-gray-50">
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className={cn(
              "p-2 rounded-lg text-white transition-transform group-hover:scale-110",
              metadata.color
            )}>
              <IconComponent className="h-5 w-5" />
            </div>
            <div>
              <CardTitle className="text-lg font-semibold group-hover:text-primary transition-colors">
                {metadata.title}
              </CardTitle>
              <Badge variant="secondary" className={cn("text-xs mt-1", difficultyColors[metadata.difficulty])}>
                {metadata.difficulty === 'beginner' ? '初级' : 
                 metadata.difficulty === 'intermediate' ? '中级' : '高级'}
              </Badge>
            </div>
          </div>
          <Badge variant="outline" className="text-xs">
            {metadata.category}
          </Badge>
        </div>
        <CardDescription className="text-sm text-muted-foreground mt-2">
          {metadata.description}
        </CardDescription>
      </CardHeader>
      
      <CardContent className="flex-1 space-y-4">
        <div className="grid grid-cols-3 gap-3 text-center">
          <div className="p-2 rounded-lg bg-blue-50">
              <User className="h-4 w-4 mx-auto text-blue-600 mb-1" />
            <div className="text-xs font-medium">{template.experience.length}</div>
            <div className="text-xs text-muted-foreground">经验</div>
          </div>
          <div className="p-2 rounded-lg bg-blue-50">
              <GraduationCap className="h-4 w-4 mx-auto text-blue-600 mb-1" />
            <div className="text-xs font-medium">{template.education.length}</div>
            <div className="text-xs text-muted-foreground">教育</div>
          </div>
          <div className="p-2 rounded-lg bg-purple-50">
              <Briefcase className="h-4 w-4 mx-auto text-purple-600 mb-1" />
            <div className="text-xs font-medium">{template.skills.length}</div>
            <div className="text-xs text-muted-foreground">技能</div>
          </div>
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Clock className="h-3 w-3" />
            <span>预计用时: {metadata.estimatedTime}</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Star className="h-3 w-3" />
            <span>特色: {metadata.features.slice(0, 2).join(', ')}</span>
          </div>
        </div>
        
        <div className="space-y-1">
          <div className="text-xs font-medium text-muted-foreground mb-2">主要特性</div>
          <div className="flex flex-wrap gap-1">
            {metadata.features.map((feature, index) => (
              <Badge key={index} variant="secondary" className="text-xs px-2 py-1">
                {feature}
              </Badge>
            ))}
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="pt-4">
        <Button 
          onClick={handleUseTemplate} 
          className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-all"
          size="sm"
        >
          使用此模板
          <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
        </Button>
      </CardFooter>
    </Card>
  );
}