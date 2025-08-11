"use client";

import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Check, X } from 'lucide-react';
import { getTemplateList } from '@/lib/templates';

interface TemplateSelectorProps {
  currentTemplateId: string;
  onSelect: (templateId: string) => void;
  onClose: () => void;
}

const templateDescriptions: Record<string, string> = {
  empty: "从空白开始创建您的简历",
  modern: "适合设计师和创意工作者的现代风格模板",
  software: "专为软件开发工程师设计的技术型模板",
  marketing: "适合市场营销专业人士的商务模板",
};

const templateFeatures: Record<string, string[]> = {
  empty: ["完全自定义", "灵活布局", "适合所有行业"],
  modern: ["现代设计", "视觉突出", "创意布局", "适合设计师"],
  software: ["技术导向", "项目展示", "技能突出", "适合开发者"],
  marketing: ["商务风格", "成果导向", "数据展示", "适合营销"],
};

export function TemplateSelector({ currentTemplateId, onSelect, onClose }: TemplateSelectorProps) {
  const templates = getTemplateList();

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            选择简历模板
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          {templates.map((template) => (
            <Card 
              key={template.id}
              className={`cursor-pointer transition-all hover:shadow-lg ${
                currentTemplateId === template.id 
                  ? 'ring-2 ring-blue-500 bg-blue-50' 
                  : 'hover:shadow-md'
              }`}
              onClick={() => onSelect(template.id)}
            >
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg flex items-center gap-2">
                    {template.name}
                    {currentTemplateId === template.id && (
                      <Badge variant="default" className="text-xs">
                        <Check className="h-3 w-3 mr-1" />
                        当前
                      </Badge>
                    )}
                  </CardTitle>
                </div>
                <CardDescription>
                  {templateDescriptions[template.id] || template.description}
                </CardDescription>
              </CardHeader>

              <CardContent>
                {/* 模板预览区域 */}
                <div className="bg-gray-100 rounded-lg p-4 mb-4 min-h-[120px] flex items-center justify-center">
                  <div className="text-center text-gray-500">
                    <div className="text-sm font-medium">{template.name}</div>
                    <div className="text-xs mt-1">模板预览</div>
                  </div>
                </div>

                {/* 模板特性 */}
                <div className="space-y-2">
                  <div className="text-sm font-medium text-gray-700">特性:</div>
                  <div className="flex flex-wrap gap-1">
                    {(templateFeatures[template.id] || []).map((feature, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {feature}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* 选择按钮 */}
                <Button 
                  className="w-full mt-4"
                  variant={currentTemplateId === template.id ? "default" : "outline"}
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelect(template.id);
                  }}
                >
                  {currentTemplateId === template.id ? "当前模板" : "使用此模板"}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="flex justify-end gap-2 mt-6 pt-4 border-t">
          <Button variant="outline" onClick={onClose}>
            取消
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}