"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ResumeData } from "@/lib/types";
import { useRouter } from "next/navigation";

interface TemplateCardProps {
  id: string;
  template: ResumeData;
}

export function TemplateCard({ id, template }: TemplateCardProps) {
  const router = useRouter();

  const handleUseTemplate = () => {
    // Store the selected template in localStorage
    localStorage.setItem("selectedTemplate", JSON.stringify(template));
    router.push("/editor");
  };

  return (
    <Card className="flex flex-col">
      <CardHeader>
        <CardTitle className="line-clamp-1">{template.personalInfo.name || `${id.charAt(0).toUpperCase() + id.slice(1)} Template`}</CardTitle>
      </CardHeader>
      <CardContent className="flex-1">
        <div className="aspect-[8.5/11] bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm">
          <div className="space-y-2">
            <div className="h-6 bg-gray-100 dark:bg-gray-700 rounded w-1/2"></div>
            <div className="h-4 bg-gray-100 dark:bg-gray-700 rounded w-1/3"></div>
            <div className="h-4 bg-gray-100 dark:bg-gray-700 rounded w-2/3"></div>
            <div className="pt-4">
              <div className="h-3 bg-gray-100 dark:bg-gray-700 rounded w-full mb-2"></div>
              <div className="h-3 bg-gray-100 dark:bg-gray-700 rounded w-full mb-2"></div>
              <div className="h-3 bg-gray-100 dark:bg-gray-700 rounded w-3/4"></div>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={handleUseTemplate} className="w-full">
          Use Template
        </Button>
      </CardFooter>
    </Card>
  );
}