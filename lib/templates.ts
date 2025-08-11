import { ResumeData } from "./types";

export const resumeTemplates: Record<string, ResumeData> = {
  empty: {
    personalInfo: {
      fullName: "",
      email: "",
      phone: "",
      location: "",
      summary: "",
    },
    experience: [],
    education: [],
    skills: [],
  },
  modern: {
    personalInfo: {
      fullName: "Jordan Chen",
      email: "jordan.chen@email.com",
      phone: "+1 (555) 234-5678",
      location: "Seattle, WA",
      summary:
        "创新驱动的产品设计师，拥有5年用户体验设计经验。专注于创造直观、美观且功能强大的数字产品。",
    },
    experience: [
      {
        company: "TechFlow Design Studio",
        position: "高级产品设计师",
        startDate: "2022-03",
        endDate: "2024-01",
        description:
          "领导多个B2B产品的设计工作，用户满意度提升25%。建立设计系统，提高团队效率40%。",
      },
    ],
    education: [
      {
        school: "华盛顿大学",
        degree: "设计学学士",
        field: "交互设计",
        startDate: "2016-09",
        endDate: "2020-06",
        graduationDate: "2020-06",
      },
    ],
    skills: [
      "Figma",
      "Sketch",
      "Adobe Creative Suite",
      "Prototyping",
      "User Research",
    ],
  },
  software: {
    personalInfo: {
      fullName: "Alex Johnson",
      email: "alex.johnson@email.com",
      phone: "(555) 123-4567",
      location: "San Francisco, CA",
      summary:
        "Senior Software Engineer with 5+ years of experience in full-stack development.",
    },
    experience: [
      {
        company: "Tech Solutions Inc.",
        position: "Senior Software Engineer",
        startDate: "2021-01",
        endDate: "2024-01",
        description:
          "Led development of microservices architecture, reducing deployment time by 40%.",
      },
    ],
    education: [
      {
        school: "University of California, Berkeley",
        degree: "Bachelor of Science",
        field: "Computer Science",
        startDate: "2015-09",
        endDate: "2019-05",
        graduationDate: "2019-05",
      },
    ],
    skills: ["JavaScript", "TypeScript", "React", "Node.js", "AWS", "Docker"],
  },
  marketing: {
    personalInfo: {
      fullName: "Sarah Miller",
      email: "sarah.miller@email.com",
      phone: "(555) 987-6543",
      location: "New York, NY",
      summary:
        "Creative Marketing Manager with 6+ years of experience in digital marketing.",
    },
    experience: [
      {
        company: "Global Brands Co.",
        position: "Marketing Manager",
        startDate: "2020-06",
        endDate: "2024-01",
        description:
          "Led digital marketing campaigns resulting in 150% increase in online engagement.",
      },
    ],
    education: [
      {
        school: "New York University",
        degree: "Bachelor of Arts",
        field: "Marketing",
        startDate: "2014-09",
        endDate: "2018-05",
        graduationDate: "2018-05",
      },
    ],
    skills: [
      "Digital Marketing",
      "Social Media Management",
      "Content Strategy",
      "SEO/SEM",
    ],
  },
};

export const getTemplate = (templateId: string): ResumeData => {
  return resumeTemplates[templateId] || resumeTemplates.empty;
};

export const getTemplateList = () => {
  return Object.keys(resumeTemplates).map((id) => ({
    id,
    name: getTemplateName(id),
    description: getTemplateDescription(id),
  }));
};

const getTemplateName = (templateId: string): string => {
  const names: Record<string, string> = {
    empty: "空白模板",
    modern: "现代风格",
    software: "软件工程师",
    marketing: "市场营销",
  };
  return names[templateId] || "未知模板";
};

const getTemplateDescription = (templateId: string): string => {
  const descriptions: Record<string, string> = {
    empty: "从空白开始创建您的简历",
    modern: "适合设计师和创意工作者",
    software: "适合软件开发工程师",
    marketing: "适合市场营销专业人士",
  };
  return descriptions[templateId] || "模板描述";
};
