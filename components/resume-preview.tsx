"use client";

import { ResumeData } from "@/lib/types";
import { format } from "date-fns";
import { Button } from "./ui/button";
import { Download } from "lucide-react";

interface ResumePreviewProps {
  resumeData: ResumeData;
}

export function ResumePreview({ resumeData }: ResumePreviewProps) {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-end sticky top-0 z-10 bg-gray-50 dark:bg-gray-900 py-2 print:hidden">
        <Button onClick={handlePrint}>
          <Download className="mr-2 h-4 w-4" />
          Download PDF
        </Button>
      </div>
      <div className="max-w-[800px] mx-auto space-y-8 bg-white dark:bg-gray-800 p-8 shadow-lg rounded-lg">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold">{resumeData.personalInfo.name}</h1>
          <div className="text-gray-600 dark:text-gray-400 space-x-4">
            {resumeData.personalInfo.email && (
              <span>{resumeData.personalInfo.email}</span>
            )}
            {resumeData.personalInfo.phone && (
              <span>{resumeData.personalInfo.phone}</span>
            )}
            {resumeData.personalInfo.location && (
              <span>{resumeData.personalInfo.location}</span>
            )}
          </div>
        </div>

        {resumeData.personalInfo.summary && (
          <div className="space-y-2">
            <h2 className="text-xl font-semibold border-b pb-2">
              Professional Summary
            </h2>
            <p className="text-gray-700 dark:text-gray-300">{resumeData.personalInfo.summary}</p>
          </div>
        )}

        {resumeData.experience.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold border-b pb-2">
              Work Experience
            </h2>
            {resumeData.experience.map((exp, index) => (
              <div key={index} className="space-y-2">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold">{exp.position}</h3>
                    <p className="text-gray-600 dark:text-gray-400">{exp.company}</p>
                  </div>
                  <div className="text-gray-600 dark:text-gray-400 text-sm">
                    {exp.startDate &&
                      format(new Date(exp.startDate), "MMM yyyy")}
                    {exp.endDate && " - "}
                    {exp.endDate && format(new Date(exp.endDate), "MMM yyyy")}
                  </div>
                </div>
                <p className="text-gray-700 dark:text-gray-300">{exp.description}</p>
              </div>
            ))}
          </div>
        )}

        {resumeData.education.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold border-b pb-2">Education</h2>
            {resumeData.education.map((edu, index) => (
              <div key={index} className="space-y-1">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold">{edu.school}</h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      {edu.degree} in {edu.field}
                    </p>
                  </div>
                  <div className="text-gray-600 dark:text-gray-400 text-sm">
                    {edu.graduationDate &&
                      format(new Date(edu.graduationDate), "MMM yyyy")}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {resumeData.skills.length > 0 && (
          <div className="space-y-2">
            <h2 className="text-xl font-semibold border-b pb-2">Skills</h2>
            <div className="flex flex-wrap gap-2">
              {resumeData.skills.map((skill, index) => (
                <span
                  key={index}
                  className="bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded-full text-gray-700 dark:text-gray-300"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}