export interface PersonalInfo {
  fullName: string;
  title?: string;
  email: string;
  phone: string;
  location: string;
  website?: string;
  summary: string;
}

export interface Experience {
  id?: string;
  company: string;
  position: string;
  startDate: string;
  endDate: string;
  description: string;
  current?: boolean;
}

export interface Education {
  id?: string;
  school: string;
  degree: string;
  field: string;
  startDate: string;
  endDate: string;
  gpa?: string;
  graduationDate?: string;
}

export interface Styles {
  fontFamily: string;
  fontSize: string;
  lineHeight?: number;
  textColor: string;
  backgroundColor: string;
  sectionSpacing: string;
}

export interface ResumeData {
  id?: string;
  personalInfo: PersonalInfo;
  experience: Experience[];
  education: Education[];
  skills: string[];
  style?: Styles[];
}
