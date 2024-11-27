import { ResumeData } from "./types";

export const resumeTemplates: Record<string, ResumeData> = {
  empty: {
    personalInfo: {
      name: "",
      email: "",
      phone: "",
      location: "",
      summary: "",
    },
    experience: [],
    education: [],
    skills: [],
  },
  software: {
    personalInfo: {
      name: "Alex Johnson",
      email: "alex.johnson@email.com",
      phone: "(555) 123-4567",
      location: "San Francisco, CA",
      summary: "Senior Software Engineer with 5+ years of experience in full-stack development. Specialized in React, Node.js, and cloud technologies. Proven track record of delivering scalable solutions and leading development teams.",
    },
    experience: [
      {
        company: "Tech Solutions Inc.",
        position: "Senior Software Engineer",
        startDate: "2021-01",
        endDate: "2024-01",
        description: "Led development of microservices architecture, reducing deployment time by 40%. Mentored junior developers and implemented CI/CD pipelines.",
      },
      {
        company: "Digital Innovations",
        position: "Software Engineer",
        startDate: "2019-03",
        endDate: "2020-12",
        description: "Developed and maintained React applications serving 100K+ users. Implemented responsive designs and optimized performance.",
      },
    ],
    education: [
      {
        school: "University of California, Berkeley",
        degree: "Bachelor of Science",
        field: "Computer Science",
        graduationDate: "2019-05",
      },
    ],
    skills: [
      "JavaScript",
      "TypeScript",
      "React",
      "Node.js",
      "AWS",
      "Docker",
      "GraphQL",
      "Git",
    ],
    style: [
      
    ]
  },
  marketing: {
    personalInfo: {
      name: "Sarah Miller",
      email: "sarah.miller@email.com",
      phone: "(555) 987-6543",
      location: "New York, NY",
      summary: "Creative Marketing Manager with 6+ years of experience in digital marketing and brand development. Proven success in developing and executing marketing strategies that drive engagement and ROI.",
    },
    experience: [
      {
        company: "Global Brands Co.",
        position: "Marketing Manager",
        startDate: "2020-06",
        endDate: "2024-01",
        description: "Led digital marketing campaigns resulting in 150% increase in online engagement. Managed a team of 5 marketing specialists and $1M annual budget.",
      },
      {
        company: "Creative Agency XYZ",
        position: "Digital Marketing Specialist",
        startDate: "2018-03",
        endDate: "2020-05",
        description: "Developed social media strategies for Fortune 500 clients. Increased client social media following by average of 200%.",
      },
    ],
    education: [
      {
        school: "New York University",
        degree: "Bachelor of Arts",
        field: "Marketing",
        graduationDate: "2018-05",
      },
    ],
    skills: [
      "Digital Marketing",
      "Social Media Management",
      "Content Strategy",
      "SEO/SEM",
      "Analytics",
      "Brand Development",
      "Project Management",
      "Adobe Creative Suite",
    ],
  },
};