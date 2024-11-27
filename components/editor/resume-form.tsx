"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ResumeData } from "@/lib/types";
import { PlusCircle, Trash2 } from "lucide-react";
import { Separator } from "@/components/ui/separator";

interface ResumeFormProps {
  resumeData: ResumeData;
  setResumeData: (data: ResumeData) => void;
}

export function ResumeForm({ resumeData, setResumeData }: ResumeFormProps) {
  const updatePersonalInfo = (field: string, value: string) => {
    setResumeData({
      ...resumeData,
      personalInfo: {
        ...resumeData.personalInfo,
        [field]: value,
      },
    });
  };

  const addExperience = () => {
    setResumeData({
      ...resumeData,
      experience: [
        ...resumeData.experience,
        { company: "", position: "", startDate: "", endDate: "", description: "" },
      ],
    });
  };

  const updateExperience = (index: number, field: string, value: string) => {
    const newExperience = [...resumeData.experience];
    newExperience[index] = { ...newExperience[index], [field]: value };
    setResumeData({ ...resumeData, experience: newExperience });
  };

  const removeExperience = (index: number) => {
    setResumeData({
      ...resumeData,
      experience: resumeData.experience.filter((_, i) => i !== index),
    });
  };

  const addEducation = () => {
    setResumeData({
      ...resumeData,
      education: [
        ...resumeData.education,
        { school: "", degree: "", field: "", graduationDate: "" },
      ],
    });
  };

  const updateEducation = (index: number, field: string, value: string) => {
    const newEducation = [...resumeData.education];
    newEducation[index] = { ...newEducation[index], [field]: value };
    setResumeData({ ...resumeData, education: newEducation });
  };

  const removeEducation = (index: number) => {
    setResumeData({
      ...resumeData,
      education: resumeData.education.filter((_, i) => i !== index),
    });
  };

  const addSkill = () => {
    setResumeData({
      ...resumeData,
      skills: [...resumeData.skills, ""],
    });
  };

  const updateSkill = (index: number, value: string) => {
    const newSkills = [...resumeData.skills];
    newSkills[index] = value;
    setResumeData({ ...resumeData, skills: newSkills });
  };

  const removeSkill = (index: number) => {
    setResumeData({
      ...resumeData,
      skills: resumeData.skills.filter((_, i) => i !== index),
    });
  };

  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Personal Information</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              className="dark:border-gray-300"
              value={resumeData.personalInfo.name}
              onChange={(e) => updatePersonalInfo("name", e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              className="dark:border-gray-300"
              value={resumeData.personalInfo.email}
              onChange={(e) => updatePersonalInfo("email", e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">Phone</Label>
            <Input
              id="phone"
              className="dark:border-gray-300"
              value={resumeData.personalInfo.phone}
              onChange={(e) => updatePersonalInfo("phone", e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              className="dark:border-gray-300"
              value={resumeData.personalInfo.location}
              onChange={(e) => updatePersonalInfo("location", e.target.value)}
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="summary">Professional Summary</Label>
          <Textarea
            id="summary"
            className="dark:border-gray-300"
            value={resumeData.personalInfo.summary}
            onChange={(e) => updatePersonalInfo("summary", e.target.value)}
          />
        </div>
      </div>

      <Separator className="dark:bg-gray-300"/>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">Work Experience</h2>
          <Button onClick={addExperience} variant="outline" size="sm" className="dark:border-gray-400">
            <PlusCircle className="mr-2 h-4 w-4 " />
            Add Experience
          </Button>
        </div>
        {resumeData.experience.map((exp, index) => (
          <div key={index} className="space-y-4 rounded-lg border p-4 ">
            <div className="flex justify-end">
              <Button
                onClick={() => removeExperience(index)}
                variant="ghost"
                size="sm"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Company</Label>
                <Input
                  className="dark:border-gray-300"                  
                  value={exp.company}
                  onChange={(e) =>
                    updateExperience(index, "company", e.target.value)
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>Position</Label>
                <Input
                  className="dark:border-gray-300"                  
                  value={exp.position}
                  onChange={(e) =>
                    updateExperience(index, "position", e.target.value)
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>Start Date</Label>
                <Input
                  className="dark:border-gray-300"                                  

                  type="date"
                  value={exp.startDate}
                  onChange={(e) =>
                    updateExperience(index, "startDate", e.target.value)
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>End Date</Label>
                <Input
                  className="dark:border-gray-300"                                  
                  type="date"
                  value={exp.endDate}
                  onChange={(e) =>
                    updateExperience(index, "endDate", e.target.value)
                  }
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea
                                className="dark:border-gray-300"

                value={exp.description}
                onChange={(e) =>
                  updateExperience(index, "description", e.target.value)
                }
              />
            </div>
          </div>
        ))}
      </div>

      <Separator className="dark:bg-gray-300"/>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">Education</h2>
          <Button onClick={addEducation} variant="outline" size="sm">
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Education
          </Button>
        </div>
        {resumeData.education.map((edu, index) => (
          <div key={index} className="space-y-4 rounded-lg border p-4">
            <div className="flex justify-end">
              <Button
                onClick={() => removeEducation(index)}
                variant="ghost"
                size="sm"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>School</Label>
                <Input
                  className="dark:border-gray-300"                  value={edu.school}
                  onChange={(e) =>
                    updateEducation(index, "school", e.target.value)
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>Degree</Label>
                <Input
                  className="dark:border-gray-300"                  value={edu.degree}
                  onChange={(e) =>
                    updateEducation(index, "degree", e.target.value)
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>Field of Study</Label>
                <Input
                  className="dark:border-gray-300"                  value={edu.field}
                  onChange={(e) => updateEducation(index, "field", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Graduation Date</Label>
                <Input
                  className="dark:border-gray-300"                  type="date"
                  value={edu.graduationDate}
                  onChange={(e) =>
                    updateEducation(index, "graduationDate", e.target.value)
                  }
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      <Separator className="dark:bg-gray-300"/>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">Skills</h2>
          <Button onClick={addSkill} variant="outline" size="sm">
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Skill
          </Button>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
          {resumeData.skills.map((skill, index) => (
            <div key={index} className="flex items-center space-x-2">
              <Input
                className="dark:border-gray-300"
                value={skill}
                onChange={(e) => updateSkill(index, e.target.value)}
                placeholder="Enter a skill"
              />
              <Button
                onClick={() => removeSkill(index)}
                variant="ghost"
                size="icon"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}