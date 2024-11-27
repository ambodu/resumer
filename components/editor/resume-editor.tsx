"use client";

import { useState, useEffect } from "react";
import { ResumeForm } from "@/components/editor/resume-form";
import { ResumePreview } from "@/components/editor/resume-preview";
import { ResumeData } from "@/lib/types";
import { resumeTemplates } from "@/lib/templates";

export function ResumeEditor() {
  const [resumeData, setResumeData] = useState<ResumeData>(resumeTemplates.empty);

  useEffect(() => {
    // Load the selected template from localStorage if it exists
    const selectedTemplate = localStorage.getItem("selectedTemplate");
    if (selectedTemplate) {
      setResumeData(JSON.parse(selectedTemplate));
      // Clear the selected template from localStorage
      localStorage.removeItem("selectedTemplate");
    }
  }, []);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 min-h-screen">
      <div className="border-r dark:bg-black overflow-y-auto h-screen p-6">
        <div className="max-w-2xl mx-auto">
          <ResumeForm resumeData={resumeData} setResumeData={setResumeData} />
        </div>
      </div>
      <div className="h-screen bg-gray-50 dark:bg-black overflow-y-auto">
        <ResumePreview resumeData={resumeData} />
      </div>
    </div>
  );
}